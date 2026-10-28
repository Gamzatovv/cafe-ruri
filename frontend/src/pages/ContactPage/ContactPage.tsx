


import { useEffect, useState } from 'react';
import { ArrowUpRight, MapPin, Phone, Clock, X } from 'lucide-react';
import { ordersApi } from '../../api/client';

export function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!isModalOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitError('');
    setIsSubmitting(true);

    try {
      await ordersApi.callback({ name, phone });
      setName('');
      setPhone('');
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Не удалось отправить заявку');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-section contact-page">
      <div className="page-intro">
        <div className="eyebrow">
          <span className="eyebrow-line" /> МЫ НА СВЯЗИ
        </div>

        <h1>
          Давайте <em>общаться.</em>
        </h1>

        <p>Вопрос по заказу? Мы рядом.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-card">
          <div className="contact-icon">
            <Phone />
          </div>

          <span>ПОЗВОНИТЬ НАМ</span>

          <h3>+7 (977) 130-65-41</h3>

          <p>Ежедневно, с 10:00 до 23:00</p>

          <a href="tel:+79771306541">
            Позвонить <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="contact-card">
          <div className="contact-icon">
            <MapPin />
          </div>

          <span>МЫ ЗДЕСЬ</span>

          <h3>г. Москва, ул. Наметкина, д. 3</h3>

          <p>Доставка по городу и ближайшим районам.</p>

          <a
            href="https://maps.google.com/?sca_esv=316c0d1cb0936c39&biw=1512&bih=782&output=search&q=г.+Москва,+ул.+Наметкина,+д.+3&source=lnms&fbs=ABfTbFVyMZGZf1hfvX9uKjN_-G8cTs4PJElQ4Z4ROUfAdKhH1r9m3wf37G6pH-AWhFIVpEnQRR8d1PsC3xypUrfrxGnk93dMnS6e-k0pEtLDUKn8Wu0fWQMHmZWA3P8WBTZu6n4oiOQ19INBMX_7dEG9gNidA0MeTxW0klZ1SFqOAGtnV5HE7h1xFbhhqZjZ4V6W0djj7T1g4rVHcDPuGSjqZayUqzYVcg&entry=mc&ved=1t:200715&ictx=111"
            target="_blank"
            rel="noreferrer"
          >
            Открыть карту <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="contact-card">
          <div className="contact-icon">
            <Clock />
          </div>

          <span>РАБОЧЕЕ ВРЕМЯ</span>

          <h3>с 11:00 до 23:00</h3>

          <p>Готовим свежие блюда и принимаем заказы каждый день.</p>
        </div>
      </div>

      <div className="contact-bottom">
        <div>
          <h2>
            Есть особый <em>запрос?</em>
          </h2>

          <p>
            Большой семейный заказ, праздник или корпоратив? Позвоните —
            обсудим меню вместе.
          </p>
        </div>

        <button
          className="button-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Обратный звонок <ArrowUpRight size={17} />
        </button>
      </div>

      {isModalOpen && (
        <div
          className="callback-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="callback-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="callback-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Закрыть"
            >
              <X size={22} />
            </button>

            {isSubmitted ? (
              <div className="callback-success" role="status" aria-live="polite">
                <div className="callback-success-icon">✓</div>
                <span>ЗАЯВКА ОТПРАВЛЕНА</span>
                <h2>Мы <em>перезвоним</em> вам</h2>
                <p>Спасибо! Заявка получена. Ожидайте звонка в ближайшее время.</p>

              </div>
            ) : (
              <>
                <div className="callback-header">
                  <span>ОБРАТНЫЙ ЗВОНОК</span>

                  <h2>
                    Мы <em>перезвоним</em> вам
                  </h2>

                  <p>
                    Оставьте свои данные, и мы свяжемся с вами в ближайшее время.
                  </p>
                </div>

                <form className="callback-form" onSubmit={handleSubmit}>
              <label>
                <span>Ваше имя</span>

                <input
                  type="text"
                  placeholder="Введите имя"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>

              <label>
                <span>Номер телефона</span>

                <input
                  type="tel"
                  placeholder="+7(___)___-__-__"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
              </label>

                  {submitError && (
                    <p className="callback-error" role="alert">{submitError}</p>
                  )}

                  <button type="submit" className="callback-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Отправляем…' : 'Перезвоните мне'}
                    {!isSubmitting && <ArrowUpRight size={17} />}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}