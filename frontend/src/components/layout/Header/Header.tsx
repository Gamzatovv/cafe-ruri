import { Menu as MenuIcon, ShoppingBag, X } from 'lucide-react';
import { Brand } from '../Brand/Brand';

export function Header({
  page,
  onNavigate,
  cartCount,
  mobileOpen,
  setMobileOpen,
}) {
  const links = ['Главная', 'Меню', 'О нас', 'Контакты'];

  const go = (pageName) => {
    onNavigate(pageName);
    setMobileOpen(false);
  };

  return (
    <>
      <div className="announcement">
        <span>Традиционный вкус Узбекистана</span>
        <span className="announcement-dot" />
        <span>Доставка ежедневно · 11:00–23:00</span>
      </div>

      <header className="site-header">
        <Brand onClick={() => go('Главная')} />

        <nav className={mobileOpen ? 'nav-links open' : 'nav-links'}>
          {links.map((link) => (
            <button
              key={link}
              className={page === link ? 'nav-link active' : 'nav-link'}
              onClick={() => go(link)}
            >
              {link}
            </button>
          ))}


        </nav>

        <div className="header-actions">
          <button className="cart-link" onClick={() => go('Корзина')}>
            <ShoppingBag size={18} />
            <span>Корзина</span>
            <b className="cart-count">{cartCount}</b>
          </button>

          <button
            className="mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Открыть меню"
          >
            {mobileOpen ? <X /> : <MenuIcon />}
          </button>
        </div>
      </header>
    </>
  );
}
