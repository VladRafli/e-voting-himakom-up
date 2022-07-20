const fs = require('fs')
const bcrypt = require('bcrypt')
const mysql = require('mysql2')
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

process.exit(0)