"use strict";

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.getElementById("canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, ["3d-vertex-shader", "3d-fragment-shader"]);
  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var normalLocation = gl.getAttribLocation(program, "a_normal");
  var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
  var colorLocation = gl.getAttribLocation(program, "a_color");

  // Create a buffer for positions
  var positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Put the positions in the buffer
  setGeometry(gl);

  // Create a buffer for normals
  var normalsBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER mormalsBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
  // Put the normals in the buffer
  setNormals(gl);

  // Create a buffer for colorss
  var colorsBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER colorsBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
  // Put the colors in the buffer
  setColors(gl);

  // provide texture coordinates
  var texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  // Set Texcoords
  setTexcoords(gl);

  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));
  // Asynchronously load an image
  var image = new Image();
  image.src = "resources/images/webgl-marble.png";
  image.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);

    // Check if the image is a power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  });

  // lookup uniforms
  var diffuse=[1, 1, 1];
  var ambient=[1, 0, 1];
  var specular=[5, 5, 5];
  var emissive=[0,0,0];
  var ambientLight=[0.2,0.2,0.2];
  var shininess=400;
  var opacity=1;

  gl.uniform3fv(gl.getUniformLocation(program, "diffuse" ), diffuse );
  gl.uniform3fv(gl.getUniformLocation(program, "ambient" ), ambient); 
  gl.uniform3fv(gl.getUniformLocation(program, "specular"), specular );	
  gl.uniform3fv(gl.getUniformLocation(program, "emissive"), emissive );
  //gl.uniform3fv(gl.getUniformLocation(program, "u_lightDirection" ), xxx );
  gl.uniform3fv(gl.getUniformLocation(program, "u_ambientLight" ), ambientLight );
     
  gl.uniform1f(gl.getUniformLocation(program, "shininess"), shininess);
  gl.uniform1f(gl.getUniformLocation(program, "opacity"), opacity);

  // Turn on the position attribute
  gl.enableVertexAttribArray(positionLocation);
  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 3;          // 3 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

  // Turn on the normal attribute
  gl.enableVertexAttribArray(normalLocation);
  // Bind the normal buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
  gl.vertexAttribPointer(normalLocation, size, type, normalize, stride, offset);

  // Turn on the color attribute
  gl.enableVertexAttribArray(colorLocation);
  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
  size = 4;          // 3 components per iteration
  gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

  // Turn on the teccord attribute
  gl.enableVertexAttribArray(texcoordLocation);
  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  size = 2;          // 2 components per iteration
  gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);

  var fieldOfViewRadians = degToRad(30);
  var modelXRotationRadians = degToRad(0);
  var modelYRotationRadians = degToRad(0);

  // Compute the projection matrix
  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  //  zmin=0.125;
  var zmin=0.1;
  var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zmin, 200);

  var cameraPosition = [2, 2, 2];
  var up = [0, 0, 1];
  var target = [0, 0, 0];

  // Compute the camera's matrix using look at.
  var cameraMatrix = m4.lookAt(cameraPosition, target, up);
  // console.log('---------------');
  // console.log(cameraMatrix);
  // Make a view matrix from the camera matrix.
  var viewMatrix = m4.inverse(cameraMatrix);
  // console.log('---------------');
  // console.log(viewMatrix);
  var matrixLocation = gl.getUniformLocation(program, "u_world");
  var textureLocation = gl.getUniformLocation(program, "diffuseMap");
  var viewMatrixLocation = gl.getUniformLocation(program, "u_view");
  var projectionMatrixLocation = gl.getUniformLocation(program, "u_projection");
  var lightWorldDirectionLocation = gl.getUniformLocation(program, "u_lightDirection");
  var viewWorldPositionLocation = gl.getUniformLocation(program, "u_viewWorldPosition");

  gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        
  // set the light position
  gl.uniform3fv(lightWorldDirectionLocation, m4.normalize([-1, 3, 5]));

  // set the camera/view position
  gl.uniform3fv(viewWorldPositionLocation, cameraPosition);

  // Tell the shader to use texture unit 0 for diffuseMap
  gl.uniform1i(textureLocation, 0);

  function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }

  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  // Get the starting time.
  var then = 0;

  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(time) {
    // convert to seconds
    time *= 0.001;
    // Subtract the previous time from the current time
    var deltaTime = time - then;
    // Remember the current time for the next frame.
    then = time;

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    //gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Animate the rotation
    modelYRotationRadians += -0.7 * deltaTime;
    modelXRotationRadians += -0.4 * deltaTime;

    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var matrix = m4.identity();
    matrix = m4.xRotate(matrix, modelXRotationRadians);
    matrix = m4.yRotate(matrix, modelYRotationRadians);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Draw the geometry.
    gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);

    requestAnimationFrame(drawScene);
  }
}

