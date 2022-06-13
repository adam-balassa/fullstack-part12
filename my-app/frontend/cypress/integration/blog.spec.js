describe('Blog app', function() {
  const user = {
    userName: 'testUserName',
    name: 'Test User',
    password: 'SuperS#cureP@ssword123'
  }
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/auth/register', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('label').contains('Username').as('userNameLabel')
    cy.get('label').contains('Password').as('passwordLabel')
    cy.get('@userNameLabel').parent().find('input')
    cy.get('@passwordLabel').parent().find('input[type=password]')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('label').contains('Username').parent().find('input')
        .type(user.userName)
      cy.get('label').contains('Password').parent().find('input[type=password]')
        .type(user.password)
      cy.get('button').contains('Log in').click()

      cy.contains('Login successful').parent().should('have.css', 'background-color', 'rgb(0, 128, 0)')
      cy.contains('Test User is logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('label').contains('Username').parent().find('input')
        .type(user.userName)
      cy.get('label').contains('Password').parent().find('input[type=password]')
        .type('WrongPassWord')
      cy.get('button').contains('Log in').click()

      cy.contains('Invalid user name or password').parent().should('have.css', 'background-color', 'rgb(255, 0, 0)')
    })
  })


  describe('When logged in', function() {
    beforeEach(function() {
      cy.login(user)
    })

    it('a blog can be created', function() {
      cy.contains('Title').parent().find('input')
        .type('Test title')
      cy.contains('Author').parent().find('input')
        .type('Test Author')
      cy.contains('Url').parent().find('input')
        .type('test.url')
      cy.contains('Create!').click()

      cy.contains('Test title')
      cy.contains('Test Author')
    })

    describe('and a blog is created', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Test title', author: 'Test author', url: 'test.url' })
      })

      it('the blog can be liked', function() {
        cy.contains('Test title').parent().contains('View').click()
        cy.contains('0 likes')
        cy.contains('Like').click()
        cy.contains('1 likes')
      })


      it('the blog can be deleted by the user who created it', function() {
        cy.contains('Test title').parent().contains('View').click()
        cy.contains('Test title').closest('div').contains('Delete').click()
        cy.contains('Test title').should('not.exist')
      })

      it('the blog cannot be deleted other users', function() {
        const user = { userName: 'anotherUser', name: 'Another User', password: 'Password123'  }
        cy.request('POST', 'http://localhost:3003/api/auth/register', user)
        cy.login(user)

        cy.createBlog({ title: 'Another blog', author: 'Another author', url: 'test.url' })
        cy.contains('Another blog').parent().contains('View').click()
        cy.contains('Another blog').closest('div').contains('Delete')

        cy.contains('Test title').parent().contains('View').click()
        cy.contains('Test title').closest('div').contains('Delete').should('not.exist')
      })
    })
    describe('and multiple blogs are created', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Test title 1', author: 'Test author 1', url: 'test.url/1' })
        cy.createBlog({ title: 'Test title 2', author: 'Test author 2', url: 'test.url/2' })
        cy.createBlog({ title: 'Test title 3', author: 'Test author 3', url: 'test.url/3' })
        cy.createBlog({ title: 'Test title 4', author: 'Test author 4', url: 'test.url/4' })
      })

      it('the blogs are ordered by the number of likes', function() {
        // after 1 like on blog 2
        cy.get('.blogs').contains('Test title 2').parent().contains('View').click()
        cy.get('.blogs').contains('Test title 2').closest('div').as('blog2')
        cy.get('@blog2').contains('Like').click()
        cy.get('@blog2').contains('1 likes').then(() => {
          const order = [2, 1, 3, 4]
          cy.get('.blogs>div').then(blogs => {
            const titles = blogs.map((_, blog) => Cypress.$(blog).find('span').first().text()).get()
            expect(titles).to.deep.eq(order.map(el => `Test title ${el}`))
          })
        })

        // after 2 likes on blog 3
        cy.get('.blogs').contains('Test title 3').parent().contains('View').click()
        cy.get('.blogs').contains('Test title 3').closest('div').as('blog2').as('blog3')
        cy.get('@blog3').contains('Like').click()
        cy.get('@blog3').contains('1 likes').then(() => {
          cy.get('@blog3').contains('Like').click()
        })
        cy.get('@blog3').contains('2 likes').then(() => {
          const order = [3, 2, 1, 4]
          cy.get('.blogs>div').then(blogs => {
            const titles = blogs.map((_, blog) => Cypress.$(blog).find('span').first().text()).get()
            expect(titles).to.deep.eq(order.map(el => `Test title ${el}`))
          })
        })

        // after another 2 likes on blog 2
        cy.get('.blogs').contains('Test title 2').closest('div').as('blog2')
        cy.get('@blog2').contains('Like').click()
        cy.get('@blog2').contains('2 likes').then(() => {
          cy.get('@blog2').contains('Like').click()
        })
        cy.get('@blog2').contains('3 likes').then(() => {
          const order = [2, 3, 1, 4]
          cy.get('.blogs>div').then(blogs => {
            const titles = blogs.map((_, blog) => Cypress.$(blog).find('span').first().text()).get()
            expect(titles).to.deep.eq(order.map(el => `Test title ${el}`))
          })
        })
      })
    })
  })
})