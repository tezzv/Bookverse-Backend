const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Books = require('../models/Books');
const bodyParser = require('body-parser');

// ROUTE 1: Get All the Books using: Get "/api/books/fetchallbooks". Login not required
router.get('/fetchallbooks', async (req, res) => {
    try {

        const books = await Books.find();

        res.json(books);

    } catch (error) {
        // console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.get('/fetchallbooksofuser', fetchuser, async (req, res) => {
    try {
        // await console.log(req.user.id);
        const books = await Books.find({
            user: req.user.id,
        })
        // console.log(books);
        res.json(books);
    } catch (error) {
        res.status(500).send("internal Server Error")
    }
})
// ROUTE 2: Add a new Book: POST "/api/books/addbook". Login required
router.post('/addbook', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {

        // If there are errors, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, author, uploadedby, price, genre, coverlink, pdflink } = req.body;


        const book = new Books({
            title, description, author, uploadedby, price, genre, coverlink, pdflink, user: req.user.id
        })



        const savedBook = await book.save();

        res.json(savedBook);

    } catch (error) {
        // console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 3: Update an existing Book using: PUT "/api/books/updatebook". Login required
router.put('/updatebook/:id', fetchuser, async (req, res) => {
    try {

        const { title, description, author, uploadedby, price, genre, coverlink, pdflink } = req.body;
        // create a newBook object

        const newBook = {};
        if (title) { newBook.title = title };
        if (description) { newBook.description = description };
        if (author) { newBook.author = author };
        if (uploadedby) { newBook.uploadedby = uploadedby };
        if (price) { newBook.price = price };
        if (genre) { newBook.genre = genre };
        if (coverlink) { newBook.coverlink = coverlink };
        if (pdflink) { newBook.pdflink = pdflink };



        // Find the book to be updated and update it
        let book = await Books.findById(req.params.id);
        if (!book) { return res.status(404).send("Not found") };

        // console.log(book.user.toString());
        // console.log(req.user.id);


        if (book.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        book = await Books.findByIdAndUpdate(req.params.id, { $set: newBook }, { new: true });

        res.json({ book });

    } catch (error) {
        // console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// ROUTE 4: Delete an existing Book using: DELETE "/api/books/deletebook". Login required
router.delete('/deletebook/:id', fetchuser, async (req, res) => {
    try {

        // Find the book to be deleted and delete it
        let book = await Books.findById(req.params.id);
        if (!book) { return res.status(404).send("Not found") };

        // console.log(book.user.toString());
        // console.log(req.user.id);


        if (book.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        book = await Books.findByIdAndDelete(req.params.id);

        res.json({ "Success": "Book has been deleted", book: book });

    } catch (error) {
        // console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 5: Get an existing Book using: get "/api/books/bookdetail". Login not required
router.get('/bookdetail/:id', async (req, res) => {
    try {

        // Find the book 
        let book = await Books.findById(req.params.id);
        if (!book) { return res.status(404).send("Not found") };

        // console.log(book.user.toString());

        res.json({ book });

    } catch (error) {
        // console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Apply bodyParser middleware to parse JSON bodies for all routes under /api/books
router.use(bodyParser.json());

// ROUTE 6: Get an existing Book using: get "/api/books/search". Login not required on search
router.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm;
        console.log(searchTerm);
        let query = {};
        if (searchTerm) {
            query = {
                $or: [
                    { title: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } },
                    { uploadedby: { $regex: searchTerm, $options: 'i' } },
                    { author: { $regex: searchTerm, $options: 'i' } },
                    { genre: { $regex: searchTerm, $options: 'i' } },
                    // Add more fields to search as needed
                ],
            };
        }
        const books1 = await Books.find(query);
        console.log(books1)
        res.json(books1);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

module.exports = router