var fs = require('fs');

module.exports = function(time, inFile, outFile){

  // console.log("in gcodeTrimmer, see param(program): ", param)

  var path    = './output/'
      ,input  = path + inFile //'new.gcode' //this needs to be passed from cmd
      ,output = path + outFile //'upper.gcode'
    // ,readText = read.sync('../output/test.gcode', 'utf8')
      ,gcode = fs.readFileSync(input).toString().split('\n') //sync read

  var lineSize = gcode.length
      ,lineCount = time * 3 //this is relative (tentatively), should be the layer numbers


  //insert command to return the extruder position
  var index = 0
  for(var i=lineCount; i<lineSize; i++){ //wipe out the first chunk
    gcode[index++] = gcode[i] + '\n'
  }
  fs.writeFileSync(output, gcode.join("")) //sync write in sequence

  console.log("finish gcodeTrimmer")
}
