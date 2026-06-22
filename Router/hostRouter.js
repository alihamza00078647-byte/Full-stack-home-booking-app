const express = require("express");
const hostRouter = express.Router();

// Local Module
const hostController = require('../Controller/hostController');




hostRouter.get('/host/Addhome', hostController.getAddhomes);

hostRouter.post('/host/Addhome', hostController.postAddhomes);

hostRouter.post('/host/edit-homes', hostController.postEdithomes);

hostRouter.get('/host/hosthomepage', hostController.gethosthomepage);

hostRouter.get('/host/hosthomepage/edit/:homeId', hostController.getUpdateHomepage);

hostRouter.get('/host/hosthomepage/remove/:homeId', hostController.getDeleteHome);



exports.hostRouter = hostRouter;