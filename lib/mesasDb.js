import { pool } from "./db";

export async function listarMesas() {
  const result = await pool.query("SELECT * FROM public.mesas_festa ORDER BY id");
  return result.rows;
}

export async function reservarMesa({ id, nome, cadeiras }) {
  const result = await pool.query(
    `
      UPDATE public.mesas_festa
      SET
        nome = $1,
        cadeiras = $2,
        ocupada = true
      WHERE id = $3
      AND ocupada = false
      RETURNING *
    `,
    [nome, cadeiras, id],
  );

  return result.rows[0];
}

export async function atualizarMesa({ id, nome, cadeiras }) {
  const result = await pool.query(
    `
      UPDATE public.mesas_festa
      SET
        nome = $1,
        cadeiras = $2,
        ocupada = true
      WHERE id = $3
      RETURNING *
    `,
    [nome, cadeiras, id],
  );

  return result.rows[0];
}

export async function limparMesa({ id, nome, cadeiras, ocupada }) {
  const result = await pool.query(
    `
      UPDATE public.mesas_festa
      SET
        nome = $1,
        cadeiras = $2,
        ocupada = $3
      WHERE id = $4
      RETURNING *
    `,
    [nome, cadeiras, ocupada, id],
  );

  return result.rows[0];
}
