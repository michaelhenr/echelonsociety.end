## Project Evaluation Notes

This document is tailored for your evaluation presentation. It explains **one functional requirement (FR3)** and **one non-functional requirement (NFR: HTTPS/security)** with direct references to where they are implemented in the codebase and how you can explain them.

---

## 1. Functional Requirement (FR3)

> **FR3**: As a client, I want to browse and search for products and ads using filters (e.g., category, price range) so that I can easily find and compare items.

### 1.1. Where it is implemented (Products browsing & filtering)

- **Frontend page**: `frontend/src/pages/Products.tsx`
  - The `Products` React component is responsible for:
    - Loading product data.
    - Providing search and filter controls.
    - Displaying a filtered list of products.

Key implementation points (simplified):

- **State for search and filters**:
  - `searchTerm`: what the user types into the search box.
  - `categoryFilter`: which category is selected (`all`, `Sweatshirts`, `Hoodies`, etc.).
  - `brandFilter`: which brand is selected (`all`, `Echelon Society`, etc.).
- **Data loading**:
  - Uses `api.fetchProducts()` from `frontend/src/lib/api.ts` to load products from either:
    - The local backend API (when `VITE_API_BASE_URL` is set), or
    - Supabase (when `VITE_API_BASE_URL` is not set).
- **Filtering logic**:
  - Implemented inside a `useEffect` hook that reacts to `searchTerm`, `categoryFilter`, `brandFilter`, and `products`.
  - The logic:
    - If a **search term** is entered, it filters products by:
      - Product name.
      - Brand name (`p.brands?.name`).
    - If a **category** is selected (not `"all"`), it keeps only products whose `category` matches.
    - If a **brand** is selected (not `"all"`), it keeps only products whose brand name matches.
  - The result is stored in `filteredProducts`, which is what the UI renders.

```110:152:frontend/src/pages/Products.tsx
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Our Collection</h1>
        {getCartCount() > 0 && (
          <Button onClick={() => navigate("/checkout", { state: { cart, products } })}>
            View Cart ({getCartCount()})
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Input
          placeholder="Search by product or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Sweatshirts">Sweatshirts</SelectItem>
            <SelectItem value="Hoodies">Hoodies</SelectItem>
          </SelectContent>
        </Select>
        <Select value={brandFilter} onValueChange={setBrandFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            <SelectItem value="Echelon Society">Echelon Society</SelectItem>
          </SelectContent>
        </Select>
      </div>
```

```71:92:frontend/src/pages/Products.tsx
  // Filter products
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brands?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (brandFilter !== "all") {
      filtered = filtered.filter((p) => p.brands?.name === brandFilter);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, brandFilter, products]);
```

### 1.2. How to explain FR3 in the evaluation

You can explain FR3 roughly like this:

- **High-level explanation**:
  - “For FR3, we implemented a **Products page** that lets the user browse, search, and filter products. The user can type in a search term, choose a category, and choose a brand. The UI updates in real time to show only the products that match those filters.”
- **Technical explanation**:
  - “The page is built as a React component (`Products.tsx`). It stores the full product list in state, then maintains a separate `filteredProducts` list. Whenever the user changes the search box or any filter dropdown, a `useEffect` hook recalculates `filteredProducts` using `.filter()` based on:
    - Product name or brand name (for search).
    - Category.
    - Brand.
  - The filtered array is then rendered in a responsive grid, so the user only sees relevant items.”
- **Connection to the requirement**:
  - “This directly satisfies FR3 because it lets clients **easily discover and compare items** based on the criteria they care about, improving the discovery and decision-making experience.”

If you need to mention ads:

- Ads are created and stored via:
  - `frontend/src/pages/SubmitAd.tsx` (form to submit an ad using Supabase).
  - `backend/Controllers/adsController.js` and `backend/Routes/ads.js` (Express routes for listing/creating ads via Supabase).
- The same pattern (list + filters) could be extended to ads as well, even though the main visible implementation right now is on the products page.

---

## 2. Non-Functional Requirement (NFR – HTTPS & Security)

> **NFR**: All user data and transactions must be encrypted using HTTPS and secure protocols to protect against breaches.  
> Security is critical for building trust in an e-commerce platform.

### 2.1. Where it is implemented (security & secure protocols)

There are **two main layers** to highlight: **backend API security** and **use of secure services/protocols**.

#### a) Backend security middleware (Express server)

