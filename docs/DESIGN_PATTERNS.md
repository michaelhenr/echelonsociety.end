# Design Patterns and Architecture Patterns

## Overview
This document explains the design patterns used in the Echelon Society project, demonstrating software engineering best practices and SOLID principles.

---

## 1. Facade Pattern

### Location: `src/services/api.ts`

### Purpose
Provides a single, simplified interface to a complex system of backend functions.

### Implementation

```typescript
// API Service Layer - Facade Pattern
export const ProductsAPI = {
  async list(filters?: { category?: string; brand_id?: string; in_stock?: boolean }) {
    // Handles complexity of Supabase function calls
    const { data, error } = await supabase.functions.invoke('products', { /* ... */ });
    if (error) throw error;
    return data.products;
  },

  async create(product: ProductInput) {
    // Validates and creates product
    const { data, error } = await supabase.functions.invoke('products', { /* ... */ });
    if (error) throw error;
    return data.product;
  },
};
```

### Benefits
- **Simplifies Frontend Code**: Components don't need to know about Supabase internals
- **Centralized Error Handling**: All API errors handled in one place
- **Easy Maintenance**: Changes to backend don't affect components
- **Testability**: Easy to mock for testing

### When It's Used
- Components calling `ProductsAPI.list()` instead of direct Supabase calls
- Admin dashboard fetching analytics data
- Cart operations

---

## 2. Factory Pattern

### Location: `supabase/functions/` (Backend)

### Purpose
Creates objects (like Orders) with complex initialization logic.

### Example: Order Creation

```typescript
// Backend Order Creation (Factory Pattern)
export async function createOrder(orderData: OrderInput): Promise<Order> {
  // 1. Validate input
  validateOrderData(orderData);

  // 2. Calculate shipping cost (factory logic)
  const shippingCost = calculateShipping(orderData.client_city);

  // 3. Calculate total
  const total = calculateOrderTotal(orderData.items, shippingCost);

  // 4. Create order and items (complex initialization)
  const order = await database.orders.insert({
    ...orderData,
    shipping_cost: shippingCost,
    total_amount: total,
    status: 'pending',
  });

  // 5. Create order items
  await database.order_items.insert(
    orderData.items.map(item => ({
      order_id: order.id,
      ...item,
    }))
  );

  return order;
}

// Factory method for shipping calculation
function calculateShipping(city: string): number {
  const ALEXANDRIA_CAIRO_COST = 70;
  const OTHER_CITIES_COST = 100;

  return city.toLowerCase() === 'cairo' || city.toLowerCase() === 'alexandria'
    ? ALEXANDRIA_CAIRO_COST
    : OTHER_CITIES_COST;
}
```

### Benefits
- **Encapsulation**: Complex creation logic is hidden
- **Consistency**: Orders are always created correctly
- **Testability**: Can test creation logic independently
- **Reusability**: Same factory method used everywhere

### When It's Used
- Creating orders with automatic shipping calculation
- Creating products with brand validation
- Creating ads with date validation

---

## 3. Observer Pattern

### Location: React Component State Management

### Purpose
Notifies multiple subscribers when data changes.

### Implementation Using React Hooks

```typescript
// Observer Pattern in React
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

// Hook that "observes" product data changes
export function useProducts(filters?: ProductFilters) {
  const query = useQuery({
    queryKey: ['products', filters],
    queryFn: () => ProductsAPI.list(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// Component subscribes to product changes
function ProductsList() {
  const { data: products, isLoading } = useProducts();

  // Component automatically re-renders when products change (observer notification)
  return (
    <div>
      {products?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Another component can subscribe to same data
function ProductSearch() {
  const [filter, setFilter] = useState('');
  const { data: products } = useProducts({ category: filter });

  return (
    <div>
      <SearchInput onChange={setFilter} />
      {/* Multiple observers watching same data */}
    </div>
  );
}
```

### Real-World Example: Order Status Updates

```typescript
// Subscribe to order updates (Observer Pattern)
export function useOrderStatus(orderId: string) {
  const [status, setStatus] = useState<OrderStatus>('pending');

  useEffect(() => {
    // Subscribe to real-time updates
    const subscription = supabase
      .from('orders')
      .on('UPDATE', payload => {
        if (payload.new.id === orderId) {
          // Notify all subscribers (observers)
          setStatus(payload.new.status);
        }
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [orderId]);

  return status;
}

// Multiple components observe order status
function OrderTracker({ orderId }: { orderId: string }) {
  const status = useOrderStatus(orderId);

  return <div>Order Status: {status}</div>;
}

function AdminDashboard() {
  const status = useOrderStatus(orderId);

  return <div>Admin View - Status: {status}</div>;
}
```

### Benefits
- **Loose Coupling**: Components don't need to know about each other
- **Real-time Updates**: Multiple UIs stay in sync
- **Reactivity**: Automatic re-renders on data changes
- **Scalability**: Easy to add more observers

---

## 4. Strategy Pattern

### Location: `src/services/api.ts` (Multiple API Strategies)

### Purpose
Defines different algorithms for API communication.

### Implementation

```typescript
// Strategy 1: List with filters
export const ProductsAPI = {
  async list(filters?: ProductFilters) {
    let query = supabaseClient.from('products').select('*');
    
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.in_stock) {
      query = query.eq('in_stock', true);
    }
    
    return query;
  },
};

// Strategy 2: Get single (different approach)
export const ProductsAPI = {
  async get(id: string) {
    return supabaseClient
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
  },
};

// Strategy 3: Create with validation (different approach)
export const ProductsAPI = {
  async create(product: ProductInput) {
    // Validation first
    validateProduct(product);
    
    return supabaseClient
      .from('products')
      .insert(product)
      .select()
      .single();
  },
};
```

