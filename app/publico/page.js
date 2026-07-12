import MapaMesas from "@/components/MapaMesas";

export const metadata = {
  title: "Mapa de Mesas - Festa Junina",
};

export default function PublicoPage() {
  return <MapaMesas gerente={false} />;
}
