var canvas, gl;

var  controls = {
    near : 1,
    far : 100,
    d : 8.5,
    fov : 40.0,  // Field-of-view in Y direction angle (in degrees)
    theta_light : degToRad(20),
    phi_light  : degToRad(80),
    d_light : 8.5,
   }

//camera initial position
var THETA=degToRad(20), PHI=degToRad(80);
var D = 8.5;

//var light=[-2,-3,5,1];
//light initial position
var theta=THETA, phi=PHI;
var d = D;

//define a gui
var gc_btnw=6, gc_btnh=3;
var btnw=gc_btnw.toString()+"%", btnh=gc_btnh.toString()+"%";
var stheta=radToDeg(theta).toString()+"%";
var sphi=radToDeg(phi).toString()+"%";

//usa libreria m4.js per definire proj_matrix
var near = 1;
var far = 100;
var fov = 40;
var dr = 5.0 * Math.PI/180.0;
var aspect;

var target = [0, 0, 0];
//get_target();
//target = [0, 0, 1.1];
var up = [0, 0, 1];

var plane_normal=[0,0,1];
var plane_vertex=[0,0,-1.0125];
var mo_matrix2=[];

var drag;
var alpha = 0;

var vertex_buffer, vertex_buffer2;
var color_buffer, color_buffer2;
var color_buffer_shadow;
var index_buffer, index_buffer2;
var _Pmatrix;
var _Vmatrix;
var _Mmatrix;
var _position;
var _color;

/*========== Defining and storing the geometry ==========*/
var vertices=[
-1,-1,-1, 1,-1,-1, 1,1,-1, -1,1,-1, -1,-1,1, 1,-1,1, 1,1,1, -1,1,1, -1,-1,-1, -1,1,-1, -1,1,1, -1,-1,1,
1,-1,-1, 1,1,-1, 1,1,1, 1,-1,1, -1,-1,-1, -1,-1,1, 1,-1,1, 1,-1,-1, -1,1,-1, -1,1,1, 1,1,1, 1,1,-1,];
var colors=[
   1,0,1,  1,0,1,  1,0,1,  1,0,1,
   1,0,0,  1,0,0,  1,0,0,  1,0,0,
   0,0,1,  0,0,1,  0,0,1,  0,0,1,
   0,1,1,  0,1,1,  0,1,1,  0,1,1,
   1,1,0,  1,1,0,  1,1,0,  1,1,0,
   0,1,0,  0,1,0,  0,1,0,  0,1,0,];

var col=0.75;
var colors_shadow=[];
for (var i=0; i<72; i++)
   colors_shadow[i]=col;

var indices = [
0,1,2, 0,2,3, 4,5,6, 4,6,7, 8,9,10, 8,10,11, 12,13,14, 12,14,15, 16,17,18, 16,18,19, 20,21,22, 20,22,23 ];

var vertices2=[
-1,-1,-1, 1,-1,-1, 1,1,-1, -1,1,-1, -1,-1,1, 1,-1,1, 1,1,1, -1,1,1,];
var colors2=[
   0,0,0,  0,0,0,  0,0,0,  0,0,0,
   0,0,0,  0,0,0,  0,0,0,  0,0,0];
var indices2 = [
 0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 1,5, 2,6, 3,7, 0,4]; 

window.onload = function init() {

/*============= Creating a canvas ======================*/ 
canvas = document.getElementById( "mycanvas" );
gl = canvas.getContext("webgl");
if (!gl) {
   alert( "WebGL isn't available" );
 } 

aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

canvas.onmousedown=mouseDown;
canvas.onmouseup=mouseUp;
canvas.mouseout=mouseUp;
canvas.onmousemove=mouseMove;

var gui = new dat.GUI();

gui.add(controls,"near").min(1).max(10).step(1).onChange(function() {
    render();});
gui.add(controls,"far").min(1).max(100).step(1).onChange(function() {
    render();});
gui.add(controls,"d").min(0).max(10).step(1).onChange(function() {
    render();});
gui.add(controls,"fov").min(10).max(120).step(5).onChange(function() {
    render();});
gui.add(controls,"theta_light").min(0).max(6.28).step(dr).onChange(function() {
    render();});
gui.add(controls,"phi_light").min(0).max(3.14).step(dr).onChange(function() {
    render();});
gui.add(controls,"d_light").min(1.75).max(10).step(1).onChange(function() {
    render();});

// Create and store data into vertex buffer 
vertex_buffer = gl.createBuffer (); 
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer); 
gl.bufferData(gl.ARRAY_BUFFER,
new Float32Array(vertices), gl.STATIC_DRAW);
// Create and store data into color buffer 
color_buffer = gl.createBuffer (); 
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer); 
gl.bufferData(gl.ARRAY_BUFFER,
new Float32Array(colors), gl.STATIC_DRAW);
// Create and store data into color buffer 
color_buffer_shadow = gl.createBuffer (); 
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer_shadow); 
gl.bufferData(gl.ARRAY_BUFFER,
new Float32Array(colors_shadow), gl.STATIC_DRAW);
// Create and store data into index buffer
index_buffer= gl.createBuffer (); 
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer); 
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW); 

