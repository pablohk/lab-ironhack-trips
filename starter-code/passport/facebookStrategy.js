const passport = require("passport");
const User = require('../models/User');
const FaceBookStrategy = require("passport-facebook").Strategy;

const FB_CLIENT_ID = process.env.FBclientID;
const FB_CLIENT_SECRET = process.env.FBclientSecret;

passport.use(new FaceBookStrategy({
  clientID: FB_CLIENT_ID,
  clientSecret: FB_CLIENT_SECRET,
  callbackURL: "authFacebook/callback"
},
(accessToken, refreshToken, profile, done) => {
  User.findOne({ provider_id: profile.id }, (err, user) => {
    if (err) { return done(err);  }
    if (user) { return done(null, user); }

    const newUser = new User({
      provider_id: profile.id,
      provider_name:profile.displayName
    });

    newUser.save((err) => {
      if (err) { return done(err); }
      done(null, newUser);
    });
  });

}
));
