/*
GOAL: canvas time, make box spin first with lines and maybe add color to faces

from what i read webgl have something called clip size which it awlays
*/

/*
an attribute will receive data from a buffer
gl_Position is a special variable a vertex shader is responsible for setting
vsource is in vec2 so giving it pixel positions will them it where to draw them in its clip space.
*/

/*
vertex shader: will handle events such as rotation transformation scaling movement within the bounds of set 3d space clipping plane and connecting texture information to each vertex

fragment shader:(pixel shader) is the final step that controls what is shown on the screen and where in pixels that the vertex shader has made.
based on what the vertex shader has made the fragment shader can and will most likely make adjustment to make it fit onto the screen and show the image with light settings and textures on a per pixel.

so while the vertex shader says that 1 point is red and when we move to point 2 we get blue.
the fragment shader will make sure that the pixels between these points are shown as going from gradual red and blue or a mix between purle based on what the shader has specified.

uniform global variable cause we want everything to be handled the same way for every pixel/thread,
*/
 let vsSource = `
    attribute vec2 a_position;
    
    uniform vec2 u_resolution;

    void main() {
    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clip space)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }
`;

// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
// gl_FragColor is a special variable a fragment shader is responsible for setting
let fsSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main(void){
        gl_FragColor = u_color;
    }
`;

function webglRender(gl, array){

// Only continue if WebGL is available and working
if (gl === null){alert("Unable to initialize WebGL. Your browser or machine may not support it.");return;}    

//resize canvas to fill the showl screen
function reziseCanvas(){
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}
//reziseCanvas()
//resize when the window sie changes
//window.addEventListener('resize', reziseCanvas)

// create GLSL shaders, upload the GLSL source, compile the shaders
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

// Link the two shaders into a program
var program = createProgram(gl, vertexShader, fragmentShader);

/*
when the program is made we can get the attributes from the GSLS to manipulate them
*/
// look up where the vertex data needs to go.
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

// look up where the color data needs to go
var colorUniformLocation = gl.getUniformLocation(program, "u_color");

// Create a buffer and put three 2d clip space points in it
var positionBuffer = gl.createBuffer();

// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

//gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// code above this line is initialization code.

// code below this line is rendering code.

//the tutorial i followed used this but i did not figure out why, do i resize it elsewhere did i miss a step
//webglUtils.resizeCanvasToDisplaySize(gl.canvas);

// Tell WebGL how to convert from clip space to pixels
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear the canvas
gl.clearColor(0.0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

// Turn on the attribute
gl.enableVertexAttribArray(positionAttributeLocation);

// Bind the position buffer.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
var size = 2;          // 2 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

//sets the reselution
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

// draw some random rectangles in random colors
for (var i = 0; i < array.length; ++i) {
    // Setup a random rectangle
    // This will write to positionBuffer because
    // its the last thing we bound on the ARRAY_BUFFER
    // bind point
    let vertices = array[i].vertices;
    let rgba = array[i].rgba;
    
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    // Set a random color.
    gl.uniform4f(colorUniformLocation, rgba[0], rgba[1], rgba[2], rgba[3]);

    console.log(array[i]);

    // Draw the rectangle.
    // arguments for what the drawarray method needs
    // what method should be used to draw the points provided
    var primitiveType = gl.TRIANGLES;
    // the first point to start drawing from
    var offset = 0;
    // how many points to render/draw (in this case we are doing them all and its half cause we are counting amount of lines drawn)
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);
  }
};

//holy woowie this one needs to be understood gradually
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
};

//holy woowie this one needs to be understood gradually
/*
all i know it is takes the fragment and vertex shaders
vertex shader tells where the points are can manipulate their loaction and oriantation and give them a color attribute
fragments ooks at the points or in case of a triangle mesh/face looks at the area made and colors the pixels in that region of the screenspace
*/
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
};

// Fills the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;

// NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
// whatever buffer is bound to the `ARRAY_BUFFER` bind point
// but so far we only have one buffer. If we had more than one
// buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
        ]),
    gl.STATIC_DRAW);
};

export default webglRender