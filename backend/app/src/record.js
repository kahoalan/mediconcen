var express = require('express');
var app = express.Router();
var mysqlService = require('./service/mysql');

/**
 *
 * @param id items id (null/interger)
 */
app.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await mysqlService('SELECT * FROM clinic_records WHERE id = ?', id);
        if (result.length != 1) throw new Error('Record not found')
        res.send(result[0]);
    } catch (err) {
        next(err.message);
    }
})

/**
 *
 */
app.get('/', async (req, res, next) => {
    try {
        const { client_id } = req.user;
        const result = await mysqlService(`SELECT * FROM clinic_records WHERE clinic_id = ?`, client_id);
        res.send(result);
    } catch (err) {
        next(err.message);
    }
})
/**
 *
 * @param doctor doctor (string)
 * @param patient patient (string)
 * @param diagnosis diagnosis (null/string)
 * @param medication medication (null/string)
 * @param medication medication (null/string)
 * 
 */
app.post('/', async (req, res, next) => {
    try {
        const { client_id } = req.user;
        const { doctor, patient, diagnosis, medication, consultation_fee, date_time, follow_up } = req.body;
        const date = new Date(date_time)
        if (isNaN(consultation_fee)) throw new Error('consultation_fee must be number')
        if (!date instanceof Date || isNaN(date)) throw new Error('Invalid format of date time')

        const result = await mysqlService("INSERT INTO clinic_records (client_id, doctor, patient, diagnosis, medication, consultation_fee, date_time, follow_up) VALUES(?,?,?,?)",
            [client_id, doctor, patient, diagnosis, medication, consultation_fee, date, follow_up]);
        res.send({ affectedRow: result.insertId });
    } catch (err) {
        next(err.message);
    }
})
/**
 *
 * @param id id (integer)
 * @param title title (null/string)
 * @param description description (null/string)
 * @param image image url (null/string of url)
 */
app.put('/', async (req, res, next) => {
    try {
        const { client_id } = req.user;
        const { id, doctor, patient, diagnosis, medication, consultation_fee, date_time, follow_up } = req.body;
        if (!Number.isInteger(Number(id))) throw new Error('id must be integer')
        const date = new Date(date_time)
        if (isNaN(consultation_fee)) throw new Error('consultation_fee must be number')
        if (!date instanceof Date || isNaN(date)) throw new Error('Invalid format of date time')

        const result = await mysqlService("UPDATE clinic_records SET doctor = ?, patient = ?, diagnosis = ?, medication = ?, consultation_fee = ?, date_time = ?, follow_up = ? WHERE id = ? AND client_id = ?",
            [doctor, patient, diagnosis, medication, consultation_fee, date, follow_up, id, client_id]);
        if (result.affectedRows == 0) throw new Error('Record not found')
        res.send({ affectedRow: id });
    } catch (err) {
        next(err.message);
    }
})
/**
 *
 * @param id id (integer)
 */
app.delete('/', async (req, res, next) => {
    try {
        const { client_id } = req.user;
        const { id } = req.body;
        if (!Number.isInteger(Number(id))) throw new Error('id must be integer')
        const result = await mysqlService("DELETE FROM clinic_records WHERE id = ? AND client_id = ?", [id, client_id]);
        if (result.affectedRows == 0) throw new Error('Record not found')
        res.send({ affectedRow: id });
    } catch (err) {
        next(err.message);
    }
})

app.use((req, res, next) => {
    next("Method not support")
})


module.exports = app;
