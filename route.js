var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

// authentication
//require('./models/users');
var ctrlAuth = require('./controllers/authentication');
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//Admin router
var ctrlAdmin = require('./controllers/admin');
// profile
router.get('/profile', auth, ctrlAdmin.profileRead);
router.post('/profile', auth, ctrlAdmin.profileAdd);
router.put('/profile', auth, ctrlAdmin.profileUpdate);
router.delete('/profile/:id', auth, ctrlAdmin.profileDelete);
// otp
router.get('/sendOTP', ctrlAdmin.sendOTP);
router.get('/loginByOtp', ctrlAdmin.loginByOtp);
// application
router.get('/application', auth, ctrlAdmin.getApplication);
router.post('/application', auth, ctrlAdmin.addApplication);
router.put('/application', auth, ctrlAdmin.updateApplication);
router.delete('/application/:id', auth, ctrlAdmin.deleteApplication);
// role
router.get('/role', auth, ctrlAdmin.getRole);
router.post('/role', auth, ctrlAdmin.addRole);
router.put('/role', auth, ctrlAdmin.updateRole);
router.delete('/role/:id', auth, ctrlAdmin.deleteRole);
// subscription
router.get('/subscription', auth, ctrlAdmin.getSubscription);
router.post('/subscription', auth, ctrlAdmin.addSubscription);
router.put('/subscription', auth, ctrlAdmin.updateSubscription);
router.delete('/subscription/:id', auth, ctrlAdmin.deleteSubscription);
// screens
router.get('/screens', auth, ctrlAdmin.getScreen);
router.post('/screens', auth, ctrlAdmin.addScreen);
router.put('/screens', auth, ctrlAdmin.updateScreen);
router.delete('/screens/:id', auth, ctrlAdmin.deleteScreen);
// fields
router.get('/fields', auth, ctrlAdmin.getField);
router.post('/fields', auth, ctrlAdmin.addField);
router.put('/fields', auth, ctrlAdmin.updateField);
router.delete('/fields/:id', auth, ctrlAdmin.deleteField);
// appScrFieldsRights
router.get('/appScrFieldsRights', auth, ctrlAdmin.getAppScrFieldsRights);
router.post('/appScrFieldsRights', auth, ctrlAdmin.addAppScrFieldsRights);
router.put('/appScrFieldsRights', auth, ctrlAdmin.updateAppScrFieldsRights);
router.delete('/appScrFieldsRights/:id', auth, ctrlAdmin.deleteAppScrFieldsRights);
router.get('/appScrRights', auth, ctrlAdmin.getAppScrRights);
router.get('/appFieldRights', auth, ctrlAdmin.getAppFieldRights);
router.put('/multipleRights', auth, ctrlAdmin.updateMultipleRights);
// productTyp
router.get('/productTyp', auth, ctrlAdmin.getProductTyp);
router.post('/productTyp', auth, ctrlAdmin.addProductTyp);
router.put('/productTyp', auth, ctrlAdmin.updateProductTyp);
router.delete('/productTyp/:id', auth, ctrlAdmin.deleteProductTyp);
// productHierarchy
router.get('/productHierarchy', auth, ctrlAdmin.getProductHierarchy);
router.post('/productHierarchy', auth, ctrlAdmin.addProductHierarchy);
router.put('/productHierarchy', auth, ctrlAdmin.updateProductHierarchy);
router.delete('/productHierarchy/:id', auth, ctrlAdmin.deleteProductHierarchy);
router.put('/updateMultiProductHierarchy', auth, ctrlAdmin.updateMultiProductHierarchy);
// specField
router.get('/specField', auth, ctrlAdmin.getSpecField);
router.post('/specField', auth, ctrlAdmin.addSpecField);
router.put('/specField', auth, ctrlAdmin.updateSpecField);
router.delete('/specField/:id', auth, ctrlAdmin.deleteSpecField);
// prdTypSpecFieldMap
router.get('/prdTypSpecFieldMap', auth, ctrlAdmin.getPrdTypSpecFieldMap);
router.post('/prdTypSpecFieldMap', auth, ctrlAdmin.addPrdTypSpecFieldMap);
router.put('/prdTypSpecFieldMap', auth, ctrlAdmin.updatePrdTypSpecFieldMap);
router.delete('/prdTypSpecFieldMap/:id', auth, ctrlAdmin.deletePrdTypSpecFieldMap);
// brand
router.get('/brand', auth, ctrlAdmin.getBrand);
router.post('/brand', auth, ctrlAdmin.addBrand);
router.put('/brand', auth, ctrlAdmin.updateBrand);
router.delete('/brand/:id', auth, ctrlAdmin.deleteBrand);
// product
router.get('/product', auth, ctrlAdmin.getProduct);
router.post('/product', auth, ctrlAdmin.addProduct);
router.put('/product', auth, ctrlAdmin.updateProduct);
router.delete('/product/:id', auth, ctrlAdmin.deleteProduct);
router.get('/serviceproduct', auth, ctrlAdmin.getServiceProduct);
router.get('/uniqueBrandBasedOnPrdTyp', auth, ctrlAdmin.getUniqueBrandBasedOnPrdTyp);
// productSpec
router.get('/productSpec', auth, ctrlAdmin.getProductSpec);
router.post('/productSpec', auth, ctrlAdmin.addProductSpec);
router.put('/productSpec', auth, ctrlAdmin.updateProductSpec);
router.delete('/productSpec/:id', auth, ctrlAdmin.deleteProductSpec);
router.post('/multiProductSpec', auth, ctrlAdmin.addMultiProductSpec);
// prdImage
router.get('/prdImage', auth, ctrlAdmin.getPrdImage);
router.post('/prdImage', auth, ctrlAdmin.addPrdImage);
router.put('/prdImage', auth, ctrlAdmin.updatePrdImage);
router.delete('/prdImage/:id', auth, ctrlAdmin.deletePrdImage);
// prdThumbnail
router.get('/prdThumbnail', auth, ctrlAdmin.getPrdThumbnail);
router.post('/prdThumbnail', auth, ctrlAdmin.addPrdThumbnail);
router.put('/prdThumbnail', auth, ctrlAdmin.updatePrdThumbnail);
//router.delete('/prdThumbnail/:id', auth, ctrlAdmin.deletePrdThumbnail);
router.put('/prdThumbnailDelete', auth, ctrlAdmin.deletePrdThumbnail);
router.get('/prdThumbnailColors', auth, ctrlAdmin.getPrdThumbnailColors);
// Location
router.get('/loc', auth, ctrlAdmin.getLoc);
router.post('/loc', auth, ctrlAdmin.addLoc);
router.put('/loc', auth, ctrlAdmin.updateLoc);
router.delete('/loc/:id', auth, ctrlAdmin.deleteLoc);
router.get('/country', auth, ctrlAdmin.getCountry);
router.get('/state', auth, ctrlAdmin.getState);
router.get('/city', auth, ctrlAdmin.getCity);
router.get('/location', auth, ctrlAdmin.getUnqLocation);
// Config Parameter
router.get('/allConfig', auth, ctrlAdmin.getAllParameter);
router.get('/config', auth, ctrlAdmin.getParameter);
router.post('/config', auth, ctrlAdmin.addParameter);
router.put('/config', auth, ctrlAdmin.updateParameter);
router.delete('/config/:id', auth, ctrlAdmin.deleteParameter);




