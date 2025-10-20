const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose  = require('mongoose');

const cookieParser = require('cookie-parser');

const app = express();
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
    }
));
app.use(express.json());
app.use(bodyParser.json())
app.use(cookieParser());


app.use('/api/products', require('./routes/ProductRoutes'));
app.use('/api/auth', require('./routes/AuthRoutes'));
app.use('/api/invoices', require('./routes/InvoiceRoutes'));
app.get('/', (req, res) => res.send('Inventory & Sales API'));

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected to dsatabase");
    app.listen(3000, () => console.log('Server running on port 3000'));
}).catch((err) => {
    console.log(err);
})