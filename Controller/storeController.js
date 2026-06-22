const validator = require('validator');
const Home = require('../model/homes');
const user = require('../model/user');
const User = require('../model/user');
const mongoose = require('mongoose');



exports.getIndexpage = async (req, res, next) => {
    try {

        if (req.session.isLoggedIn) {

            const userId = req.session.myUser.id;
            const homes = await Home.find();
            const user = await User.findById(userId);
            
            return res.render('store/index', {
                pageTitle : 'Home page',
                homes : homes,
                favourites : user.favourites,
                isLoggedIn : req.isLoggedIn,
                user : req.session.myUser
            });
        } else {

            const homes = await Home.find();
            return res.render('store/index', {
                pageTitle : 'Home page',
                homes : homes,
                favourites : user.favourites,
                isLoggedIn : false,
                user : req.session.myUser
            });
        }
    } catch(err) {
        console.log("Error At Home Page", err);
        return next(err);
    }
}

exports.getHomesDetailspage = (req, res, next) => {
    const homeId = req.params.homeId;
    Home.findById(homeId).then(home => {
        res.render('store/homedetailspage', {
            pageTitle : 'Home Details',
            home : home,
            isLoggedIn : req.isLoggedIn,
            user : req.session.myUser
        });
    });
}

exports.getfavouitespage = async (req, res, next) => {

    try {

        if (req.session.isLoggedIn) {
            const userId = req.session.myUser.id;
            const user = await User.findById(userId).populate('favourites');
            return res.render('store/favourites', {
                pageTitle : 'Favourites page',
                favourites : user.favourites,
                isLoggedIn : req.isLoggedIn,
                user : req.session.myUser
            });

        } else {
            return res.render('store/favourites', {
                pageTitle : 'Favourites page',
                favourites : user.favourites,
                isLoggedIn : req.isLoggedIn,
                user : req.session.myUser
            });
        }

    } catch (err) {
        console.log('Fetching Favourites Error', err);
        return res.redirect('/favourites');
    }

}



exports.AddFavourite = async (req, res, next) => {
    const productId = req.params.productId;

    if (req.session.isLoggedIn) {
        // Session sy userId Ki base user search karna
        const userId = req.session.myUser.id;
        const user = await User.findById(userId);

        // favourites mein productId ka index pata karna agar hai tu index warna -1
        const index = user.favourites.indexOf(productId);

            if (index === -1) {
                user.favourites.push(productId);    // Add New fav
            } else {
                user.favourites.splice(index, 1);   //Remove fav
            }

        await user.save();
        // Page Reload Nahi Hoga.
        return res.redirect(req.get('referrer') || '/');
    } else {
        return res.redirect('/login')
    }
}


exports.getbookingspage = async (req, res, next) => {
    try {
    if (req.session.isLoggedIn) {
        const userId = req.session.myUser.id;
        const user = await User.findById(userId);
        // console.log(userId, user);

        const homeId = user.bookings;

        if (user.bookings.length === 0) {
            return res.render('store/bookings', {
                pageTitle : 'Bookings page',
                homes : [],
                isLoggedIn : req.isLoggedIn,
                user : req.session.myUser
            });
        } else {
            const bookedHomes = await Home.findById(homeId).populate(' bookings');
            console.log("Booked Homes", bookedHomes);
            return res.render('store/bookings', {
                pageTitle : 'Bookings page',
                homes : bookedHomes,
                isLoggedIn : req.isLoggedIn,
                user : req.session.myUser
            });
        }
    
    } else {
        return res.redirect('/login');
    }
    } catch (err) {
        console.error("Error While Fetching Bookings", err);
    }
}


exports.postSearchPage = async (req, res, next) => {
    const location = req.body.location.trim();

    if (typeof location !== 'string') {
        return res.redirect('/');
    }

    const homes = await Home.find({location : location});
    
    if (req.session.isLoggedIn) {
        const userId = await req.session.myUser.id;
        const user = await User.findById(userId);

            return res.render('store/searchedItems', {
            pageTitle : 'searched Results',
            homes : homes,
            favourites : user.favourites,
            isLoggedIn : req.isLoggedIn,
            user : []
        });
    }

    return res.render('store/searchedItems', {
        pageTitle : 'searched Results',
        homes : homes,
        favourites : [],
        isLoggedIn : req.isLoggedIn,
        user : []
    })
}


exports.postPaymentPage = async (req, res, next) => {
    try {

        if (req.session.isLoggedIn) {
            const homeId = req.body.bookingHomeId;
            const home = await Home.findById(homeId);
            // console.log("Home Details", home);
            return res.render('store/payment', {
                home : home,
                pageTitle : 'Payment page',
                isLoggedIn : req.isLoggedIn,
                user : req.session.myUser
            });
        } else {
            return res.redirect('/login');
        }

    } catch (err) {
        console.log("Error While fetching Payments", err);
    }
}



exports.postBookedHome = async (req, res, next) => {
    const {cardNumber, expiration, cvv, id } = req.body;

    if (req.session.isLoggedIn) {
        const userId = req.session.myUser.id;
        const user = await User.findById(userId);
        
        // console.log(req.body, homeStringId);
        // Convert String Id to ObjectId
        const homeObjectId = new mongoose.Types.ObjectId(id);
        
        if (user.bookings.includes(homeObjectId)) {
            // Home is already booked
            return res.redirect('/');
        } else {
            user.bookings.push(homeObjectId);
            await user.save();
            return res.redirect('/');
        }    

    } else {
        return res.redirect('/login');
    }
}