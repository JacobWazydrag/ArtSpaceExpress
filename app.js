const express = require('express');
const mongoose = require('mongoose') 
require('dotenv').config();


//app
const app = express();

//db connection
mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  )
  .then(() => console.log('DB Connected'));
   
  mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
  });

//routes
app.get('/', (req, res) => {
    res.send('hello from node');
});


//grabbing port from env file or 8000 by default
const port = process.env.PORT || 8000

//run the app
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})