const path = require('path');
const express = require('express');
require('dotenv').config();
const port = process.env.PORT || 5000;
const connectDB = require('./config/db');

connectDB();
const app = express();

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));
//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the weather station' });
});

const readingsRouter = require('./routes/readings');
app.use('/weatherstation/reading', readingsRouter);

app.listen(port, () => console.log(`Server listening on our port ${port}`));
