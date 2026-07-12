async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Erro ao salvar reserva.");
  }

  return data;
}

export async function fetchMesas() {
  const response = await fetch("/api/mesas", { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Erro ao carregar mesas.");
  }

  return response.json();
}

export function reservarMesa(id, { nome, cadeiras }) {
  return request(`/api/mesas/${id}/reservar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, cadeiras }),
  });
}

export function atualizarMesa(id, { nome, cadeiras }) {
  return request(`/api/mesas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, cadeiras }),
  });
}

export function limparMesa(id) {
  return request(`/api/mesas/limpar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: null, cadeiras: null, ocupada: false }),
  });
}
