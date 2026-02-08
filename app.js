const express = require('express');
const userRoutes = require('./routes/user.routes');
const app = express();
const port = 3000;


app.set('view engine', 'ejs');
app.use('/user', userRoutes);
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies



app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
}); 