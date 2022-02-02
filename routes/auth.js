const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

// Todo Add better error messages for the specific errors

// Register

router.post('/register', async (req, res) => {
	const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
	});
	try {
		// checks if the username or email is already in the db
		const user = await User.findOne({ username: req.body.username });
		const email = await User.findOne({ email: req.body.email });
		if (!user && !email) {
			// no user or email in db
			const savedUser = await newUser.save();
			res.status(201).json('registration complete');
		} else if (user) {
			res.status(409).json('Username already taken');
		} else if (email) {
			res.status(409).json('email already being used');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// Login

router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username });
		if (!user) {
			// no user in db
			res.status(401).json('Wrong Credentials!');
		}
		// decrypts the Hashed password
		const decryptPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
		const originalPassword = decryptPassword.toString(CryptoJS.enc.Utf8);
		if (originalPassword !== req.body.password) {
			//wrong password
			res.status(401).json('Wrong Password!');
		}
		const accessToken = jwt.sign(
			{
				id: user._id,
				isAdmin: user.isAdmin,
			},
			process.env.JWT_SEC,
			{ expiresIn: '1h' }
		);
		//Successful login - sends back accesstoken and id details
		const { password, isAdmin, ...others } = user._doc;
		res.status(200).json({ ...others, accessToken });
	} catch (err) {
		res.status(500).json(err);
	}
});
module.exports = router;
