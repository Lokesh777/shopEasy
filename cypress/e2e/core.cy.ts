describe("core shopping flow", () => {
  beforeEach(() => {
    cy.intercept("GET", "https://fakestoreapi.com/products", {
      fixture: "products.json",
    }).as("products");
    cy.intercept("GET", "https://fakestoreapi.com/products/3", {
      fixture: "product.json",
    }).as("product");
  });

  it("shows products and opens the cart drawer", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        cy.stub(win.Math, "random").returns(0.9);
      },
    });
    cy.wait("@products");
    cy.contains("Test Jacket");
    cy.contains("Quick Add").first().click();
    cy.get("[aria-label='Open cart']").click();
    cy.contains("Grand total");
  });

  it("opens a product detail page with variant controls", () => {
    cy.visit("/");
    cy.wait("@products");
    cy.get("a[href='/product/3']").first().click();
    cy.contains("Colour");
    cy.contains("Size");
    cy.contains("Add to Cart");
  });
});
