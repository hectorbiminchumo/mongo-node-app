const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true }, // Index for fast search
  author: { type: String, required: true },
  year: { type: Number, required: true },
  category: { type: String, required: true }
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
