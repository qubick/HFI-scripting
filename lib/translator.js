var exec = require('child_process').exec, child
    ,isJSON = require('is-JSON')
    ,gcodeTrimmer = require('./gcodeTrimmer')

// Modify here
var geomScript = 'openjscad ../CuraEngine/adjust_geometry.jscad -o ./output/test.stl'
    ,curaRunScript = '../CuraEngine/build/CuraEngine slice -j ../CuraEngine/resources/machines/fdmprinter.json -e0 -l ./output/test.stl -o ./output/test.gcode'

//step #0
//assuming we already sent the host model stl for slicing,
//and the original model is being processed in the gcod queue


//step #1
//get parameters:
//    elapsed time (paused height)
//    foreign item localization info ~ from leap motion

module.exports = function(program){ //program == commandline args

  // if(isJSON(program)){
    var time = parseInt(program.time) //parse parameters from cmdline
        ,filename = program.input //assume this is stl
        ,localization = program.local //<-- parse x,y coord && rotation angle
    console.log('see time')
  // }

  // step #2
  //call this by passing paramters to adjust_geometry.jscad
  //var geomScript = 'openjscad ../../CuraEngine/adjust_geometry.jscad -o ../output/' + filename + '.stl'
  var geomAdjustor = exec(geomScript,
    function(error, stdout, stderr) {
      console.log('stdout in calling geomAdjustor: ' + stdout);
      console.log('stderr: ' + stderr);
      if(error != null){
        console.log('exec error: ' + error);
      }
    });

  //step #3
  //run slicer for second time with the adjusted geometry
  // var curaScript = '../../CuraEngine/build/CuraEngine slice -j ../../CuraEngine/resources/machines/fdmprinter.json -e0 -l ../output/' + inputFile + ' -o ../output/' + outputFile + '.gcode'
  var slicing = exec(curaRunScript,
    function(error, stdout, stderr) {
      console.log('stdout in calling slicing: ' + stdout);
      console.log('stderr: ' + stderr);
      if(error != null){
        console.log('exec error: ' + error);
      } else {
        gcodeTrimmer(program.time)
      }
  });

  //step #4
  // trim new gcode to clean out printed model height

}


//step #5
//clean needless log files --> run synchronously
exec('rm ./isolate-*.log',
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
