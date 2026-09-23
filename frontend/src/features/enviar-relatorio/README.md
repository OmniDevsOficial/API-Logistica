# Importação real de manifesto

Alterações limitadas à feature `enviar-relatorio`. Não há mock em produção.

## Contrato usado

`api/importarManifesto.ts` envia `POST /api/operacional/viagens/importar-manifesto` com multipart no campo `file`. O operacional chama o serviço de relatórios, mapeia o JSON, salva e retorna uma lista de viagens. O frontend verifica IDs e identificadores de manifesto e mostra a quantidade retornada. Não usa mais a chamada antiga de `entities/relatorio`, que somente processa o arquivo.

Validação local: CSV/XLSX não vazio, até 10 MB. O modal bloqueia envio repetido e fechamento enquanto espera. Erros permanecem visíveis e não expõem detalhes internos do servidor. Não existe repetição automática: em falhas de rede/timeout/servidor, uma gravação pode ter ocorrido mesmo sem a confirmação chegar.

## Limitações do backend atual

- `spring.service.servlet.multipart` no operacional está no lugar errado; o limite pretendido de 10 MB não está aplicado. Começar com o CSV pequeno desta pasta. A correção é responsabilidade do backend.
- CPF obrigatório e veículo opcional ainda não seguem integralmente o Jira; erros de validação podem aparecer como HTTP 500.
- Não há prevenção de manifestos duplicados. Não reenviar o mesmo arquivo sem conferir os registros.
- O dashboard e a lista visual podem continuar usando dados simulados: o sucesso deste upload não atualiza essas outras features.

## Teste manual em ambiente de desenvolvimento

1. Na raiz da cópia de Documents, abrir Docker Desktop, preparar `.env` a partir de `.env.example` se necessário e executar `docker compose up --build -d`. O Compose usa o mesmo nome de projeto/containers da cópia anterior: esse comando pode substituir os containers antigos e reutilizar o volume de banco. Não executar as duas cópias simultaneamente nem apagar o volume.
2. Abrir `http://localhost:3000` e atualizar com Ctrl+F5.
3. Conferir que `GET http://localhost:3000/api/operacional/viagens` responde e registrar se o manifesto `TESTE-FRONT-20260922-001` já existe.
4. Importar `test-data/manifesto-teste.csv` pelo modal. São dados fictícios; o envio realmente grava uma viagem. O CSV está em ISO-8859-1, compatível com o parser atual. Manter essa codificação se editar.
5. Esperar “1 viagem importada com sucesso!”. No navegador (F12, Network), conferir o POST ao operacional com HTTP 200 e uma lista contendo `id`.
6. Atualizar a consulta GET do passo 3 e procurar o manifesto. Deve conter destino Campinas, frete 1500.50, data 2026-09-22 e status FINALIZADO.
7. Para confirmação direta no banco, executar na raiz (credenciais padrão do `.env.example`):

```powershell
docker compose exec postgres psql -U newelog_app -d newelog_db -c "SELECT id, manifesto, data, cidade_destino, valor_frete, status FROM operacional.viagem WHERE manifesto = 'TESTE-FRONT-20260922-001';"
```

Se o banco já contiver viagens antigas, a migration V4 também pode precisar de ajuste no backend. Não apagar dados para contornar falhas.

## Cenários adicionais

- Arrastar um PDF: rejeição antes do envio.
- Selecionar CSV vazio ou maior que 10 MB: rejeição antes do envio.
- CSV sem Manifesto/Data/Valor Frete: backend rejeita; atualmente pode responder 500. Conferir os logs e a ausência do registro no banco.
- Para simular indisponibilidade, parar `operacional-service`, tentar o envio, conferir mensagem de erro e iniciar o serviço novamente. Aguardar sua inicialização antes do próximo teste.
- XLSX deve usar os mesmos nomes de cabeçalhos do CSV. A regra de conversão permanece no backend.

## Testes automatizados sem rede

A partir de `frontend`, com Node 24:

```powershell
node --test src/features/enviar-relatorio/api/importarManifesto.test.mjs
```

Somente os testes simulam HTTP. Eles não comprovam a gravação real; esta é verificada pelo teste manual acima.
