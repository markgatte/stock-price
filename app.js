require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT;
const path = require('path');
const index = require('./routes/index');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const app  = express();
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
  }
}));
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'pug');
app.use(express.static('./'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use('/', index);

app.listen(PORT || 3000);