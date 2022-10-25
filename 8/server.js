const PROTO_PATH = "./users.proto";

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});
var usersProto = grpc.loadPackageDefinition(packageDefinition);
const { v4: uuidv4 } = require("uuid");
const server = new grpc.Server();
const users = [];
server.addService(usersProto.gRPC_service.AuthService.service, {
  registerUser: (call, callback) => {
    let user = call.request;
    if (users.find((_user) => _user.email == call.request.email)) {
      callback({
        code: grpc.status.ALREADY_EXISTS,
        details: "Пользователь с такой почтой уже существует",
      });
    } else {
      user.id = uuidv4();
      users.push(user);
      callback(null, { reply: "Привет " + user.name + "!" });
    }
  },
  loginUser: (call, callback) => {
    let user = users.find((_user) => _user.email == call.request.email);
    if (!user) {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Пользователя с такой почтой не существует",
      });
    } else if (user.password != call.request.password) {
      callback({
        code: grpc.status.PERMISSION_DENIED,
        details: "Неправильный пароль",
      });
    } else {
      callback(null, { reply: "Привет " + user.name + "!" });
    }
  },
  editUser: (call, callback) => {
    let user = users.find(
      (_user) => _user.email == call.request.credentials.email
    );
    if (!user) {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Пользователя с такой почтой не существует",
      });
    } else if (user.password != call.request.credentials.password) {
      callback({
        code: grpc.status.PERMISSION_DENIED,
        details: "Неправильный пароль",
      });
    } else {
      Uid = user.id;
      index = users.findIndex(
        (_user) => _user.email == call.request.credentials.email
      );
      users.splice(index, 1);
      let newUser = call.request.newUser;
      newUser.id = Uid;
      users.push(newUser);
      callback(null, { reply: "Пользователь успешно изменён" });
    }
  },
  deleteUser: (call, callback) => {
    index = users.findIndex((_user) => _user.email == call.request.email);
    if (index == -1) {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Пользователь с такой почтой не найден",
      });
    } else if (
      users.find((_user) => _user.email == call.request.email).password !=
      call.request.password
    ) {
      callback({
        code: grpc.status.PERMISSION_DENIED,
        details: "Неправильный пароль",
      });
    } else {
      users.splice(index, 1);
      callback(null, { reply: "Пользователь успешно удалён" });
    }
  },
});
server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure());
console.log("Сервер запущен по адресу http://127.0.0.1:50051");
server.start();
