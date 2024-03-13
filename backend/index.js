const port = 3000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
// const { error } = require("console");
const stripe = require("stripe")(
  "sk_test_51OtWHKSAc6aIc4xECJDyVxLUcFU2HBmqMnPUuIl9J6WjvAyIixPP8ruHEiFhKZvtqLRGVxJI25lkEYwClHgwFZGN00KzbXpmkt"
);

app.use(express.json());
app.use(cors());

//Database COnnection With MongoDB
mongoose.connect(
  "mongodb+srv://shwetasajjan92:4L92SaNVChyo9qL6@cluster0.nwmiiae.mongodb.net/shopplusplus"
);

//API creation

app.get("/", (req, res) => {
  res.send("Express App is Running");
});

//Image Storage Engine

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

const Product = mongoose.model("Product", {
  id: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  available: {
    type: Boolean,
    default: true,
  },
});

app.post("/addProduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }

  const product = await Product.create({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  console.log(product);
  console.log("saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

app.delete("/removeProduct/:id", async (req, res) => {
  const id = req.params.id;
  await Product.findOneAndDelete({
    id,
  });
  console.log("Removed");
  res.json({
    success: true,
  });
});

app.get("/allProducts", async (req, res) => {
  let products = await Product.find({});
  res.send(products);
});

const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  orders: [
    {
      products: [],
      address: {},
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

app.post("/signup", async (req, res) => {
  let success = false;
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res
      .status(400)
      .json({ success: false, errors: "Existing user found with this email" });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();
  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

app.post("/login", async (req, res) => {
  let success = false;
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };

      console.log(user.id);
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      return res.status(400).json({
        success: false,
        errors: "Please try again with correct email/password",
      });
    }
  } else {
    return res.status(400).json({
      success: success,
      errors: "Please try with correct email/password",
    });
  }
});

app.get("/newCollections", async (req, res) => {
  let products = await Product.find({});
  let arr = products.slice(1).slice(-8);
  console.log("New Collections");
  res.send(arr);
});

app.get("/popularInWomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popularInWomen = products.splice(0, 4);
  console.log("Popular In Women");
  res.send(popularInWomen);
});

const findUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res
      .status(401)
      .send({ error: "Please authenticate using a valid token ***" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ error: "Please authenticate using a valid token ----" });
    }
  }
};
app.get("/orders", findUser, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const user = await Users.findOne({ _id: userId }).sort({ createdAt: -1 });
    console.log(user.orders);

    res.status(200).json(user.orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/addToCart", findUser, async (req, res) => {
  console.log("Add Cart");
  console.log(req.body);
  console.log(req.user);
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send({ success: true, message: "Item added to cart successfully" });
});

app.post("/removeFromCart", findUser, async (req, res) => {
  console.log("Remove Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0) {
    userData.cartData[req.body.itemId] -= 1;
  }
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send({ success: true, message: "Item removed from cart successfully" });
});

app.post("/getCart", findUser, async (req, res) => {
  console.log("Get Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

app.post("/createCheckoutSession", findUser, async (req, res) => {
  const products = req.body.body.products;
  const address = req.body.body.address;
  console.log("address", address);
  console.log("products", products);
  console.log(req.user);
  const lineItems = products.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
        images: [product.image],
      },

      unit_amount: Math.round(product.new_price * 100),
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "KE"],
    },
    mode: "payment",
    success_url: `http://shopplusplus.s3-website-us-east-1.amazonaws.com/checkout-success`,
    cancel_url: `http://shopplusplus.s3-website-us-east-1.amazonaws.com/not-found`,
  });
  res.json({ id: session.id });

  if (session.id) {
    const userId = req.user.id;

    try {
      await Users.findByIdAndUpdate(
        userId,
        {
          $push: { orders: { products, address, date: Date.now() } },
        },
        { new: true }
      );

      console.log("Order and address saved successfully for user:", userId);
    } catch (error) {
      console.error("Error saving order and address:", error);
    }
  }
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on Port " + port);
  } else {
    console.log(`Error : ${error}`);
  }
});
