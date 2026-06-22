const Home = require('../model/homes');
const user = require('../model/user');
const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/pathUtils')


exports.getAddhomes = (req, res, next) => {
    res.render('host/edit-homes', { 
        pageTitle: 'Host Dashboard ', 
        editing : false, 
        isLoggedIn : req.isLoggedIn,
        user : req.session.myUser 
    });
}

exports.postAddhomes = (req, res, next) => {
    const {houseName, location, price, rating, description} = req.body;
    
    // Also use NPM for this porpose
    const generateSerialNum = () => {
        let uniqueId = ""
        const prefix = "AB"
        const code = houseName.substring(0, 2).toUpperCase();
        const loc = location.substring(0, 10).toUpperCase();
        for (i = 0; i<3; i++){
            uniqueId += Math.floor(Math.random() * houseName.length); 
        }
        let res = `${prefix}-${code}-${loc}-${uniqueId}`;
        return res;
    }

    const homeSerialNum = generateSerialNum()
    
    const mainImage = req.files.mainImage[0].path;
    // console.log(req.files.mainImage[0].path);
    const images = req.files.photoUrl.map(f => f.path)
    const [imgOne, imgTwo, imgThree, imgFour] = images;
    
    // const filePath = req.files.photoUrl.map(f => f.path);
    // console.log(filePath);

    if (req.files.mainImage && req.files.photoUrl) {
        console.log('Directory Created Successfully');
    } else {
        console.log('Please Upload All Required Files');
    }

    
    const homes = new Home({homeSerialNum, mainImage, imgOne, imgTwo, imgThree, imgFour, houseName, location, price, rating, description});

    homes.save().then(() => {
        return res.redirect('/host/hosthomepage');
    }).catch((err) => {
        console.log('Error While Saving Homes', err);
    });
}


exports.postEdithomes = (req, res, next) => {
    // const _id = req.body._id;

    const {_id, houseName, location, price, rating, photoUrl, description} = req.body;

    Home.findById(_id).then((home) => {
        home.houseName = houseName;
        home.location = location;
        home.price = price;
        home.rating = rating;
        // home.photoUrl = photoUrl;
        home.description = description;

        if (req.files) {
            // console.log(req.files);
            // if (req.files.mainImage.filename) {
            //     fs.unlink(home.mainImage, (err) => {
            //         console.log("Error During Updating photo", err);
            //     });
            // }
            console.log(req.files.mainImage[0].path)
            // if (req.files.photoUrl.filename)
            // home.mainImage = req.files.mainImage[0].path;
            // home.photoUrl = req.file.path;
        }

        home.save().then((res) => {
            console.log('Update Homes Successfully', res);
        }).catch((err) => {
            console.log('Error While Updating Homes', err);
        });
    }).catch((err) => {
        console.log('Error While Finding Homes', err);
    });
    return res.redirect('/host/hosthomepage');
}



exports.gethosthomepage = (req, res, next) => {
    Home.find().then((hostHomes) => {
        res.render('host/hosthomepage', { pageTitle: 'Host home page',
            hostHomes : hostHomes,
            isLoggedIn : req.isLoggedIn,
            user : req.session.myUser
        });
    }).catch((err) => {
        console.log('Error While Fetching Host Homes', err);
    });
}


exports.getDeleteHome = async (req, res, next) => {
    const homeId = req.params.homeId;
    
    const home = await Home.findById(homeId);
    const deletePath = path.join('uploads', home.mainImage.substring(7, 23));
    try {
        await fs.rm(deletePath, {recursive : true , force : true}, (err) => {
            if (err) {
                // throw new Error('Deleting Home Error :', err);
                console.error('Deleting Home Error');
            }
            return;
        });
    } catch(err) {
        return res.send('Error A gaya E Hounsla Rakh!', err);
    }

    await Home.findByIdAndDelete(homeId);
    return res.redirect('/host/hosthomepage');
}


exports.getUpdateHomepage = (req, res, next) => {
    const homeId = req.params.homeId;
    const editing = req.query.editing === 'true';


    Home.findById(homeId).then((home) => {
        res.render('host/edit-homes', { 
            pageTitle : 'Edit home page',
            editing : editing,
            isLoggedIn : req.isLoggedIn,
            home : home,
            user : req.session.myUser
        })
    }).catch((err) => {
        console.log('Error While Editing Page', err);
        return res.redirect('/host/hosthomepage');
    });
}