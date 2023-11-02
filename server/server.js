const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
// apollo server imports
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware} = require('@apollo/server/express4')

// import typeDefs and Resolvers
const { typeDefs, resolvers } = require('./schemas')

// express server
const app = express();
const PORT = process.env.PORT || 3001;

//  apollo server 
const server = new ApolloServer({
  typeDefs,
  resolvers
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', async () => {

  // start apollo server
  await server.start()
  
  app.use('/graphql', expressMiddleware(server, {
    context: async ({req}) => ({ token: req.headers.token})
  }))

  app.listen(PORT, () => { 
      console.log(`Express listening at http://localhost:${PORT}`);
      console.log(`Graphql available at http://localhost:${PORT}/graphql`)
  });
});
