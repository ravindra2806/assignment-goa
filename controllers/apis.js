// Apis controller
// including initial libraries
var Config = require('../config/config.js');
var distance = require('../distance.js');
var tj = require('@mapbox/togeojson');
var fs = require('fs');
DOMParser = require('xmldom').DOMParser;
//distance.getDistance()
  var sessions = {}; // Current session information
  
  class Apis {

    constructor(){

    }

    index(req, res, next) {
      res.render('index.html', {
        
      });
    }
  
  
    // Function: getLatLngByAddress
    // Description: get polygon data
    // Parameter: post
    // return: string
    getLatLngByAddress(start,cb) {
      var allPromises = [];
      var myPromise;
      var kml = new DOMParser().parseFromString(fs.readFileSync('FullStackTest_DeliveryAreas.kml', 'utf8'));
      var converted = tj.kml(kml);
      console.log("--------------------->>",start,converted.features[0].geometry.coordinates);
      var returnobj = [];
      
      for(var i=0;i<converted.features.length;i++){

        var name = converted.features[i].properties.name;
        myPromise = (function() {
          var lat = converted.features[0].geometry.coordinates[1];
          var lng = converted.features[0].geometry.coordinates[0];
          var end = {"lat": lat, "lng": lng};
          var distance2 = distance.getDistance(start,end);
          
          if(distance2 != NaN){
            returnobj.push(name);
            console.log({"name":name, "distance":distance2});
          }
        })();
        allPromises.push(myPromise);
      }

      Promise.all(allPromises).then(function() {
        //console.log("---->",returnobj);
        cb(returnobj[0]);
      }, reason => {
        
      });
      //var convertedWithStyles = tj.kml(kml, { styles: true }
    }
      
        
    // Function: submit
    // Description: submit
    // Parameter: post
    // return: string
    submit(req,res, next){     
      var self = this;
      var url = Config.api.url;
      var key = Config.api.key;
      var address = req.body.srchVal;
      var fullURL = url+address+'&key='+key
      
      var request = require('request');
        request(fullURL, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            //console.log(JSON.parse(body)) // Show the HTML for the Google homepage. 
            var resp = JSON.parse(body);
            var latLng = resp.results[0].geometry.location;
            if(latLng == undefined){
              res.send({"success":1,"msg":"No result found","data":[]});
              res.end();
            }else{
              self.getLatLngByAddress(latLng,(success)=>{
                  res.send({"success":1,"msg":success,"data":[]});
                  //res.send(success);
                  res.end();
              });
            }
          }
          else {
            console.log("Error "+response.statusCode)
          }
      })
    } 
    
  }
  
module.exports = Apis;