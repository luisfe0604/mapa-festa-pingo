const CORES = ["var(--ember)", "var(--corn)", "var(--gingham)", "var(--sage)"];

const QUANTIDADE = 28;

export default function Bandeirinhas() {
  return (
    <div className="bandeirinhas" aria-hidden="true">
      {Array.from({ length: QUANTIDADE }).map((_, i) => (
        <span
          key={i}
          className="bandeirinha"
          style={{
            "--cor-bandeira": CORES[i % CORES.length],
            "--atraso": `${(i % 7) * 0.28}s`,
          }}
        />
      ))}
    </div>
  );
}
