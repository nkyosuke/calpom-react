import { createPortal } from "react-dom";

type Props = {
  tooltip: { top: number; left: number; title: string; start: string; end: string } | null;
};

export default function Tooltip({ tooltip }: Props) {
  if (!tooltip) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",          // ← ここがポイント！（viewport 基準）
        top: tooltip.top,
        left: tooltip.left,
        transform: "translate(-50%, -100%)",
        background: "#333",
        color: "#fff",
        padding: "10px 13px",
        borderRadius: "5px",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        fontSize: "14px",
        zIndex: 10000,
        boxShadow: "2px 2px 10px rgba(0,0,0,.5)",
      }}
    >
      <strong>{tooltip.title}</strong>
      <div>{tooltip.start} – {tooltip.end}</div>
    </div>,
    document.body                 // ← Portal 先
  );
}