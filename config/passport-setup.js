const passport = require('passport');
const keys = require('./keys')
const GoogleStrategy =  require('passport-google-oauth20')
const User = require('../models/user-model')

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then(user=>{
        done(null,user);
    });
});


passport.use(
    new GoogleStrategy({
        //option for the google strat
        callbackURL:'/auth/google/redirect',
        clientID:keys.google.clientID,
        clientSecret:keys.google.clientSecret
    },(accessToken,refreshToken,profile,done) =>{
        //passport callback function
        //console.log('passport callback function fired')
        //console.log(profile);
        //check if user already exists in our database  
        console.log(profile);
        User.findOne({googleId:profile.id}).then((currentUser)=>{
            if (currentUser) {
                //already have the user
                console.log('user is'+currentUser);
                done(null,currentUser);
            }else{
        new User({
        username: profile.displayName,
        googleId:profile.id,
        thumbnail:profile._json.picture
    }).save().then((newUser)=>{
        console.log('new user created'+ newUser);
        done(null,newUser);
    });
                
            }
        });
    })
    
)