const express = require('express');
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkID);

// 3) ROUTES:
router
	.route('/top-5-cheap')
	.get(tourController.aliasTopTours, tourController.getAllTours)
	//aliasTopTours is the middleware, written in the controller.

router
	.route('/tour-stats')
	.get(tourController.getTourStats);
	
router
	.route('/monthly-plan/:year')
	.get(tourController.getMonthlyPlan);

router
	.route('/')
	.get(authController.protect, tourController.getAllTours)
	.post(tourController.createTour);
// Need to check and make sure the user is logged in/autherized. 

router
	.route('/:id')
	.get(tourController.getTour)
	.patch(tourController.updateTour)
	.delete(authController.protect,
	//  authController.restrictedTo('admin'), 
	tourController.deleteTour);

module.exports = router;