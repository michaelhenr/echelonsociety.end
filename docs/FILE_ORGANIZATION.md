# Project File Organization Guide

## Frontend Directory Structure

```
src/
├── services/
│   └── api/                          # API Service Layer (Facade Pattern)
│       ├── ProductsAPI.ts           # Product operations
│       ├── OrdersAPI.ts             # Order operations
│       ├── BrandsAPI.ts             # Brand operations
│       ├── AdsAPI.ts                # Advertisement operations
│       ├── AnalyticsAPI.ts          # Dashboard statistics
│       ├── NewsletterAPI.ts         # Newsletter management
│       ├── ClientsAPI.ts            # Client tracking
│       ├── ChatAPI.ts               # AI chatbot
│       └── index.ts                 # Barrel export (central hub)
│
├── components/
│   ├── ui/                          # Reusable UI components
│   ├── ChatBot.tsx                  # Chatbot component
│   └── Layout.tsx                   # Main layout
│
├── pages/
│   ├── Home.tsx                     # Home page
│   ├── Products.tsx                 # Products listing
│   ├── Checkout.tsx                 # Checkout page
│   ├── Admin.tsx                    # Admin dashboard
│   ├── SubmitProduct.tsx            # Product submission
│   ├── SubmitBrand.tsx              # Brand submission
│   ├── SubmitAd.tsx                 # Ad submission
│   └── NotFound.tsx                 # 404 page
│
├── hooks/
│   ├── use-mobile.tsx               # Mobile detection
│   └── use-toast.ts                 # Toast notifications
│
├── types/
│   └── index.ts                     # TypeScript interfaces
│
├── test/
│   ├── setup.ts                     # Test configuration
│   ├── api.products.test.ts         # ProductsAPI tests
│   ├── api.orders.test.ts           # OrdersAPI tests
│   ├── api.brands.test.ts           # BrandsAPI tests
│   └── types.validation.test.ts     # Type validation tests
│
├── App.tsx                          # Main app component
├── main.tsx                         # Entry point
└── index.css                        # Global styles
```

### API Service Layer Architecture

```
src/services/api/
│
├── ProductsAPI.ts (Class)
│   ├── list()           → GET /products
│   ├── get()            → GET /products/:id
│   ├── create()         → POST /products
│   ├── update()         → PUT /products/:id
│   └── delete()         → DELETE /products/:id
│
├── OrdersAPI.ts (Class)
│   ├── create()         → POST /orders (with shipping calc)
│   ├── list()           → GET /orders
│   ├── get()            → GET /orders/:id
│   └── updateStatus()   → PUT /orders/:id/status
│
├── BrandsAPI.ts (Class)
│   ├── list()           → GET /brands
│   ├── get()            → GET /brands/:id
│   ├── create()         → POST /brands
│   ├── update()         → PUT /brands/:id
│   └── delete()         → DELETE /brands/:id
│
├── AdsAPI.ts (Class)
│   ├── list()           → GET /ads
│   ├── create()         → POST /ads
│   ├── update()         → PUT /ads/:id
│   └── delete()         → DELETE /ads/:id
│
├── AnalyticsAPI.ts (Class)
│   └── getDashboardStats() → GET /analytics
│
├── NewsletterAPI.ts (Class)
│   ├── subscribe()      → POST /newsletter
│   └── list()           → GET /newsletter
│
├── ClientsAPI.ts (Class)
│   ├── register()       → POST /clients
│   └── list()           → GET /clients
│
├── ChatAPI.ts (Class)
│   └── sendMessage()    → POST /chat
│
└── index.ts (Barrel Export)
    └── Exports all APIs and types
```

---

## Backend Directory Structure

```
supabase/
├── functions/
│   ├── _shared/                    # Shared utilities
│   │   ├── validation.ts           # Input validation
│   │   ├── errors.ts               # Error handling & CORS
│   │   └── business-logic.ts       # Business calculations
│   │
│   ├── products/
│   │   └── index.ts                # Product service
│   │       ├── List products
│   │       ├── Get product
│   │       ├── Create product
│   │       ├── Update product
│   │       └── Delete product
│   │
│   ├── orders/
│   │   └── index.ts                # Order service
│   │       ├── Create order (with shipping)
│   │       ├── List orders
│   │       ├── Get order
│   │       └── Update status
│   │
│   ├── brands/
│   │   └── index.ts                # Brand service
│   │       ├── List brands
│   │       ├── Get brand
│   │       ├── Create brand
│   │       ├── Update brand
│   │       └── Delete brand
│   │
│   ├── ads/
│   │   └── index.ts                # Advertisement service
│   │       ├── List ads
│   │       ├── Create ad
│   │       ├── Update ad
│   │       └── Delete ad
│   │
│   ├── analytics/
│   │   └── index.ts                # Analytics service
│   │       └── Get dashboard stats
│   │
│   ├── newsletter/
│   │   └── index.ts                # Newsletter service
│   │       ├── Subscribe
│   │       └── List subscribers
│   │
│   ├── clients/
│   │   └── index.ts                # Client service
│   │       ├── Register client
│   │       └── List clients
│   │
│   └── chat/
│       └── index.ts                # Chat service
│           └── Send message
│
├── migrations/
│   ├── 20251024154332_*.sql       # Database schema
│   └── 20251029024228_*.sql       # Additional schemas
│
└── config.toml                    # Supabase config
```

