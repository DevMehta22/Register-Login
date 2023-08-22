require("dotenv").config()
const mongoose = require('mongoose')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

require('./passport')(passport)

app.use(expressLayouts)
app.set('view engine','ejs')

app.use(express.urlencoded({extended:false}))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true 
  }))

app.use(passport.initialize())
app.use(passport.session())  

app.use(flash())

app.use(function(err, req, res, next) {
    console.log(err);
});

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next();
})

const router = require('./Routes/app')
const router1 = require('./Routes/users')

app.use(express.json())
app.use('/',router)
app.use('/users',router1)
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('connected to DB!')
    const port= process.env.PORT || 5000
    app.listen(port,(err)=>{
        if (err) throw err
        console.log(`server is running on port:${port}`)
    })}
    ).catch((err)=>{
        console.log(err)
    })
