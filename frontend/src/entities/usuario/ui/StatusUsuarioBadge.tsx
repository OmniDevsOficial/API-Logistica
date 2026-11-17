export function StatusUsuarioBadge({ ativo }: { ativo: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        ativo ? "bg-success/15 text-success" : "bg-border text-fg-muted"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {ativo ? "Ativo" : "Inativo"}
    </span>
  );
}
