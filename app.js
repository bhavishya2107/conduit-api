var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');


var apiRouter = require('./routes/api/index');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true },
  (err) => {
    console.log('Connected', err ? false : true);
  })

var app = express();



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', apiRouter);

module.exports = app;
