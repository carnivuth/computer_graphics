/*============= Creating a canvas ======================*/ 
var canvas = document.getElementById('my_Canvas');
gl = canvas.getContext('webgl');
/*========== Defining and storing the geometry ==========*/
var vertices=[
-1,-1,-1, 1,-1,-1, 1,1,-1, -1,1,-1, -1,-1,1, 1,-1,1, 1,1,1, -1,1,1, -1,-1,-1, -1,1,-1, -1, 1,1, -1,-1,1,
1,-1,-1, 1,1,-1, 1,1,1, 1,-1,1, -1,-1,-1, -1,-1,1, 1,-1,1, 1,-1,-1, -1,1,-1, -1,1,1, 1,1,1, 1,1,-1,];
var colors=[
   1,0,1,  1,0,1,  1,0,1,  1,0,1,
   1,0,0,  1,0,0,  1,0,0,  1,0,0,
   0,0,1,  0,0,1,  0,0,1,  0,0,1,
   0,1,1,  0,1,1,  0,1,1,  0,1,1,
   1,1,0,  1,1,0,  1,1,0,  1,1,0,
   0,1,0,  0,1,0,  0,1,0,  0,1,0,];
var indices = [
0,1,2, 0,2,3, 4,5,6, 4,6,7, 8,9,10, 8,10,11, 12,13,14, 12,14,15, 16,17,18, 16,18,19, 20,21,22, 20,22,23 ];
// Create and store data into vertex buffer 
var vertex_buffer = gl.createBuffer (); 
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer); 
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
// Create and store data into color buffer 
var color_buffer = gl.createBuffer (); 
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer); 
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
// Create and store data into index buffer
var index_buffer= gl.createBuffer (); 
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer); 
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW); 
/*=================== SHADERS =================== */

// var vertCode = document.getElementById("vertex-shader").text;

// var fragCode = document.getElementById("fragment-shader").text;

// var vertShader = gl.createShader(gl.VERTEX_SHADER); 
// gl.shaderSource(vertShader, vertCode); 
// gl.compileShader(vertShader);

// var fragShader = gl.createShader(gl.FRAGMENT_SHADER); 
// gl.shaderSource(fragShader, fragCode); 
// gl.compileShader(fragShader);

// var shaderprogram=gl.createProgram(); 
// gl.attachShader(shaderprogram, vertShader); 
// gl.attachShader(shaderprogram, fragShader);
// gl.linkProgram(shaderprogram); 

//usa libreria webgl-utilis.js
var shaderprogram = webglUtils.createProgramFromScripts(gl, ["vertex-shader", "fragment-shader"]);
    
/*======== Associating attributes to vertex shader =====*/
var _Pmatrix = gl.getUniformLocation(shaderprogram, "Pmatrix"); 
var _Vmatrix = gl.getUniformLocation(shaderprogram, "Vmatrix"); 
var _Mmatrix = gl.getUniformLocation(shaderprogram, "Mmatrix");

gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
var _position = gl.getAttribLocation(shaderprogram, "position"); 
gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0); 
gl.enableVertexAttribArray(_position);

gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
var _color = gl.getAttribLocation(shaderprogram, "color"); 
gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,0,0) ; 
gl.enableVertexAttribArray(_color);

gl.useProgram(shaderprogram);   

/*==================== MATRIX ====================== */
// function get_projection(angle, a, zMin, zMax) {
// var ang=Math.tan((angle*.5)*Math.PI/180);//angle*.5 
// //return [
// //   1/(ang*a), 0 ,   0, 0,
// //    0, 1/ang,  0, 0,
// //    0, 0, -(zMax+zMin)/(zMax-zMin), -1,
// //    0, 0, -(2*zMax*zMin)/(zMax-zMin), 0 ];
//var proj_matrix=get_projection(40, canvas.width/canvas.height, 1, 100);

function degToRad(d) {
   return d * Math.PI / 180;
}

//usa libreria m4.js per definire proj_matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var zNear = 1;
    var zFar = 100;
    var fov = 40;
    var proj_matrix = m4.perspective(degToRad(fov), aspect, zNear, zFar);
//console.log(proj_matrix);

