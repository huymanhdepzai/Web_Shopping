const express = require('express');
const path = require('path');
const searchRoute = require('./routes/search');

const app = express();

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'ShopWeb')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'ShopWeb', 'index.html'));
});

app.use(express.json());
app.use('/search', searchRoute);

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT);
});
