import { useEffect, useState } from "react";

export function useValorAdiado<T>(valor: T, atrasoMs: number): T {
  const [adiado, setAdiado] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setAdiado(valor), atrasoMs);
    return () => clearTimeout(temporizador);
  }, [valor, atrasoMs]);

  return adiado;
}
