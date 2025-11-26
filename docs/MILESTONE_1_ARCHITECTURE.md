# Milestone 1: Project Idea & Architecture
## Echelon Society - E-Commerce Platform

**Submission Date:** November 26, 2025  
**Team Project:** Software Construction and Testing - Winter 2025  
**Dr. Ahmed Maghawry | TA. Nadeen Serag | TA. Menna Singergy**

---

## 1. Project Idea

### Overview
Echelon Society is an **E-Commerce Fashion Platform** that combines elegant old-money aesthetics with a social mission. The platform allows users to browse, search, and purchase premium fashion items while supporting philanthropic causes. 50% of profits are donated to support lower-income communities.

### Justification
This idea was chosen because:
1. **E-commerce domain** is one of the suggested project ideas
2. **Real-world relevance** - E-commerce is a thriving industry requiring robust systems
3. **Complexity** - Demonstrates full-stack development (frontend, backend, database)
4. **Social impact** - Combines business with community support
5. **Scalability** - Can be extended with additional features
6. **Educational value** - Covers multiple software engineering principles

### Objectives
- Develop a fully functional e-commerce platform
- Provide seamless shopping experience for customers
- Enable administrative management of products, orders, and analytics
- Implement role-based access control (Customer, Admin, Brand Owner, Advertiser)
- Demonstrate clean code and testing best practices

### Expected Outcomes
1. A functional web application deployable to production
2. Comprehensive test suite covering unit, integration, and E2E tests
3. Well-documented codebase following SOLID principles
4. Database with proper schema and security
5. Real-time analytics dashboard for admins

---

## 2. Functional Requirements (FRs) with User Stories

### FR1: Product Catalog Management
**User Story 1.1:** As a **customer**, I want to browse all available products so that I can discover new fashion items.
- List all products with filtering by category and brand
- Display product details (name, price, description, images)
- Show stock status

**User Story 1.2:** As an **admin**, I want to add new products to the catalog so that I can expand our inventory.
- Create product with validation
- Upload product images
- Assign to brands and categories
- Set pricing and stock status

**User Story 1.3:** As an **admin**, I want to update or delete products so that I can keep the catalog current.
- Edit existing product details
- Update pricing and inventory
- Remove discontinued items

### FR2: Shopping Cart & Checkout
**User Story 2.1:** As a **customer**, I want to add products to my cart so that I can purchase multiple items at once.
- Add items to cart
- Modify quantities
- Remove items
- View cart total

**User Story 2.2:** As a **customer**, I want to checkout and place an order so that I can complete my purchase.
- Enter shipping information (name, email, phone, address, city)
- Automatic shipping cost calculation based on city
- Order confirmation with order ID

### FR3: Order Management
**User Story 3.1:** As an **admin**, I want to view all orders so that I can manage fulfillment.
- List orders with status tracking
- Filter by status (pending, confirmed, shipped, delivered)
- View detailed order information

**User Story 3.2:** As an **admin**, I want to update order status so that I can track fulfillment progress.
- Change order status through workflow
- Track order history
- Send status notifications

### FR4: Brand Management
**User Story 4.1:** As a **brand owner**, I want to create my brand profile so that customers know about our company.
- Register brand with contact information
- Add brand description
- Manage brand products

**User Story 4.2:** As an **admin**, I want to manage all brands so that I can ensure quality control.
- View all registered brands
- Edit brand information
- Remove inactive brands

### FR5: Newsletter & Discount System
**User Story 5.1:** As a **customer**, I want to subscribe to the newsletter so that I can receive exclusive discounts.
- Subscribe with email
- Receive discount code (10% off with code: ECHELON10)
- Unsubscribe option

**User Story 5.2:** As an **admin**, I want to manage newsletter subscribers so that I can track engagement.
- View subscriber list
- Send announcements
- Track newsletter performance

### FR6: Advertisement Management
**User Story 6.1:** As an **advertiser**, I want to create ads so that I can promote products.
- Create advertisement with budget
- Set ad duration (start/end dates)
- Upload ad images
- Track ad performance

**User Story 6.2:** As an **admin**, I want to manage all advertisements so that I can control platform content.
- Review and approve ads
- View ad analytics
- Remove inappropriate ads

### FR7: Analytics Dashboard
**User Story 7.1:** As an **admin**, I want to view dashboard statistics so that I can monitor business performance.
- Total revenue
- Number of orders, products, brands
- Active clients
- Inventory status
- Order trends

### FR8: AI Chat Assistant
**User Story 8.1:** As a **customer**, I want to chat with an AI assistant so that I can get product recommendations and support.
- Ask product-related questions
- Receive instant recommendations
- Get customer support help

---

## 3. Non-Functional Requirements (NFRs)

### NFR1: Performance
- Page load time < 3 seconds
- API response time < 1 second
- Support 1000+ concurrent users

