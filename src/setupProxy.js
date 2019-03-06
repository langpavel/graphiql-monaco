const graphqlHTTP = require('express-graphql');
const schema = require('../server/schema');

function setupProxy(app) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  app.use('/graphql', graphqlHTTP({ schema }));
}

module.exports = setupProxy;
