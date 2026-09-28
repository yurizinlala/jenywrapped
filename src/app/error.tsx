"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="preloader">
      <span>JENY WRAPPED / 2026</span>
      <strong>
        essa memória
        <br />
        tropeçou.
      </strong>
      <button className="start-button" onClick={reset}>
        tentar de novo ↗
      </button>
    </div>
  );
}
