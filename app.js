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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const userRoutes = require('./routes/user.routes');
const indexRouter = require('./routes/index.routes');
const fileRoutes = require('./routes/file.routes'); // Add this line

// Use routes
app.use('/user', userRoutes);
app.use('/', indexRouter);
app.use('/api', fileRoutes); // Add this line

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});