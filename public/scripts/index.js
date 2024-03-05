import webglRender from "./webglcanvas.js";

//get canvas from the doc
const canvas = document.getElementById("canvas")
//say we want canvas to use be a webgl
const gl = canvas.getContext("webgl")

let boxes = [
{
    vertices:[[0, 250],[250, 0],[250,250]],
    rgba:[0.5, 0.4, 0.1 , 1]
},{
    vertices:[10, 255, 23, 23],
    rgba:[0.4, 0.2, 0.24, 1]
},{
    vertices:[10, -25, 25, -50],
    rgba:[0.4, 0.2, 0.1, 1]
}
]

let boxes1 = [
    {
        vertices:[100, 100, 100, 200, 200, 100],
        rgba:[0.33, 0.33, 0.33, 1]
    }
    ]

webglRender(gl, boxes)


webglRender(gl, boxes)

// Returns a random integer from 0 to range - 1.
function randomInt(range) {
    return Math.floor(Math.random() * range);
}
