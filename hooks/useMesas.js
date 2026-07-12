"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchMesas } from "@/lib/mesasApi";
import { WS_URL } from "@/lib/config";

export function useMesas() {
  const [mesas, setMesas] = useState([]);

  const carregarMesas = useCallback(async () => {
    try {
      const data = await fetchMesas();
      setMesas(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount; setState only runs after the awaited response, not synchronously
    carregarMesas();

    document.addEventListener("visibilitychange", carregarMesas);

    const socket = new WebSocket(WS_URL);

    socket.addEventListener("open", () => {
      carregarMesas();
    });

    socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "mesas:update") {
          setMesas(data.mesas);
        }
      } catch (error) {
        console.error("Erro ao processar mensagem WebSocket:", error);
      }
    });

    return () => {
      document.removeEventListener("visibilitychange", carregarMesas);
      socket.close();
    };
  }, [carregarMesas]);

  return { mesas, carregarMesas };
}
