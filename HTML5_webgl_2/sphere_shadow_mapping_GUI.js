'use strict';

  function createBufferInfoFunc(fn) {
      return function(gl) {
        const arrays = fn.apply(null,  Array.prototype.slice.call(arguments, 1));
        return webglUtils.createBufferInfoFromArrays(gl, arrays);
      };
  }

  function createSphereVertices(){
      var radius =  1;
      var subdivisionsAxis = 32;
      var subdivisionsHeight = 24;
      var opt_startLatitudeInRadians,
          opt_endLatitudeInRadians,
          opt_startLongitudeInRadians,
          opt_endLongitudeInRadians;
      if (subdivisionsAxis <= 0 || subdivisionsHeight <= 0) {
        throw Error('subdivisionAxis and subdivisionHeight must be > 0');
      }

      opt_startLatitudeInRadians = opt_startLatitudeInRadians || 0;
      opt_endLatitudeInRadians = opt_endLatitudeInRadians || Math.PI;
      opt_startLongitudeInRadians = opt_startLongitudeInRadians || 0;
      opt_endLongitudeInRadians = opt_endLongitudeInRadians || (Math.PI * 2);

      const latRange = opt_endLatitudeInRadians - opt_startLatitudeInRadians;
      const longRange = opt_endLongitudeInRadians - opt_startLongitudeInRadians;

      // We are going to generate our sphere by iterating through its
      // spherical coordinates and generating 2 triangles for each quad on a
      // ring of the sphere.
      const numVertices = (subdivisionsAxis + 1) * (subdivisionsHeight + 1);
      const positions = webglUtils.createAugmentedTypedArray(3, numVertices);
      const normals   = webglUtils.createAugmentedTypedArray(3, numVertices);
      const texCoords = webglUtils.createAugmentedTypedArray(2 , numVertices);

      // Generate the individual vertices in our vertex buffer.
      for (let y = 0; y <= subdivisionsHeight; y++) {
        for (let x = 0; x <= subdivisionsAxis; x++) {
          // Generate a vertex based on its spherical coordinates
          const u = x / subdivisionsAxis;
          const v = y / subdivisionsHeight;
          const theta = longRange * u;
          const phi = latRange * v;
          const sinTheta = Math.sin(theta);
          const cosTheta = Math.cos(theta);
          const sinPhi = Math.sin(phi);
          const cosPhi = Math.cos(phi);
          const ux = cosTheta * sinPhi;
          const uy = cosPhi;
          const uz = sinTheta * sinPhi;
          positions.push(radius * ux, radius * uy, radius * uz);
          normals.push(ux, uy, uz);
          texCoords.push(1 - u, v);
        }
      }

      const numVertsAround = subdivisionsAxis + 1;
      const indices = webglUtils.createAugmentedTypedArray(3, subdivisionsAxis * subdivisionsHeight * 2, Uint16Array);
      for (let x = 0; x < subdivisionsAxis; x++) {
        for (let y = 0; y < subdivisionsHeight; y++) {
          // Make triangle 1 of quad.
          indices.push(
              (y + 0) * numVertsAround + x,
              (y + 0) * numVertsAround + x + 1,
              (y + 1) * numVertsAround + x);

          // Make triangle 2 of quad.
          indices.push(
              (y + 1) * numVertsAround + x,
              (y + 0) * numVertsAround + x + 1,
              (y + 1) * numVertsAround + x + 1);
        }
      }

      return {
        position: positions,
        normal: normals,
        texcoord: texCoords,
        indices: indices,
      };
  }

  function applyFuncToV3Array(array, matrix, fn) {
      const len = array.length;
      const tmp = new Float32Array(3);
      for (let ii = 0; ii < len; ii += 3) {
        fn(matrix, [array[ii], array[ii + 1], array[ii + 2]], tmp);
        array[ii    ] = tmp[0];
        array[ii + 1] = tmp[1];
        array[ii + 2] = tmp[2];
      }
  }

  function transformNormal(mi, v, dst) {
      dst = dst || new Float32Array(3);
      const v0 = v[0];
      const v1 = v[1];
      const v2 = v[2];

      dst[0] = v0 * mi[0 * 4 + 0] + v1 * mi[0 * 4 + 1] + v2 * mi[0 * 4 + 2];
      dst[1] = v0 * mi[1 * 4 + 0] + v1 * mi[1 * 4 + 1] + v2 * mi[1 * 4 + 2];
      dst[2] = v0 * mi[2 * 4 + 0] + v1 * mi[2 * 4 + 1] + v2 * mi[2 * 4 + 2];

      return dst;
    }

  function reorientDirections(array, matrix) {
      applyFuncToV3Array(array, matrix, m4.transformDirection);
      return array;
    }

  /*
   * Reorients normals by the inverse-transpose of the given
   * matrix.
   */
  function reorientNormals(array, matrix) {
      applyFuncToV3Array(array, m4.inverse(matrix), transformNormal);
      return array;
    }

  /*
   * Reorients positions by the given matrix. In other words, it
   * multiplies each vertex by the given matrix.
   */
  function reorientPositions(array, matrix) {
      applyFuncToV3Array(array, matrix, m4.transformPoint);
      return array;
    }

  /*
   * Reorients arrays by the given matrix. Assumes arrays have
   * names that contains 'pos' could be reoriented as positions,
   * 'binorm' or 'tan' as directions, and 'norm' as normals.
   */
  function reorientVertices(arrays, matrix) {
      Object.keys(arrays).forEach(function(name) {
        const array = arrays[name];
        if (name.indexOf('pos') >= 0) {
          reorientPositions(array, matrix);
        } else if (name.indexOf('tan') >= 0 || name.indexOf('binorm') >= 0) {
          reorientDirections(array, matrix);
        } else if (name.indexOf('norm') >= 0) {
          reorientNormals(array, matrix);
        }
      });
      return arrays;
    }

  function createPlaneVertices(){
    var width = 20;
    var depth = 20;
    var subdivisionsWidth = 1;
    var subdivisionsDepth = 1;
    var matrix;

      width = width || 1;
      depth = depth || 1;
      subdivisionsWidth = subdivisionsWidth || 1;
      subdivisionsDepth = subdivisionsDepth || 1;
      matrix = matrix || m4.identity();

      const numVertices = (subdivisionsWidth + 1) * (subdivisionsDepth + 1);
      const positions = webglUtils.createAugmentedTypedArray(3, numVertices);
      const normals = webglUtils.createAugmentedTypedArray(3, numVertices);
      const texcoords = webglUtils.createAugmentedTypedArray(2, numVertices);

      for (let z = 0; z <= subdivisionsDepth; z++) {
        for (let x = 0; x <= subdivisionsWidth; x++) {
          const u = x / subdivisionsWidth;
          const v = z / subdivisionsDepth;
          positions.push(
              width * u - width * 0.5,
              0,
              depth * v - depth * 0.5);
          normals.push(0, 1, 0);
          texcoords.push(u, v);
        }
      }

      const numVertsAcross = subdivisionsWidth + 1;
      const indices = webglUtils.createAugmentedTypedArray(
          3, subdivisionsWidth * subdivisionsDepth * 2, Uint16Array);

      for (let z = 0; z < subdivisionsDepth; z++) {
        for (let x = 0; x < subdivisionsWidth; x++) {
          // Make triangle 1 of quad.
          indices.push(
              (z + 0) * numVertsAcross + x,
              (z + 1) * numVertsAcross + x,
              (z + 0) * numVertsAcross + x + 1);

          // Make triangle 2 of quad.
          indices.push(
              (z + 1) * numVertsAcross + x,
              (z + 1) * numVertsAcross + x + 1,
              (z + 0) * numVertsAcross + x + 1);
        }
      }

      const arrays = reorientVertices({
        position: positions,
        normal: normals,
        texcoord: texcoords,
        indices: indices,
      }, matrix);
      return arrays;
    }

  function createCubeVertices() {
      const k = 1;
      const cornerVertices = [
        [-k, -k, -k],
        [+k, -k, -k],
        [-k, +k, -k],
        [+k, +k, -k],
        [-k, -k, +k],
        [+k, -k, +k],
        [-k, +k, +k],
        [+k, +k, +k],
      ];

      const faceNormals = [
        [+1, +0, +0],
        [-1, +0, +0],
        [+0, +1, +0],
        [+0, -1, +0],
        [+0, +0, +1],
        [+0, +0, -1],
      ];

      const uvCoords = [
        [1, 0],
        [0, 0],
        [0, 1],
        [1, 1],
      ];

      const numVertices = 6 * 4;
      const positions = webglUtils.createAugmentedTypedArray(3, numVertices);
      const normals   = webglUtils.createAugmentedTypedArray(3, numVertices);
      const texCoords = webglUtils.createAugmentedTypedArray(2 , numVertices);
      const indices   = webglUtils.createAugmentedTypedArray(3, 6 * 2, Uint16Array);

      for (let f = 0; f < 6; ++f) {
        const faceIndices = CUBE_FACE_INDICES[f];
        for (let v = 0; v < 4; ++v) {
          const position = cornerVertices[faceIndices[v]];
          const normal = faceNormals[f];
          const uv = uvCoords[v];

          // Each face needs all four vertices because the normals and texture
          // coordinates are not all the same.
          positions.push(position);
          normals.push(normal);
          texCoords.push(uv);

        }
        // Two triangles make a square face.
        const offset = 4 * f;
        indices.push(offset + 0, offset + 1, offset + 2);
        indices.push(offset + 0, offset + 2, offset + 3);
      }

      return {
        position: positions,
        normal: normals,
        texcoord: texCoords,
        indices: indices,
      };
    }

  const CUBE_FACE_INDICES = [
    [3, 7, 5, 1], // right
    [6, 2, 0, 4], // left
    [6, 7, 3, 2], // ??
    [0, 1, 5, 4], // ??
    [7, 6, 4, 5], // front
    [2, 3, 1, 0], // back
  ];

  var settings = new function(){
    this.cameraX = 6;
    this.cameraY = 5;
    this.posX = 2.5;
    this.posY = 4.8;
    this.posZ = 4.3;
    this.targetX = 2.5;
    this.targetY = 1;
    this.targetZ = 3.5;
    this.projWidth = 3;
    this.projHeight = 2.4;
    this.fieldOfView = 120;
    this.bias = -0.006;
    this.perspective= true;
  };

  window.onload = function main() {
  //function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.getElementById('canvas');
    var gl = canvas.getContext('webgl');
    if (!gl) {
      return;
    }
    canvas.width=600;
    canvas.height=600;

    var gui = new dat.GUI();

    gui.add(settings,'cameraX',-10,10);
    gui.add(settings,'cameraY',1,20);
    gui.add(settings,'posX',-10,10);
    gui.add(settings,'posY',1,20);
    gui.add(settings,'posZ',1,20);
    gui.add(settings,'targetX',-10,10);
    gui.add(settings,'targetY',0,20);
    gui.add(settings,'targetZ',-10,20);
    gui.add(settings,'projWidth',0,3);
    gui.add(settings,'projHeight',0,3);
    gui.add(settings,'fieldOfView',1,179);
    gui.add(settings,'bias',-0.2,0.0).step(0.025);
    gui.add(settings,'perspective');

    const ext = gl.getExtension('WEBGL_depth_texture');
    if (!ext) {
      return alert('need WEBGL_depth_texture');  // eslint-disable-line
    }

    // setup GLSL programs
    const textureProgramInfo = webglUtils.createProgramInfo(gl, ['3d-vertex-shader', '3d-fragment-shader']);
    const colorProgramInfo = webglUtils.createProgramInfo(gl, ['color-vertex-shader', 'color-fragment-shader']);

    const arrays1 = createSphereVertices.apply(null,  Array.prototype.slice.call(arguments, 1));
    const sphereBufferInfo=webglUtils.createBufferInfoFromArrays(gl, arrays1);

    const arrays2 = createPlaneVertices.apply(null,  Array.prototype.slice.call(arguments, 1));
    const planeBufferInfo=webglUtils.createBufferInfoFromArrays(gl, arrays2);

    const arrays3 = createCubeVertices.apply(null,  Array.prototype.slice.call(arguments, 1));
    const cubeBufferInfo=webglUtils.createBufferInfoFromArrays(gl, arrays3);

    const cubeLinesBufferInfo = webglUtils.createBufferInfoFromArrays(gl, {
      position: [-1,-1,-1, 1,-1,-1, -1,1,-1, 1,1,-1, -1,-1,1, 1,-1,1, -1,1,1, 1,1,1,],
      indices: [0,1, 1,3, 3,2, 2,0, 4,5, 5,7, 7,6, 6,4, 0,4, 1,5, 3,7, 2,6,],
    });

    // make a 8x8 checkerboard texture
    const checkerboardTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, checkerboardTexture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,                // mip level
        gl.LUMINANCE,     // internal format
        8,                // width
        8,                // height
        0,                // border
        gl.LUMINANCE,     // format
        gl.UNSIGNED_BYTE, // type
        new Uint8Array([  // data
          0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
          0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
          0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
          0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
          0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
          0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
          0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
          0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
        ]));
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    const depthTexture = gl.createTexture();
    const depthTextureSize = 512;
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texImage2D(
        gl.TEXTURE_2D,      // target
        0,                  // mip level
        gl.DEPTH_COMPONENT, // internal format
        depthTextureSize,   // width
        depthTextureSize,   // height
        0,                  // border
        gl.DEPTH_COMPONENT, // format
        gl.UNSIGNED_INT,    // type
        null);              // data
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const depthFramebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER,       // target
        gl.DEPTH_ATTACHMENT,  // attachment point
        gl.TEXTURE_2D,        // texture target
        depthTexture,         // texture
        0);                   // mip level

    function degToRad(d) {
      return d * Math.PI / 180;
    }

    const fieldOfViewRadians = degToRad(60);

    // Uniforms for each object.
    const planeUniforms = {
      u_colorMult: [0.5, 0.5, 1, 1],  // lightblue
      u_color: [1, 0, 0, 1],
      u_texture: checkerboardTexture,
      u_world: m4.translation(0, 0, 0),
    };
    const sphereUniforms = {
      u_colorMult: [1, 0.5, 0.5, 1],  // pink
      u_color: [0, 0, 1, 1],
      u_texture: checkerboardTexture,
      u_world: m4.translation(2, 3, 4),
    };
    const cubeUniforms = {
      u_colorMult: [0.5, 1, 0.5, 1],  // lightgreen
      u_color: [0, 0, 1, 1],
      u_texture: checkerboardTexture,
      u_world: m4.translation(3, 1, 0),
    };

    function drawScene(
        projectionMatrix,
        cameraMatrix,
        textureMatrix,
        lightWorldMatrix,
        programInfo) {
      // Make a view matrix from the camera matrix.
      const viewMatrix = m4.inverse(cameraMatrix);

      gl.useProgram(programInfo.program);

      // set uniforms that are the same for both the sphere and plane
      // note: any values with no corresponding uniform in the shader
      // are ignored.
      webglUtils.setUniforms(programInfo, {
        u_view: viewMatrix,
        u_projection: projectionMatrix,
        u_bias: settings.bias,
        u_textureMatrix: textureMatrix,
        u_projectedTexture: depthTexture,
        u_shininess: 150,
        u_innerLimit: Math.cos(degToRad(settings.fieldOfView / 2 - 10)),
        u_outerLimit: Math.cos(degToRad(settings.fieldOfView / 2)),
        u_lightDirection: lightWorldMatrix.slice(8, 11).map(v => -v),
        u_lightWorldPosition: [settings.posX, settings.posY, settings.posZ],
        u_viewWorldPosition: cameraMatrix.slice(12, 15),
      });

      // ------ Draw the sphere --------

      // Setup all the needed attributes.
      webglUtils.setBuffersAndAttributes(gl, programInfo, sphereBufferInfo);

      // Set the uniforms unique to the sphere
      webglUtils.setUniforms(programInfo, sphereUniforms);

      // calls gl.drawArrays or gl.drawElements
      webglUtils.drawBufferInfo(gl, sphereBufferInfo);

      // ------ Draw the cube --------

      // Setup all the needed attributes.
      webglUtils.setBuffersAndAttributes(gl, programInfo, cubeBufferInfo);

      // Set the uniforms unique to the cube
      webglUtils.setUniforms(programInfo, cubeUniforms);

      // calls gl.drawArrays or gl.drawElements
      webglUtils.drawBufferInfo(gl, cubeBufferInfo);

      // ------ Draw the plane --------

      // Setup all the needed attributes.
      webglUtils.setBuffersAndAttributes(gl, programInfo, planeBufferInfo);

      // Set the uniforms unique to the cube
      webglUtils.setUniforms(programInfo, planeUniforms);

      // calls gl.drawArrays or gl.drawElements
      webglUtils.drawBufferInfo(gl, planeBufferInfo);
    }

    // Draw the scene.
    function render() {

      webglUtils.resizeCanvasToDisplaySize(gl.canvas);

      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);

      // first draw from the POV of the light
      const lightWorldMatrix = m4.lookAt(
          [settings.posX, settings.posY, settings.posZ],          // position
          [settings.targetX, settings.targetY, settings.targetZ], // target
          [0, 1, 0],                                              // up
      );
      const lightProjectionMatrix = settings.perspective
          ? m4.perspective(
              degToRad(settings.fieldOfView),
              settings.projWidth / settings.projHeight,
              0.5,  // near
              10)   // far
          : m4.orthographic(
              -settings.projWidth / 2,   // left
              settings.projWidth / 2,   // right
              -settings.projHeight / 2,  // bottom
              settings.projHeight / 2,  // top
              0.5,                      // near
              10);                      // far

      // draw to the depth texture
      gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
      gl.viewport(0, 0, depthTextureSize, depthTextureSize);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      drawScene(
          lightProjectionMatrix,
          lightWorldMatrix,
          m4.identity(),
          lightWorldMatrix,
          colorProgramInfo);

      // now draw scene to the canvas projecting the depth texture into the scene
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      let textureMatrix = m4.identity();
      textureMatrix = m4.translate(textureMatrix, 0.5, 0.5, 0.5);
      textureMatrix = m4.scale(textureMatrix, 0.5, 0.5, 0.5);
      textureMatrix = m4.multiply(textureMatrix, lightProjectionMatrix);
      // use the inverse of this world matrix to make
      // a matrix that will transform other positions
      // to be relative this this world space.
      textureMatrix = m4.multiply(
          textureMatrix,
          m4.inverse(lightWorldMatrix));

      // Compute the projection matrix
      const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      const projectionMatrix =
          m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

      // Compute the camera's matrix using look at.
      const cameraPosition = [settings.cameraX, settings.cameraY, 7];
      const target = [0, 0, 0];
 //     const target = [settings.targetX, settings.targetY, settings.targetZ];
      const up = [0, 1, 0];
      const cameraMatrix = m4.lookAt(cameraPosition, target, up);

      drawScene(
          projectionMatrix,
          cameraMatrix,
          textureMatrix,
          lightWorldMatrix,
          textureProgramInfo);

      // ------ Draw the frustum ------
      {
        const viewMatrix = m4.inverse(cameraMatrix);

        gl.useProgram(colorProgramInfo.program);

        // Setup all the needed attributes.
        webglUtils.setBuffersAndAttributes(gl, colorProgramInfo, cubeLinesBufferInfo);

        // scale the cube in Z so it's really long
        // to represent the texture is being projected to
        // infinity
        const mat = m4.multiply(
            lightWorldMatrix, m4.inverse(lightProjectionMatrix));

        // Set the uniforms we just computed
        webglUtils.setUniforms(colorProgramInfo, {
          u_color: [1, 1, 1, 1],
          u_view: viewMatrix,
          u_projection: projectionMatrix,
          u_world: mat,
        });

        // calls gl.drawArrays or gl.drawElements
        webglUtils.drawBufferInfo(gl, cubeLinesBufferInfo, gl.LINES);
      } 
    }

    render();
    setInterval(render, 10);
  }

//main();
