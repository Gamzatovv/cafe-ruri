import { ArrowUpRight } from 'lucide-react';
import topImage from '../../images/other/plov.avif'


export function AboutPage({ onNavigate }) {
  return (
    <section className="page-section about-page">
      <div className="page-intro">
        <div className="eyebrow">
          <span className="eyebrow-line" /> СЕРДЦЕ НАШЕЙ КУХНИ
        </div>
        <h1>
          Традиции, которые
          <br />
          <em>собирают вместе.</em>
        </h1>
        <p>
          РУРИ — место, где знакомые ароматы становятся новыми
          воспоминаниями.
        </p>
      </div>

      <div className="about-feature">
        <img
          src={topImage}
          alt="Узбекская кухня"
        />
        <div className="about-quote">
          <span>“</span>
          <p>
            Самое важное в рецепте — не только ингредиенты, но и люди, с
            которыми ты делишь трапезу.
          </p>
          <small>НАША КУХОННАЯ МУДРОСТЬ</small>
        </div>
      </div>

      <div className="about-columns">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" /> С ЧЕГО ВСЁ НАЧАЛОСЬ
          </div>
          <h2>
            Вкус настоящего
            <br />
            <em>дома.</em>
          </h2>
        </div>

        <div>
          <p>
            Мы вдохновляемся базарами Самарканда, семейными дастарханами и
            мастерством поваров, которые передают рецепты из поколения в
            поколение.
          </p>
          <p>
            Каждый день мы готовим небольшими партиями, уделяем внимание
            специям и не торопим то, что должно созреть на огне. Нам важно,
            чтобы вы почувствовали не просто вкус, а настоящее узбекское
            гостеприимство.
          </p>
         
        </div>
      </div>
    </section>
  );
}
