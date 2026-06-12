# Decisions

The main architectural decision was how much global state to introduce. I could
have used a dedicated state library, but the app only has one genuinely global
concern: the cart. Product data is fetched inside the pages that need it, and
selected product variants belong in the URL because the detail page has to be
deep-linkable. For that reason I used React Context API for cart state and kept
the rest local to the route components. This keeps the implementation easy to
follow while still meeting the persistence requirement through localStorage.
It also makes the cart behavior easy to review in a follow-up call because the
state transitions live in one small provider instead of being spread across
page components.

The other call was how to handle missing data from Fake Store API. The API
provides real product IDs, titles, descriptions, categories, prices, images, and
ratings, but it does not provide brands, sale prices, colours, sizes, stock
levels, or multiple gallery images. The options were to hard-code a separate
mock catalogue, use a different API, or derive the missing commerce details
locally. I chose deterministic local helpers in `src/data/variants.ts`. That
keeps Fake Store as the product source of truth while making variant states
stable across refreshes and shareable URLs.

I added focused tests around the variant selector and purchase state because the
stock rules are the easiest place to accidentally regress behavior. I also added
a small async cart API wrapper for the bonus loading and failure states. With
more time, I would make the drawer announce async errors accessibly and expand
the tests to cover cart persistence after a refresh. The responsive layout is
functional, but I would spend more time on visual polish after a Lighthouse
pass, especially image sizing and interaction states. Finally, after deployment
I would replace the placeholder live URL in the README and add a Lighthouse
screenshot under `docs/` so the performance work is documented instead of just
implied by the build.
