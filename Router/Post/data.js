const { Router } = require('express');
const {
	createUser,
	deleteUser,
	getAllUser,
	getUser,
	updatePassword,
} = require('../../Data/Event/user');
const fs = require('fs');

const router = Router();
//! Router For Admin Start
router.post('/updata/:month', async (req, res) => {
	const body = req.body;
	const field = req.field;
	let nv = [];
	let msg;
	let field_body = body.filter(
		(v) =>
			Object.values(v).filter(
				(value) => value.toString().toLowerCase() === 'họ và tên',
			).length > 0,
	);
	let status = field.update(field_body);
	let value_field_body = body.filter((v) => v !== field_body[0]);
	if (status) {
		let value_field = value_field_body.filter(
			(v) =>
				field.findInField(Object.keys(v)[0]) === 'TT' &&
				typeof Object.values(v)[0] === 'number' &&
				typeof Object.values(v)[1] === 'string',
		);
		let user = {};
		let id_user = [];
		for (const x in value_field) {
			const values = value_field[x];
			var field_name = field.getAllField();
			for (const x in field_name) {
				if (Number(x) === 1) {
					user[
						`${field_name[x].name
							.split('\n')
							.join(' ')
							.split('\r')
							.join(' ')
							.split(' ')
							.filter((a) => a.length > 0)
							.join(' ')
							.toLowerCase()}`
					] = `${values[field_name[x].id]} ${values[`${field_name[x].id}_1`]}`;
				} else if (Number(x) !== 1) {
					user[
						`${field_name[x].name
							.split('\n')
							.join(' ')
							.split('\r')
							.join(' ')
							.split(' ')
							.filter((a) => a.length > 0)
							.join(' ')
							.toLowerCase()}`
					] =
						values[field_name[x].id] === undefined
							? 0
							: values[field_name[x].id];
				}
			}
			id_user.push(user['mã số nv'].split(' ').join(''));
			nv.push(user);
			user = {};
		}
		if (!fs.existsSync('./luong-json')) fs.mkdirSync('./luong-json');
		//Check File Luong nv month;
		if (!fs.existsSync('./luong-json/luong-nv.json'))
			fs.writeFileSync(
				'./luong-json/luong-nv.json',
				JSON.stringify([], null, 2),
			);
		let luong_nv = fs.readFileSync('./luong-json/luong-nv.json', 'utf-8');
		let month = JSON.parse(luong_nv);
		//check dp element in array;
		const not_dp_in_arr = month.filter((v) => v.date !== req.params.month);
		not_dp_in_arr.push({ date: req.params.month, data_user: id_user });
		// Write Again in File;
		fs.writeFileSync(
			'./luong-json/luong-nv.json',
			JSON.stringify(not_dp_in_arr, null, 2),
		);
		fs.writeFileSync(
			`./luong-json/luong-nv-${req.params.month}.json`,
			JSON.stringify(nv, null, 2),
		);
		for (const x in nv) {
			await createUser(Object.values(nv[x])[2], '1');
		}
		msg = { message: 'Success', data: nv };
	} else {
		msg = { message: 'Error', Error: 'Update Fail!' };
	}
	return msg.message === 'Error'
		? res.status(500).json(msg)
		: res.status(200).json(msg);
});

router.get('/getallmonth', async (req, res) => {
	let msg;
	switch (fs.existsSync('./luong-json/luong-nv.json')) {
		case true:
			let year = {};
			const month = JSON.parse(
				fs.readFileSync('./luong-json/luong-nv.json', 'utf-8'),
			);
			// Get month in year of Array;
			for (const x in month) {
				const month_year = month[x].date.split('-')[0];
				if (year[month_year] === undefined) {
					year[month_year] = [];
					year[month_year].push(month[x].date.split('-')[1]);
				} else {
					year[month_year].push(month[x].date.split('-')[1]);
				}
			}
			msg = {
				message: 'Success',
				data: year,
			};

			break;
		default:
			msg = {
				message: 'Error',
				error: 'Ko co du lieu!',
			};
			break;
	}
	return msg.message === 'Error'
		? res.status(404).json(msg)
		: res.status(200).json(msg);
});

