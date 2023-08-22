const express = require('express')
const router = express.Router();
const {forwardAuthenticated } = require('../auth');
const User = require('../models/userSch')
router.get('/',forwardAuthenticated,(req,res)=>{
    res.render('welcome')
})

router.get('/dashboard',forwardAuthenticated,(req,res)=>{
    res.render('dashboard',{
       
    })
})

module.exports = router