### NFR2: Security
- HTTPS encryption for all data transmission
- Row-Level Security (RLS) policies in database
- Input validation and sanitization
- Protection against SQL injection and XSS attacks

### NFR3: Scalability
- Database can handle growing product catalog (100K+ products)
- Backend functions auto-scale with demand
- CDN for static assets

### NFR4: Maintainability
- Code must follow SOLID principles
- Test coverage > 80%
- Clear code documentation
- Modular architecture with separation of concerns

### NFR5: Availability
- 99.5% uptime SLA
- Automated backups
- Disaster recovery plan

### NFR6: Usability
- Responsive design (mobile, tablet, desktop)
- Intuitive navigation
- Accessible to users with disabilities (WCAG 2.1)
- Multi-language support (future)

### NFR7: Reliability
- Data consistency guaranteed
- Error recovery mechanisms
- Comprehensive logging and monitoring

### NFR8: Compliance
- GDPR compliance for customer data
- PCI DSS for payment processing
- Terms of service and privacy policy

---

## 4. System Architecture

### Architecture Type: **Layered Architecture**

#### Why Layered Architecture?
1. **Separation of Concerns** - Each layer has specific responsibilities
2. **Maintainability** - Easy to understand and modify
3. **Testability** - Each layer can be tested independently
4. **Flexibility** - Components can be replaced without affecting others
5. **Team Scalability** - Different team members can work on different layers
6. **Standard approach** - Well-known and documented pattern

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│              (React Frontend - Single Page App)              │
│   ├─ Pages (Home, Products, Cart, Admin Dashboard)          │
│   ├─ Components (UI Components, Forms, Lists)               │
│   ├─ Layout (Navigation, Sidebar, Footer)                   │
│   └─ State Management (React hooks, Context)                │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                     API LAYER                                │
│        (Service Layer - Centralized API calls)              │
│   ├─ ProductsAPI                                            │
│   ├─ OrdersAPI                                              │
│   ├─ BrandsAPI                                              │
│   ├─ AdsAPI                                                 │
│   ├─ AnalyticsAPI                                           │
│   ├─ NewsletterAPI                                          │
│   ├─ ClientsAPI                                             │
│   └─ ChatAPI                                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                 BACKEND LAYER                               │
│         (Supabase Edge Functions - Deno Runtime)            │
│   ├─ products/index.ts    (CRUD + Validation)              │
│   ├─ orders/index.ts      (Processing + Shipping Calc)     │
│   ├─ brands/index.ts      (Brand Management)               │
│   ├─ ads/index.ts         (Ad Management)                  │
│   ├─ analytics/index.ts    (Dashboard Stats)               │
│   ├─ newsletter/index.ts   (Subscription + Discount)       │
│   ├─ clients/index.ts      (Client Tracking)               │
│   └─ chat/index.ts         (AI Chat)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                 DATABASE LAYER                              │
│              (PostgreSQL - Supabase)                        │
│   ├─ products table                                         │
│   ├─ brands table                                           │
│   ├─ orders table                                           │
│   ├─ order_items table                                      │
│   ├─ ads table                                              │
│   ├─ clients table                                          │
│   ├─ newsletter_subscribers table                           │
│   ├─ user_roles table (Role-based access)                  │
│   └─ RLS Policies (Row-Level Security)                      │
└─────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

#### 1. Presentation Layer
- **Technologies:** React, TypeScript, Tailwind CSS, shadcn-ui
- **Responsibility:** User interface and user interactions
- **Components:**
  - Pages: Home, Products, Checkout, Admin Dashboard
  - UI Components: Buttons, Forms, Tables, Cards
  - Navigation and Layout management

#### 2. API Service Layer
- **Location:** `src/services/api.ts`
- **Responsibility:** Centralized client for all backend calls
- **Pattern:** Facade pattern - single interface for multiple backend functions
- **Services:**
  - ProductsAPI
  - OrdersAPI
  - BrandsAPI
  - AdsAPI
  - AnalyticsAPI
  - NewsletterAPI
  - ClientsAPI
  - ChatAPI

#### 3. Backend Layer
- **Technologies:** Deno + Supabase Edge Functions
- **Responsibility:** Business logic, validation, data processing
- **Services:**
  - Input validation and error handling
  - Business logic (shipping calculation, discount application)
  - Database operations
  - Logging and monitoring

#### 4. Database Layer
- **Technologies:** PostgreSQL (Supabase)
- **Responsibility:** Data persistence and security
- **Features:**
  - Schema design with relationships
  - Row-Level Security policies
  - Indexed queries for performance
  - Automatic timestamps (created_at, updated_at)

### Key Architectural Patterns

#### 1. Facade Pattern (API Service Layer)
```typescript
export const ProductsAPI = {
  async list() { /* ... */ },
  async get(id: string) { /* ... */ },
  async create(product) { /* ... */ },
  async update(id, updates) { /* ... */ },
  async delete(id) { /* ... */ },
};
```
- Single interface for all product operations
- Hides complexity of backend calls

