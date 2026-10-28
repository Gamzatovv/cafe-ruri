import { useCallback, useEffect, useState } from 'react';
import { productsApi } from '../api/client';
import { fallbackProducts } from '../data/fallbackProducts';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setProducts(await productsApi.list());
      setFailed(false);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    products: failed ? fallbackProducts : products,
    loading,
    fromApi: !failed,
    refresh,
  };
}