router.get('/getmonth/:month', async (req, res) => {
	let msg;
	// check file luong-nv.json;
	switch (fs.existsSync('./luong-json/luong-nv.json')) {
		case true:
			// check file luong-nv-month.json;
			switch (fs.existsSync(`./luong-json/luong-nv-${req.params.month}.json`)) {
				case true:
					const data = JSON.parse(
						fs.readFileSync(
							`./luong-json/luong-nv-${req.params.month}.json`,
							'utf-8',
						),
					);
					msg = {
						message: 'Success',
						data: data,
					};
					break;
				default:
					msg = {
						message: 'Error',
						error: 'Ko co du lieu!',
					};
					break;
			}
			break;
		default:
			msg = {
				message: 'Error',
				error: 'Ko co du lieu!',
			};
			break;
	}
	return msg.message === 'Error'
		? res.status(404).json(msg)
		: res.status(200).json(msg);
});

router.get('/getalluser', async (req, res) => {
	const msg = await getAllUser();
	return msg.message === 'Error'
		? res.status(404).json(msg)
		: res.status(200).json(msg);
});

router.get('/getuser/:id', async (req, res) => {
	const msg = await getUser(req.params.id);
	return msg.message === 'Error'
		? res.status(404).json(msg)
		: res.status(200).json(msg);
});

router.post('/createuser', async (req, res) => {
	const msg = await createUser(req.body.id, req.body.password);
	return msg.message === 'Error'
		? res.status(404).json(msg)
		: res.status(200).json(msg);
});

router.delete('/deleteuser/:id', async (req, res) => {
	const msg = await deleteUser(req.params.id);
	return msg.message === 'Error'
		? res.status(404).json(msg)
		: res.status(200).json(msg);
});

router.post('/updatepassword', async (req, res) => {
	const msg = await updatePassword(req.body.id, req.body.password);
	return msg.message === 'Error'
		? res.status(404).json(msg)
		: res.status(200).json(msg);
});
//! Router For Admin End

//! Router For User Start
router.get('/getallmonth/:id', async (req, res) => {
	const msg = await getAllMonth(req.params.id);
	return msg.message === 'Error'
		? res.status(404).json(msg)
		: res.status(200).json(msg);
});

router.get('/getmonth/:id/:month/:year', async (req, res) => {
	const msg = await getMonth(req.params.id, req.params.month, req.params.year);
	return msg.message === 'Error'
		? res.status(404).json(msg)
		: res.status(200).json(msg);
});
//! Router For User End

//! Function For User Start
async function getAllMonth(id) {
	// check file luong-nv.json;
	if (fs.existsSync('./luong-json/luong-nv.json')) {
		// check file luong-nv-month.json;
		const month = JSON.parse(
			fs.readFileSync('./luong-json/luong-nv.json', 'utf-8'),
		);
		let data = [];
		const user = month
			.filter((v) => v.data_user.includes(id))
			.map((v) => v.date);
		data.push({ date: user.length > 0 ? user : [] });
		return { message: 'Success', data: data };
	} else {
		return { message: 'Error', error: 'Ko co du lieu!' };
	}
}

// Getmonth with id, month and year params
async function getMonth(id, month, year) {
	// check file luong-nv.json;
	if (fs.existsSync('./luong-json/luong-nv.json')) {
		// check file luong-nv-month.json;
		const luong_nv = JSON.parse(
			fs.readFileSync('./luong-json/luong-nv.json', 'utf-8'),
		);
		const user = luong_nv
			.filter((v) => v.data_user.includes(id))
			.map((v) => v.date);
		if (user.length > 0) {
			let data = [];
			for (const x in user) {
				const date = user[x].split('-');
				if (date[0] === year && date[1] === month) {
					data.push(user[x]);
				}
			}
			const data_alluser = JSON.parse(
				fs.readFileSync(`./luong-json/luong-nv-${data[0]}.json`, 'utf-8'),
			);
			const data_user = data_alluser.filter(
				(v) => v['mã số nv'].split(' ').join('') === id,
			);
			return { message: 'Success', data: data_user };
		} else {
			return { message: 'Error', error: 'Ko co du lieu!' };
		}
	} else {
		return { message: 'Error', error: 'Ko co du lieu!' };
	}
}
//! Function For User End

module.exports = router;