vertex_buffer2 = gl.createBuffer (); 
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer2); 
gl.bufferData(gl.ARRAY_BUFFER,
new Float32Array(vertices2), gl.STATIC_DRAW);
// Create and store data into color buffer 
color_buffer2 = gl.createBuffer (); 
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer2); 
gl.bufferData(gl.ARRAY_BUFFER,
new Float32Array(colors2), gl.STATIC_DRAW);
// Create and store data into index buffer
index_buffer2= gl.createBuffer (); 
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer2); 
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices2), gl.STATIC_DRAW); 

//usa libreria webgl-utilis.js
var shaderprogram = webglUtils.createProgramFromScripts(gl, 
   ["vertex-shader", "fragment-shader"]);

// setup GLSL program
// compiles shader, links program, look up locations
// const shaderprogramInfo = webglUtils.createProgramInfo(gl, ['3d-vertex-shader', '3d-fragment-shader']);

/*======== Associating attributes to vertex shader =====*/
_Pmatrix = gl.getUniformLocation(shaderprogram, "Pmatrix"); 
_Vmatrix = gl.getUniformLocation(shaderprogram, "Vmatrix"); 
_Mmatrix = gl.getUniformLocation(shaderprogram, "Mmatrix");
_position = gl.getAttribLocation(shaderprogram, "position"); 
_color = gl.getAttribLocation(shaderprogram, "color"); 

gl.useProgram(shaderprogram);   

render(0);
}

/*-------------------------------------- CREA_MATRICE_OMBRA --------------------------------------*/
/* Funzione con la quale vado a creare la matrice di proiezione di ombra da applicare all'oggetto 
   
   Per creare la matrice di ombra abbiamo bisogno delle seguenti informazioni :
      - Un punto (vertice) del piano dove l'ombra sarà proiettata. 
      - La normale del piano dove l'ombra srà proiettata.
      - La posizione o direzione della luce 
   Da queste informazioni possiamo calcolare tutto quello di cui necessitiamo per la nostra matrice d'ombra.
   
   1) L'equazione del piano è Ax+By+Cz+D = 0, dove A,B,C è la normale, x,y,z, un punto e D la distanza
      del piano dall'origine. La prima cosa da faer è appunto calcolarci D
                        D = -(Ax + By + Cz)
   2) Devo calcolare ora il punto prodotto tra la normale e la luce. Tale risultato mi darà il 
      dato necessario per proiettare un'ombra sulla superficie avente quella normale.
      Tramite la distanza D so quanto dista l'ombra dall'origine 
      
La funzione prende in input 4 parameti :
   -) OutputMatrix [16]: è la matrice di proiezione che otterrò alla fine 
   -) vertex : un vertice del piano. Ne basta uno solo perché la parete è piatta e per una superficie piana
      dato un suo vertice (x,y,z) e la normale del piano, riesco a determinare il piano stesso. 
      E' ti tipo point3D (vedi struttura in alto) perché appunto un vertice è esplicitato nelle 3 coordinate x, y, z.
   -) normal: è appunto la normale al piano. E' di tipo point3D per lo stesso motivo detto in vertex
   -) LightPos : è la posizione della luce  
*/
function Crea_Matrice_Ombra (vertex, normal, LightPos)
{
        //calcolo D = -(Ax + By + Cz)
        var D = -((normal[0] * vertex[0]) + (normal[1] * vertex[1]) + (normal[2] * vertex[2]));

        //calcolo il punto prodotto dalla normale e la luce
        var dot = normal[0] * LightPos[0] + normal[1] * LightPos[1] + normal[2] * LightPos[2] + D*LightPos[3];

        //a questo punto calcolo la OutputMatrix, ossia la matrice di proiezione 

        //prima colonna matrice
        mo_matrix2 [0]  = dot - LightPos [0] * normal[0] ;
        mo_matrix2 [4]  =     - LightPos [0] * normal[1] ;
        mo_matrix2 [8]  =     - LightPos [0] * normal[2] ;
        mo_matrix2 [12] =     - LightPos [0] * D ;
        //seconda colonna matrice   
        mo_matrix2 [1]  =     - LightPos [1] * normal[0] ;
        mo_matrix2 [5]  = dot - LightPos [1] * normal[1] ;
        mo_matrix2 [9]  =     - LightPos [1] * normal[2] ;
        mo_matrix2 [13] =     - LightPos [1] * D ;
        //terza colonna matrice
        mo_matrix2 [2]  =     - LightPos [2] * normal[0] ;
        mo_matrix2 [6]  =     - LightPos [2] * normal[1] ;
        mo_matrix2 [10] = dot - LightPos [2] * normal[2] ;
        mo_matrix2 [14] =     - LightPos [2] * D ;
        //quarta colonna matrice
        mo_matrix2 [3]  =     - LightPos [3] * normal[0]  ;
        mo_matrix2 [7]  =     - LightPos [3] * normal[1]  ;
        mo_matrix2 [11] =     - LightPos [3] * normal[2] ;
        mo_matrix2 [15] = dot - LightPos [3] * D ;
}

