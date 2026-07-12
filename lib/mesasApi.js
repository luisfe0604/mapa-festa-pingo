import { API_BASE_URL } from "./config";

async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Erro ao salvar reserva.");
  }

  return data;
}

export async function fetchMesas() {
  const response = await fetch(`${API_BASE_URL}/mesas`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Erro ao carregar mesas.");
  }

  return response.json();
}

export function reservarMesa(id, { nome, cadeiras }) {
  return request(`${API_BASE_URL}/mesas/${id}/reservar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, cadeiras }),
  });
}

export function atualizarMesa(id, { nome, cadeiras }) {
  return request(`${API_BASE_URL}/mesas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, cadeiras }),
  });
}

export function limparMesa(id) {
  return request(`${API_BASE_URL}/mesas/limpar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: null, cadeiras: null, ocupada: false }),
  });
}
