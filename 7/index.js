const mysql = require("mysql2");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");

const app = express();

app.use(
  "/graphql/api",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(3001, function () {
  console.log("Server is waiting for connection...");
});
