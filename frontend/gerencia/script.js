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

fetch('https://mapa-festa-pingo-backend-infantil.onrender.com/api/mesas')
  .then(res => res.json())
  .then(data => {
    mesas = data;
    renderizarMapa();
  });

  const socket = new WebSocket('wss://mapa-festa-pingo-backend-infantil.onrender.com');

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
  
    const colunas = 6;
    const linhas = 19;
  
    const ladoEsquerdo = document.createElement('div');
    const ladoDireito = document.createElement('div');
  
    ladoEsquerdo.className = 'lado-mapa';
    ladoDireito.className = 'lado-mapa';
  
    for (let col = 0; col < colunas; col++) {
      const colunaDiv = document.createElement('div');
      colunaDiv.className = 'coluna-mesa';
  
      for (let row = 0; row < linhas; row++) {
        const index = col * linhas + row;
        if (index >= mesas.length) break;
  
        const div = document.createElement('div');
        div.className = 'mesa';
        div.textContent = index + 1;
  
        if (mesas[index]?.ocupada) {
          div.classList.add('ocupada');
        }
  
        div.onclick = () => abrirModal(index);
        colunaDiv.appendChild(div);
      }
  
      if (col < 3) {
        ladoEsquerdo.appendChild(colunaDiv);
      } else {
        ladoDireito.appendChild(colunaDiv);
      }
    }
  
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
  const url = gerente ? `https://mapa-festa-pingo-backend-infantil.onrender.com/api/mesas/${id}` : `https://mapa-festa-pingo-backend-infantil.onrender.com/api/mesas/${id}/reservar`;
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
  fetch(`https://mapa-festa-pingo-backend-infantil.onrender.com/api/mesas/limpar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: null,
      cadeiras: null,
      ocupada: false
    })
  }).then(() => location.reload());
};

cancelarBtn.onclick = () => modal.classList.add('hidden');