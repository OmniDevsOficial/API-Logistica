package com.ominidevs.operacional.veiculo.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.nio.charset.Charset;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.transaction.annotation.Transactional;

import com.ominidevs.operacional.motorista.dto.MotoristaResponseDTO;
import com.ominidevs.operacional.motorista.services.MotoristaService;
import com.ominidevs.operacional.veiculo.dto.FiltroVeiculo;
import com.ominidevs.operacional.veiculo.dto.ImportacaoVeiculoResponse;
import com.ominidevs.operacional.veiculo.dto.OcorrenciaLinhaVeiculo;
import com.ominidevs.operacional.veiculo.dto.VeiculoResponse;
import com.ominidevs.operacional.veiculo.dto.VeiculoResumoResponse;
import com.ominidevs.operacional.veiculo.exceptions.VeiculoNaoEncontradoException;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;

import jakarta.persistence.EntityManager;

/** PostgreSQL descartável com migrations reais. Docker obrigatório; não ignora testes. */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, properties = {
        "spring.datasource.url=jdbc:tc:postgresql:17-alpine:///veiculos?currentSchema=operacional",
        "spring.datasource.driver-class-name=org.testcontainers.jdbc.ContainerDatabaseDriver",
        "spring.datasource.username=test",
        "spring.datasource.password=test",
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.jpa.properties.hibernate.default_schema=operacional",
        "spring.flyway.schemas=operacional",
        "spring.flyway.create-schemas=true"
})
@Transactional
class ImportacaoVeiculoIntegrationTest {

    @Autowired private ImportacaoVeiculoService service;
    @Autowired private VeiculoConsultaService consulta;
    @Autowired private MotoristaService motoristaService;
    @Autowired private JdbcTemplate jdbc;
    @Autowired private EntityManager entityManager;

    private static final String CSV_PADRAO = """
            Placa;Marca;Modelo;Tipo Veículo;Proprietário;Motorista Padrão;Status do Veículo
            EKO2F09;Volvo;VM260;Truck ou pesado;ANA PROPRIETARIA;JOSE HILTON MENDES;Ativo
            AAJ3354;Mercedes Benz;"=""1114""\";Cavalo mecânico;LIMA TRANSPORTE;Maykon Zambonini;Ativo
            AAJ3355;Randon;SR;Semi-reboque com 2 eixos;LIMA TRANSPORTE;MAYKON  ZAMBONINI;Ativo
            HNF5D31;FIAT;FIORINO;Fiorino;LUCAS DIAS;;Inativo
            """;

    private static MockMultipartFile csv(String conteudo) {
        return new MockMultipartFile("file", "veiculos.csv", "text/csv",
                conteudo.getBytes(Charset.forName("windows-1252")));
    }

    /** Simula uma nova requisição: grava pendências e descarta o cache do JPA. */
    private ImportacaoVeiculoResponse importarEmNovaRequisicao(String conteudo) {
        ImportacaoVeiculoResponse resposta = service.importar(csv(conteudo));
        entityManager.flush();
        entityManager.clear();
        return resposta;
    }

    private Map<String, Object> veiculo(String placa) {
        return jdbc.queryForMap("""
                SELECT v.tipo, v.marca, v.modelo, v.status AS ativo, m.nome AS motorista, v.motorista_id
                FROM operacional.veiculo v LEFT JOIN operacional.motorista m ON m.id = v.motorista_id
                WHERE v.placa = ?""", placa);
    }

    private int contar(String tabela) {
        return jdbc.queryForObject("SELECT COUNT(*) FROM operacional." + tabela, Integer.class);
    }

    @Test
    void cadastraVeiculosEMotoristasLigandoMotoristaComVariosVeiculos() {
        ImportacaoVeiculoResponse resposta = importarEmNovaRequisicao(CSV_PADRAO);

        assertEquals(4, resposta.totalLinhas());
        assertEquals(4, resposta.veiculosCadastrados());
        assertEquals(0, resposta.veiculosAtualizados());
        assertEquals(2, resposta.motoristasCadastrados());
        assertEquals(1, resposta.veiculosSemMotorista());
        assertEquals(0, resposta.linhasComErro());

        assertEquals(4, contar("veiculo"));
        assertEquals(2, contar("motorista"));
        assertEquals("TRUCK OU PESADO", veiculo("EKO2F09").get("tipo"));
        assertEquals("JOSE HILTON MENDES", veiculo("EKO2F09").get("motorista"));
        assertEquals("CAVALO MECÂNICO", veiculo("AAJ3354").get("tipo"));
        assertEquals(veiculo("AAJ3354").get("motorista_id"), veiculo("AAJ3355").get("motorista_id"));
        assertEquals("FIORINO", veiculo("HNF5D31").get("tipo"));
        assertNull(veiculo("HNF5D31").get("motorista_id"));

        assertEquals("Volvo", veiculo("EKO2F09").get("marca"));
        assertEquals("VM260", veiculo("EKO2F09").get("modelo"));
        assertEquals(true, veiculo("EKO2F09").get("ativo"));
        assertEquals("1114", veiculo("AAJ3354").get("modelo"));
        assertEquals(false, veiculo("HNF5D31").get("ativo"));
    }

