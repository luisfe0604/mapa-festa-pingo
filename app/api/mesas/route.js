import { NextResponse } from "next/server";
import { listarMesas } from "@/lib/mesasDb";

export async function GET() {
  try {
    const mesas = await listarMesas();
    return NextResponse.json(mesas);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
