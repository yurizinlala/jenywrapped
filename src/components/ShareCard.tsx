"use client";
import { useState } from "react";
import { jenyWrapped as data } from "@/data/jeny";
import { Burst } from "./Primitives";

async function exportCard() {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível");
  ctx.fillStyle = "#123df5";
  ctx.fillRect(0, 0, 1080, 1920);
  ctx.fillStyle = "#dfff00";
  ctx.beginPath();
  for (let i = 0; i < 40; i++) {
    const a = (i * Math.PI) / 20;
    const r = i % 2 ? 300 : 365;
    const x = 1040 + Math.cos(a) * r;
    const y = 550 + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  const text = (
    value: string,
    x: number,
    y: number,
    size: number,
    color = "#f7f4e9",
    weight = 700,
  ) => {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px "Space Grotesk Variable", Arial, sans-serif`;
    ctx.fillText(value, x, y);
  };
  text("JENY", 70, 210, 170);
  text("WRAPPED", 70, 345, 145);
  text(String(data.year), 76, 418, 38);
  text("TOP PERSON", 76, 555, 28);
  text(data.share.topPerson.toUpperCase(), 65, 735, 200);
  const rows = [
    ["TOP TRIP", data.share.topTrip],
    ["COR DO ANO", data.share.color],
    ["TRILHA DA VIAGEM", "Alinhamento Milenar — Jão"],
    ["SECRET YURI TRACK", "this is what falling in love"],
    ["", "feels like — JVKE"],
  ];
  let y = 850;
  for (const [label, value] of rows) {
    if (label) {
      text(label, 76, y, 25, "#b9c9ff", 500);
      y += 53;
    }
    text(value, 76, y, 43);
    y += label ? 92 : 60;
  }
  text("CAOS DOMÉSTICO", 76, 1540, 25);
  text(data.share.chaos, 76, 1630, 86, "#dfff00");
  text("GOSTAR DE VOCÊ", 580, 1540, 25);
  text(data.share.affection, 580, 1630, 86, "#dfff00");
  ctx.fillStyle = "#f7f4e9";
  ctx.fillRect(76, 1740, 928, 2);
  text("YURI × JENY", 76, 1815, 35);
  text(String(data.year), 896, 1815, 30);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Falha no PNG"))),
      "image/png",
    ),
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `jeny-wrapped-${data.year}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
export function ShareCard({
  onReplay,
  onMusic,
}: {
  onReplay: () => void;
  onMusic: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  return (
    <div className="share-content">
      <div className="share-card">
        <header>
          <span>
            JENY
            <br />
            WRAPPED
          </span>
          <small>{data.year}</small>
        </header>
        <Burst />
        <div className="share-person">
          <small>TOP PERSON</small>
          <strong>{data.share.topPerson}</strong>
        </div>
        <div className="share-pair">
          <div>
            <small>TOP TRIP</small>
            <b>{data.share.topTrip}</b>
          </div>
          <div>
            <small>COR DO ANO</small>
            <b>{data.share.color}</b>
          </div>
        </div>
        <div className="share-song">
          <small>TRILHA DA VIAGEM</small>
          <b>
            Alinhamento Milenar <span>— Jão</span>
          </b>
        </div>
        <div className="share-song">
          <small>SECRET YURI TRACK</small>
          <b>
            this is what falling in love feels like <span>— JVKE</span>
          </b>
        </div>
        <div className="share-numbers">
          <div>
            <strong>{data.share.chaos}</strong>
            <small>CAOS DOMÉSTICO</small>
          </div>
          <div>
            <strong>{data.share.affection}</strong>
            <small>GOSTAR DE VOCÊ</small>
          </div>
        </div>
        <footer>
          <span>YURI × JENY</span>
          <span>{data.year}</span>
        </footer>
      </div>
      <div className="share-actions">
        <button onClick={onReplay}>↺ rever</button>
        <button onClick={onMusic}>♫ músicas</button>
        <button
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            try {
              await exportCard();
              setFeedback("Card salvo. Todo seu.");
            } catch {
              setFeedback(
                "Não foi possível salvar. Você também pode fazer uma captura da tela.",
              );
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? "salvando..." : "↓ salvar card"}
        </button>
      </div>
      <span className="export-feedback" role="status">
        {feedback || "uma edição limitada. uma pessoa só."}
      </span>
    </div>
  );
}
