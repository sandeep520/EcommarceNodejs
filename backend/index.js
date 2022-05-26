const express = require("express");
const cors = require("cors");
const image = require('./helpers');
const app = express();
require("./db/config");
const multer = require('multer')


const Product = require("./db/Product");
const User = require("./db/User");
const Jwt = require("jsonwebtoken");
const jwtKey = "ecommarce";

app.use(express.json());
app.use(cors());

// register api
app.post("/register", async (req, res) => {
  try {
    let temp1 = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const temp = await temp1.save();
    Jwt.sign({ temp }, jwtKey, { expiresIn: "10m" }, (err, token) => {
      res.json({
        status: 200,
        data: { temp, token },
        mes: "Users add data succussfully",
      });
    });
  } catch {
    res.json({
      status: 403,
      data: [],
      mes: "Something Wrong",
    });
  }
});

// Login Api
app.post("/login", async (req, res) => {
  try {
    if (req.body.password && req.body.email) {
      let user = await User.findOne(req.body);
      if (user) {
        Jwt.sign({ user }, jwtKey, { expiresIn: "10m" }, (err, token) => {
          res.json({
            status: 200,
            data: { user, token },

            mes: "Users add data succussfully",
          });
        });
      } else {
        res.send({ result: "No User Found" });
      }
    }
  } catch {
    res.json({
      status: 403,
      data: [],
      mes: "Something Wrong",
    });
  }
});

// product Api
app.post("/addproduct", async (req, res) => {
  image.single("image")(req,res,(err)=>{
    if(err) throw err
  })
  try {
    let temp1 = new Product({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      userId: req.body.userId,
      company: req.body.company,
    });
    const temp = await temp1.save();
    res.json({
      status: 200,
      data: temp,
      mes: "Users add data succussfully",
    });
  } catch {
    res.json({
      status: 403,
      data: [],
      mes: "Something Wrong",
    });
  }
});

// product listing api
app.get("/products", async (req, res) => {
  try {
    let products = await Product.find();
    if (products.length > 0) {
      res.json({
        status: 200,
        data: products,
        mes: "Users add data succussfully",
      });
    } else {
      res.json({
        status: 403,
        data: [],
        mes: "No Products found",
      });
    }
  } catch {
    res.json({
      status: 403,
      data: [],
      mes: "Something Wrong",
    });
  }
});

// Delete product api
app.delete("/product/:_id", async (req, res) => {
  console.log(req.params._id);
  try {
    let result = await Product.deleteOne({ _id: req.params._id });
    res.json({
      status: 200,
      data: result,
      mes: "Product delete succussfully",
    });
    console.log(result);
  } catch {
    res.json({
      status: 403,
      data: [],
      mes: "Something Wrong",
    });
  }
});

// Update get api find id
app.get("/product/:_id", async (req, res) => {
  try {
    let products = await Product.findOne({ _id: req.params._id });
    if (products) {
      res.json({
        status: 200,
        data: products,
        mes: "product updated succussfully",
      });
    } else {
      res.json({
        status: 403,
        data: [],
        mes: "No Record found",
      });
    }
  } catch {
    res.json({
      status: 403,
      data: [],
      mes: "Something Wrong",
    });
  }
});

// product update put api
app.put("/product/:_id", async (req, res) => {
  try {
    console.log("this is request", req.body);

    let products = await Product.findByIdAndUpdate(
      { _id: req.params._id },
      { $set: req.body }
    );
    console.log(products);
    res.json({
      status: 200,
      data: products,
      mes: "product updated succussfully",
    });
  } catch {
    res.json({
      status: 403,
      data: [],
      mes: "Something Wrong",
    });
  }
});

// Search Api
app.get("/search/:key", async (req, res) => {
  let result = await Product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
    ],
  });
  res.send(result);
});

// pagination api

app.get("/pagination", async (req, res) => {
  try {
    const PAGE_SIZE = req.query.data_size|| "10";
    const page = parseInt(req.query.page || "1");
    const total = await Product.countDocuments({})
    let products = await Product.find({}).limit(PAGE_SIZE).skip(PAGE_SIZE * (page-1));
    if (products.length > 0) {
      res.json({
        status: 200,
        data: {products,total},
        mes: "Users add data succussfully",
      });
    } else {
      res.json({
        status: 403,
        data: [],
        mes: "No Products found",
      });
    }
  } catch {
    res.json({
      status: 403,
      data: [],
      mes: "Something Wrong",
    });
  }
});



function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(' ')[1];
    Jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.send({ result: "Please add  valid token" });
      } else {
        next();
      }
    });
  } else {
    res.send({ result: "Please add token" });
  }
  console.log("middleware called", token);
}



app.listen(5500);
