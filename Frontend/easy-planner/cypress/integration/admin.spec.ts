/// <reference types="cypress" />

describe('Gestion des utilisateurs', () => {
  const admin = {
    email:    'admin@gmail.com',
    password: 'Azerty123'
  };

  // données pour le nouvel utilisateur
  const newUser = {
    firstname: 'Cypress',
    name:      'Tester',
    email:     'cypress.tester@example.com',
    password:  'Secret123!',
    job:       'Testeur'
  };

  const updatedJob = 'Menuisier';

    beforeEach(() => {
        cy.session('adminSession', () => {
        cy.visit('/login');
        cy.get('input[name="email"]').clear().type('admin@gmail.com');
        cy.get('input[name="password"]').clear().type('Azerty123');
        cy.get('ion-button[type="submit"]').click();
        cy.url().should('not.include', '/login');
        cy.contains('Dashboard').should('exist');
        });
        cy.visit('/admin');
    });

 it('A. Ajoute un nouvel utilisateur (via labels)', () => {
    cy.get('p-button[label="Ajouter"]').click();

    // Utilisation des labels pour cibler les inputs
    cy.contains('label', 'Prénom')
      .parent().find('input')
      .type(newUser.firstname);

    cy.contains('label', 'Nom')
      .parent().find('input')
      .type(newUser.name);

    cy.contains('label', 'Rôles')
      .parent()
      .find('p-multiselect')
      .click();

    cy.get('div.p-overlay.p-component', { timeout: 10000 })
    .should('exist')
    .within(() => {
        cy.get('div.p-multiselect-overlay')
        .should('be.visible')
        .contains('li[role="option"]', 'client')
        .click();
    });
    cy.contains('label', 'Métier')
      .click();

    cy.contains('label', 'Métier')
      .parent().find('input')
      .type(newUser.job).type('{enter}');

    cy.contains('label', 'Email')
      .parent().find('input')
    .scrollIntoView({ offset: {left:0, top: 0 } })
    .should('be.visible')
    .clear({ force: true })
    .type(newUser.email);

    cy.contains('label', 'Mot de passe')
      .parent().find('input')
      .type(newUser.password);

    cy.get('div.p-overlay-mask')
    .should('be.visible')
    .within(() => {
        cy.get('div.p-dialog')
        .should('be.visible')
        .contains('button', 'Ajouter')
        .click();
    });

    cy.get('div.p-overlay-mask')
    .should('not.exist');

  });

  it('B. Recherche le nouvel utilisateur', () => {
    cy.get('input[placeholder="Rechercher un utilisateur"]')
    .scrollIntoView({ offset: {left:0, top: 0 } })
    .should('be.visible')
    .clear({ force: true })
    .type(newUser.email);

    cy.get('p-table tbody tr')
        .first()
        .within(() => {
        cy.contains(newUser.email);
        });
  });

  it('C. Modifie l’utilisateur ajouté', () => {
    cy.get('input[placeholder="Rechercher un utilisateur"]')
    .scrollIntoView({ offset: {left:0, top: 0 } })
    .should('be.visible')
    .clear({ force: true })
    .type(newUser.email);

    cy.get('p-table tbody tr').first()
      .find('p-tableCheckbox input[type="checkbox"]')
      .click();

    cy.get('p-button[label="Modifier"]').click();

    // Modifier via label
    cy.contains('label', 'Métier')
      .parent().find('input')
      .clear().type(updatedJob).type('{enter}');

    cy.get('div.p-overlay-mask')
    .should('be.visible')
    .within(() => {
        cy.get('div.p-dialog')
        .should('be.visible')
        .contains('button', 'Enregistrer')
        .click();
    });

    cy.get('div.p-overlay-mask').should('not.exist');

    cy.get('input[placeholder="Rechercher un utilisateur"]')
      .clear().type(updatedJob);

    cy.get('p-table tbody tr')
      .should('contain', updatedJob);
  });

  it('D. Supprime l’utilisateur modifié', () => {
    cy.get('input[placeholder="Rechercher un utilisateur"]')
    .scrollIntoView({ offset: {left:0, top: 0 } })
    .should('be.visible')
    .clear({ force: true })
    .type(newUser.email);

    cy.get('p-table tbody tr').first()
      .find('p-tableCheckbox input[type="checkbox"]')
      .click();

    cy.get('p-button[label="Supprimer"]').click();
    
    cy.get('div.p-overlay-mask')
        .should('be.visible')
        .within(() => {
            cy.get('div.p-dialog')
            .should('be.visible')
            .contains('button', 'Supprimer')
            .click();
        });

    cy.get('div.p-overlay-mask').should('not.exist');

    cy.get('input[placeholder="Rechercher un utilisateur"]')
      .clear().type(newUser.email);

    cy.contains('Aucun utilisateur trouvé').should('exist');
  });
});
