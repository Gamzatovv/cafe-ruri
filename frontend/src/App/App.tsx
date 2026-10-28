import { useState } from 'react';
import './App.css';
import { Footer } from '../components/layout/Footer/Footer';
import { Header } from '../components/layout/Header/Header';
import { AboutPage } from '../pages/AboutPage/AboutPage';
import { AdminPage } from '../pages/AdminPage/AdminPage';
import { CartPage } from '../pages/CartPage/CartPage';
import { ContactPage } from '../pages/ContactPage/ContactPage';
import { HomePage } from '../pages/HomePage/HomePage';
import { MenuPage } from '../pages/MenuPage/MenuPage';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';

export default function App() {
  const { products, refresh, fromApi } = useProducts();
  const cart = useCart(products, fromApi);
  const [page, setPage] = useState('Главная');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState('');

  const navigate = (next, category) => {
    setPage(next);
    setMobileOpen(false);

    if (category) {
      window.history.replaceState({}, '', `#${encodeURIComponent(category)}`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2600);
  };

  let content;

  if (page === 'Главная') {
    content = (
      <HomePage
        products={products}
        onNavigate={navigate}
        onAdd={(product) => {
          cart.add(product);
          notify(`${product.name} добавлено в корзину`);
        }}
      />
    );
  }

  if (page === 'Меню') {
    content = (
      <MenuPage
        products={products}
        onAdd={(product) => {
          cart.add(product);
          notify(`${product.name} добавлено в корзину`);
        }}
      />
    );
  }

  if (page === 'Корзина') {
    content = (
      <CartPage
        cart={cart.cart}
        items={cart.items}
        count={cart.count}
        total={cart.total}
        onChange={cart.change}
        onRemove={cart.remove}
        onClear={cart.clear}
        onNavigate={navigate}
        notify={notify}
      />
    );
  }

  if (page === 'О нас') {
    content = <AboutPage onNavigate={navigate} />;
  }

  if (page === 'Контакты') {
    content = <ContactPage />;
  }

  if (page === 'Админка') {
    content = (
      <AdminPage
        products={products}
        refresh={refresh}
        notify={notify}
      />
    );
  }

  return (
    <div className="app-shell">
      <Header
        page={page}
        onNavigate={navigate}
        cartCount={cart.count}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <main>{content}</main>
      <Footer onNavigate={navigate} />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
