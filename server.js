const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static('public'));

// routes
app.use('/auth', require('./routes/auth'));
app.use('/items', require('./routes/items'));
app.use('/uploads', express.static('uploads'));
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});