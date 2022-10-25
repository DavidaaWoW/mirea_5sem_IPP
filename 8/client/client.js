const PROTO_PATH = "../users.proto";

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

var authService =
  grpc.loadPackageDefinition(packageDefinition).gRPC_service.AuthService;

const client = new authService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

module.exports = client;
