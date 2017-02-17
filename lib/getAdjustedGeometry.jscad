function getParameterDefinitions() { //this is for gui widget
  return [
    { name: 'returnedZ', type: 'int', initial: '5', caption: 'z' },
    { name: 'location', type: 'group', caption: 'Location' },
    { name: 'xlocation', type: 'int', initial: '2', caption: 'x' },
    { name: 'ylocation', type: 'int', initial: '3', caption: 'y' },
    { name: 'rotatoin', type: 'group', caption: 'Rotation' },
    { name: 'xrotation', type: 'int', initial: '30', caption: 'x' },
    { name: 'yrotation', type: 'int', initial: '60', caption: 'y' },
    ];
}

function main( params ) {

  //parameters --> load this maybe by json?
  var returnedZ = params.returnedZ; //assume this is returned from the printer queue
  var locationX = params.xlocation; //assume these are returned by localization
  var locationY = params.ylocation;
  var rotationX = params.xrotation;
  var rotationY = params.yrotation;


console.log("\nsee parameters: ", returnedZ, locationX, locationY, rotationX, rotationY)

  //inputs
  var original = CSG.cube({radius:10}); //the original model
  var inserted = CSG.cube({radius:3}).translate([0,0,returnedZ]);
  var cutPlane = CSG.Plane.fromNormalAndPoint([0,0,1],[0,0,returnedZ]);

  //segment model in two parts
  // var partLower = original.cutByPlane(cutPlane); //already printed
  var partUpper = original.cutByPlane(cutPlane.flipped()); //not yet printed

  //localize the inserted mesh
  inserted.translate([locationX, locationY, 0])
          .rotateX(rotationX)
          .rotateY(rotationY) //do we want to care z-rotation for insertion?
          .scale(1.1); //scaling factor should be decided by extruder radius

  //upperPart geometry adjustment
  // var newGeometry = partUpper.subtract(inserted); --> trimming should be done after, otherwise we have to readjust z-height of 2nd gcode later
  var newGeometry = original.subtract(inserted);


  //geometry operations for further intervention
  // 1. ensure space to avoid collision with extruder
  // 2. define printable surface, etc.
  // ...

  return newGeometry
    // union(newGeometry,
    //       original//.translate([30,0,0])
    // );
}