//  var mo_matrix=[
//     1,0,0,0,
//     0,1,0,0,
//     0,0,1,0,
//     0,0,0,1];

//  var view_matrix=[
//     1,0,0,0,
//     0,1,0,0,
//     0,0,1,0,
//     0,0,0,1];
// view_matrix[14]=view_matrix[14]-5; 

//usa libreria m4.js per definire view_matrix
    var THETA=0, PHI=0, D=5;
    var camera = [D*Math.sin(PHI)*Math.cos(THETA),
              D*Math.sin(PHI)*Math.sin(THETA),
              D*Math.cos(PHI)];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    var view_matrix = m4.inverse(m4.lookAt(camera, target, up));

gl.uniformMatrix4fv(_Pmatrix, false, proj_matrix); 
gl.uniformMatrix4fv(_Vmatrix, false, view_matrix); 

/*================= Mouse events ======================*/
 var AMORTIZATION=0.95;
 var drag=false;
 var old_x, old_y;
 var dX=0, dY=0;

 var mouseDown=function(e) {
    drag=true;
    old_x=e.pageX, old_y=e.pageY;
    e.preventDefault();
    return false;
 };
var mouseUp=function(e){
   drag=false;
};
var mouseMove=function(e) {
if (!drag) return false; 
dX=(e.pageX-old_x)*2*Math.PI/canvas.width, 
dY=(e.pageY-old_y)*2*Math.PI/canvas.height; 
THETA+=dX;
PHI+=dY;
old_x=e.pageX, old_y=e.pageY; 
e.preventDefault();
};

canvas.onmousedown=mouseDown;
canvas.onmouseup=mouseUp;
canvas.mouseout=mouseUp;
canvas.onmousemove=mouseMove;

/*=========================rotation================*/
//    function rotateX(m, angle) {
//    var c=Math.cos(angle);
//    var s=Math.sin(angle);
//    var mv1=m[1], mv5=m[5], mv9=m[9];
//    m[1]=m[1]*c-m[2]*s;
//    m[5]=m[5]*c-m[6]*s;
//    m[9]=m[9]*c-m[10]*s;
//    m[2]=m[2]*c+mv1*s;
//    m[6]=m[6]*c+mv5*s;
//    m[10]=m[10]*c+mv9*s;
// }
// function rotateY(m, angle) {
//    var c=Math.cos(angle);
//    var s=Math.sin(angle);
//    var mv0=m[0], mv4=m[4], mv8=m[8]; 
//    m[0]=c*m[0]+s*m[2]; 
//    m[4]=c*m[4]+s*m[6]; 
//    m[8]=c*m[8]+s*m[10];
//    m[2]=c*m[2]-s*mv0;
//    m[6]=c*m[6]-s*mv4;
//    m[10]=c*m[10]-s*mv8;
// }
/*=================== Drawing =================== */
//var THETA=0, PHI=0;
var time_old=0;

var render=function(time) {
var dt=time-time_old;
//      document.write(time);
//      console.log(time);
      if (!drag) {
         dX*=AMORTIZATION, dY*=AMORTIZATION;
         THETA+=dX, PHI+=dY;
      }
//set model matrix to I4
// var mo_matrix=[
//     1,0,0,0,
//     0,1,0,0,
//     0,0,1,0,
//     0,0,0,1];
// rotateY(mo_matrix, THETA); 
// rotateX(mo_matrix, PHI); 
//usa libreria m4.js per definire le rotazioni
var mo_matrix=[];
m4.identity(mo_matrix);
m4.yRotate(mo_matrix, THETA, mo_matrix);
m4.xRotate(mo_matrix, PHI, mo_matrix);

time_old=time;          
gl.enable(gl.DEPTH_TEST);
// gl.depthFunc(gl.LEQUAL); 
gl.clearColor(0.75, 0.75, 0.75, 1); 
gl.clearDepth(1.0);
gl.viewport(0.0, 0.0, canvas.width, canvas.height); 
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
// gl.uniformMatrix4fv(_Pmatrix, false, proj_matrix); 
// gl.uniformMatrix4fv(_Vmatrix, false, view_matrix); 
gl.uniformMatrix4fv(_Mmatrix, false, mo_matrix);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

window.requestAnimationFrame(render); 
}

render(0);