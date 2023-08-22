const localstrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const userSchema = require('./models/userSch')

module.exports = (passport)=>{
    passport.use(
        new localstrategy({usernameField:'email'},(email,password,done)=>{
            userSchema.findOne({email:email})
            .then(user=>{
                if(!user){
                    return done(null,false,{message:'Email not registered'})    
                }

                bcrypt.compare(password,user.password,(isMatch)=>{
                    if(isMatch==undefined){
                        return done(null,user)
                    }else{
                        return done(null,false,{message:'Password is incorrect'})
                        
                    }
                })

            })
            .catch((err)=>{
                console.log(err)
            })

        })
    )
    passport.serializeUser((userSchema, done)=> {
          done(null,userSchema.id)  
      });
      
      passport.deserializeUser((id, done)=> {
        userSchema.findOne({where:{id:id}}).then((user)=>{
            done(null,user)
        });
      });
}