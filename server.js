// External Module
require('dotenv').config(); 
const express = require('express');
const app = express();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


// Core Module
const path = require('path');
const fs = require('fs');

// Local Module
const rootDir = require('./utils/pathUtils');
const  { storeRouter } = require('./Router/storeRouter');
const  { authRouter } = require('./Router/authRouter');
const  { hostRouter } = require('./Router/hostRouter');
const { default: mongoose } = require('mongoose');


app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(express.urlencoded());

// Multer for Custom Photos.
const randomString = (len) => {
    let res = '';
    const aplha = "asdfghjklqwertyuiopzxvbnm";

    for (i = 0; i < len; i++) {
        res += aplha[Math.floor(Math.random() * aplha.length)];
    }
    return res;
}


const storage = multer.diskStorage({
    
    destination : (req, file, cb) => {
        if (!req.uploadDir) {
            let uniqueName = randomString(15);
            let folderPathToStoreImages = path.join("uploads", uniqueName);
            
            if (!fs.existsSync(folderPathToStoreImages)) {
                fs.mkdirSync(folderPathToStoreImages, {recursive : true})
            }
            req.uploadDir = folderPathToStoreImages;
        }
        cb(null, req.uploadDir);
    },

    filename : (req, file, cb) => { 
        if (file.mimetype.startsWith('image/')) {
            cb(null, randomString(20) + '-' + path.extname(file.originalname));
        }
    }
});


const fileFilter = (req, file, cb) => {
    const allowedType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (allowedType.includes(file.mimetype)){
        cb(null, true);
    } else {
        cb(null, false);
    }
}


const multerOptions = {
    storage,
    fileFilter
}

app.use(multer(multerOptions).fields([
    {name : 'mainImage', maxCount : 1},
    {name : 'photoUrl', maxCount : 4}
])); // 5 is the maximum number of files that can be uploaded at once.


app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/homesdetails/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/favourites', express.static(path.join(rootDir, 'uploads')));
app.use('/reserve', express.static(path.join(rootDir, 'uploads')));
app.use('/search', express.static(path.join(rootDir, 'uploads')));
app.use('/host/uploads', express.static(path.join(rootDir, 'uploads')));
app.use(express.static(path.join(rootDir, 'public')));



const store = new MongoDBStore({
    uri: process.env.MONGOURL,
    collection: 'sessions'
});


app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie : {
        maxAge : 1000 * 60 * 60 * 24 // 1 day
    }
}));


app.use((req, res, next) => {
    req.isLoggedIn = req.session.isLoggedIn;
    next();
});


app.use(authRouter);
app.use(storeRouter);

app.use('/host', (req, res, next) => {
    if(req.isLoggedIn){
        next();
    } else {
        return res.redirect('/login');
    }
});

app.use(hostRouter);



app.use((req, res, next) => {
    res.render('404', {pageTitle : 'page Not Found', isLoggedIn: req.isLoggedIn});
});



const port = 3002;
mongoose.connect(process.env.MONGOURL).then(() => {
    console.log('Database Is Connected');
    app.listen(port, () => {
        console.log(`Server Running at http://localhost:${port}`);
    })
}).catch((err) => {
    console.log('Error While Connecting To database', err);
});



// app.listen(port, () => {
//     console.log(`Server Running at http://localhost:${port}`);
// });