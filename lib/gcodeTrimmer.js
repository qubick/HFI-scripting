var fs = require('fs');

module.exports = function(param){

  // console.log("in gcodeTrimmer, see param(program): ", param)

  var path    = './output/'
      ,input  = path + 'test.gcode'
      ,output = path + 'g2.gcode'
    // ,readText = read.sync('../output/test.gcode', 'utf8')
      ,gcode = fs.readFileSync(input).toString().split('\n') //sync read

  var lineSize = gcode.length
      ,lineCount = param


  // write a new gcod file
  var index = 0
  for(var i=lineCount; i<lineSize; i++){ //wipe out the first chunk
    gcode[index++] = gcode[i] + '\n'
  }
  fs.writeFileSync(output, gcode.join("")) //sync write

  console.log("finish gcodeTrimmer")
}
