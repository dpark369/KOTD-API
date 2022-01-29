const User = require('../models/User');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const router = require('express').Router();
const CryptoJS = require('crypto-js');

//Update
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
	if (req.body.password) {
		req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Delete
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id);
		res.status(200).json('User Deleted');
	} catch (err) {
		res.status(500).json(err);
	}
});

// Get User data

router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Get All Users
router.get('/', verifyTokenAndAdmin, async (req, res) => {
	const query = req.query.new;
	try {
		const users = query ? await User.find().sort({ _id: -1 }).limit(10) : await User.find();
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json(err);
	}
});
module.exports = router;
