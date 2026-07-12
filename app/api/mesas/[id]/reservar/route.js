import { NextResponse } from "next/server";
import { reservarMesa } from "@/lib/mesasDb";

export async function POST(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10) + 1;
    const { nome, cadeiras } = await request.json();

    if (!nome || !cadeiras) {
      return NextResponse.json(
        { error: "Nome e número de cadeiras são obrigatórios." },
        { status: 400 },
      );
    }

    const mesa = await reservarMesa({ id, nome, cadeiras });

    if (!mesa) {
      return NextResponse.json(
        { error: "Mesa já está ocupada ou não existe." },
        { status: 409 },
      );
    }

    return NextResponse.json({ message: "Mesa reservada com sucesso.", mesa });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
