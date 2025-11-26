# Echelon Society - E-Commerce Platform

An old money fashion e-commerce platform built with a comprehensive backend architecture.

## Project Overview

Echelon Society is a fashion e-commerce platform that combines elegant old-money aesthetics with a social mission. 50% of profits go directly to supporting lower-income communities.

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

2. **Order Workflow**
   - pending → confirmed → shipped → delivered

3. **Newsletter Discount**
   - 10% discount code (ECHELON10) for subscribers

4. **Input Validation**
   - Email format validation
   - Price validation (positive numbers)
   - Date range validation
   - Duplicate checking

## Key Features

- **Multi-Role System**: Clients, Advertisers, Brand Owners, Admins
- **Product Management**: Full CRUD with categories and brands
- **Order Processing**: Automated shipping calculation
- **Admin Dashboard**: Analytics, user management, data export
- **AI Chatbot**: Customer service assistant
- **Newsletter System**: With discount code generation

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

## Deployment

The project is deployed automatically via Lovable's deployment system and is also synced to GitHub for version control and potential self-hosting.

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

## License

© 2024 Echelon Society. All rights reserved.
