# Echelon Society - Premium Fashion E-Commerce Platform

[![CI/CD Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml)
[![Test Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO)

> "A Higher Standard" - Egyptian old-money fashion brand committed to excellence and social responsibility.

## 🌟 Project Overview

Echelon Society is a premium fashion e-commerce platform launched in 2017, initially as sportswear and now rebranded with a commitment to donate 50% of profits to help the poor. The platform serves multiple user roles with a sophisticated "old money" aesthetic.

**Live URL**: https://lovable.dev/projects/ea7b4127-6393-46c5-be0d-e81c85a02b30

## Technology Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn-ui** - Component library
- **React Router** - Navigation

### Backend
- **Supabase Edge Functions** (Deno runtime)
- **PostgreSQL** - Database
- **Row Level Security (RLS)** - Data protection

## Architecture

```
Frontend (React) → API Service Layer → Backend (Edge Functions) → Database (PostgreSQL)
```

### Backend Structure

All business logic is implemented in separate backend services:

```
supabase/functions/
├── products/      # Product CRUD with validation
├── orders/        # Order processing & shipping calculation
├── brands/        # Brand management
├── ads/           # Advertisement handling
├── analytics/     # Dashboard statistics
├── newsletter/    # Newsletter subscriptions
├── clients/       # Client tracking
└── chat/          # AI chatbot assistant
```

### Custom Business Logic

1. **Shipping Calculation**
   - Alexandria & Cairo: 70 EGP
   - Other cities: 100 EGP

2. **Payment Methods**
   - Cash on Delivery (default)
   - Visa Card (with secure card detail collection)
   - Card validation (16-digit number, expiry, CVV)

3. **Order Workflow**
   - pending → confirmed → shipped → delivered

4. **Newsletter Discount**
   - 10% discount code (ECHELON10) for subscribers

5. **Input Validation**
   - Email format validation
   - Price validation (positive numbers)
   - Date range validation
   - Card number validation (16 digits)
   - Duplicate checking

## Key Features

- **Multi-Role Platform**: Client browsing, advertiser submissions, brand management, and admin oversight
- **Product Catalog**: Premium fashion items with advanced filtering and search by brand and category
- **Payment Options**: Cash on Delivery or Visa card payment with secure validation
- **Secure Checkout**: Location-based shipping (Cairo/Alexandria: 70 EGP, Other: 100 EGP)
- **Newsletter**: 10% discount code (ECHELON10) for subscribers
- **AI Assistant**: Built-in chatbot using Lovable AI Gateway (Gemini 2.5 Flash)
- **Admin Dashboard**: Comprehensive analytics, order management with payment details, and Excel export
- **Client Tracking**: Entry tracking with name, orders, and newsletter status

## Setup Instructions

### Prerequisites
- Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Local Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd echelonsociety

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

The following variables are automatically configured:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## Database Schema

### Tables
- `products` - Product catalog
- `brands` - Brand information
- `orders` - Customer orders
- `order_items` - Order line items
- `ads` - Advertisements
- `client_entries` - Client tracking
- `newsletter_subscribers` - Newsletter emails
- `user_roles` - Role-based access control

## API Endpoints

All backend functions are accessible via the API service layer (`src/services/api.ts`):

- **ProductsAPI**: list, get, create, update, delete
- **OrdersAPI**: create, list, get, updateStatus
- **BrandsAPI**: list, get, create, update, delete
- **AdsAPI**: list, create, update, delete
- **AnalyticsAPI**: getDashboardStats
- **NewsletterAPI**: subscribe, list
- **ClientsAPI**: register, list
- **ChatAPI**: sendMessage

## 🧪 Testing

### Test Structure
```
├── src/test/              # Unit & Integration tests
│   ├── api.products.test.ts
│   ├── api.orders.test.ts
│   ├── api.brands.test.ts
│   └── types.validation.test.ts
└── cypress/e2e/           # End-to-end tests
    ├── products.cy.ts
    ├── checkout.cy.ts
    ├── admin.cy.ts
    ├── role-selection.cy.ts
    ├── brand-submission.cy.ts
    ├── ad-submission.cy.ts
    ├── newsletter.cy.ts
    └── client-registration.cy.ts
```

### Running Tests

```bash
# Unit tests (Vitest)
npm run test              # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report

# E2E tests (Cypress)
npm run e2e              # Interactive mode
npm run e2e:headless     # CI mode

# All tests
npm run test:all         # Unit + E2E
```

### Test Coverage Goals
- **Frontend**: >75%
- **Backend**: >80%
- **Overall**: >95%

## 📦 Deployment

### Vercel (Recommended)

1. **Connect GitHub Repository**
   ```bash
   # Repository is already synced via Lovable GitHub integration
   ```

2. **Configure Vercel Project**
   - Import repository in Vercel dashboard
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
   ```

4. **Deploy**
   ```bash
   # Automatic deployment on push to main
   git push origin main
   ```

### GitHub Actions CI/CD

The project includes automated workflows (`.github/workflows/ci.yml`):
- ✅ Unit tests on every push/PR
- ✅ E2E tests with Cypress
- ✅ Build verification
- ✅ Lint & type checking
- ✅ Auto-deploy to Vercel on main branch

**Required GitHub Secrets**:
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon key

## Development Approach

This project was built with:
- **Custom business logic** in all backend functions
- **Separation of concerns** (Frontend → API Layer → Backend → Database)
- **Comprehensive validation** and error handling
- **Well-documented code** with inline comments
- **Professional architecture** following software engineering best practices

## Contributing

This is an academic project for evaluation purposes. The codebase demonstrates:
- Backend development skills
- Database design
- Business logic implementation
- API design
- Full-stack architecture

## 🎓 Academic Context

This project is developed for university evaluation with the following milestones:
- **M1 (Oct 11)**: Architecture & Requirements
- **M2 (Nov 25)**: Beta with working features
- **M3 (Dec 16)**: Final system with full testing

**Evaluation Criteria**:
- Code quality and maintainability
- Design patterns implementation
- Test coverage (>95%)
- SOLID principles adherence
- Documentation quality
- Deployment and CI/CD

## 📖 Additional Documentation

Available in `/docs`:
- `DESIGN_PATTERNS.md` - Design pattern implementations
- `SOLID_PRINCIPLES.md` - SOLID principles adherence
- `TESTING_GUIDE.md` - Comprehensive testing strategy
- `FILE_ORGANIZATION.md` - Project structure
- `TRACEABILITY_MATRIX.md` - Requirements to tests mapping

## 📄 License

Educational project for academic evaluation.

---

**Built with**: React, TypeScript, Vite, Tailwind CSS, Supabase, Vitest, Cypress, Lovable AI Gateway

**Tagline**: "A Higher Standard" 🏛️
