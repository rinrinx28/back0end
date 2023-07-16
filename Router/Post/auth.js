const express = require('express');
const { login, createUser } = require('../../Data/Event/user');
const router = express.Router();
const bcrypt = require('bcrypt');

const Login = router.post('/auth/login', async (req, res) => {
	const { id, password } = req.body;
	const status = await login(id);
	let msg;
	switch (status.message) {
		case 'Error':
			msg = { message: 'Error', data: status.data };
			break;
		default:
			if (status.data.length > 0) {
				let isValid = await bcrypt.compare(password, status.data[0].password);
				if (!isValid) {
					msg = { message: 'Error', Error: 'Wrong password' };
					break;
				} else {
					if (id === 'admin') {
						msg = {
							message: 'admin-login',
							data: status.data[0].id,
						};
					} else {
						msg = {
							message: 'Success',
							data: status.data[0].id,
						};
					}
					break;
				}
			} else {
				msg = {
					message: 'Error',
					Error: 'User already exists',
				};
				break;
			}
	}
	return msg.message === 'Error'
		? res.status(200).json(msg)
		: res.status(200).json(msg);
});

const setAdmin = router.post('/auth/setadmin', async (req, res) => {
	const { id, password } = req.body;
	const status = await login(id);
	let msg;
	switch (status.message) {
		case 'Error':
			msg = { message: 'Error', data: status.data };
			break;
		default:
			if (status.data.length > 0) {
				msg = { message: 'Error', Error: 'Already have users' };
			} else {
				const create_st = await createUser(id, password);
				msg = create_st;
				break;
			}
	}
	return msg.message === 'Error'
		? res.status(200).json(msg)
		: res.status(200).json(msg);
});

module.exports = {
	Login,
	setAdmin,
};
