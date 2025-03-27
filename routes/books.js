const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

// 📌 Add a new book
router.post("/add", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📌 Search book by title (Uses Indexing)
router.get("/search", async (req, res) => {
  try {
    const { title } = req.query;
    const books = await Book.find({ title: title });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📌 Aggregation: Count books by category
router.get("/count-by-category", async (req, res) => {
  try {
    const result = await Book.aggregate([
      { $group: { _id: "$category", totalBooks: { $sum: 1 } } }
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
