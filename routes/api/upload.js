const cloudinary = require('cloudinary').v2;

exports.uploadImage = async( req, res ) => {
	// File upload
	const avatar = req.files.avatar;
	const result = await cloudinary.uploader.upload(avatar.path);
	res.apiResponse({
		status:200,
		result
	});
};