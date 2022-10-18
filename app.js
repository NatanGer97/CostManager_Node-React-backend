const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const expensesRouter = require('./routes/expenses');
const categoriesRouter = require('./routes/categories');
const ExpressError = require('./utils/ExpressError');
const jwt = require('jsonwebtoken');
const cors = require('cors');

dotenv.config({path:'./config.env'});

const connectionURI = 'mongodb+srv://Natan:1234@cluster0.palxhoz.mongodb.net/expense-tracker';
mongoose.connect(process.env.uri);
const db = mongoose.connection;
db.on('error', ()=> {
    console.log("Error");
});

db.once('open', ()=>
{
    console.log("DB Connected");
    console.log(process.env.PORT);
});



const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/expenses', expensesRouter);
app.use('/categories', categoriesRouter);


// for every single request with every path
app.all('*', (req, res, next) => {
    next(new ExpressError('error, not found', 404));
    
});
app.use(function (err, req, res, next) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({message:"token expired, please refresh..."});
    } else {
      next(err);
    }
  });

app.use((err, req, res, next)=>{
    const {statusCode = 500} = err;
    const {name = "Exception"} = err;

    if(!err.message) {
        err.message = "something get wrong";
    }
    res.status(statusCode).json({"error-name":name,"error-code": statusCode, "message": err.message});
})

module.exports = app;
