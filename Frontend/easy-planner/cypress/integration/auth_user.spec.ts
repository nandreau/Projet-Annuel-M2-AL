describe('Parcours complet utilisateur', () => {
  const testUser = {
    firstname: 'Test',
    name:      'User',
    email:     'testuser5@example.com',
    password:  'Azerty123',
    job:       'Charpentier'
  };

  it('1. S’inscrit avec un nouvel utilisateur', () => {
    cy.visit('/register');

    cy.get('input[name="firstname"]').type(testUser.firstname);
    cy.get('input[name="name"]').type(testUser.name);
    cy.get('input[name="job"]').type(testUser.job);
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('input[name="confirmPassword"]').type(testUser.password);

    cy.get('ion-button[type="submit"]').click();
    cy.url().should('include', '/login');
  });

  it('2. Se connecte et déconnecte avec l’utilisateur créé', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('ion-button[type="submit"]').click();

    cy.url().should('not.include', '/login');
    cy.contains('Dashboard').should('exist');

    cy.get('[data-testid="logout-button"]').click();
    cy.url().should('include', '/login');
  });

  context('Avec session conservée', () => {
    beforeEach(() => {
      cy.session('userSession', () => {
        cy.visit('/login');
        cy.get('input[name="email"]').type(testUser.email);
        cy.get('input[name="password"]').type(testUser.password);
        cy.get('ion-button[type="submit"]').click();
        cy.url().should('not.include', '/login');
      });

      cy.visit('/dashboard');
    });

    it('Vérifie que le Dashboard est accessible', () => {
      cy.contains('Dashboard').should('exist');
    });

    it('Se déconnecte', () => {
      cy.get('ion-button[data-testid="logout-button"]')
        .shadow()
        .find('button')
        .click();
      cy.url().should('include', '/login');
    });
  });
});
