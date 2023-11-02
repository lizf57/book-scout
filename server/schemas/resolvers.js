const { Book, User } = require('../models')
const { BAD_USER_INPUT } = require('@apollo/server/errors')
const { signToken } = require('../utils/auth')
const { GraphQLError } = require('graphql')

const resolvers = {
    Query: {
        books: async () => {
            return await Book.find().populate('user')
        },
        book: async (parent, { _id }, contextValue, info) => {
            return await Book.findById(_id).populate(user)
        },
        users: async ()=> {
            return await User.find().populate('books')
        },
        user: async (parent, {_id, name}, contextValue, info) => {
            if (!_id && !name){
                throw new GraphQLError('Missing _id or name', {
                extensions: {
                    code: BAD_USER_INPUT,
                    }
                })
            }
        },
    },
    Mutation: {
        login: async (parent, {email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new GraphQLError('incorrect login info', {
                    extensions: {
                        code: BAD_USER_INPUT,
                    },
                }),
            },
        },
        addUser: async (parent, { userInput }, contextValue, info) => {
            return await User.create(userInput)
        },
        saveBook: async (parent, { savedBookInput }, contextValue, info) => {
            if (contextValue.user) {
                const updatedUser = await User.findOneAndUpdate(
                   {_id: contextValue.user._id},
                   { $addToSet: {savedBookInput: Book}},
                   { new: true}
               )
               return updatedUser
            }

            throw new GraphQLError('incorrect login info', {
                extensions: {
                    code: BAD_USER_INPUT,
                },
            })
        },
        removeBook: async (parent, { bookId }, contextValue, info) => {
            if (contextValue.user){
                const updatedUser = await User.findOneAndUpdate(
                    {_id: contextValue.user._id},
                   { $pull: {savedBookInput: {bookId: bookId }}},
                   { new: true}
                )
                return updatedUser
            }
        }
    }

}


module.exports = resolvers