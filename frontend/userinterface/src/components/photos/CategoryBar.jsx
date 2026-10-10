import './CategoryBar.css'

// Row of category chips + "NN photographs" counter.
export default function CategoryBar({
  categories,
  activeCategory,
  onCategoryChange,
  photoCount,
}) {
  return (
    <div className="category-bar">
      <div className="category-list" role="group" aria-label="Photo categories">
        {categories.map((category) => (
          <button
            className={`category-chip ${activeCategory === category ? 'is-active' : ''}`}
            type="button"
            key={category}
            aria-pressed={activeCategory === category}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <span className="collection-count">
        {photoCount.toString().padStart(2, '0')} photographs
      </span>
    </div>
  )
}
