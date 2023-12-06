var express = require('express');
var addressRouter = express.Router();
const addressController = require('../../controllter/uni/addressController')

addressRouter.get('/uni/address', addressController.getAddress)
addressRouter.get('/uni/region', addressController.getRegion)
// addressRouter.get('/uni/region/child', addressController.getRegionChild)
addressRouter.post('/uni/address', addressController.addAddress)
addressRouter.delete('/uni/address', addressController.delAddress)
addressRouter.put('/uni/address', addressController.updateAddress)
addressRouter.put('/uni/address/selected', addressController.updateAddressSelected)

module.exports = addressRouter