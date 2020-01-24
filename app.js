const express = require("express");
let mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

//importing routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const braintreeRoutes = require("./routes/braintree");
const orderRoutes = require("./routes/order");
const app = express();

//db connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("DB Connected"));

mongoose.connection.on("error", err => {
  console.log(`DB connection error: ${err.message}`);
});

//using userRoutes middleware
//we can use api convension as prefix before rote begins
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(expressValidator());
//client front will runs on differrent port thn 8000 so api url path will wrong to avoid that we have to use cors
app.use(cors());
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", braintreeRoutes);
app.use("/api", orderRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`your app is running on port  ${port}`);
});
