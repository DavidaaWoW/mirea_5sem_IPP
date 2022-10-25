const client = require("./client");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/register", (req, res) => {
  res.render("register", { err: req.query.err, data: req.query.data });
});

app.get("/login", (req, res) => {
  res.render("login", { err: req.query.err, data: req.query.data });
});

app.get("/home", (req, res) => {
  res.render("home", { err: req.query.err, data: req.query.data });
});

app.post("/register", (req, res) => {
  let user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  client.registerUser(user, (err, data) => {
    if (err) res.redirect("/register?err=" + err);
    else {
      res.redirect("/home?data=" + data.reply);
    }
  });
});

app.post("/login", (req, res) => {
  let credentials = {
    email: req.body.email,
    password: req.body.password,
  };
  client.loginUser(credentials, (err, data) => {
    if (err) res.redirect("/login?err=" + err);
    else {
      res.redirect("/home?data=" + data.reply);
    }
  });
});

app.post("/edit", (req, res) => {
  let _data = {
    credentials: {
      email: req.body.email,
      password: req.body.password,
    },
    newUser: {
      name: req.body.newname,
      email: req.body.newmail,
      password: req.body.newpassword,
    },
  };
  client.editUser(_data, (err, data) => {
    if (err) res.redirect("/home?err=" + err);
    else {
      res.redirect("/login?data=" + data.reply);
    }
  });
});

app.post("/delete", (req, res) => {
  let credentials = {
    email: req.body.email,
    password: req.body.password,
  };
  client.deleteUser(credentials, (err, data) => {
    if (err) res.redirect("/home?err=" + err);
    else {
      res.redirect("/login?data=" + data.reply);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Сервер запущен на порту %d", PORT);
});
