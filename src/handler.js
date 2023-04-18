const { nanoid } = require('nanoid');
const databaseBooks = require('./books');

// ====== CREATE BOOK ======
const createBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined || !name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  databaseBooks.push(newBook);

  const successCreateBook = databaseBooks.filter((book) => book.id === id).length > 0;

  if (successCreateBook) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// ====== FETCH ALL BOOK ======
const getAllBooksHandler = (request, h) => {
  const { reading, name, finished } = request.query;
  let databaseBooksFilter = databaseBooks;

  if (name !== undefined) {
    databaseBooksFilter = databaseBooks.filter((book) => book
      .name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    databaseBooksFilter = databaseBooks.filter((book) => book.reading === (reading === '1'));
  }

  if (finished !== undefined) {
    databaseBooksFilter = databaseBooks.filter((book) => book.finished === (finished === '1'));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: databaseBooksFilter.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// ====== FETCH DETAIL BOOK ======
const getDetailBookHandler = (request, h) => {
  const { bookId } = request.params;
  const findBook = databaseBooks.filter((book) => book.id === bookId)[0];
  if (findBook !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book: findBook,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

// ====== UPDATE BOOK ======
const updateBookHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const findIndexBook = databaseBooks.findIndex((book) => book.id === bookId);
  if (findIndexBook !== -1) {
    if (name === undefined || !name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    const updatedAt = new Date().toISOString();

    databaseBooks[findIndexBook] = {
      ...databaseBooks[findIndexBook],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// ====== DELETE BOOK ======
const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;
  const findIndexBook = databaseBooks.findIndex((book) => book.id === bookId);

  if (findIndexBook !== -1) {
    databaseBooks.splice(findIndexBook, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  createBookHandler,
  getAllBooksHandler,
  getDetailBookHandler,
  updateBookHandler,
  deleteBookHandler,
};
