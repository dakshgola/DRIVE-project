const express = require('express'); 
const router = express.Router();
const{body, validationResult} = require('express-validator');

router.get('/register', (req, res) => {
    res.render('register');   // Render the register.ejs view
});

router.post('/register', 
    body('email').trim().isEmail(),
    body('password').trim().isLength({ min: 6 }),
    body('username').trim().notEmpty(),



    (req, res) => {

    const errors = validationResult(req);
    console.log(req.body)
    res.send('Registration successful!'); 
    // Handle form submission

});

module.exports = router;  