var canvas;
var gl;

var numVertices  = 36;

var pointsArray = [];
var normalsArray = [];

var vertices = [
        [-1.0, -1.0,  1.0, ],
        [-1.0,  1.0,  1.0, ],
        [1.0,  1.0,  1.0, ],
        [1.0, -1.0,  1.0, ],
        [-1.0, -1.0, -1.0, ],
        [-1.0, 1.0, -1.0, ],
        [1.0,  1.0, -1.0, ],
        [1.0, -1.0, -1.0, ] ];

var lightPosition = [1.0, 1.0, 1.0, 0.0 ];
var lightAmbient =  [0.2, 0.2, 0.2, 1.0 ];
var lightDiffuse =  [1.0, 1.0, 1.0, 1.0 ];
var lightSpecular = [1.0, 1.0, 1.0, 1.0 ];

var materialAmbient = [1.0, 0.0, 1.0, 1.0];
var materialDiffuse = [1.0, 0.2, 0.0, 1.0];
var materialSpecular = [1.0, 0.2, 0.0, 1.0];
var materialShininess = 100.0;

var ambientColor, diffuseColor, specularColor;
var modelView, projection;

var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta =[0, 0, 0];

var near = 1.0;    // try 0.1;
var far = 100.0;
var  fovy = 40.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

//var thetaLoc;

var flag = true;

function quad(a, b, c, d) {

     var t1 = m4.subtractVectors(vertices[b], vertices[a]);
     var t2 = m4.subtractVectors(vertices[c], vertices[b]);
     var normal=[];
     normal = m4.cross(t1, t2, normal);

     pointsArray.push(vertices[a]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[b]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[c]); 
     normalsArray.push(normal);   
     pointsArray.push(vertices[a]);  
     normalsArray.push(normal); 
     pointsArray.push(vertices[c]); 
     normalsArray.push(normal); 
     pointsArray.push(vertices[d]); 
     normalsArray.push(normal);    
}


function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = canvas.getContext("webgl");
    if (!gl) {
      alert( "WebGL isn't available" );
      return;
    } 

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    aspect =  canvas.width/canvas.height;
    //
    //  Load shaders and initialize attribute buffers
    //
    program = webglUtils.createProgramFromScripts(gl, ["vertex-shader", "fragment-shader"]);
    gl.useProgram( program );
    
    colorCube();
    pointsArray=m4.flatten(pointsArray);
    console.log(pointsArray);
    normalsArray=m4.flatten(normalsArray);
 
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, normalsArray, gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, pointsArray, gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //thetaLoc = gl.getUniformLocation(program, "theta"); 
    
    var camera = [0, 5, 0];   // try [0, 0.5, 0] 
    var target = [0, 0, 0];
    var up = [0, 0, 1];
    var view_matrix = m4.inverse(m4.lookAt(camera, target, up));
    
    projection = m4.perspective(degToRad(fovy), aspect, near, far);

    projection=m4.multiply(projection,view_matrix);

// Compute the projection matrix
//    projection = m4.orthographic(-1.5, 1.5, -1.5, 1.5, -100, 100);

    ambientProduct = m4.mvec4(lightAmbient, materialAmbient);
    diffuseProduct = m4.mvec4(lightDiffuse, materialDiffuse);
    specularProduct = m4.mvec4(lightSpecular, materialSpecular);
    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct" ), ambientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct" ), diffuseProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), specularProduct );	
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"  ), lightPosition );
       
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
       false, projection);
    
    render();
}

function degToRad(d) {
   return d * Math.PI / 180;
}

var render = function(){
            
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    if(flag) theta[axis] += 2.0;
            
    modelView = m4.identity();
    modelView = m4.xRotate(modelView,degToRad(theta[xAxis]));
    modelView = m4.yRotate(modelView,degToRad(theta[yAxis]));
    modelView = m4.zRotate(modelView,degToRad(theta[zAxis]));
 
    gl.uniformMatrix4fv( gl.getUniformLocation(program,"modelViewMatrix"), false, modelView );

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
            
    window.requestAnimationFrame(render);       
}
