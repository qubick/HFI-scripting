var exec = require('child_process').exec, child
    ,isJSON = require('is-JSON')
    ,gcodeTrimmer = require('./gcodeTrimmer')
    ,fs = require('fs');

// Modify here
var geomScriptPath = 'openjscad lib/'
    ,curaRunScriptPath = '../CuraEngine/build/CuraEngine slice -j ../CuraEngine/resources/machines/fdmprinter.json -e0'
    ,viewerScript = 'python ./yagv/yagv'


module.exports = function(program){ //program == commandline args

  //step #1
  //get parameters:
  //    elapsed time (paused height)
  //    foreign item localization info ~ from leap motion


  // if(isJSON(program)){
    var time = parseInt(program.time) //parse parameters from cmdline
        ,filename = program.input //assume this is stl
        ,localization = program.local //<-- parse x,y coord && rotation angle
    console.log('see time')
  // }


  //step #1-1
  //assuming we already sent the host model stl for slicing,
  //and the original model is being processed in the gcod queue
  var printedGeom = geomScriptPath + 'getPrintedGeometry.jscad -o ./output/lower.stl' //this is purely for debugging purpose
      ,originGcode = curaRunScriptPath + ' -l ./output/lower.stl -o ./output/lower.gcode'

  //given stopping time, get the original stl chunked
  exec(printedGeom, function(err, stdout, stderr){
    if(err != null){
      console.log("generate printed stl: ", stderr)
    }
    else {
      //get the first gcode (assuming it is printed already)
      exec(originGcode, function(err, stdout, stderr){
        if(err != null){
          console.log(stderr)
        }
        else{
          // step #2
          //call this by passing paramters to adjust_geometry.jscad
          geomScript = geomScriptPath + 'getAdjustedGeometry.jscad' + ' -o ./output/new.stl'
          var geomAdjustor = exec(geomScript, function(err, stdout, stderr) {
            if(err != null) {
              console.log('exec error: ' + err);
            } else{
//done up to here

            //step #3
            //run slicer again with the adjusted geometry
              curaRunScript = curaRunScriptPath + ' -l ./output/new.stl' //+ ' -o new.gcode'
              var slicing = exec(curaRunScript, function(err, stdout, stderr) {
                if(err != null) {
                  console.log('exec error: ' + err);
                }
                else { //if succeed to slice new adjusted geometry

            //step #4
            // trim new gcode to clean out printed model height
                  gcodeTrimmer(program.time, 'new.stl', 'upper.gcode') //this generate upper part gcode

                  //concatenate all Gcode
                  gcode1 = fs.readFileSync('./output/lower.gcode')
                  gcode2 = fs.readFileSync('./output/upper.gcode')

                  gcode1 = gcode1 + gcode2

                  fs.writeFileSync('result.gcode', gcode1)

                  viewerScript = viewerScript + ' upper.gcode'//outputFile
                  var viewer = exec(viewerScript, function(err, stdout, stderr) {
                    console.log('stdout in calling gcodeviewer: ' + stdout);
                    if(error != null){
                      console.log('exec error: ' + err);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}


//step #5
//clean needless log files --> run synchronously
exec('rm isolate-*.log',
  function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if(error != null){
      console.log('exec error: ' + error);
    }
});


// module.exports = function(){
//
// }
