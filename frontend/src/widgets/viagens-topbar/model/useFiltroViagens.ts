// Hook que concentra todo o estado do filtro: valores selecionados, chamada
// à API, loading e erro. 

import { useState } from "react";
import {filtrarViagensApi} from "../api/filtrarViagens";
import { filtroVazio, type FiltroViagens } from "./types";

export function useFiltroViagens(onFiltroAplicado?: (resultado: any[]) => void) {
    const [filtro, setFiltro] = useState<FiltroViagens>(filtroVazio);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    // Conta quantos critérios estão preenchidos, só pra mostrar o valor no
    // botão (ex: "Filtrar (2)"). apenasDisponiveis é boolean então trata à parte.
    const quantidadeAtiva = Object.entries(filtro).filter(([chave, valor]) => {
        if (chave === 'apenasDisponiveis') return valor === true;
        return valor !== true;
    }).length;

    const aplicar = async () => {
        setCarregando(true);
        setErro(null);

        try {
            const dados = await filtrarViagensApi(filtro)
    
            // Resposta vazia vira mensagem, ao invés de listar em branco
            if (!dados || dados.length === 0) {
                setErro('Viagem não encontrada para estes filtros')
            } else {
                onFiltroAplicado?.(dados)
            }
        } catch {
            setErro('Erro ao filtrar viagens. Tente novamente.')
        } finally {
            setCarregando(false)
        }
    };

    const limpar = () => {
        setFiltro(filtroVazio);
        setErro(null);
    }

    return { filtro, setFiltro, carregando, erro, quantidadeAtiva, aplicar, limpar }
}