const express = require('express')
const router = express.Router();
const userSchema = require('../models/userSch')
const bcrypt =require('bcryptjs')
const passport = require('passport')
const { forwardAuthenticated } = require('../auth');

//LOGIN PAGE
router.get('/login',forwardAuthenticated,(req,res)=>{
    res.render('login')
})

//REGISTER PAGE
router.get('/register',forwardAuthenticated,(req,res)=>{
    try{res.render('register')}
    catch(err){
        console.log(err)
    }
})

// HANDLE REGISTER
router.post('/register',(req,res)=>{
    const {name,email,password,password2}=req.body;
    let errors=[];
    //check required fileds
    if (!name || !email || !password ||!password2) {
        errors.push({msg:'All fields but be filled'});
    }
    //check passwords matching
    if(password!=password2){
        errors.push({msg:'password is not matching'})
    }
    //check password length
    if(password.length<8){
        errors.push({msg:'password must be atleast of 8 characters'})
    }

    if (errors.length>0) {
       res.render('register',{
        errors,
        name,
        email,
        password,
        password2})
    }else{
        //validation passed
        userSchema.findOne({email})
        .then((user)=>
        {if(user){
            errors.push({msg:'User already exists'})
            res.render('register',{
                errors,
                name,
                email,
                password,
                password2})
            }
            else{
                const newUser = new userSchema({
                    name,
                    email,
                    password
                })
                //hashing and salting
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password = hash
                        newUser.save()
                        .then(user =>{
                            req.flash('success_msg','you are now registered') 
                            res.redirect('login')   
                        })
                        .catch((err)=>{
                            console.log(err.message)
                        })
                    })
                })
            }
        })
    }

})

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
   
})

router.get('/logout',(req,res,next)=>{
    // req.logout()
    req.flash('success_msg','You are successfully logged out!')
    res.redirect('/users/login')
})

module.exports = router