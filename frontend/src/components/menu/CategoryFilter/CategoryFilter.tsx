export function CategoryFilter({ categories, selected, onChange }) {
  return (
    <div className="menu-filter">
      {categories.map((category) => (
        <button
          key={category}
          className={selected === category ? 'filter-pill selected' : 'filter-pill'}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
