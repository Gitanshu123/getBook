const express = require("express");
const app = express();
const cors = require("cors"); 
require("dotenv").config();
const User = require("./routes/user");
const Book = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");
const bodyParser = require('body-parser');


app.use(bodyParser.json());

app.use(cors());
// Import and invoke the MongoDB connection
const connectDB = require("./conn/conn");
connectDB();

// Middleware to parse JSON (if needed for your API)
app.use(express.json());

// Example route
app.get("/", (req, res) => {
    res.send("Hello from backend side");
});

//routes
app.use("/api/v1", User);
app.use("/api/v1", Book);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);

// Creating port
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
});