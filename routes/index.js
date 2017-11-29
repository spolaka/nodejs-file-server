
const express = require('express');
const router = express.Router();
var path = require('path');
const fs = require('fs');




router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname , '..' , 'views','index.html'));
});

router.post('/nwfld', (req, res) => {
  console.log(req.body);
  var fldr = req.body.fldr;
  var nfldr = req.body.nfldr;
  console.log(fldr);
  console.log(nfldr);
  var dirPath = path.join(__dirname , '..' , 'public' , fldr , nfldr);
  fs.mkdirSync(dirPath);  
  res.send({"res" : "OK"});
});

router.get('/Folder', (req, res) => {
  var Results=[];  
  var fldr = req.query.fldr;
  console.log(fldr);
  if(fldr === ''){
     var cr = new Object();;
     cr.path = "/";
     cr.name = "/";
     cr.fld = true;
     Results.push(cr);
  }
  else{
    var fd = path.join(__dirname , '..' , 'public' , fldr);
    var files = fs.readdirSync(fd);
    for (var i in files) {
      var cr = new Object();
      if(fldr == '/'){
        cr.path = "/" + files[i];
      }
      else{
        cr.path = fldr + "/" + files[i];
      }
      cr.name = files[i];
      cr.fld = fs.statSync(fd + "/" + files[i]).isDirectory();
      Results.push(cr);
    }

  }
  var rt = {};
  rt.Results = Results; 
  res.json(rt);   
});

function renderError(e, res) {
  e.innerError = (e.response) ? e.response.text : '';
  console.log(e);
}

module.exports = router;
