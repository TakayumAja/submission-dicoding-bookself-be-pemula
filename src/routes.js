const {
  createBook,
  getAllBooks,
  getDetailBook,
  updateBook,
} = require("./handler");

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: createBook,
  },
  {
    method: "GET",
    path: "/books",
    handler: getAllBooks,
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: getDetailBook,
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: updateBook,
  },
];

module.exports = routes;
