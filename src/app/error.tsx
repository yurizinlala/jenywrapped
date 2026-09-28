"use client";
import { jenyWrapped } from "@/data/jeny";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="preloader">
      <span>
        {jenyWrapped.person.nickname.toUpperCase()} WRAPPED / {jenyWrapped.year}
      </span>
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
