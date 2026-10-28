import { useRef, useState } from 'react';
import {
  ArrowUpRight,
  LogOut,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
} from 'lucide-react';
import { adminApi, productsApi } from '../../api/client';

const money = (value) =>
  `${new Intl.NumberFormat('ru-RU').format(value)} руб`;

const blank = {
  name: '',
  category: '',
  description: '',
  price: '',
  imageFile: null,
  imagePreview: '',
};

export function AdminPage({ products, refresh, notify }) {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const fileRef = useRef(null);

  const selectImage = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      notify('Выберите файл изображения');
      return;
    }
    setForm((current) => ({
      ...current,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const save = async (event) => {
    event.preventDefault();

    if (!editing && !form.imageFile) {
      notify('Загрузите картинку блюда');
      return;
    }

    try {
      const data = {
        name: form.name.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        imageFile: form.imageFile,
      };

      if (editing) {
        await productsApi.update(editing, data, password);
      } else {
        await productsApi.create(data, password);
      }

      await refresh();
      setEditing(null);
      setForm(blank);
      if (fileRef.current) fileRef.current.value = '';
      notify('Блюдо сохранено');
    } catch (error) {
      notify(error.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Удалить это блюдо?')) return;

    try {
      await productsApi.remove(id, password);
      await refresh();
      if (editing === id) {
        setEditing(null);
        setForm(blank);
      }
      notify('Блюдо удалено');
    } catch (error) {
      notify(error.message);
    }
  };

  const edit = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: String(product.price),
      imageFile: null,
      imagePreview: product.image,
    });
    if (fileRef.current) fileRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!authed) {
    return (
      <section className="page-section admin-page">
        <div className="page-intro compact">
          <div className="eyebrow">
            <span className="eyebrow-line" /> УПРАВЛЕНИЕ
          </div>
          <h1>
            Панель <em>владельца.</em>
          </h1>
          <p>
            Добавляйте блюда, обновляйте меню и поддерживайте каталог в порядке.
          </p>
        </div>

        <form
          className="admin-login"
          onSubmit={(event) => {
            event.preventDefault();
            adminApi.login(password).then(() => setAuthed(true)).catch((error) => notify(error.message));
          }}
        >
          <ShieldCheck size={32} />
          <h2>Вход для владельца</h2>
  

          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Пароль администратора"
              required
            />
          </label>

          <button className="button-primary full-button">
            Войти в админку <ArrowUpRight size={16} />
          </button>
  
        </form>
      </section>
    );
  }

  return (
    <section className="page-section admin-page">
      <div className="page-intro compact">
        <div className="eyebrow">
          <span className="eyebrow-line" /> УПРАВЛЕНИЕ
        </div>
        <h1>
          Панель <em>владельца.</em>
        </h1>
      </div>

      <div className="admin-toolbar">
        <div>
          <b>{products.length} блюд в каталоге</b>
          <p>Изменения сохраняются в базе данных.</p>
        </div>
        <button
          className="outline-button"
          onClick={() => {
            setAuthed(false);
            setPassword('');
          }}
        >
          <LogOut size={15} /> Выйти
        </button>
      </div>

      <div className="admin-layout">
        <form className="checkout-card admin-form" onSubmit={save}>
          <div className="checkout-title">
            <span>{editing ? 'РЕДАКТИРОВАНИЕ' : 'НОВАЯ ПОЗИЦИЯ'}</span>
            <h2>{editing ? 'Изменить блюдо' : 'Добавить блюдо'}</h2>
          </div>

          <label>
            Название
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
            />
          </label>

          <label>
            Тип
            <input
              required
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
              placeholder="Например: Горячее"
            />
          </label>

          <label>
            Описание
            <textarea
              required
              rows="3"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />
          </label>

          <label>
            Цена, руб
            <input
              required
              type="number"
              min="1"
              step="0.01"
              value={form.price}
              onChange={(event) =>
                setForm({ ...form, price: event.target.value })
              }
            />
          </label>

          <label>
            Картинка
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              required={!editing}
              onChange={(event) => selectImage(event.target.files?.[0])}
            />
          </label>

          {form.imagePreview && (
            <div className="admin-image-preview">
              <img src={form.imagePreview} alt="Предпросмотр" />
            </div>
          )}

          <div className="form-note">
            <Upload size={15} /> Картинка загружается файлом на сервер, ссылку указывать не нужно.
          </div>

          <button className="button-primary full-button">
            {editing ? 'Сохранить изменения' : 'Добавить блюдо'}
            <Plus size={16} />
          </button>

          {editing && (
            <button
              type="button"
              className="continue-link"
              onClick={() => {
                setEditing(null);
                setForm(blank);
                if (fileRef.current) fileRef.current.value = '';
              }}
            >
              Отменить редактирование
            </button>
          )}
        </form>

        <div className="admin-products">
          {products.map((product) => (
            <div className="admin-product" key={product.id}>
              <img src={product.image} alt={product.name} />
              <div>
                <b>{product.name}</b>
                <small>
                  {product.category} · {money(product.price)}
                </small>
              </div>
              <button onClick={() => edit(product)} aria-label="Редактировать">
                <Pencil size={16} />
              </button>
              <button onClick={() => remove(product.id)} aria-label="Удалить">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
