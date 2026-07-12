"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchMesas } from "@/lib/mesasApi";
import { supabase } from "@/lib/supabaseClient";

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

    const channel = supabase
      .channel("mesas_festa_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mesas_festa" },
        carregarMesas,
      )
      .subscribe();

    return () => {
      document.removeEventListener("visibilitychange", carregarMesas);
      supabase.removeChannel(channel);
    };
  }, [carregarMesas]);

  return { mesas, carregarMesas };
}
