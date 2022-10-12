const graphql = require("graphql");
const mysql = require("mysql2");

const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} = graphql;

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "IPP7",
  password: "1",
});

let getData = (queryString) => {
  return new Promise(function (resolve, reject) {
    pool.query(queryString, function (err, data) {
      resolve(data);
    });
  });
};

let postData = (queryString, params) => {
  return new Promise(function (resolve, reject) {
    pool.query(queryString, params, function (err, data) {
      console.log(err);
      resolve(data.insertId);
    });
  });
};

const CarType = new GraphQLObjectType({
  name: "Car",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLFloat },
    age: { type: GraphQLInt },
    brand: {
      type: BrandType,
      resolve(parent, args) {
        return getData("SELECT * FROM brand WHERE ID=" + parent.brandId).then(
          (data) => data[0]
        );
      },
    },
  }),
});

const BrandType = new GraphQLObjectType({
  name: "Brand",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    cars: {
      type: new GraphQLList(CarType),
      resolve(parent, args) {
        return getData("SELECT * FROM car WHERE brandId=" + parent.id);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    info: {
      type: GraphQLString,
      resolve(parents, args) {
        return "Server is ready";
      },
    },
    car: {
      type: CarType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return getData("SELECT * FROM car WHERE ID=" + args.id).then(
          (data) => data[0]
        );
      },
    },
    cars: {
      type: new GraphQLList(CarType),
      resolve(parent, args) {
        return getData("SELECT * FROM car");
      },
    },
    brand: {
      type: BrandType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return getData("SELECT * FROM brand WHERE ID=" + args.id).then(
          (data) => data[0]
        );
      },
    },
    brands: {
      type: new GraphQLList(CarType),
      resolve(parent, args) {
        return getData("SELECT * FROM brand");
      },
    },
  },
});

const Mutations = new GraphQLObjectType({
  name: "MutationsType",
  fields: {
    addCar: {
      type: CarType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: GraphQLFloat },
        age: { type: GraphQLInt },
        brandId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        return postData(
          "INSERT INTO car (name, price, age, brandId) VALUES (?, ?, ?, ?)",
          [args.name, args.price, args.age, args.brandId]
        )
          .then((insertId) => {
            return getData("SELECT * FROM car WHERE id=" + insertId);
          })
          .then((data) => data[0]);
      },
    },
    addBrand: {
      type: BrandType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return postData("INSERT INTO brand (name) VALUES (?)", [args.name])
          .then((insertId) => {
            return getData("SELECT * FROM brand WHERE id=" + insertId);
          })
          .then((data) => data[0]);
      },
    },
    putCar: {
      type: CarType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: GraphQLFloat },
        age: { type: GraphQLInt },
        brandId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        return postData(
          "UPDATE car SET name = ?, price = ?, age = ?, brandId = ? WHERE id=?",
          [args.name, args.price, args.age, args.brandId, args.id]
        )
          .then((insertId) => {
            return getData("SELECT * FROM car WHERE id=" + args.id);
          })
          .then((data) => {
            return data[0];
          });
      },
    },
    putBrand: {
      type: BrandType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return postData("UPDATE brand SET name = ? WHERE id=?", [
          args.name,
          args.id,
        ])
          .then((insertId) => {
            return getData("SELECT * FROM brand WHERE id=" + args.id);
          })
          .then((data) => {
            return data[0];
          });
      },
    },
    patchCar: {
      type: CarType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        price: { type: GraphQLFloat },
        age: { type: GraphQLInt },
        brandId: { type: GraphQLInt },
      },
      resolve(parent, args) {
        let query = "UPDATE car SET ";
        let counter = 0;
        let argsSet = [];
        if (args.name) {
          query += "name = ?";
          counter++;
          argsSet.push(args.name);
        }
        if (args.price) {
          if (counter) {
            query += ", ";
          }
          query += "price = ?";
          counter++;
          argsSet.push(args.price);
        }
        if (args.age) {
          if (counter) {
            query += ", ";
          }
          query += "age = ?";
          counter++;
          argsSet.push(args.age);
        }
        if (args.brandId) {
          if (counter) {
            query += ", ";
          }
          query += "brandId = ?";
          counter++;
          argsSet.push(args.brandId);
        }
        query += " WHERE id=?";
        argsSet.push(args.id);
        console.log(query);
        console.log(argsSet);
        return postData(query, argsSet)
          .then((insertId) => {
            return getData("SELECT * FROM car WHERE id=" + args.id);
          })
          .then((data) => {
            return data[0];
          });
      },
    },
    patchBrand: {
      type: BrandType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
      },
      resolve(parent, args) {
        let query = "UPDATE brand SET ";
        let counter = 0;
        let argsSet = [];
        if (args.name) {
          query += "name = ?";
          counter++;
          argsSet.push(args.name);
        }
        query += " WHERE id=?";
        argsSet.push(args.id);
        console.log(query);
        console.log(argsSet);
        return postData(query, argsSet)
          .then((insertId) => {
            return getData("SELECT * FROM brand WHERE id=" + args.id);
          })
          .then((data) => {
            return data[0];
          });
      },
    },
    deleteCar: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return postData("DELETE FROM car WHERE id=?", [args.id]).then(
          () => "Success!"
        );
      },
    },
    deleteBrand: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return postData("DELETE FROM brand WHERE id=?", [args.id]).then(
          () => "Success!"
        );
      },
    },
    deleteAllCars: {
      type: GraphQLString,
      resolve(parent, args) {
        return postData("DELETE FROM car", []).then(() => "Success!");
      },
    },
    deleteAllBrands: {
      type: GraphQLString,
      resolve(parent, args) {
        return postData("DELETE FROM brand", []).then(() => "Success!");
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations,
});