#### 2. Factory Pattern (Resource Creation)
- Order creation with automatic shipping calculation
- Product creation with brand validation
- Ad creation with validation

#### 3. Observer Pattern (State Management)
- React hooks for state updates
- useQuery for data fetching and caching (React Query)

#### 4. MVC Pattern
- Model: TypeScript interfaces and types (`src/types/index.ts`)
- View: React components
- Controller: Backend services handling business logic

### Data Flow Example: Product Purchase

```
1. Customer adds product to cart (Frontend State)
2. Customer checkout (Form submission)
3. API calls OrdersAPI.create(orderData)
4. API Service calls Supabase edge function
5. Backend validates input (order items, customer data)
6. Backend calculates shipping based on city
7. Backend creates order + order_items records
8. Database returns order with calculated total
9. API returns order to frontend
10. Frontend shows confirmation
11. Admin sees new order in dashboard
```

### Error Handling & Validation

**Frontend Validation:**
- Form validation using React Hook Form + Zod
- Type checking with TypeScript

**Backend Validation:**
- Email format validation (regex pattern)
- Price validation (must be positive)
- Required field validation
- Foreign key validation (brand exists before product creation)
- Stock validation

**Database Security:**
- Row-Level Security policies
- Column encryption for sensitive data
- Automatic audit trails

---

## 5. Technology Stack Justification

| Layer | Technology | Why? |
|-------|-----------|------|
| Frontend | React | Industry standard, component-based, large ecosystem |
| Styling | Tailwind CSS | Utility-first, rapid development, responsive design |
| UI Components | shadcn-ui | Pre-built accessible components, customizable |
| Type Safety | TypeScript | Compile-time error detection, better IDE support |
| Build Tool | Vite | Fast development server, optimized build |
| Backend | Deno/Edge Functions | Low latency, modern JavaScript, FaaS benefits |
| Database | PostgreSQL/Supabase | Robust, ACID compliance, RLS support |
| Routing | React Router | Declarative routing, nested routes support |
| Forms | React Hook Form | Performance optimized, minimal re-renders |
| Data Validation | Zod | Runtime type checking, clear error messages |
| HTTP Client | Supabase JS | Official SDK, excellent TypeScript support |

---

## 6. Deployment & Infrastructure

### Frontend Deployment
- Hosted on Vercel/Netlify
- CDN for global distribution
- Automatic deployments from GitHub

### Backend Deployment
- Supabase Edge Functions (auto-scaling)
- PostgreSQL database on Supabase
- HTTPS/TLS encryption

### CI/CD Pipeline
- GitHub Actions for automated testing
- Pre-commit hooks for code quality
- Automated deployment on main branch

---

## 7. Testing Strategy

### Unit Testing
- Test individual functions and components
- Mock database calls
- Framework: Deno test or Vitest

### Integration Testing
- Test API endpoints with real database
- Test data flow between layers
- Framework: Supertest or similar

### End-to-End Testing
- Test complete user workflows
- Browser automation
- Framework: Playwright or Cypress

### Test Coverage Goals
- Backend: > 80%
- Frontend: > 75%
- Overall: > 80%

---

## 8. Security Considerations

1. **Authentication & Authorization**
   - Role-based access control
   - JWT tokens (via Supabase Auth)
   - Session management

2. **Data Protection**
   - HTTPS encryption in transit
   - Column encryption at rest
   - PII anonymization where appropriate

3. **Input Validation**
   - Server-side validation
   - Sanitization of user inputs
   - Protection against injection attacks

4. **API Security**
   - CORS configuration
   - Rate limiting
   - Request validation

---

## 9. Scalability Considerations

1. **Database:**
   - Connection pooling
   - Query optimization with indexes
   - Partitioning for large tables

2. **Backend:**
   - Stateless functions
   - Horizontal scaling via FaaS
   - Caching strategies

3. **Frontend:**
   - Code splitting
   - Lazy loading
   - Service workers for offline capability

---

## 10. Future Enhancements

1. Payment gateway integration (Stripe, Fawry)
2. Inventory management system
3. Customer reviews and ratings
4. Wishlist feature
5. Personalized recommendations
6. Mobile app (React Native)
7. Multi-language support
8. Advanced analytics with ML recommendations
9. Subscription models
10. Integration with shipping providers

---

## Conclusion

The Echelon Society e-commerce platform uses a **Layered Architecture** that provides:
- Clear separation of concerns
- Scalability for growth
- Easy maintenance and testing
- Professional code organization
- Real-world applicability

This architecture aligns with software engineering best practices and provides a solid foundation for a production-ready e-commerce system.

---

**Document Version:** 1.0  
**Last Updated:** November 26, 2025  
**Status:** Ready for Milestone 1 Submission
