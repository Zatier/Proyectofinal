const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');



//Inits
const app = express();
require('./database');
require('./passport/local-auth');

//settings
app.set('views',path.join(__dirname,'views'));
app.engine('ejs',engine);
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extend: false}));
app.use(session({
    secret: 'MyfisrstProject',
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.use(express.static('files'));

app.use((req,res,next) => {
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.user = req.user;
    next();
})

//Routes
app.use('/',require('./routes/index'));
require('./routes/index');

//starting the server
app.listen(app.get('port'),()=>{
    console.log('Server on Port', app.get('port'));
});