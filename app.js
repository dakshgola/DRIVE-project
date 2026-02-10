const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;

// Database connection
const connectDB = require('./config/db');
connectDB();

// Middleware (should be BEFORE routes)
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// Import routes
const userRoutes = require('./routes/user.routes');
const indexRouter = require('./routes/index.routes');

// Use routes
app.use('/user', userRoutes); // Changed userRouter to userRoutes
app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});