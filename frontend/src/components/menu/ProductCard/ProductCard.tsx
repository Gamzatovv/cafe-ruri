import { Plus } from 'lucide-react';

export function ProductCard({ product, index = 0, onAdd }) {
  return (
    <article
      className="food-card"
      style={{ '--delay': `${index * 55}ms` }}
    >
      <div className="food-image-wrap">
        <img
          className="food-image"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
      </div>

      <div className="food-info">
        <div className="food-category">{product.category}</div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div className="food-bottom">
          <strong>
            {new Intl.NumberFormat('ru-RU').format(product.price)} руб
          </strong>
          <div className='add-button-cover'>

          <button className="add-button" onClick={() => onAdd(product)}>

            <Plus size={19} />
          </button>
          </div>
        </div>
      </div>
    </article>
  );
}