### Benefits
- **Flexibility**: Easy to swap different API strategies
- **Separation of Concerns**: Each operation is independent
- **Testability**: Can test each strategy separately
- **Maintainability**: Clear, focused functions

---

## 5. MVC Pattern

### Location: Throughout the application

### Purpose
Separates concerns into Model, View, and Controller.

### Implementation

```
MODEL (src/types/index.ts)
├─ Product Interface
├─ Order Interface
├─ Brand Interface
└─ DashboardStats Interface

VIEW (src/components/, src/pages/)
├─ ProductCard.tsx (display products)
├─ OrderForm.tsx (collect order data)
├─ AdminDashboard.tsx (display stats)
└─ Layout.tsx (page structure)

CONTROLLER (Backend Edge Functions)
├─ supabase/functions/products/
├─ supabase/functions/orders/
├─ supabase/functions/analytics/
└─ Service Layer (src/services/api.ts)
```

### Example Flow

```typescript
// MODEL: Type Definition
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  in_stock: boolean;
}

// CONTROLLER: API Service
export const ProductsAPI = {
  async get(id: string): Promise<Product> {
    const { data, error } = await supabase.functions.invoke('products', {
      body: { action: 'get', id },
    });
    if (error) throw error;
    return data.product;
  },
};

// VIEW: React Component
function ProductDetail() {
  const { id } = useParams();
  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: () => ProductsAPI.get(id), // Uses Controller
  });

  return (
    <div>
      <h1>{product?.name}</h1> {/* Uses Model type */}
      <p>${product?.price}</p>
    </div>
  );
}
```

---

## 6. Repository Pattern

### Location: Backend Functions

### Purpose
Abstracts database access logic.

### Implementation

```typescript
// Repository Layer (Backend)
class ProductRepository {
  async findAll(filters?: ProductFilters): Promise<Product[]> {
    let query = supabase.from('products').select('*');
    
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findById(id: string): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(product: ProductInput): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

// Usage in Edge Function
const productRepo = new ProductRepository();

serve(async (req) => {
  if (req.method === 'GET') {
    const products = await productRepo.findAll();
    return new Response(JSON.stringify({ products }));
  }
});
```

### Benefits
- **Abstraction**: Database logic is hidden
- **Testability**: Easy to mock repository
- **Consistency**: Standard CRUD operations
- **Maintainability**: Changes to database affect only repository

---

## 7. Decorator Pattern

### Location: Function Wrappers and Middleware

### Purpose
Adds functionality to existing functions without modifying them.

### Implementation

```typescript
// Error Handling Decorator
function withErrorHandling(fn: Function) {
  return async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Error:', error);
      throw new Error(`Operation failed: ${error.message}`);
    }
  };
}

// Logging Decorator
function withLogging(name: string, fn: Function) {
  return async (...args: any[]) => {
    console.log(`[${name}] Called with:`, args);
    const result = await fn(...args);
    console.log(`[${name}] Result:`, result);
    return result;
  };
}

// Apply Decorators
const getProduct = withErrorHandling(
  withLogging('getProduct', async (id: string) => {
    return await ProductsAPI.get(id);
  })
);
```

---

## Summary of Patterns Used

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Facade** | `src/services/api.ts` | Simplify backend calls |
| **Factory** | Backend functions | Complex object creation |
| **Observer** | React hooks & React Query | State management |
| **Strategy** | API methods | Multiple approaches |
| **MVC** | Full stack | Separation of concerns |
| **Repository** | Backend functions | Database abstraction |
| **Decorator** | Error handling | Add functionality |

---

## Best Practices Demonstrated

### 1. **Separation of Concerns**
- Frontend doesn't know about database
- Backend doesn't know about React
- Services layer acts as bridge

### 2. **Single Responsibility**
- Each function has one job
- Each component renders one thing
- Each backend function handles one operation

### 3. **Open/Closed Principle**
- Easy to extend with new patterns
- Hard to break existing code

### 4. **Dependency Injection**
- Components receive data via props
- Services injected via React hooks
- Database queries passed as parameters

### 5. **Don't Repeat Yourself (DRY)**
- Reusable API methods
- Shared utility functions
- Centralized error handling

---

## Testing Patterns

### Unit Testing
```typescript
describe('ProductsAPI', () => {
  it('should create product with valid data', () => {
    const product = { name: 'Test', price: 100, ... };
    expect(product.price).toBeGreaterThan(0);
  });
});
```

### Integration Testing
```typescript
describe('Product API Integration', () => {
  it('should create and retrieve product', async () => {
    const created = await ProductsAPI.create(newProduct);
    const retrieved = await ProductsAPI.get(created.id);
    expect(retrieved.id).toBe(created.id);
  });
});
```

---

## Conclusion

The Echelon Society project demonstrates professional-grade use of:
- ✅ Design patterns (Facade, Factory, Observer, etc.)
- ✅ SOLID principles
- ✅ Separation of concerns
- ✅ Clean code practices
- ✅ Testable architecture
- ✅ Scalable structure

This foundation allows the project to grow and maintain quality as features are added.

**Document Version:** 1.0  
**Last Updated:** November 26, 2025
