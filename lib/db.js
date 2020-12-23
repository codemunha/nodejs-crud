let mysql = require('mysql')
let connection = mysql.createConnection({
  host: "localhost",
  user: "user",
  password: "P@ssw0rd",
  database: "mydb"
})

connection.connect((error) => {
  if(!!error){
    console.log(error)
  } else{
    console.log('Connected...')
  }
})

module.exports = connection