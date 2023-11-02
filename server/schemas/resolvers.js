const { Book, User } = require('../models')

module.exports = {
    Query: {
        books: async () => {
            return await Book.find()
        },
        users: async () => {
            return await User.find()
        }
    }
}