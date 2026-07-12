import { NextResponse } from "next/server";
import { limparMesa } from "@/lib/mesasDb";

export async function PUT(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10) + 1;
    const { nome, cadeiras, ocupada } = await request.json();

    if (typeof ocupada !== "boolean") {
      return NextResponse.json({ error: 'Valor de "ocupada" inválido.' }, { status: 400 });
    }

    const mesa = await limparMesa({ id, nome, cadeiras, ocupada });

    if (!mesa) {
      return NextResponse.json({ error: "Mesa não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ message: "Mesa atualizada com sucesso.", mesa });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
