const graphqlHTTP = require("express-graphql");
const schema = require("../server/schema");

function setupProxy(app) {
  app.use("/graphql", graphqlHTTP({ schema }));
}

module.exports = setupProxy;
