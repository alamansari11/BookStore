import express from 'express';
import { Book } from '../models/bookModel.js';

const router = express.Router();

function validate_book_data(data) {
  return data.title && data.author && data.publishYear;
}

// for saving books to database
router.post('/', async (request, response) => {
  try {
    // check for any missing parameters
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(404).send({
        message: 'Please provide title, author and publishYear',
      });
    }
    // if no error create new object of book
    const newBook = Book({
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
    });
    // save the book in the database
    const book = await Book.create(newBook);
    return response.status(201).send(book);
  } catch (error) {
    // console.log(error.message);
    return response.status(500).send({
      message: error.message,
    });
  }
});

// for saving book in bulk request
router.post('/bulk-save', async (request, response) => {
  try {
    // console.log(request.body)
    let data = request.body;
    let validated_list = data.filter(validate_book_data);
    if (validated_list.length < data.length) {
      return response.status(404).send({
        message: 'Please provide valid book data',
      });
    } else {
      const books = await Book.insertMany(validated_list);
      return response.status(201).send(books);
    }
  } catch (error) {
    // console.log(error.message);
    return response.status(500).send({
      message: error.message,
    });
  }
});
// route to get all books
router.get('/', async (request, response) => {
  try {
    const books = await Book.find({});
    return response.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    return response.status(500).send({
      message: error.message,
    });
  }
});

// route to get a books by id
router.get('/:id', async (request, response) => {
  try {
    const id = request.params.id;
    console.log(id);
    const books = await Book.findById(id);
    return response.status(200).json(books);
  } catch (error) {
    return response.status(500).send({
      message: error.message,
    });
  }
});

// Route to update books
router.put('/:id', async (request, response) => {
  try {
    if (validate_book_data(request.body)) {
      const id = request.params.id;
      const result = await Book.findByIdAndUpdate(id, request.body);
      if (!result) {
        return response.status(400).json({ message: 'Book not found' });
      } else {
        return response
          .status(200)
          .send({ message: 'Book updated successfully' });
      }
    } else {
      return response.status(404).send({
        message: 'Please provide valid book data',
      });
    }
  } catch (error) {
    return response.status(500).send({
      message: error.message,
    });
  }
});

// route to delete the book
router.delete('/:id', async (request, response) => {
  try {
    const id = request.params.id;
    const result = await Book.findByIdAndDelete(id);
    if (!result) {
      return response.status(400).json({ message: 'Book not found' });
    }
    return response.status(404).send({ message: 'Book deleted Successfuly' });
  } catch (error) {
    return response.status(500).send({
      message: error.message,
    });
  }
});

export default router;