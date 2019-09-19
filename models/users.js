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