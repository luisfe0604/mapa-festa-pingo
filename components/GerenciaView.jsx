import Link from "next/link";
import MapaMesas from "@/components/MapaMesas";

export default function GerenciaView() {
  return (
    <>
      <nav className="painel-nav">
        <span className="painel-nav-titulo">Painel de Gerência</span>
        <Link href="/publico" className="painel-nav-link">
          Ver versão pública ↗
        </Link>
      </nav>
      <MapaMesas gerente />
    </>
  );
}
