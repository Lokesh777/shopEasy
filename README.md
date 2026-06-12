# ShopEasy

A mini e-commerce app built for the frontend assignment using React 18, Vite,
TypeScript, React Router, Context API, localStorage, and SCSS modules.

Live URL: add the deployed Vercel or Netlify URL here before submission.

## Features

- Product listing page using the Fake Store API
- Responsive product grid with quick add to cart
- Product detail page with image thumbnails, colour and size variants, stock
  states, quantity selection, and URL-driven selected variant state
- Right-side cart drawer with item quantity controls, remove action, subtotal,
  and grand total
- Cart persistence with localStorage
- Desktop two-column product detail layout and mobile single-column layout
- Bonus coverage: variant selector tests for sold-out state, low stock display,
  disabled CTA, and quantity cap
- Bonus mock cart API with add-to-cart loading state and simulated random
  failure

## Tech Stack

- React 18 with hooks
- TypeScript
- Vite
- React Router
- SCSS modules and shared global SCSS
- Context API for cart state
- Fake Store API: https://fakestoreapi.com

## Setup

```bash
npm install
npm run dev
```

The development server will print the local URL, usually:

```bash
http://localhost:5173
```

## Build

```bash
npm run build
```

## Project Structure

```text
src/
  components/  Reusable UI pieces such as product cards, cart drawer, variants
  data/        Local variant and pricing helpers used to fill Fake Store gaps
  pages/       Route-level product listing and product detail pages
  services/    Fake Store API access
  stores/      Cart Context API provider and hook
  styles/      Global SCSS
  types/       Shared TypeScript types
```

## Design Decisions

Fake Store API does not provide product variants, brands, sale prices, or
multiple images. I kept the API as the source of truth for product identity,
image, title, price, category, and description, then added deterministic local
helpers for assignment-only commerce details. This keeps the app stable across
refreshes and makes deep links predictable.

Cart state uses Context API because the global state surface is small: add,
remove, update quantity, and persist cart items. A larger store would add
unnecessary setup for this scope.

SCSS modules are used for components and pages so styles remain close to the UI
they belong to, while `src/styles/global.scss` holds resets and shared page
status styles.

## Known Trade-offs

- Variant stock is generated locally because Fake Store has no inventory API.
- Product thumbnails reuse the product image because Fake Store exposes one
  image per product.
- Checkout is intentionally out of scope.
- The mock cart API intentionally has a small random failure rate to exercise
  error UI. Once an item is already in the cart, the UI switches to quantity
  controls instead of repeating the Add to Cart button.
