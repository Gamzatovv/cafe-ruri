import { useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { ordersApi } from '../../api/client';

const money = (value) =>
  `${new Intl.NumberFormat('ru-RU').format(value)} руб`;

export function CartPage({
  cart,
  onChange,
  onRemove,
  onClear,
  items,
  total,
  count,
  onNavigate,
  notify,
}) {
  const [customer, setCustomer] = useState({
    customer_name: '',
    phone: '',
    address: '',
  });
  const [orderSent, setOrderSent] = useState(false);

  const submit = async (event) => {
    event.preventDefault();

    try {
      const data = await ordersApi.create({
        ...customer,
        items: items.map(({ product, quantity }) => ({
          product_id: product.id,
          name: product.name,
          quantity,
          price: product.price,
        })),
        total,
      });

      setOrderSent(true);
      onClear();
    } catch (error) {
      notify(error.message);
    }
  };

  return (
    <section className="page-section">
      <div className="page-intro compact">
        <div className="eyebrow">
          <span className="eyebrow-line" /> ВАШ ВЫБОР
        </div>
        <h1>
          Корзина <em>заказа.</em>
        </h1>
        <p>Осталось совсем немного до вкусного момента.</p>
      </div>

      {orderSent ? (
        <div className="success-panel">
          <CheckCircle2 size={46} />
          <h2>Заказ принят!</h2>
          <p>
            Спасибо за заказ. Мы свяжемся с вами для подтверждения.
          </p>
          <button
            className="button-primary"
            onClick={() => {
              setOrderSent(false);
              onNavigate('Меню');
            }}
          >
            Вернуться в меню <ArrowUpRight size={17} />
          </button>
        </div>
      ) : (
        <div className="checkout-layout">
          <div className="cart-list">
            {items.length ? (
              items.map(({ product, quantity }) => (
                <div className="cart-row" key={product.id}>
                  <img src={product.image} alt={product.name} />

                  <div className="cart-row-info">
                    <span className="food-category">{product.category}</span>
                    <h3>{product.name}</h3>
                    <b>{money(product.price)}</b>
                  </div>

                  <div className="quantity-control">
                    <button onClick={() => onChange(product.id, -1)}>
                      <Minus size={14} />
                    </button>
                    <span>{quantity}</span>
                    <button onClick={() => onChange(product.id, 1)}>
                      <Plus size={14} />
                    </button>
                  </div>

                  <strong className="line-total">
                    {money(product.price * quantity)}
                  </strong>

                  <button
                    className="remove-item"
                    onClick={() => onRemove(product.id)}
                    aria-label={`Удалить ${product.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state cart-empty">
                <ShoppingBag size={36} />
                <h3>Корзина пока пуста</h3>
                <p>Добавьте что-нибудь вкусное из нашего меню.</p>
                <button
                  className="button-primary"
                  onClick={() => onNavigate('Меню')}
                >
                  Перейти в меню <ArrowUpRight size={16} />
                </button>
              </div>
            )}

            {items.length > 0 && (
              <button className="continue-link" onClick={() => onNavigate('Меню')}>
                ← Продолжить выбор
              </button>
            )}
          </div>

          <form className="checkout-card" onSubmit={submit}>
            <div className="checkout-title">
              <span>ДЕТАЛИ ДОСТАВКИ</span>
              <h2>Куда доставить?</h2>
            </div>

            <label>
              Ваше имя
              <input
                required
                minLength={2}
                maxLength={50}
                value={customer.customer_name}
                onChange={(event) =>
                  setCustomer({
                    ...customer,
                    customer_name: event.target.value,
                  })
                }
                placeholder="Введите имя"
              />
            </label>

            <label>
              Номер телефона
              <input
                required
                minLength={2}
                maxLength={50}
                type="tel"
                value={customer.phone}
                onChange={(event) =>
                  setCustomer({ ...customer, phone: event.target.value })
                }
                placeholder="+7(___)___-__-__"
              />
            </label>

            <label>
              Адрес или комментарий
              <textarea
                required
                minLength={5}
                maxLength={300}
                value={customer.address}
                onChange={(event) =>
                  setCustomer({ ...customer, address: event.target.value })
                }
                placeholder="Адрес доставки или ваши пожелания"
                rows="3"
              />
            </label>

            <div className="order-summary">
              <span>Товаров ({count})</span>
              <b>{money(total)}</b>
              <span>Доставка</span>
              <b className="free-delivery">Уточним по телефону</b>
            </div>

            <button
              className="button-primary full-button"
              disabled={!items.length}
            >
              Отправить заказ <ArrowUpRight size={17} />
            </button>
            
          </form>
        </div>
      )}
    </section>
  );
}
