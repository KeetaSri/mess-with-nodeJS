import alert from 'alert-node'

var express = require('express');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var path = require('path');
var fs = require('fs-extra');
var cookieParser = require('cookie-parser')

var app = express();

app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
   console.log("Cookies: ", req.cookies)
})

app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})

app.get('/process_get', function (req, res) {

   response = {
      first_name:req.query.first_name,
      last_name:req.query.last_name
   };
   console.log(response);
   alert("Register completed")
   // res.end(JSON.stringify(response));
})

app.post('/file_upload', function (req, res, next) {
      var fstream;
      req.pipe(req.busboy);
      req.busboy.on('file', function (fieldname, file, filename) {
          console.log("Uploading: " + filename);

          fstream = fs.createWriteStream(__dirname + '/uploads/' + filename);
          file.pipe(fstream);
          fstream.on('close', function () {
              console.log("Upload Finished of " + filename);
              alert("Upload done boi")
              res.redirect('back');
          });
      });
});

app.listen(3000)
