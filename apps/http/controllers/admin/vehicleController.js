const Vehicle = require('../../../models/admin/Vehicle');

const CreateVehicle = async (req, res) => {
    const body = req.body;
    try {
        const newVehicle = new Vehicle(body);
        await newVehicle.save();
        return res.status(200).json({ 
            message: "Vehicle created sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const UpdateVehicle = async (req, res) =>{
    try {
        await Vehicle.findOneAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "Vehicle, Updated successfully"
                    })
                })
                .catch(error => {
                    return res.status(500).json({
                        message: "Error Found",
                        errors: error.message
                    })
                });

    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
}
const ViewVehicle = async (req, res) => {
    try{
        const VehicleData = await Vehicle.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: VehicleData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllVehicle = async (req, res) => {
    try{
        const AllVehicles = await Vehicle.find({},{__v: 0});
        return res.status(200).json({ 
            data: AllVehicles 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const DeleteVehicle = async (req, res) =>{
    const id = req.body.vehicle_id;
    try {
        await Vehicle.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "Vehicle, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};

module.exports = {
    CreateVehicle,
    UpdateVehicle,
    ViewVehicle,
    ViewAllVehicle,
    DeleteVehicle,
}