"use client";

import { useEffect, useState } from "react";
import { useMesas } from "@/hooks/useMesas";
import { distribuirMesas } from "@/lib/distribuirMesas";
import { reservarMesa, atualizarMesa, limparMesa } from "@/lib/mesasApi";

const IDENTIFICACOES = [
  { chave: "som", emoji: "🎵", label: "Som" },
  { chave: "palco", emoji: "🎤", label: "Palco" },
  { chave: "salgados", emoji: "🍔", label: "Salgados" },
  { chave: "caixa", emoji: "💵", label: "Caixa" },
  { chave: "pesca", emoji: "🎣", label: "Pesca" },
  { chave: "bebidas", emoji: "🥤", label: "Bebidas" },
  { chave: "entrada", emoji: "🚪", label: "Entrada" },
];

function MesaCard({ mesa, index, bloqueada, onSelecionar }) {
  const numero = index + 1;
  const rotulo = mesa.ocupada
    ? `Mesa ${numero}, reservada${bloqueada ? "" : " — toque para editar"}`
    : `Mesa ${numero}, livre — toque para reservar`;

  function acionar() {
    if (bloqueada) return;
    onSelecionar(index);
  }

  return (
    <div
      className={`mesa${mesa.ocupada ? " ocupada" : ""}`}
      role="button"
      tabIndex={bloqueada ? -1 : 0}
      aria-disabled={bloqueada}
      aria-label={rotulo}
      onClick={acionar}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          acionar();
        }
      }}
    >
      {numero}
    </div>
  );
}

function ColunaMesas({ coluna, gerente, onSelecionar }) {
  return coluna.map(({ mesa, index }) => (
    <MesaCard
      key={index}
      mesa={mesa}
      index={index}
      bloqueada={mesa.ocupada && !gerente}
      onSelecionar={onSelecionar}
    />
  ));
}

export default function MapaMesas({ gerente }) {
  const { mesas, carregarMesas } = useMesas();
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [nome, setNome] = useState("");
  const [cadeiras, setCadeiras] = useState("");
  const [toast, setToast] = useState(null);

  const { colunasEsquerda, colunasDireita } = distribuirMesas(mesas);
  const mesaAtual = mesaSelecionada !== null ? mesas[mesaSelecionada] : null;
  const totalOcupadas = mesas.filter((mesa) => mesa.ocupada).length;
  const totalLivres = mesas.length - totalOcupadas;

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  function mostrarToast(mensagem, tipo = "success") {
    setToast({ mensagem, tipo, id: Date.now() });
  }

  function abrirModal(index) {
    const mesa = mesas[index];
    if (mesa.ocupada && !gerente) return;
    setMesaSelecionada(index);
    setNome(mesa.nome || "");
    setCadeiras(mesa.cadeiras || "");
  }

  function fecharModal() {
    setMesaSelecionada(null);
  }

  async function handleConfirmar() {
    const id = mesaSelecionada;
    const payload = { nome, cadeiras: parseInt(cadeiras, 10) };

    try {
      if (gerente) {
        await atualizarMesa(id, payload);
      } else {
        await reservarMesa(id, payload);
      }

      mostrarToast(
        gerente
          ? `Mesa ${id + 1} atualizada com sucesso!`
          : `Mesa ${id + 1} reservada com sucesso!`,
        "success",
      );

      fecharModal();
      carregarMesas();
    } catch (error) {
      mostrarToast(error.message || "Erro ao salvar reserva.", "error");
    }
  }

  async function handleLimpar() {
    if (!gerente || mesaSelecionada === null) return;

    const confirmar = window.confirm(
      `Deseja realmente liberar a Mesa ${mesaSelecionada + 1}?`,
    );

    if (!confirmar) return;

    try {
      await limparMesa(mesaSelecionada);
      mostrarToast(`Mesa ${mesaSelecionada + 1} liberada com sucesso!`, "success");
      fecharModal();
      carregarMesas();
    } catch (error) {
      console.error(error);
      mostrarToast("Erro ao liberar mesa.", "error");
    }
  }

  async function handleExportar() {
    const XLSX = await import("xlsx");

    const dados = mesas.map((mesa, index) => ({
      Mesa: index + 1,
      Nome: mesa.nome || "",
      Cadeiras: mesa.cadeiras || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Mesas");
    worksheet["!cols"] = [{ wch: 10 }, { wch: 35 }, { wch: 15 }];

    XLSX.writeFile(workbook, "mesas-festa.xlsx");
  }

  return (
    <>
      <header className="pagina-header">
        <p className="pagina-eyebrow">{gerente ? "Painel de gerência" : "Festa Junina"}</p>
        <h1 className="pagina-titulo">{gerente ? "Mapa de Mesas" : "Escolha sua mesa"}</h1>
        <p className="pagina-subtitulo">
          {gerente
            ? `${totalLivres} livres · ${totalOcupadas} reservadas de ${mesas.length} mesas`
            : "Toque em uma mesa livre para garantir seu lugar no arraiá."}
        </p>
        <div className="legenda">
          <span className="legenda-item">
            <span className="legenda-marca livre" /> Livre
          </span>
          <span className="legenda-item">
            <span className="legenda-marca ocupada" /> Reservada
          </span>
        </div>
      </header>

      <div id="toast" className={`toast ${toast?.tipo || ""}${toast ? "" : " hidden"}`}>
        {toast?.mensagem}
      </div>

      <div id="mapa-container">
        <div id="mapa-identificacoes">
          {IDENTIFICACOES.map((item) => (
            <div key={item.chave} className={`identificacao ${item.chave}`}>
              <span>
                {item.emoji} {item.label}
              </span>
            </div>
          ))}
        </div>

        <div id="mapa">
          <div className="mapa-wrapper">
            <div className="lado-mapa esquerda">
              {colunasEsquerda.map((coluna, i) => (
                <div className="coluna-mesa" key={i}>
                  <ColunaMesas coluna={coluna} gerente={gerente} onSelecionar={abrirModal} />
                </div>
              ))}
            </div>
            <div className="lado-mapa direita">
              {colunasDireita.map((coluna, i) => (
                <div className="coluna-mesa" key={i}>
                  <ColunaMesas coluna={coluna} gerente={gerente} onSelecionar={abrirModal} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {gerente && (
        <div className="acoes-rodape">
          <button id="exportar-excel" onClick={handleExportar}>
            Exportar Excel
          </button>
        </div>
      )}

      <div
        className={`modal${mesaAtual ? "" : " hidden"}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) fecharModal();
        }}
      >
        {mesaAtual && (
          <div className="modal-content">
            <h2>
              {gerente ? (
                <span>Mesa {mesaSelecionada + 1}</span>
              ) : (
                <>
                  Reservar Mesa <span>{mesaSelecionada + 1}</span>
                </>
              )}
            </h2>

            <label>
              Nome: <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
            </label>
            <br />
            <label>
              Cadeiras:{" "}
              <input
                type="number"
                value={cadeiras}
                onChange={(e) => setCadeiras(e.target.value)}
              />
            </label>
            <br />

            <div className="modal-buttons">
              <button id="confirmar" onClick={handleConfirmar}>
                Salvar
              </button>
              {gerente && (
                <button id="limpar" onClick={handleLimpar}>
                  Excluir reserva
                </button>
              )}
              <button id="cancelar" onClick={fecharModal}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
