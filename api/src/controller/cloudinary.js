let cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "tomasmacchi-muma",
    api_key: "718889228812439",
    api_secret: "6W_isy5uJtfRz1p0hKdK_gUi0fg"
})

module.exports = {cloudinary};