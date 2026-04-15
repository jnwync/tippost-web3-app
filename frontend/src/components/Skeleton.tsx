export function Skeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__img" />
      <div className="skeleton-card__body">
        <div className="skeleton-card__line skeleton-card__line--lg" />
        <div className="skeleton-card__line skeleton-card__line--md" />
        <div className="skeleton-card__line skeleton-card__line--sm" />
      </div>
    </div>
  );
}
