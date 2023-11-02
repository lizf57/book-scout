const typeDefs = `

    type Book {
        _id: ID
        authors: String
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    input savedBookInput {
        authors: String
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type User {
        _id: ID
        username: String!
        email: String
        password: String
        savedBooks: [Book]
    }

    input userInput {
        username: String!
        email: String
        password: String
    }

    type Query: {
        books: [Book]
        users: [User]
    }

    type Auth{
        token: ID!
        user: User
    }


    type Mutation {
        addUser: (userInput: UserInput): User
        login(email: String!, password: String!) 
        saveBook(book: SavedBookInput): User
        removeBook(boodId: String!): User
    }
`

module.exports = typeDefs