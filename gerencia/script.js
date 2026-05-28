const mapa = document.getElementById('mapa');
const modal = document.getElementById('modal');
const nomeInput = document.getElementById('nome');
const cadeirasInput = document.getElementById('cadeiras');
const confirmarBtn = document.getElementById('confirmar');
const cancelarBtn = document.getElementById('cancelar');
const mesaIdSpan = document.getElementById('mesa-id');

let mesas = [];
let mesaSelecionada = null;
const gerente = typeof isGerente !== 'undefined' && isGerente === true;
const limparBtn = document.getElementById('limpar');

fetch('https://simulados-oab-back.onrender.com/mesas')
  .then(res => res.json())
  .then(data => {
    mesas = data;
    renderizarMapa();
  });

  const socket = new WebSocket('wss://simulados-oab-back.onrender.com');

  socket.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'mesas:update') {
        mesas = data.mesas;
        renderizarMapa();
      }
    } catch (error) {
      console.error('Erro ao processar mensagem WebSocket:', error);
    }
  });

function renderizarMapa() {

  mapa.innerHTML = '';

  const colunasEsquerda = 4;
  const colunasDireita = 3;

  const totalColunas = colunasEsquerda + colunasDireita;

  const ladoEsquerdo = document.createElement('div');
  const ladoDireito = document.createElement('div');

  ladoEsquerdo.className = 'lado-mapa esquerda';
  ladoDireito.className = 'lado-mapa direita';

  const colunasLeft = [];
  const colunasRight = [];

  for (let i = 0; i < colunasEsquerda; i++) {

    const coluna = document.createElement('div');

    coluna.className = 'coluna-mesa';

    colunasLeft.push(coluna);

    ladoEsquerdo.appendChild(coluna);
  }

  for (let i = 0; i < colunasDireita; i++) {

    const coluna = document.createElement('div');

    coluna.className = 'coluna-mesa';

    colunasRight.push(coluna);

    ladoDireito.appendChild(coluna);
  }

  mesas.forEach((mesa, index) => {

    const div = document.createElement('div');

    div.className = 'mesa';

    div.textContent = index + 1;

    if (mesa.ocupada) {
      div.classList.add('ocupada');
    }

    div.onclick = () => abrirModal(index);

    const colunaAtual = index % totalColunas;

    if (colunaAtual < colunasEsquerda) {

      colunasLeft[colunaAtual].appendChild(div);

    } else {

      colunasRight[colunaAtual - colunasEsquerda].appendChild(div);
    }
  });

  const wrapper = document.createElement('div');

  wrapper.className = 'mapa-wrapper';

  wrapper.appendChild(ladoEsquerdo);
  wrapper.appendChild(ladoDireito);

  mapa.appendChild(wrapper);
}

function abrirModal(id) {
  const mesa = mesas[id];
  if (mesa.ocupada && !gerente) return;
  mesaSelecionada = id;
  mesaIdSpan.textContent = id + 1;
  nomeInput.value = mesa.nome || '';
  cadeirasInput.value = mesa.cadeiras || '';
  modal.classList.remove('hidden');
}

modal.addEventListener('click', (event) => {
  // Se o clique foi no próprio modal (fundo), e não no conteúdo interno
  if (event.target === modal) {
    modal.classList.add('hidden'); // fecha o modal
  }
});

confirmarBtn.onclick = () => {
  const nome = nomeInput.value;
  const cadeiras = parseInt(cadeirasInput.value);
  const id = mesaSelecionada;
  const url = gerente ? `https://simulados-oab-back.onrender.com/mesas/${id}` : `https://simulados-oab-back.onrender.com/mesas/${id}/reservar`;
  const method = gerente ? 'PUT' : 'POST';

  fetch(url, {
    method,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ nome, cadeiras })
  }).then(() => location.reload());
};

limparBtn.onclick = () => {
  if (!gerente || mesaSelecionada === null) return;

  const id = mesaSelecionada;
  fetch(`https://simulados-oab-back.onrender.com/mesas/limpar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: null,
      cadeiras: null,
      ocupada: false
    })
  }).then(() => location.reload());
};

document
  .getElementById('exportar-excel')
  .onclick = exportarExcel;

function exportarExcel() {

  const dados = mesas.map((mesa, index) => ({

    Mesa: index + 1,

    Nome: mesa.nome || 'Livre',

    Cadeiras: mesa.cadeiras || 0
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(dados);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Mesas'
  );

  /* largura das colunas */

  worksheet['!cols'] = [
    { wch: 10 },
    { wch: 35 },
    { wch: 15 }
  ];

  XLSX.writeFile(
    workbook,
    'mesas-festa.xlsx'
  );
}

cancelarBtn.onclick = () => modal.classList.add('hidden');