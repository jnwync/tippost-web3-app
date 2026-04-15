import type { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "ghost";
  };
}

export function EmptyState({ icon, title, subtitle, action }: Props) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
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