### Backend Service Pattern

Each service follows the same pattern:

```typescript
// Handle CORS
if (req.method === 'OPTIONS') {
  return handleCORS(req);
}

try {
  const supabaseClient = createClient(...);
  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  // Parse request body
  const body = await req.json();

  // Validate input
  validateData(body);

  // Execute business logic
  const result = await performOperation(supabaseClient, body);

  // Return success response
  return createSuccessResponse({ data: result }, 200);

} catch (error) {
  // Return error response
  return createErrorResponse(error, 400);
}
```

---

## Key Improvements

### 1. **Separation of Concerns**
- ✅ Each API service is in its own file
- ✅ Each backend function is independent
- ✅ Shared utilities are reusable
- ✅ Clear layer separation (Frontend → API → Backend → DB)

### 2. **Organization Benefits**
- ✅ Easy to find specific code
- ✅ Easy to add new services
- ✅ Easy to test individual services
- ✅ Easy to maintain and update

### 3. **Scalability**
- ✅ Add new services without touching existing ones
- ✅ Shared utilities prevent code duplication
- ✅ Clear patterns for new developers

### 4. **Import Paths**
```typescript
// Before: One giant file
import { ProductsAPI, OrdersAPI } from '@/services/api';

// Now: Clean, organized imports
import { ProductsAPI } from '@/services/api/ProductsAPI';
import { OrdersAPI } from '@/services/api/OrdersAPI';

// Or use barrel export (recommended):
import { ProductsAPI, OrdersAPI } from '@/services/api';
```

---

## File Sizes (Optimized)

| File | Lines | Purpose |
|------|-------|---------|
| ProductsAPI.ts | ~120 | Product operations |
| OrdersAPI.ts | ~150 | Order operations |
| BrandsAPI.ts | ~110 | Brand operations |
| AdsAPI.ts | ~80 | Ad operations |
| AnalyticsAPI.ts | ~25 | Analytics |
| NewsletterAPI.ts | ~45 | Newsletter |
| ClientsAPI.ts | ~45 | Clients |
| ChatAPI.ts | ~25 | Chat |
| validation.ts | ~40 | Validation utilities |
| errors.ts | ~35 | Error handling |
| business-logic.ts | ~50 | Business logic |

---

## Development Workflow

### Adding a New API Service

1. **Create Frontend Service**
   ```bash
   touch src/services/api/NewFeatureAPI.ts
   ```

2. **Implement Class**
   ```typescript
   export class NewFeatureAPI {
     static async operation() { /* ... */ }
   }
   ```

3. **Export from Barrel File**
   ```typescript
   // src/services/api/index.ts
   export { NewFeatureAPI } from './NewFeatureAPI';
   ```

4. **Create Backend Function**
   ```bash
   mkdir supabase/functions/new-feature
   touch supabase/functions/new-feature/index.ts
   ```

5. **Add Tests**
   ```bash
   touch src/test/api.new-feature.test.ts
   ```

### Usage Example

```typescript
// Component code
import { ProductsAPI } from '@/services/api';

function ProductsPage() {
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => ProductsAPI.list(),
  });

  return (
    <div>
      {products?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## Documentation & Comments

Each API class includes:
- ✅ JSDoc comments for methods
- ✅ Parameter descriptions
- ✅ Return type documentation
- ✅ Error handling examples
- ✅ Usage examples

Each backend function includes:
- ✅ Purpose and functionality
- ✅ Business logic explanation
- ✅ Validation rules
- ✅ Error scenarios

---

**This organization supports:**
- Clean code principles
- SOLID principles
- Scalable architecture
- Easy testing
- Clear collaboration
- Professional standards

**Document Version:** 1.0  
**Last Updated:** November 26, 2025
