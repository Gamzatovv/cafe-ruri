export function Brand({ onClick }) {
  return (
    <button className="brand" onClick={onClick} aria-label="РУРИ — главная">
      <span className="brand-emblem" aria-hidden="true">
        <span>Р</span>
      </span>
      <span className="brand-wordmark">
        <strong>РУРИ</strong>
        <span>УЗБЕКСКАЯ КУХНЯ</span>
      </span>
    </button>
  );
}
