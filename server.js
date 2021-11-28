const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const education = require('./models/education');
const occupation = require('./models/occupation');

require('dotenv').config();

const app = express(),
    port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/jssapp', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
}, err => {
    if (err)
        console.log(err)
});

mongoose.connection.once('open', () => console.log('Successfully connected to database'));

app.use(helmet());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const _id = req.signedCookies.patient;

    if (_id)
        return res.redirect('/dashboard');

    const Education = await education.find({}),
        Occupation = await occupation.find({});
    const educationList = Education.map(each => ({
            _id: each._id,
            education: each.education
        })),
        occupationList = Occupation.map(each => ({
            _id: each._id,
            occupation: each.occupation
        }));

    res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline' https://code.jquery.com https://maxcdn.bootstrapcdn.com");
    res.render('index', {
        educationList,
        occupationList
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('patient');
    res.redirect('/');
});

app.use('/signup', require('./routes/signup'));
app.use('/login', require('./routes/login'));
app.use('/registration', require('./routes/registration'));
app.use('/dashboard', require('./routes/dashboard'));

//Route to send downloadable resources
app.use('/resources', require('./routes/resources'));

//Only admin access to modify db
app.use('/admin/occupation_data', require('./routes/occupation_data'));
app.use('/admin/education_data', require('./routes/education_data'));
app.use('/admin/income_data', require('./routes/income_data'));
app.use('/admin/socio_economic_status_data', require('./routes/socio_economic_status_data'));
app.use('/admin/calorie_data', require('./routes/calorie_data'));
app.use('/admin', require('./routes/admin'));


app.listen(port, console.log(`Successfully connected to port ${port}`));