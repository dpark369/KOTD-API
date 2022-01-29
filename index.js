const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const productRoute = require('./routes/product');
dotenv.config();

mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => console.log('DB Connected'))
	.catch((err) => console.log(err));

app.get('/api/test', () => {
	console.log('working');
});

app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);

//Todo get rid of the 5000 when going live
app.listen(process.env.PORT || 5000, () => {
	console.log('backend is working');
});
