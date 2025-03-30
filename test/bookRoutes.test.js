const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server"); // Import your Express server
const Book = require("../models/Book");

let mongoServer;
let server;

// 🏗️ Setup and teardown of MongoDB Memory Server
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

   // 🔥 Ensure we disconnect before connecting to avoid conflicts
   if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  await mongoose.connect(mongoUri);

  server = app.listen(3001)
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close()
});

describe("📚 Book API Tests", () => {
  
  // 1️⃣ Test Adding a Book
  test("✅ Should add a new book", async () => {
    const response = await request(server).post("/books/add").send({
      title: "Test Book",
      author: "John Doe",
      year: 2023,
      category: "Fiction",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.title).toBe("Test Book");
  });

  // 2️⃣ Test Searching a Book by Title
  test("✅ Should return a book when searched by title", async () => {
    await Book.create({
      title: "Harry Potter",
      author: "J.K. Rowling",
      year: 2001,
      category: "Fantasy",
    });

    const response = await request(app).get("/books/search?title=Harry Potter");
    
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Harry Potter");
  });

  // 3️⃣ Test Counting Books by Category
  test("✅ Should return book count by category", async () => {
    await Book.create([
      { title: "Book1", author: "Author1", year: 2020, category: "Science" },
      { title: "Book2", author: "Author2", year: 2021, category: "Science" },
    ]);

    const response = await request(app).get("/books/count-by-category");
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ _id: "Science", totalBooks: 2 }),
    ]));
  });
});
