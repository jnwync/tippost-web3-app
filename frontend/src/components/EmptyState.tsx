interface Props {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "ghost";
  };
}

export function EmptyState({ title, subtitle, action }: Props) {
  return (
    <div className="empty-state">
      <p className="empty-state__title">{title}</p>
      {subtitle && <p className="empty-state__subtitle">{subtitle}</p>}
      {action && (
        <button
          className={action.variant === "ghost" ? "ghost-btn" : "connect-btn"}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
