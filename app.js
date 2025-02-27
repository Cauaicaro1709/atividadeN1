var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config()
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.URI);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/api/quizzes', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('data');
    const quizzesCollection = db.collection('questions');
    const quizzes = await quizzesCollection.find({}).toArray();
    res.json(quizzes);
  } catch (err) {
    res.status(500).send('Error fetching quizzes');
  } finally {
    await client.close();
  }
});

app.post('/api/quizzes', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('data');
    const quizzesCollection = db.collection('questions');
    const newQuiz = req.body; // This should be the data from the client

    await quizzesCollection.insertOne(newQuiz);
    res.status(201).send('Quiz added successfully');
  } catch (err) {
    res.status(500).send('Error adding quiz');
  } finally {
    await client.close();
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
