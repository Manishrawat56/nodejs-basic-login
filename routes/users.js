var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var User = require('../models/users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const {check, validationResult} = require('express-validator');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{title:"Register"});
});

router.get('/login', function(req, res, next) {
  res.render('login',{title:"Login"});
});

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}),
  function(req, res) {
   req.flash('success', 'You are now logged in');
   res.redirect('/');
});

passport.serializeUser(function(user, done) {
  console.log("done "+done+"\nuser "+JSON.stringify(user));
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("done "+done+"n\id "+id);
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  //console.log("username "+username+"\npassword "+password);
  User.getUserByUsername(username, function(err, result){
    let user=result[0];
    //console.log("err "+err+"\nuser "+JSON.stringify(user));
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }
    //console.log("password "+password+"\nuser.password "+user.password);
    User.comparePassword(password, user.password, function(err, isMatch){
      //console.log("err "+err+"\nisMatch "+isMatch);
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message:'Invalid Password'});
      }
    });
  });
}));

router.post('/register',[check('name','Name field is required').isEmpty(),

check('email','Email field is required').isEmpty(),
check('email','Email is not valid').isEmail(),
check('username','Username field is required').isEmpty(),
check('password','Password field is required').isEmpty(),
check('password2','Passwords do not match').custom((value, { req }) => value === req.body.password)
],upload.single('profileimage'), function(req, res, next) {
  let name=req.body.name;
  let email=req.body.email;
  let username=req.body.username;
  let password=req.body.password;
  let password2=req.body.password2;
  if(req.file){
  	console.log('Uploading File...');
  	var profileimage = req.file.filename;
  } else {
  	console.log('No File Uploaded...');
  	var profileimage = 'noimage.jpg';
  }

    // Form Validator
   
  
    // Check Errors
    //var errors = req.validationErrors();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('register', {
        errors: errors.array()
      });
      //return res.status(422).json({ errors: errors.array() });
    }
  
    /* if(errors){
      res.render('register', {
        errors: errors
      });
    }  */else{
      console.log('No Errors');

      var today = new Date();
               var newUser={
                 id:0,
                 name: name,
                 email: email,
                 username: username,
                 password: password,
                 profileimage: profileimage,
                 "created":today,
                 "modified":today
               }  
               console.log("newUser"+JSON.stringify(newUser));
              User.createUser(newUser, function(err, user){
                if(err) throw err;
                console.log(user);
              });
          
              req.flash('success', 'You are now registered and can login');
          
              res.location('/');
              res.redirect('/');
    }
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('info', 'You are now logged out');
  res.redirect('/users/login');
});
module.exports = router;
