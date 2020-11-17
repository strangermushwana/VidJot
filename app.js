const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('./models/Idea')

const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected')
}).catch(err => {
    console.log(error)
})

// Load Idea Model
const Idea = mongoose.model('ideas');

//  Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    runtimeOptions: {
          allowProtoPropertiesByDefault: true,
          allowProtoMethodsByDefault: true}}));
          
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Index Route
app.get('', (req, res) => {
    const title = 'Wecome';
    res.render('index', {title});
})

// About Route
app.get('/about', (req, res) => {
    res.render('about');
})

// Idea Index Page
app.get('/ideas', (req, res) => {
    Idea.find({}).sort({date: 'desc'}).then(ideas => {
        res.render('ideas/index', {
            ideas
        })
    })
})

// Add Idea Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
})

// Process Form
app.post('/ideas', (req, res) => {
    let errors = []
    if (!req.body.title) {
        errors.push({text: 'Please add a title'})
    }
    if (!req.body.details) {
        errors.push({text: 'Please add some details'})
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
        errors,
        title: req.body.title,
        details: req.body.details})
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
       new Idea(newUser).save().then(idea => {
           res.redirect('/ideas')
       })
    }
})

const PORT = 3000;
app.listen(PORT, () => { console.log(`Server started on port ${PORT}`); });