    @Test
    void planilhaSemColunasOpcionaisNaoApagaMarcaModeloEStatus() {
        importarEmNovaRequisicao(CSV_PADRAO);

        importarEmNovaRequisicao("""
                Placa;Tipo Veículo;Motorista Padrão
                EKO2F09;Truck ou pesado;JOSE HILTON MENDES
                """);

        assertEquals("Volvo", veiculo("EKO2F09").get("marca"));
        assertEquals("VM260", veiculo("EKO2F09").get("modelo"));
        assertEquals(true, veiculo("EKO2F09").get("ativo"));
    }

    @Test
    void statusDesconhecidoGeraAvisoSemRejeitarALinha() {
        ImportacaoVeiculoResponse resposta = importarEmNovaRequisicao("""
                Placa;Tipo Veículo;Status do Veículo
                ABC1234;VAN;Em manutenção
                """);

        assertEquals(1, resposta.veiculosCadastrados());
        assertEquals(0, resposta.linhasComErro());
        assertEquals(List.of(new OcorrenciaLinhaVeiculo(2, "ABC1234",
                "Status do veículo \"Em manutenção\" não reconhecido. Use Ativo ou Inativo.")), resposta.avisos());
        assertNull(veiculo("ABC1234").get("ativo"));
    }

    @Test
    void consultaFiltraVeiculosEAceitaPlacaEmQualquerFormato() {
        importarEmNovaRequisicao(CSV_PADRAO);

        assertEquals(List.of("AAJ3354", "AAJ3355"), consulta.listar(new FiltroVeiculo("aaj-33", null, null, null))
                .stream().map(VeiculoResponse::placa).toList());
        assertEquals(List.of("HNF5D31"), consulta.listar(new FiltroVeiculo(null, "fiorino", null, false))
                .stream().map(VeiculoResponse::placa).toList());

        VeiculoResponse truck = consulta.buscarPorPlaca("eko-2f09");
        assertEquals("VM260", truck.modelo());
        assertEquals("JOSE HILTON MENDES", truck.motoristaNome());
        assertEquals(List.of(truck), consulta.listar(new FiltroVeiculo(null, null, truck.motoristaId(), null)));
        assertThrows(VeiculoNaoEncontradoException.class, () -> consulta.buscarPorPlaca("ZZZ9Z99"));

        assertEquals(List.of("CAVALO MECÂNICO", "FIORINO", "SEMI-REBOQUE COM 2 EIXOS", "TRUCK OU PESADO"),
                consulta.listarTipos());
        assertEquals(Map.of("EKO2F09", "TRUCK OU PESADO"),
                consulta.tiposPorPlaca(List.of("eko 2f09", "XXX0000")));
    }

    @Test
    void listaDeMotoristasMostraVeiculoPrincipalComModeloETodosOsVeiculos() {
        importarEmNovaRequisicao(CSV_PADRAO);
        jdbc.update("UPDATE operacional.veiculo SET status = false WHERE placa = 'AAJ3354'");

        MotoristaResponseDTO maykon = motoristaService.listar(null).stream()
                .filter(m -> m.nome().equals("Maykon Zambonini"))
                .findFirst().orElseThrow();

        assertEquals("AAJ3355", maykon.placa());
        assertEquals("SR", maykon.modeloVeiculo());
        assertEquals("SEMI-REBOQUE COM 2 EIXOS", maykon.tipoVeiculo());
        assertEquals(List.of("AAJ3355", "AAJ3354"),
                maykon.veiculos().stream().map(VeiculoResumoResponse::placa).toList());
    }

    @Test
    void reimportarMesmaPlanilhaAtualizaSemDuplicar() {
        importarEmNovaRequisicao(CSV_PADRAO);

        ImportacaoVeiculoResponse resposta = importarEmNovaRequisicao(CSV_PADRAO);

        assertEquals(0, resposta.veiculosCadastrados());
        assertEquals(4, resposta.veiculosAtualizados());
        assertEquals(0, resposta.motoristasCadastrados());
        assertEquals(4, contar("veiculo"));
        assertEquals(2, contar("motorista"));
    }

