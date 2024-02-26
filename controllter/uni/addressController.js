const addressServices = require('../../services/uni/addressServices')

const addressController = {
  getRegion: (req, res) => {
    addressServices.getRegionAPI(req, res)
  },
  getRegionChild: (req, res) => {
    addressServices.getRegionChild(req, res)
  },
  getAddress: (req, res) => {
    addressServices.getAddressList(req, res)
  },
  delAddress: (req, res) => {
    addressServices.delAddressList(req, res)
  },
  updateAddress: (req, res) => {
    addressServices.updateAddressItem(req, res)
  },
  updateAddressSelected: (req, res) => {
    addressServices.updateAddressList(req, res)
  },
  addAddress: (req, res) => {
    addressServices.addAddressList(req, res)
  }
}

module.exports = addressController