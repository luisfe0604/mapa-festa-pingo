const mapa = document.getElementById("mapa");
const modal = document.getElementById("modal");
const nomeInput = document.getElementById("nome");
const cadeirasInput = document.getElementById("cadeiras");
const confirmarBtn = document.getElementById("confirmar");
const cancelarBtn = document.getElementById("cancelar");
const mesaIdSpan = document.getElementById("mesa-id");

let mesas = [];
let mesaSelecionada = null;
const gerente = typeof isGerente !== "undefined" && isGerente === true;

fetch("https://simulados-oab-back.onrender.com/mesas")
  .then((res) => res.json())
  .then((data) => {
    mesas = data;
    renderizarMapa();
  });

const socket = new WebSocket("wss://simulados-oab-back.onrender.com");

socket.addEventListener("message", (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.type === "mesas:update") {
      mesas = data.mesas;
      renderizarMapa();
    }
  } catch (error) {
    console.error("Erro ao processar mensagem WebSocket:", error);
  }
});

function abrirModal(id) {
  const mesa = mesas[id];
  if (mesa.ocupada && !gerente) return;
  mesaSelecionada = id;
  mesaIdSpan.textContent = id + 1;
  nomeInput.value = mesa.nome || '';
  cadeirasInput.value = mesa.cadeiras || '';
  modal.classList.remove('hidden');
}


function renderizarMapa() {
  mapa.innerHTML = "";

  const colunasEsquerda = 4;
  const colunasDireita = 3;

  const totalColunas = colunasEsquerda + colunasDireita;

  const ladoEsquerdo = document.createElement("div");
  const ladoDireito = document.createElement("div");

  ladoEsquerdo.className = "lado-mapa esquerda";
  ladoDireito.className = "lado-mapa direita";

  /* =========================
     CRIAR COLUNAS
  ========================= */

  const colunasLeft = [];
  const colunasRight = [];

  for (let i = 0; i < colunasEsquerda; i++) {
    const coluna = document.createElement("div");

    coluna.className = "coluna-mesa";

    colunasLeft.push(coluna);

    ladoEsquerdo.appendChild(coluna);
  }

  for (let i = 0; i < colunasDireita; i++) {
    const coluna = document.createElement("div");

    coluna.className = "coluna-mesa";

    colunasRight.push(coluna);

    ladoDireito.appendChild(coluna);
  }

  /* =========================
     DISTRIBUIR MESAS
     LINHA POR LINHA
  ========================= */

  mesas.forEach((mesa, index) => {
    const div = document.createElement("div");

    div.className = "mesa";

    div.textContent = index + 1;

    if (mesa.ocupada) {
      div.classList.add("ocupada");
    }

    div.onclick = () => abrirModal(index);

    const colunaAtual = index % totalColunas;

    if (colunaAtual < colunasEsquerda) {
      colunasLeft[colunaAtual].appendChild(div);
    } else {
      colunasRight[colunaAtual - colunasEsquerda].appendChild(div);
    }
  });

  const wrapper = document.createElement("div");

  wrapper.className = "mapa-wrapper";

  wrapper.appendChild(ladoEsquerdo);

  wrapper.appendChild(ladoDireito);

  mapa.appendChild(wrapper);
}

modal.addEventListener("click", (event) => {
  // Se o clique foi no próprio modal (fundo), e não no conteúdo interno
  if (event.target === modal) {
    modal.classList.add("hidden"); // fecha o modal
  }
});

confirmarBtn.onclick = () => {
  const nome = nomeInput.value;
  const cadeiras = parseInt(cadeirasInput.value);
  const id = mesaSelecionada;
  const url = gerente
    ? `https://simulados-oab-back.onrender.com/mesas/${id}`
    : `https://simulados-oab-back.onrender.com/mesas/${id}/reservar`;
  const method = gerente ? "PUT" : "POST";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, cadeiras }),
  }).then(() => location.reload());
};

cancelarBtn.onclick = () => modal.classList.add("hidden");
