describe('Parcours complet utilisateur', () => {
  context('Session administrateur', () => {
    beforeEach(() => {
      cy.session('adminSession', () => {
        cy.visit('/login');
        cy.get('input[name="email"]').clear().type('admin@gmail.com');
        cy.get('input[name="password"]').clear().type('Azerty123');
        cy.get('ion-button[type="submit"]').click();
        cy.url().should('not.include', '/login');
        cy.contains('Dashboard').should('exist');
      });
      cy.visit('/dashboard');
    });

    it('4. Se connecte en tant qu’administrateur', () => {
      cy.contains('Dashboard').should('exist');
    });

    it('5. Navigue dans toutes les pages principales', () => {
      const pages = [
        '/dashboard',
        '/sites',
        '/tasks',
        '/planning',
        '/problems',
        '/admin'
      ];

      pages.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', route);
        cy.wait(300);
      });
    });
  });
});
