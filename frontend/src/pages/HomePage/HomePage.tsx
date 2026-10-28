import {
  ArrowUpRight,
  ChevronRight,
  Clock3,
  Heart,
  Leaf,
  Utensils,
  Flame
} from 'lucide-react';
import { ProductCard } from '../../components/menu/ProductCard/ProductCard';

import topImage from '../../images/other/samsa.jpg'
import bottomImage from '../../images/other/soup.jpg'

export function HomePage({ products, onNavigate, onAdd }) {
  const categories = [
    'Горячее',
    'Супы',
    'Выпечка',
    'Гриль',
    'Донер и роллы',
    'Салаты',
    'Десерты',
    'Напитки',
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            ГОСТЕПРИИМСТВО В КАЖДОМ БЛЮДЕ
          </div>

          <h1>
            Вкус, который
            <br />
            <em>возвращает домой.</em>
          </h1>

          <p className="hero-description">
            Готовим с душой и доставляем блюда, которые хочется заказывать снова. 
            Традиционные вкусы, качественные ингредиенты и забота о каждом заказе.

          </p>

          <div className="hero-buttons">
            <button className="button-primary" onClick={() => onNavigate('Меню')}>
              Смотреть меню <ArrowUpRight size={17} />
            </button>
           
          </div>

          <div className="hero-notes">
            <div className="note-icon">
              <Leaf size={18} />
            </div>
            <div>
              <b>Свежие продукты</b>
              <small>Ингредиенты каждый день</small>
            </div>
            <div className="note-divider" />
            <div className="note-icon">
              <Clock3 size={18} />
            </div>
            <div>
              <b>С любовью к традициям</b>
              <small>Готовим после заказа</small>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-photo">
            <img
              src={topImage}
              alt="Традиционный плов"
            />
            <div className="photo-shade" />
          </div>

          <div className="round-stamp" aria-label="Настоящая узбекская кухня">
            <svg className="round-stamp-text" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <path id="round-stamp-path" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
              </defs>
              <text>
                <textPath href="#round-stamp-path" startOffset="0%">
                  НАСТОЯЩАЯ УЗБЕКСКАЯ КУХНЯ
                </textPath>
              </text>
            </svg>
            <span className="round-stamp-center">✳</span>
          </div>

          <div className="hero-caption">
            <span className="caption-number"><Flame size={24}/></span>
            <div>
              <b>С заботой о качестве</b>
              <small>на правильном огне</small>
            </div>
            
          </div>
        </div>

        <div className="hero-bottom-mark">
          MADE WITH <span>♥</span>
        </div>
      </section>

  

      

      <section className="story-band">
        <div className="story-image">
          <img
            src={bottomImage}
            alt="Восточное застолье"
          />
        </div>
        <div className="story-copy">
          <div className="eyebrow light">
            <span className="eyebrow-line" /> НАША ФИЛОСОФИЯ
          </div>
          <h2>
            Еда — это язык
            <br />
            <em>гостеприимства.</em>
          </h2>
          <p>
            В Узбекистане стол всегда больше, чем просто еда. Это встречи,
            истории, щедрость и тепло. Мы сохраняем эту традицию в каждом блюде.
          </p>
          <button className="light-link" onClick={() => onNavigate('О нас')}>
            Узнать нашу историю <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      <section className="promise-row">
        <div>
          <span className="promise-num">01</span>
          <Utensils />
          <h3>Рецепты поколений</h3>
          <p>Традиционные блюда без компромиссов.</p>
        </div>
        <div>
          <span className="promise-num">02</span>
          <Leaf />
          <h3>Честные продукты</h3>
          <p>Выбираем свежие ингредиенты каждый день.</p>
        </div>
        <div>
          <span className="promise-num">03</span>
          <Heart />
          <h3>Тепло в каждой порции</h3>
          <p>Готовим так, как для близких.</p>
        </div>
      </section>
    </>
  );
}
