export const COLUNAS_ESQUERDA = 4;
export const COLUNAS_DIREITA = 3;
const TOTAL_COLUNAS = COLUNAS_ESQUERDA + COLUNAS_DIREITA;

export function distribuirMesas(mesas) {
  const colunasEsquerda = Array.from({ length: COLUNAS_ESQUERDA }, () => []);
  const colunasDireita = Array.from({ length: COLUNAS_DIREITA }, () => []);

  mesas.forEach((mesa, index) => {
    const colunaAtual = index % TOTAL_COLUNAS;

    if (colunaAtual < COLUNAS_ESQUERDA) {
      colunasEsquerda[colunaAtual].push({ mesa, index });
    } else {
      colunasDireita[colunaAtual - COLUNAS_ESQUERDA].push({ mesa, index });
    }
  });

  return { colunasEsquerda, colunasDireita };
}
