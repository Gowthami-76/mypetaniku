
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var bodyparser = require('body-parser')
var mongoose = require('mongoose');
var cors = require('cors');
var db = require('./resources/db.config');


//  const serverOptions = {
//   poolSize: 100,
//   socketOptions: {
//     socketTimeoutMS: 6000000
//   }
// };

 

mongoose.connect(db, { useNewUrlParser: true , useUnifiedTopology: true , useCreateIndex: true } , err =>{
  if (err) {
		console.error('Error!' + err);
	} else {
		console.log('Connected to mongoDB');
	}
})




var  userRouter = require('./routes/api/user')






var app = express(); 


app.use(logger('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors());

// URL'S
app.use('/api' , userRouter)



app.listen(5000 , () =>{
  console.log('App listen on port 5000')
})

module.exports = app;
