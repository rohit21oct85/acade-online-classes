const express =  require("express");
const Vehicle = require('../../http/controllers/admin/vehicleController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, Vehicle.CreateVehicle)
    .patch('/update/:id',checkAuth,adminAuth, Vehicle.UpdateVehicle)
    .get('/view/:id',checkAuth,adminAuth, Vehicle.ViewVehicle)
    .get('/view-all',checkAuth,adminAuth, Vehicle.ViewAllVehicle)
    .post('/delete/', checkAuth,adminAuth, Vehicle.DeleteVehicle);

module.exports = router;