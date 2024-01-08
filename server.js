const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

// Config
const { database, port, sessionSecret } = require('./hooks/config');

// Routes
const userRoute = require('./routes/user');

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  req.db = database;
  next();
});

app.use(session({
  key: "userid",
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60 * 60 * 24 * 30
  }
}))

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Landing page');
})

// Use routes
app.use('/user', userRoute);