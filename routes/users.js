var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var User = require('../models/users');
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
router.post('/register',[check('name','Name field is required').exists(),
check('name','Name field is required').exists(),
check('email','Email field is required').exists(),
check('email','Email is not valid').isEmail(),
check('username','Username field is required').exists(),
check('password','Password field is required').exists(),
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
    var errors = req.validationErrors();
  
    if(errors){
      res.render('register', {
        errors: errors
      });
    } else{
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

               User.createUser(newUser, function(err, user){
                if(err) throw err;
                console.log(user);
              });
          
              req.flash('success', 'You are now registered and can login');
          
              res.location('/');
              res.redirect('/');
    }
});
module.exports = router;
