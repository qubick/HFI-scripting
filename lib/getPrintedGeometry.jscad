//since jscad can't export two stl separately.
//this is purely for our debugging simulation
function getParameterDefinitions() { //this is for gui widget
  return [
    { name: 'returnedZ', type: 'int', initial: '5', caption: 'z' },
    ];
}

function main( params ) {

  var returnedZ = params.returnedZ; //assume this is returned from the printer queue

  //inputs
  var original = CSG.cube({radius:10}); //the original model
  // var inserted = CSG.cube({radius:3}).translate([0,0,returnedZ]);
  var cutPlane = CSG.Plane.fromNormalAndPoint([0,0,1],[0,0,returnedZ]);

  //segment model in two parts
  var partLower = original.cutByPlane(cutPlane); //already printed


  return partLower
}
