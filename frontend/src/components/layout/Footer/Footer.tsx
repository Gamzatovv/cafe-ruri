import { ArrowUpRight } from 'lucide-react';
import { Brand } from '../Brand/Brand';

export function Footer({ onNavigate }) {

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Brand onClick={() => onNavigate('Главная')} />

        <p>
          С любовью к традициям.
          <br />
          С заботой о каждом госте.
        </p>

        <button className="footer-order" onClick={() => onNavigate('Админка')}>
          Для персонала 
        </button>
      </div>

      <div className="footer-bottom">
        <span>2026 РУРИ. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</span>

       

        <span>СДЕЛАНО С ♥</span>
      </div>
    </footer>
  );
}
