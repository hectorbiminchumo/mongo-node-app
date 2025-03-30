require("dotenv").config();
const PORT = process.env.PORT || 5001;
const express = require("express");

const bookRoutes = require("./routes/books");

const app = express();

// import db
const connectDB = require('./config/db')

connectDB()
app.use(express.json());

//Routes
app.use("/books", bookRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


module.exports = app;