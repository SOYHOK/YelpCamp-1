if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/users');
const khmerfoodRoutes = require('./routes/khmerfoods');
const reviewRoutes = require('./routes/reviews');
const videoRoutes = require('./routes/videos');
const meatuphumRoutes = require('./routes/meatuphums');
const tbalkhmerRoutes = require('./routes/talkhmers')

mongoose.connect('mongodb://127.0.0.1:27017/khmerfoods', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('Database connected');
}
);
const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}))
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';


const sessionConfig = {
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/khmerfoods', khmerfoodRoutes)
app.use('/khmerfoods/:id/reviews', reviewRoutes)

app.use('/tbalkhmers', tbalkhmerRoutes)
app.use('/tbalkhmers/:id/reviews', reviewRoutes)
app.use('/meatuphums', meatuphumRoutes)
app.use('/meantuphums/:id/reviews', reviewRoutes)
app.use('/videos', videoRoutes)

app.get('/', (req, res) => {
    res.render('homes')
});

app.get('/home', (req, res) => {
    res.render('home')
});

app.get('/order', (req, res) => {
    res.render('order')
}
);


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
