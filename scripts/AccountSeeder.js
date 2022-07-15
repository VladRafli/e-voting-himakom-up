const fs = require('fs')
const bcrypt = require('bcrypt')
const mysql = require('mysql2')
const nodemailer = require('nodemailer')
require('dotenv').config()

const dataBuffer = fs.readFileSync(`${process.argv[2]}`)
const dataCsv = dataBuffer.toString('utf-8')
const dataRow = dataCsv.split('\n')
dataRow.pop()

let dataColHead = []
let dataCol = dataRow.map(
    /** 
        @returns {{nim: String, nama: String, email: String, username: String, password: String}} 
    */
    (val, idx) => {
    const data = val.split(',')

    if (idx === 0) {
        data.forEach(val => {
            dataColHead.push(val)
        })
        return
    }

    return {
        [dataColHead[0]]: data[0],
        [dataColHead[1]]: data[1],
        [dataColHead[2]]: data[2],
        [dataColHead[3]]: data[3],
        [dataColHead[4]]: data[4],
        [dataColHead[5]]: data[5]
    }
})

dataCol = dataCol.slice(1)

const input = dataCol.map((val) => {
    return `('${val.username}', '${bcrypt.hashSync(val.password, bcrypt.genSaltSync())}')`
})

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})


conn.query(`INSERT INTO \`user\`(\`username\`, \`password\`) VALUES ${input};`)

const email = dataCol.map((val) => {
    return { nim: val.nim, nama: val.nama, email: val.email, username: val.username, password: val.password }
})

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE_HOST,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    pool: true
});

transporter.verify((err, success) => {
    if (err) {
        console.log('Error on verifying SMTP connection:', err);
        res.status(500).send({ msg: `Error on verifying SMTP connection: ${err}` });
        return;
    }
});

email.forEach(val => {
    transporter.sendMail({
        from: `\"Panitia Pemilu Himsiskom Unperta\" <${process.env.EMAIL_USERNAME}>`,
        to: val.email,
        subject: 'Akun untuk Aplikasi Pemilihan Umum Ketua Himpunan Mahasiswa Komunikasi Universitas Pertamina',
        html: `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                    </style>
                </head>
                <body>
                    <p>Nama Mahasiswa: ${val.nama}</p>
                    <p>NIM: ${val.nim}</p>
                    <br/>
                    <p>Berikut kredensial untuk mengakses akun anda:</p>
                    <p>Username: ${val.username}</p>
                    <p>Password: ${val.password}</p>
                </body>
            </html>
        `
    }, (err, data) => {
        if (err) {
            console.log('Error on sending email:', err);
            res.status(500).send({ msg: 'Error on sending email', reason: err });
        } else {
            console.log('Email sent successfully');
            res.status(200).send({ msg: 'Email send successfully' });
        }
    });
})

process.exit(0)