    @Test
    void reimportacaoTrocaTipoEMotoristaERemoveVinculoQuandoVazio() {
        importarEmNovaRequisicao(CSV_PADRAO);

        importarEmNovaRequisicao("""
                Placa;Tipo Veículo;Motorista Padrão
                EKO2F09;Toco ou semi-pesado;Maykon Zambonini
                AAJ3354;Cavalo mecânico;
                """);

        assertEquals("TOCO OU SEMI-PESADO", veiculo("EKO2F09").get("tipo"));
        assertEquals("Maykon Zambonini", veiculo("EKO2F09").get("motorista"));
        assertNull(veiculo("AAJ3354").get("motorista_id"));
        assertEquals(2, contar("motorista"));
    }

    @Test
    void linhasInvalidasSaoReportadasSemDerrubarAsValidas() {
        ImportacaoVeiculoResponse resposta = importarEmNovaRequisicao("""
                Placa;Tipo Veículo;Motorista Padrão
                ABC1234;VAN;Ana
                ;VAN;Bruno
                AB12;VAN;Carla
                DEF5678;;Diego
                abc-1234;VUC;Eva
                GHI9J01;3/4;Fabio
                """);

        assertEquals(6, resposta.totalLinhas());
        assertEquals(2, resposta.veiculosCadastrados());
        assertEquals(4, resposta.linhasComErro());
        assertEquals(List.of(
                new OcorrenciaLinhaVeiculo(3, null, "Placa não informada."),
                new OcorrenciaLinhaVeiculo(4, "AB12", "Placa inválida. Use o formato AAA9999 ou AAA9A99."),
                new OcorrenciaLinhaVeiculo(5, "DEF5678", "Tipo de veículo não informado."),
                new OcorrenciaLinhaVeiculo(6, "ABC1234", "Placa repetida no arquivo (já informada na linha 2).")),
                resposta.erros());
        assertEquals(2, contar("veiculo"));
        assertEquals(2, contar("motorista"));
        assertEquals("VAN", veiculo("ABC1234").get("tipo"));
    }

    @Test
    void reconheceMotoristaDoManifestoPeloNomeMesmoComCpfAcentoEEspacos() {
        jdbc.update("""
                INSERT INTO operacional.motorista (nome, cpf, data_criacao, status)
                VALUES ('José  da Silva', '00123456789', CURRENT_DATE, 'EM_OPERACAO')""");

        ImportacaoVeiculoResponse resposta = importarEmNovaRequisicao("""
                Placa;Tipo Veículo;Motorista Padrão
                ABC1234;VAN;JOSE DA SILVA
                """);

        assertEquals(0, resposta.motoristasCadastrados());
        assertEquals(1, contar("motorista"));
        assertEquals("José  da Silva", veiculo("ABC1234").get("motorista"));
        assertEquals("EM_OPERACAO", jdbc.queryForObject(
                "SELECT status FROM operacional.motorista", String.class));
    }

    @Test
    void manifestoPosteriorCompletaCpfDoMotoristaCriadoPelaPlanilhaDeVeiculos() {
        importarEmNovaRequisicao("""
                Placa;Tipo Veículo;Motorista Padrão
                ABC1234;VAN;Maria  Souza
                """);
        Viagem viagem = new Viagem("MAN-1", LocalDate.of(2026, 9, 1), "MARIA SOUZA", "001.234.567-89",
                "ABC1234", "Campinas", "Santos", new BigDecimal("100.00"), null, null,
                StatusViagem.FINALIZADO, null, null);

        motoristaService.sincronizarComManifesto(List.of(viagem));
        entityManager.flush();

        assertEquals(1, contar("motorista"));
        assertEquals("00123456789", jdbc.queryForObject("SELECT cpf FROM operacional.motorista", String.class));
    }

    @Test
    void homonimosGeramAvisoEVeiculoSemMotorista() {
        jdbc.update("""
                INSERT INTO operacional.motorista (nome, cpf, data_criacao, status) VALUES
                ('Pedro Lima', '11111111111', CURRENT_DATE, 'DISPONIVEL'),
                ('PEDRO LIMA', '22222222222', CURRENT_DATE, 'DISPONIVEL')""");

        ImportacaoVeiculoResponse resposta = importarEmNovaRequisicao("""
                Placa;Tipo Veículo;Motorista Padrão
                ABC1234;VAN;Pedro Lima
                """);

        assertEquals(1, resposta.veiculosSemMotorista());
        assertEquals(1, resposta.avisos().size());
        assertTrue(resposta.avisos().getFirst().mensagem().startsWith("Há 2 motoristas cadastrados"));
        assertNull(veiculo("ABC1234").get("motorista_id"));
        assertEquals(2, contar("motorista"));
    }
}
