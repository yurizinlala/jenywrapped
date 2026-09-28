import { jenyWrapped } from "@/data/jeny";
export default function Loading() {
  return (
    <div className="preloader">
      <span>
        {jenyWrapped.author.toUpperCase()} ×{" "}
        {jenyWrapped.person.nickname.toUpperCase()}
      </span>
      <strong>
        carregando
        <br />
        memórias<span className="loading-dot">...</span>
      </strong>
      <small>
        {jenyWrapped.person.nickname.toUpperCase()} WRAPPED / {jenyWrapped.year}
      </small>
    </div>
  );
}
