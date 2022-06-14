const express = require('express');
const usersRepo = require('./repositories/users.js')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session');
const router = require('./routes/admin/auth.js')

const app = express();


app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieSession({
    keys: ['flutbrtmiaptiwetnWTpia058a420q34vnp4v8[2-qb9-3v9n-0w385vb3qc80']
}))

app.listen(3000, ()=>{
    console.log('Listening')
})

app.use(router)