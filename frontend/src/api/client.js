const API = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || `Ошибка запроса (${response.status})`);
  return data;
}

function productFormData(product) {
  const data = new FormData();
  data.append('name', product.name);
  data.append('category', product.category);
  data.append('description', product.description);
  data.append('price', String(product.price));
  if (product.imageFile) data.append('image', product.imageFile);
  return data;
}

export const adminApi = {
  login: (password) => request('/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  }),
};

export const productsApi = {
  list: () => request('/products'),
  create: (product, password) => request('/products', {
    method: 'POST',
    headers: { 'X-Admin-Password': password },
    body: productFormData(product),
  }),
  update: (id, product, password) => request(`/products/${id}`, {
    method: 'PUT',
    headers: { 'X-Admin-Password': password },
    body: productFormData(product),
  }),
  remove: (id, password) => request(`/products/${id}`, {
    method: 'DELETE',
    headers: { 'X-Admin-Password': password },
  }),
};

export const ordersApi = {
  create: (order) => request('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  }),
  callback: (data) => request('/orders/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
};