//End users router
//Search
var ctrlSearch = require('./controllers/search');
router.get('/public/node/search', auth, ctrlSearch.search);
router.post('/public/node/searchload', auth, ctrlSearch.getTransactions);
router.get('/public/node/searchLoc', auth, ctrlSearch.searchLoc);

//User address
var ctrlAddress = require('./controllers/address');
router.get('/public/node/userAddress', auth, ctrlAddress.getUserAddress);
router.post('/public/node/userAddress', auth, ctrlAddress.addUserAddress);
router.put('/public/node/userAddress', auth, ctrlAddress.updateUserAddress);
router.delete('/public/node/userAddress/:id', auth, ctrlAddress.deleteUserAddress);
//userAlert
var ctrlAlert = require('./controllers/alert');
router.get('/public/node/userAlert', auth, ctrlAlert.getUserAlert);
router.post('/public/node/userAlert', auth, ctrlAlert.addUserAlert);
router.put('/public/node/userAlert', auth, ctrlAlert.updateUserAlert);
router.delete('/public/node/userAlert/:id', auth, ctrlAlert.deleteUserAlert);
//bid
var ctrlBid = require('./controllers/bid');
router.get('/public/node/bid', auth, ctrlBid.getBid);
router.post('/public/node/bid', auth, ctrlBid.addBid);
router.put('/public/node/bid', auth, ctrlBid.updateBid);
router.delete('/public/node/bid/:id', auth, ctrlBid.deleteBid);
//BidBy 
var ctrlBidBy = require('./controllers/bidBy');
router.get('/public/node/bidBy', auth, ctrlBidBy.getBidBy);
router.post('/public/node/bidBy', auth, ctrlBidBy.addBidBy);
router.put('/public/node/bidBy', auth, ctrlBidBy.updateBidBy);
router.delete('/public/node/bidBy/:id', auth, ctrlBidBy.deleteBidBy);
//buy 
var ctrlBuy = require('./controllers/buy');
router.get('/public/node/buy', auth, ctrlBuy.getBuy);
router.post('/public/node/buy', auth, ctrlBuy.addBuy);
router.put('/public/node/buy', auth, ctrlBuy.updateBuy);
router.delete('/public/node/buy/:id', auth, ctrlBuy.deleteBuy);
//Fav 
var ctrlFav = require('./controllers/favourite');
router.get('/public/node/fav', auth, ctrlFav.getFav);
router.post('/public/node/fav', auth, ctrlFav.addFav);
router.put('/public/node/fav', auth, ctrlFav.updateFav);
router.delete('/public/node/fav/:id', auth, ctrlFav.deleteFav);
//Filter 
var ctrlFilter = require('./controllers/filter');
router.get('/public/node/filter', auth, ctrlFilter.getFilter);
router.post('/public/node/filter', auth, ctrlFilter.addFilter);
router.put('/public/node/filter', auth, ctrlFilter.updateFilter);
router.delete('/public/node/filter/:id', auth, ctrlFilter.deleteFilter);
router.put('/public/node/filterDelete', auth, ctrlFilter.deleteMultipleFilter);
//Image 
var ctrlImage = require('./controllers/image');
router.get('/public/node/image', auth, ctrlImage.getImage);
router.post('/public/node/image', auth, ctrlImage.addImage);
router.put('/public/node/image', auth, ctrlImage.updateImage);
router.delete('/public/node/image/:id', auth, ctrlImage.deleteImage);
//Sell 
var ctrlSell = require('./controllers/sell');
router.get('/public/node/sell', auth, ctrlSell.getSell);
router.post('/public/node/sell', auth, ctrlSell.addSell);
router.put('/public/node/sell', auth, ctrlSell.updateSell);
router.delete('/public/node/sell/:id', auth, ctrlSell.deleteSell);
//UserSubMap 
var ctrlUserSubMap = require('./controllers/subscription');
router.get('/public/node/userSubMap', auth, ctrlUserSubMap.getUserSubMap);
router.post('/public/node/userSubMap', auth, ctrlUserSubMap.addUserSubMap);
router.put('/public/node/userSubMap', auth, ctrlUserSubMap.updateUserSubMap);
router.delete('/public/node/userSubMap/:id', auth, ctrlUserSubMap.deleteUserSubMap);
//Thumbnail 
var ctrlThumbnail = require('./controllers/thumbnail');
router.get('/public/node/thumbnail', auth, ctrlThumbnail.getThumbnail);
router.post('/public/node/thumbnail', auth, ctrlThumbnail.addThumbnail);
router.put('/public/node/thumbnail', auth, ctrlThumbnail.updateThumbnail);
router.delete('/public/node/thumbnail/:id', auth, ctrlThumbnail.deleteThumbnail);
//Service 
var ctrlService = require('./controllers/service');
router.get('/public/node/service', auth, ctrlService.getService);
router.post('/public/node/service', auth, ctrlService.addService);
router.put('/public/node/service', auth, ctrlService.updateService);
router.delete('/public/node/service/:id', auth, ctrlService.deleteService);
//Rating 
var ctrlRating = require('./controllers/rating');
router.get('/public/node/rating', auth, ctrlRating.getRating);
router.post('/public/node/rating', auth, ctrlRating.addRating);
router.put('/public/node/rating', auth, ctrlRating.updateRating);
router.delete('/public/node/rating/:id', auth, ctrlRating.deleteRating);
//Feedback 
var ctrlFeedback = require('./controllers/feedback');
router.get('/public/node/feedback', auth, ctrlFeedback.getFeedback);
router.post('/public/node/feedback', auth, ctrlFeedback.addFeedback);
router.put('/public/node/feedback', auth, ctrlFeedback.updateFeedback);
router.delete('/public/node/feedback/:id', auth, ctrlFeedback.deleteFeedback);
//ThumbsUp 
var ctrlThumbsUp = require('./controllers/thumbs_up');
router.get('/public/node/thumbs_up', auth, ctrlThumbsUp.getThumbsUp);
router.post('/public/node/thumbs_up', auth, ctrlThumbsUp.addThumbsUp);
router.put('/public/node/thumbs_up', auth, ctrlThumbsUp.updateThumbsUp);
router.delete('/public/node/thumbs_up/:id', auth, ctrlThumbsUp.deleteThumbsUp);
//ThumbsDown 
var ctrlThumbsDown = require('./controllers/thumbs_down');
router.get('/public/node/thumbs_down', auth, ctrlThumbsDown.getThumbsDown);
router.post('/public/node/thumbs_down', auth, ctrlThumbsDown.addThumbsDown);
router.put('/public/node/thumbs_down', auth, ctrlThumbsDown.updateThumbsDown);
router.delete('/public/node/thumbs_down/:id', auth, ctrlThumbsDown.deleteThumbsDown);




module.exports = router;