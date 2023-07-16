const Db = require('../connect/pool');
const bcrypt = require('bcrypt');

async function createUser(id, password) {
	const pool = new Db(
		process.env.HOST,
		process.env.ROOT,
		process.env.PASSWORD,
		'luong',
	).createPool();
	let conn;
	let msg;
	let data;
	try {
		conn = await pool.getConnection();
		// Check User in Table
		const [user] = await conn.query(
			`select id from nhanvien where id=?`,
			id.split(' ').join(''),
		);
		if (user.length > 0) {
			data = 'User Exits';
		} else {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			await conn.query('insert into nhanvien values (?,?)', [
				id.split(' ').join(''),
				hashedPassword,
			]);
			data = 'Done';
		}
	} catch (e) {
		msg = {
			message: 'Error',
			Error: e,
		};
	} finally {
		if (conn) conn.release();
		msg = {
			message: 'Done',
			data: data,
		};
	}
	pool.end();
	return msg;
}

async function login(id) {
	const pool = new Db(
		process.env.HOST,
		process.env.ROOT,
		process.env.PASSWORD,
		'luong',
	).createPool();
	let conn;
	let msg;
	let data;
	try {
		conn = await pool.getConnection();
		// Check User in Table
		const [user] = await conn.query(
			`select id,password from nhanvien where id=?`,
			[id],
		);
		if (user.length < 1) {
			data = [];
		} else {
			data = user;
		}
	} catch (e) {
		msg = {
			message: 'Error',
			Error: e,
		};
	} finally {
		if (conn) conn.release();
		msg = {
			message: 'Success',
			data: data,
		};
	}
	pool.end();
	return msg;
}

async function updatePassword(id, password) {
	const pool = new Db(
		process.env.HOST,
		process.env.ROOT,
		process.env.PASSWORD,
		'luong',
	).createPool();
	let conn;
	let msg;
	let data;
	try {
		conn = await pool.getConnection();
		// Check User in Table
		const [user] = await conn.query(
			`select id from nhanvien where id=?`,
			id.split(' ').join(''),
		);
		if (user.length > 0) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			await conn.query('update nhanvien set password=? where id=?', [
				hashedPassword,
				id.split(' ').join(''),
			]);
			data = 'Done';
		} else {
			data = 'User Not Exits';
		}
	} catch (e) {
		msg = {
			message: 'Error',
			Error: e,
		};
	} finally {
		if (conn) conn.release();
		msg = {
			message: 'Done',
			data: data,
		};
	}
	pool.end();
	return msg;
}

async function deleteUser(id) {
	const pool = new Db(
		process.env.HOST,
		process.env.ROOT,
		process.env.PASSWORD,
		'luong',
	).createPool();
	let conn;
	let msg;
	let data;
	try {
		conn = await pool.getConnection();
		// Check User in Table
		const [user] = await conn.query(
			`select id from nhanvien where id=?`,
			id.split(' ').join(''),
		);
		if (user.length > 0) {
			await conn.query('delete from nhanvien where id=?', [
				id.split(' ').join(''),
			]);
			data = 'Done';
		} else {
			data = 'User Not Exits';
		}
	} catch (e) {
		msg = {
			message: 'Error',
			Error: e,
		};
	} finally {
		if (conn) conn.release();
		msg = {
			message: 'Done',
			data: data,
		};
	}
	pool.end();
	return msg;
}

async function getAllUser() {
	const pool = new Db(
		process.env.HOST,
		process.env.ROOT,
		process.env.PASSWORD,
		'luong',
	).createPool();
	let conn;
	let msg;
	let data;
	try {
		conn = await pool.getConnection();
		// Check User in Table
		const [user] = await conn.query(`select id from nhanvien`);
		if (user.length > 0) {
			data = user.filter((v) => v.id !== 'admin');
		} else {
			data = 'User Not Exits';
		}
	} catch (e) {
		msg = {
			message: 'Error',
			Error: e,
		};
	} finally {
		if (conn) conn.release();
		msg = {
			message: 'Done',
			data: data,
		};
	}
	pool.end();
	return msg;
}

async function getUser(id) {
	const pool = new Db(
		process.env.HOST,
		process.env.ROOT,
		process.env.PASSWORD,
		'luong',
	).createPool();
	let conn;
	let msg;
	let data;
	try {
		conn = await pool.getConnection();
		// Check User in Table
		const [user] = await conn.query(`select id from nhanvien where id=?`, [
			id.split(' ').join(''),
		]);
		if (user.length > 0) {
			data = user;
		} else {
			data = 'User Not Exits';
		}
	} catch (e) {
		msg = {
			message: 'Error',
			Error: e,
		};
	} finally {
		if (conn) conn.release();
		msg = {
			message: 'Done',
			data: data,
		};
	}
	pool.end();
	return msg;
}

module.exports = {
	createUser,
	login,
	updatePassword,
	deleteUser,
	getAllUser,
	getUser,
};
