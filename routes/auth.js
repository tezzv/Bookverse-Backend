const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const { JWT_SECRET } = require('../config/keys');

// ROUTE 1: Create a user using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.password, salt);
        // Create a new user
        user = await User.create({
            name: req.body.name,
            password: secpass,
            email: req.body.email,
        })
        // res.json(user)
        const data = {
            user: {
                id: user.id
            }
        }

        // generate JWT Token
        // const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: "30d" });
        const authtoken = jwt.sign(data, JWT_SECRET);
        // console.log(authtoken);


        res.json({ authtoken });

    } catch (error) {
        // console.error(error.message);
        res.status(500).send("Internal server Error");
    }

})

// ROUTE 2: Authenticate a user using: POST "/api/auth/login". No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        // Check whether the user with this email exists already
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct credentials" })
        }

        // res.json(user)
        const data = {
            user: {
                id: user.id
            }
        }

        // generate JWT Token
        // const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: "30d" });
        const authtoken = jwt.sign(data, JWT_SECRET);
        // console.log(authtoken);


        res.json({ authtoken });

    } catch (error) {
        // console.error(error.message);
        res.status(500).send("Internal server Error");
    }

})

// ROUTE 3: Get logged user Details: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user);
    } catch (error) {
        // console.error(error.message);
        res.status(500).send("Internal server Error");
    }

})


module.exports = router