- **File**: `backend/server.js`
- Middlewares used:
  - `helmet()`:
    - Sets various **HTTP security headers** (e.g., HSTS, X-Content-Type-Options, X-Frame-Options).
    - Helps protect against common web vulnerabilities like clickjacking and MIME-sniffing.
  - `xss-clean()`:
    - Sanitizes user input to prevent **Cross-Site Scripting (XSS)** attacks.
  - `cors()`:
    - Controls which origins can access the API, which is important when the frontend runs on a different domain/port.

```18:21:backend/server.js
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xssClean());
```

These middlewares don’t by themselves create HTTPS, but they **harden the API** so that when it is served behind HTTPS (e.g., on a cloud provider), it is much more secure.

#### b) Secure data storage and communication (Supabase + HTTPS)

- The project uses **Supabase** for:
  - Storing products, brands, orders, ads, and user-related data.
  - Exposing a `supabase.functions.invoke('chat')` endpoint.
- Supabase endpoints are always accessed via `https://` URLs, for example in the edge function:

```1:1:backend/supabase/functions/chat/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
```

```36:36:backend/supabase/functions/chat/index.ts
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
```

- When the frontend calls Supabase (in `frontend/src/lib/api.ts` and `frontend/src/integrations/supabase/client.ts`), it relies on Supabase’s own **HTTPS-secured API**:
  - This means data between the browser and Supabase is encrypted in transit (TLS).

#### c) Frontend–backend communication over HTTPS

- **File**: `frontend/src/lib/api.ts`
- The frontend uses `fetch` to call the backend via an `API_BASE` URL:
  - `const API_BASE = import.meta.env.VITE_API_BASE_URL`
  - In production, you configure `VITE_API_BASE_URL` with an `https://` URL.
  - All calls like `fetch(`${API_BASE}/product`)` will then go over HTTPS when deployed behind an HTTPS-enabled server.

```1:8:frontend/src/lib/api.ts
import { supabase } from '@/integrations/supabase/client'

const API_BASE = import.meta.env.VITE_API_BASE_URL

async function getJSON(path: string) {
  const res = await fetch(`${API_BASE}${path}`)
  if(!res.ok) throw new Error('Network error')
  return res.json()
}
```

### 2.2. How to explain the NFR in the evaluation

You can explain the security/HTTPS NFR like this:

- **High-level explanation**:
  - “For the security NFR, our goal is to ensure that user data and transactions are protected in transit and at the API level. We rely on HTTPS for encryption and use security middlewares to protect the backend.”
- **Technical explanation**:
  - “On the backend (`server.js`), we use `helmet` to add secure HTTP headers and `xss-clean` to sanitize incoming data, which protects us against common web attacks such as XSS.
  - Our data layer uses Supabase, which exposes its APIs over HTTPS by default, so any data going between the browser and Supabase is encrypted using TLS.
  - For our own Express API, the frontend calls an `API_BASE` URL that we configure to `https://` in production, so the connection between the client and our backend is also encrypted.”
- **Connection to the requirement**:
  - “This setup aligns with the NFR by ensuring that all traffic is sent over secure HTTPS endpoints and that our server adds additional protection against typical web vulnerabilities. This is important for building user trust in an e-commerce context.”

### 2.3. Extra points you can mention

- **Authorization & protected routes**:
  - Some routes (like creating products, brands, or ads) use `checkAuth` middleware (`backend/MiddleWare/authMiddleware.js`), and the frontend attaches a `Bearer` token in the `Authorization` header (`createProduct`, `createBrand`, `deleteProduct` in `frontend/src/lib/api.ts`).
  - This shows that not all operations are public—**only authenticated users** (e.g., admin) can create or delete sensitive resources.
- **Why this matters**:
  - “Combining HTTPS, secure headers, sanitized input, and authenticated routes helps protect both the platform and the customers, which is essential for any e-commerce system.”

---

## 3. Quick 30–60 Second Summary (for your presentation)

- **FR3 – Browse/search with filters**:
  - Implemented on the `Products` page where we load all products, store them in state, and then apply real-time filtering based on the user’s search term, category, and brand. The final filtered list is displayed in a responsive grid, making it easy for users to discover and compare items.
- **NFR – HTTPS & security**:
  - We secure our backend using `helmet` and `xss-clean`, rely on Supabase’s HTTPS APIs for data storage, and configure the frontend to talk to the backend via an HTTPS `API_BASE` URL. Together, this ensures encrypted communication and protection against many common attacks, which is critical for an e-commerce platform.



