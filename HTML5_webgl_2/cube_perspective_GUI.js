var canvas;
var gl;

var NumVertices  = 36;

var pointsArray = [];
var colorsArray = [];

var vertices = [
    [ 1.0, -1.0, -1.0, 1.0,],
    [ 1.0, -1.0,  1.0, 1.0,],
    [ 1.0,  1.0,  1.0, 1.0,],
    [ 1.0,  1.0, -1.0, 1.0,],
    [-1.0, -1.0, -1.0, 1.0,],
    [-1.0, -1.0,  1.0, 1.0,],
    [-1.0,  1.0,  1.0, 1.0,],
    [-1.0,  1.0, -1.0, 1.0,] ];

var vertexColors = [
    [0.0, 0.0, 0.0, 1.0,],  // black
    [1.0, 0.0, 0.0, 1.0,],  // red
    [1.0, 1.0, 0.0, 1.0,],  // yellow
    [0.0, 1.0, 0.0, 1.0,],  // green
    [0.0, 0.0, 1.0, 1.0,],  // blue
    [1.0, 0.0, 1.0, 1.0,],  // magenta
    [0.0, 1.0, 1.0, 1.0,],  // cyan
    [1.0, 1.0, 1.0, 1.0,]  // white
];

var  controls = {
    near : 1,
    far : 100,
    D : 5.0,
    theta : 1.57,
    phi  : 1.57,
    fovy : 40.0,  // Field-of-view in Y direction angle (in degrees)
    enable : true
   }
// var  controls = new function(){
//     this.near = 1;
//     this.far = 100;
//     this.D = 5.0;
//     this.theta = 1.57;
//     this.phi = 1.57;
//     this.fovy = 40.0;
//   }

var dr = 5.0 * Math.PI/180.0;

var  aspect;       // Viewport aspect ratio

var mvMatrix, cameraMatrix, pMatrix;
var modelView, projection;
var eye;
var at = [0, 0, 0];
var up = [0, 0, 1];

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]); 
     colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[b]); 
     colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[c]); 
     colorsArray.push(vertexColors[a]);     
     pointsArray.push(vertices[a]); 
     colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[c]); 
     colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[d]); 
     colorsArray.push(vertexColors[a]);  
}

function colorCube(){
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function define_gui(){
var gui = new dat.GUI();

    gui.add(controls,"near").min(1).max(10).step(1).onChange(function() {
        render();});
    gui.add(controls,"far").min(1).max(100).step(1).onChange(function() {
        render();});
    gui.add(controls,"D").min(0).max(10).step(1).onChange(function() {
        render();});
    gui.add(controls,"theta").min(0).max(6.28).step(dr).onChange(function() {
        render();});
    gui.add(controls,"phi").min(0).max(3.14).step(dr).onChange(function() {
        render();});
    gui.add(controls,"fovy").min(10).max(120).step(5).onChange(function() {
            render();});
//   gui.add(controls, "casciola").onChange(function(newValue) {
//       console.log("Value changed to:  ", newValue);
//   });
    gui.add(controls, "enable")
}

window.onload = function init() {

    define_gui();
    
    canvas = document.getElementById( "mycanvas" );
 
    gl = canvas.getContext("webgl");
    if (!gl) {
      alert( "WebGL isn't available" );
      return;
    } 

    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    aspect =  canvas.width/canvas.height;
    
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //gl.enable(gl.CULL_FACE,null);
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    //
    // setup GLSL program
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader", "fragment-shader"]);
    gl.useProgram( program );
    
    colorCube();

    // console.log(pointsArray.length);
    // var temp=webglUtils.createAugmentedTypedArray(4, 36);
    // for (var i=0; i<pointsArray.length; i++){
    //     temp.push(pointsArray[i]);
    // }
    // pointsArray=temp;
    // console.log(pointsArray)

    pointsArray=m4.flatten(pointsArray);
    colorsArray=m4.flatten(colorsArray);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, colorsArray, gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, pointsArray, gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
 
    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );
       
    render(); 
}

function degToRad(d) {
   return d * Math.PI / 180;
}

function radToDeg(r) {
    return r * 180 / Math.PI;
 }

var render = function(){

    if (controls.enable){
    // Tell WebGL how to convert from clip space to pixels
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

    eye = [controls.D*Math.sin(controls.phi)*Math.cos(controls.theta), 
           controls.D*Math.sin(controls.phi)*Math.sin(controls.theta),
           controls.D*Math.cos(controls.phi)];
    // Compute the camera's matrix
    var cameraMatrix = m4.lookAt(eye, at, up);
    
   // Make a view matrix from the camera matrix.
    var mvMatrix = m4.inverse(cameraMatrix);

    // Compute the projection matrix
    var pMatrix = m4.perspective(degToRad(controls.fovy), aspect, controls.near, controls.far);

    gl.uniformMatrix4fv( modelView, false, mvMatrix );
    gl.uniformMatrix4fv( projection, false, pMatrix );            
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    }
}
