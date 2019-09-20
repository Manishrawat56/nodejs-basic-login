const mysql = require('mysql');
const bcrypt = require('bcrypt');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'SMS'
  });

  connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn");
    }
    });



    module.exports.getUserById = function(id, callback){
      //User.findById(id, callback);
      connection.query('select * from users where id = ?',id,callback);
    }
    
    module.exports.getUserByUsername = function(username, callback){
      //var query = {username: username};
      connection.query(`select * from users where username = ? limit 1`,username,callback);
      //User.findOne(query, callback);
    }
    
    module.exports.comparePassword = function(candidatePassword, hash, callback){
      bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        //console.log("isMatch#"+isMatch);
          callback(null, isMatch);
      });
    }
    
  

  module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        
        console.log("newUser.password"+newUser.password);   
        connection.query('INSERT INTO users SET ?',newUser,callback);
               
   			//newUser.save(callback);
    	});
	});
}