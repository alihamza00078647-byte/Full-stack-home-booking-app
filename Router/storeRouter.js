const express = require('express');
const storeRouter = express.Router();

// Local modules
const storeController = require('../Controller/storeController');

storeRouter.get('/', storeController.getIndexpage);

storeRouter.get('/homesdetails/:homeId', storeController.getHomesDetailspage);

storeRouter.get('/favourites', storeController.getfavouitespage);

storeRouter.get('/favourites/:productId', storeController.AddFavourite);

storeRouter.get('/bookings', storeController.getbookingspage);

storeRouter.post('/search', storeController.postSearchPage);

storeRouter.post('/reserve', storeController.postPaymentPage);

storeRouter.post('/confirm/payments', storeController.postBookedHome);

exports.storeRouter = storeRouter;
