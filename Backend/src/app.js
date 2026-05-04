const express = require('express');
const multer = require('multer');
const app = express();
const postModel = require('./models/post.model');
app.use(express.json());
const cors = require('cors');
app.use(cors());

const uploadFile = require('./services/storage.service');

const upload = multer({ storage: multer.memoryStorage() });

app.post('/create-post', upload.single('image'), async (req, res) => {
    const result = await uploadFile(req.file.buffer);

    const post = await postModel.create({
        title: result.url,
        caption: req.body.caption,
    });

    res.status(201).json({
        message: 'Post created successfully',
        imageUrl: result.url,
        data: post
    });
});


app.get('/posts', async (req, res) => {
    const posts = await postModel.find();
    res.status(200).json({
        message: 'Posts retrieved successfully',
        data: posts
    });
});

module.exports = app;