function get_target(){
var min_xyz=[], max_xyz=[];
  min_xyz=[vertices[0],vertices[1],vertices[2]];
  max_xyz=[vertices[0],vertices[1],vertices[2]];
  for (var k=0; k<vertices.length/3; k++)
      for (var j=0; j<3; j++){
        if (vertices[k+j] > max_xyz[j]) max_xyz[j] = vertices[k+j];
                else if (vertices[k+j] < min_xyz[j]) min_xyz[j] = vertices[k+j];
      }
  for (var k=0;k<vertices2.length/3;k++)
      for (var j=0; j<3; j++){
        if (vertices2[k+j] > max_xyz[j]) max_xyz[j] = vertices2[k+j];
                else if (vertices2[k+j] < min_xyz[j]) min_xyz[j] = vertices2[k+j];
      }
/* centro oggetto iniziale */
  target[0] = (min_xyz[0] + max_xyz[0])/2;
  target[1] = (min_xyz[1] + max_xyz[1])/2;
  target[2] = (min_xyz[2] + max_xyz[2])/2;
}

function degToRad(d) {
   return d * Math.PI / 180;
}
function radToDeg(r) {
   return r * 180 / Math.PI;
}

/*================= Mouse events ======================*/
 var mouseDown=function(e) {
    drag=true;
    old_x=e.pageX, old_y=e.pageY;
    e.preventDefault();
//    render();
    return false;
 };
var mouseUp=function(e){
   drag=false;
};
var mouseMove=function(e) {
if (!drag) return false; 
dX=-(e.pageX-old_x)*2*Math.PI/canvas.width; 
dY=-(e.pageY-old_y)*2*Math.PI/canvas.height; 
//console.log('stampa',dX,dY);
THETA+=dX;
PHI+=dY;
old_x=e.pageX, old_y=e.pageY; 
e.preventDefault();
render();
};

/*=================== Drawing =================== */
var render=function() {

D=controls.d;
theta=controls.theta_light;
phi=controls.phi_light;
d=controls.d_light;
fov=controls.fov;
near=controls.near;
far=controls.far;

//usa libreria m4.js per definire proj_matrix e view_matrix
var proj_matrix = m4.perspective(degToRad(fov), aspect, near, far);

var camera = [D*Math.sin(PHI)*Math.cos(THETA),
              D*Math.sin(PHI)*Math.sin(THETA),
              D*Math.cos(PHI)];
var view_matrix = m4.inverse(m4.lookAt(camera, target, up));

var mo_matrix=[
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1];

var light = [d*Math.sin(phi)*Math.cos(theta),
   d*Math.sin(phi)*Math.sin(theta),
   d*Math.cos(phi), 1];

gl.enable(gl.DEPTH_TEST);
// gl.depthFunc(gl.LEQUAL); 
gl.clearColor(1.0, 1.0, 1.0, 1); 

gl.clearDepth(1.0);
gl.viewport(0.0, 0.0, canvas.width, canvas.height); 
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.uniformMatrix4fv(_Pmatrix, false, proj_matrix); 
gl.uniformMatrix4fv(_Vmatrix, false, view_matrix); 
gl.uniformMatrix4fv(_Mmatrix, false, mo_matrix);

//Cubo a facce
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0); 
gl.enableVertexAttribArray(_position);

gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,0,0) ; 
gl.enableVertexAttribArray(_color);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

//Cubo a linee
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer2);
gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0); 
gl.enableVertexAttribArray(_position);

gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer2);
gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,0,0) ; 
gl.enableVertexAttribArray(_color);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer2);
gl.drawElements(gl.LINES, indices2.length, gl.UNSIGNED_SHORT, 0);

//matrice di proiezione del cubo sul piano di appoggio
Crea_Matrice_Ombra (plane_vertex, plane_normal, light)
gl.uniformMatrix4fv(_Mmatrix, false, mo_matrix2);

//Cubo a facce
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0); 
gl.enableVertexAttribArray(_position);

gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer_shadow);
gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,0,0) ; 
gl.enableVertexAttribArray(_color);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

// //Cubo a linee
// gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer2);
// gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0); 
// gl.enableVertexAttribArray(_position);

// gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer2);
// gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,0,0) ; 
// gl.enableVertexAttribArray(_color);

// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer2);
// gl.drawElements(gl.LINES, indices2.length, gl.UNSIGNED_SHORT, 0);

}


