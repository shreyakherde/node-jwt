const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/api", (req, res) => {
  res.json({
    message: "Hi! welcome to this API service",
  });
});

app.post("/api/login", (req, res) => {
  const user = {
    id: 1,
    username: "shreya",
    email: "shreya@email.com",
  };

  jwt.sign({ user: user }, "secretkey", (err, token) => {
    res.json({ token });
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  console.log("bearerHeader: ", bearerHeader);

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    console.log("token: ", bearerToken);
    next();
  } else {
    res.sendStatus(403);
  }
}

app.post("/api/posts", verifyToken, (req, res) => {
  console.log("req.token: ", req.token);
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({ message: "POST created...", authData });
    }
  });
});

app.listen(8080, (req, res) => {
  console.log("Service is up and running on port 8080");
});
