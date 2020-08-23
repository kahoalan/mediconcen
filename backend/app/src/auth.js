const express = require('express');
const app = express.Router();
const mysqlService = require('./service/mysql');
const jwtService = require('./service/jwt')
const bcrypt = require('bcrypt');
const e = require('express');
const saltRounds = 10;
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
/**
 *
 * @param email email (string of email)
 * @param password password (string of password) 
 * @param clinic_id clinic_id (null/integer) - use exist clinic
 * @param clinic_name clinic_name (null/string) - for create new clinic
 * @param phone_number phone_number (null/integer) - for create new clinic
 * @param address address (null/string) - for create new clinic
 */
app.post('/register', async (req, res, next) => {
    try {
        const { email, password, clinic_id, clinic_name, phone_number, address } = req.body;
        if (!emailRegexp.test(email)) throw new Error('Email format not correct');
        if (!clinic_id && !clinic_name) throw new Error('Please provide the clinic')

        let [, clinic_in_db, hashed_password] = await Promise.all([
            mysqlService('SELECT email FROM clinic_users WHERE email = ?', email).then(data => {
                if (data.length != 0) throw new Error('Already Registered')
            }),
            clinic_id ? mysqlService('SELECT id FROM clinics WHERE id = ?', clinic_id).then(data => {
                if (clinic_exist.length != 1) throw new Error('Clinic not found')
                return clinic_id
            }) : mysqlService("INSERT INTO clinics (name,address,phone_number) VALUES(?,?,?)",
                [clinic_name, address, phone_number]).then(data => data.insertId),
            bcrypt.hash(password, saltRounds)
        ])
        console.log(clinic_in_db, hashed_password)
        const result = await mysqlService("INSERT INTO clinic_users (email,password,clinic_id) VALUES(?,?,?)",
            [email, hashed_password, clinic_in_db]);
        res.send({ affectedRow: result.insertId });
    } catch (err) {
        console.log(err)
        next(err.message);
    }
})

/**
 *
 * @param email email (string of email)
 * @param password password (string of password) 
 */
app.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!emailRegexp.test(email)) throw new Error('Email format not correct');
        const user = await mysqlService('SELECT id, password, clinic_id FROM clinic_users WHERE email = ?', email);
        if (user.length == 0) throw new Error('Not yet registered');
        const result = await bcrypt.compare(password, user[0].password);
        if (!result) throw new Error('Password not match');
        res.cookie('jwt', jwtService.generateToken({ email, id: user[0].id, clinic_id: user[0].clinic_id }), {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            secure: false,
            httpOnly: true,
        }).send()
    } catch (err) {
        next(err.message);
    }
})
/**
 *
 * @param token title (null/string)
 */
app.use(async (req, res, next) => {
    try {
        const { jwt } = req.cookies;
        req.user = jwtService.verifyToken(jwt)
        next()
    } catch (err) {
        next(err.message);
    }
})

module.exports = app;
