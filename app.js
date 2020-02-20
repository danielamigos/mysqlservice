var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var indexRouter = require('./routes/index');
var ldapRouter = require('./routes/ldap');
var productosRouter = require('./routes/productos');

var app = express();

var cors = require('cors')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/ldap', ldapRouter);
app.use('/productos', productosRouter);

module.exports = app;
