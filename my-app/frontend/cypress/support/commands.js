Cypress.Commands.add('login', ({ userName, password }) => {
  cy.request('POST', 'http://localhost:3003/api/auth/login', {
    userName, password
  }).then(({ body }) => {
    localStorage.setItem('blogAppUser', JSON.stringify(body))
    cy.visit('http://localhost:3000')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.contains('Blogs').then(() => {
    cy.request({
      url: 'http://localhost:3003/api/blogs/',
      method: 'POST',
      body: { title, author, url },
      headers: {
        'Authorization': `bearer ${JSON.parse(localStorage.getItem('blogAppUser')).token}`
      }
    }).then(() => {
      cy.visit('http://localhost:3000')
    })
  })
})