// Fill the buffer with the values that define a cube.
function setGeometry(gl) {
  var positions = new Float32Array(
    [
//1 bottom
    -0.5, -0.5,  -0.5,
    -0.5,  0.5,  -0.5,
     0.5, -0.5,  -0.5,
    -0.5,  0.5,  -0.5,
     0.5,  0.5,  -0.5,
     0.5, -0.5,  -0.5,
//2 top
    -0.5, -0.5,   0.5,
    -0.5,  0.5,   0.5,
     0.5, -0.5,   0.5,
     0.5, -0.5,   0.5,
    -0.5,  0.5,   0.5,
     0.5,  0.5,   0.5,
//3 right
    -0.5,   0.5, -0.5,
    -0.5,   0.5,  0.5,
     0.5,   0.5, -0.5,
    -0.5,   0.5,  0.5,
     0.5,   0.5,  0.5,
     0.5,   0.5, -0.5,
//4 left
    -0.5,  -0.5, -0.5,
     0.5,  -0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,  -0.5,  0.5,
     0.5,  -0.5, -0.5,
     0.5,  -0.5,  0.5,
//5 back
    -0.5,  -0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,   0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,   0.5,  0.5,
    -0.5,   0.5, -0.5,
//6 front
     0.5,  -0.5, -0.5,
     0.5,   0.5, -0.5,
     0.5,  -0.5,  0.5,
     0.5,  -0.5,  0.5,
     0.5,   0.5, -0.5,
     0.5,   0.5,  0.5,
    ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}
// Fill the buffer with the values that define Normals.
function setNormals(gl) {
  var normals = new Float32Array(
    [
//1 bottom
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
//2 top
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
//3 right
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
//4 left
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
//5 back
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
//6 front
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0.
    ]);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
}

// Fill the buffer with the values that define Normals.
function setColors(gl) {
  var colors = new Float32Array(
    [
//1 bottom
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,        
//2 top
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
//3 right
    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
//4 left
    1, 1, 0, 1,
    1, 1, 0, 1,
    1, 1, 0, 1,
    1, 1, 0, 1,
    1, 1, 0, 1,
    1, 1, 0, 1,
//5 back
    1, 0, 1, 1,
    1, 0, 1, 1,
    1, 0, 1, 1,
    1, 0, 1, 1,
    1, 0, 1, 1,
    1, 0, 1, 1,
//6 front
    0, 1, 1, 1,
    0, 1, 1, 1,
    0, 1, 1, 1,
    0, 1, 1, 1,
    0, 1, 1, 1,
    0, 1, 1, 1,
    ]);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
}
// Fill the buffer with texture coordinates the cube.
function setTexcoords(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        [
        //1 bottom
        1.0  , 0.0,
        0.0   , 0.0,
        1.0  , 1.0,
        0.0   , 0.0,
        0.0  , 1.0,
        1.0  , 1.0,
        //2 top
        1.0  , 0.0,
        1.0   , 1.0,
        0.0  , 0.0,
        0.0   , 0.0,
        1.0  , 1.0,
        0.0  , 1.0,
        //3 right
        1.0 , 1.0  ,
        1.0 , 0.0,
        0.0, 1.0  ,
        1.0 , 0.0,
        0.0, 0.0,
        0.0, 1.0,
        //4 left
        0.0 , 1.0  ,
        1.0 , 1.0,
        0.0, 0.0  ,
        0.0 , 0.0,
        1.0, 1.0,
        1.0, 0.0,
        //5 back
        1.0 , 1.0  ,
        1.0 , 0.0,
        0.0, 1.0  ,
        1.0 , 0.0,
        0.0, 0.0,
        0.0, 1.0,
        //6 front
        0.0 , 1.0  ,
        1.0 , 1.0,
        0.0, 0.0  ,
        0.0 , 0.0,
        1.0, 1.0,
        1.0, 0.0,
      ]),
      gl.STATIC_DRAW);
}

main();



