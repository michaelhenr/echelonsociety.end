# Pattern Snippets

Small, focused code snippets demonstrating where patterns appear in the project.

## Facade (ProductsAPI)
Location: `src/services/api/ProductsAPI.ts`
Snippet:
```ts
// ProductsAPI exposes simple methods for the frontend
export default class ProductsAPI {
  static async list(filters = {}) {
    const resp = await fetch(`/api/products?action=list&category=${filters.category || 'all'}`);
    return resp.json();
  }
}
```

## Factory (Order creation)
Location: `supabase/functions/orders/index.ts`
Snippet:
```ts
// Factory-like assembly of order and items
const order = await supabaseClient.from('orders').insert({ ... }).select().single();
const orderItems = items.map(item => ({ order_id: order.id, product_id: item.product_id, quantity: item.quantity, price: item.price }));
await supabaseClient.from('order_items').insert(orderItems);
```

## Observer (React state)
Location: `src/pages/Products.tsx`
Snippet:
```tsx
const [products, setProducts] = useState([]);
useEffect(() => { ProductsAPI.list().then(r => setProducts(r.products)); }, []);
```

## Decorator (Error response wrapper)
Location: `supabase/functions/_shared/errors.ts`
Snippet:
```ts
export function createErrorResponse(error: Error, status = 400) {
  console.error('[Error]', error.message);
  return new Response(JSON.stringify({ error: error.message }), { status });
}
```

## Repository (example in docs)
Location: `docs/SOLID_PRINCIPLES.md` (examples)
Snippet (conceptual):
```ts
interface IProductRepository { list(): Promise<Product[]> }
class SupabaseProductRepository implements IProductRepository { /* uses Supabase client */ }
```
