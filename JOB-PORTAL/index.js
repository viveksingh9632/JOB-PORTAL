


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./passport-config'); // Include passport-config.js
const path = require('path');

const app = express();
 const PORT = process.env.PORT || 8080;



// Session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', error => console.error('MongoDB connection error:', error));
db.once('open', () => console.log('Connected to the database!'));

app.use(express.urlencoded({extended:false}))
app.use(express.json());


app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');


 var adminPages = require('./routes/admin_pages.js');
var job_categories = require('./routes/job_categories.js');
var countrie = require('./routes/countries.js');
var citie = require('./routes/cities.js');
var employer = require('./routes/employers.js');
var jobs = require('./routes/jobs.js');
var employes = require('./routes/employes.js');
app.use('/', adminPages);
app.use('/', job_categories);
app.use('/', countrie);
app.use('/', citie);
app.use('/', employer);
app.use('/', jobs);
app.use('/', employes);





app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
