import { NextResponse } from "next/server";
import { atualizarMesa } from "@/lib/mesasDb";

export async function PUT(request, { params }) {
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

    const mesa = await atualizarMesa({ id, nome, cadeiras });

    if (!mesa) {
      return NextResponse.json({ error: "Mesa não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ message: "Mesa atualizada com sucesso.", mesa });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
