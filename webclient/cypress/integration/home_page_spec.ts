describe('My First Test', () => {
  it('Visit dilo!', () => {
    cy.visit('http://localhost:1234/')
    cy.contains('Get Started').click()

    cy.url().should('include', '/?j=')

    cy.get('input[type=text]')
      .type('Hola')
      .should('have.value', 'Hola')
      .type('{enter}')
      .should('have.value', '')

    cy.contains('Hola')
  })
})
