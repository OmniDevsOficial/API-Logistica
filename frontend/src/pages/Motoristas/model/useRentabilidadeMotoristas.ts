import { useEffect, useMemo, useState } from "react";
import { buscarRentabilidadeMotoristas } from "@entities/motorista";

function formatarData(data: Date): string {
  return new Intl.DateTimeFormat("pt-BR").format(data);
}

function normalizarNome(nome: string): string {
  return nome.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

export function useRentabilidadeMotoristas() {
  const intervalo = useMemo(() => {
    const hoje = new Date();
    const primeiroDiaDoPeriodo = new Date(
      hoje.getFullYear(),
      hoje.getMonth() - 6,
      1,
    );
    const ultimoDiaDoPeriodo = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      0,
    );
    return {
      dataInicio: formatarData(primeiroDiaDoPeriodo),
      dataFim: formatarData(ultimoDiaDoPeriodo),
    };
  }, []);
  const [rentabilidades, setRentabilidades] = useState<Map<string, number | null>>(
    () => new Map(),
  );

  useEffect(() => {
    const controller = new AbortController();

    void buscarRentabilidadeMotoristas(
      intervalo.dataInicio,
      intervalo.dataFim,
      controller.signal,
    )
      .then((dados) => {
        if (controller.signal.aborted) return;
        setRentabilidades(
          new Map(
            dados.map((item) => [
              normalizarNome(item.motorista),
              item.rentabilidadeMedia,
            ]),
          ),
        );
      })
      .catch(() => {
        if (!controller.signal.aborted) setRentabilidades(new Map());
      });

    return () => controller.abort();
  }, [intervalo]);

  return rentabilidades;
}

export function chaveNomeMotorista(nome: string): string {
  return normalizarNome(nome);
}
