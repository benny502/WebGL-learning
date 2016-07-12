require.config({
    waitSeconds: 60,
    paths: {
        "jquery": [
            "common/jquery-1.11.2.min"
        ],
        "webgl.utils":[
            "common/webgl-utils"
        ],
        "webgl.debug":[
            "common/webgl-debug"
        ],
        "cuon.utils":[
            "common/cuon-utils"
        ],
        "cuon.matrix":[
            "common/cuon-matrix"
        ],
        "webgl.view3d":[
            "3d/webgl-view3d"
        ],
        "webgl.gameobject3d":[
            "3d/webgl-gameobject3d"
        ],
        "webgl.cube3d":[
            "3d/webgl-cube3d"
        ]
    },
    shim: {
        'webgl.utils': {
            init:function(){
                return {
                    setupWebGL:WebGLUtils.setupWebGL,
                    create3DContext: WebGLUtils.create3DContext,
                }
            }
        },
        'webgl.debug': {
            init:function(){
                return {
                    'init': WebGLDebugUtils.init,
                    'mightBeEnum': WebGLDebugUtils.mightBeEnum,
                    'glEnumToString': WebGLDebugUtils.glEnumToString,
                    'glFunctionArgToString': WebGLDebugUtils.glFunctionArgToString,
                    'makeDebugContext': WebGLDebugUtils.makeDebugContext,
                    'makeLostContextSimulatingContext': WebGLDebugUtils.makeLostContextSimulatingContext,
                    'resetToInitialState': WebGLDebugUtils.resetToInitialState
                }
            }
        },
        'cuon.utils': {
            deps: ['webgl.utils','webgl.debug'],
            init:function(){
                return {
                    'initShaders':initShaders,
                    'getWebGLContext':getWebGLContext
                }
            }
        },
        'cuon.matrix': {
            deps: [],
            init:function(){
                return {
                    'Matrix4':Matrix4,
                    'Vector3':Vector3,
                    'Vector4':Vector4
                }
            }
        }
    }
});

require(['jquery','webgl.view3d','webgl.gameobject3d','webgl.cube3d'],function($,view,gameobject,cube){
    var canvas = $('canvas')[0];

    var view = new view(canvas);
    view.clearColor(0,0,0,1);
    view.setPerspective(30, canvas.width/canvas.height, 0.1, 100);
    view.setLookAt(0,0,-6,
                0,0,100,
                0,1,0);
    var triangle1 = new gameobject([      0.0,  0.5,   0.0,   
                            -0.5, -0.5,   0.0,
                             0.5, -0.5,   0.0,
                             ],
                             [
                        0.5,  0.5,  0, 1.0,
                        0.5,  0.5,  0, 1.0,
                        0.5,  0.5,  0, 1.0,
                        ]);

    var triangle2 = new gameobject(
                        [   
                             0.0,  1.0,  0.5,  
                            -0.5, -1.0,  0.5,
                             0.5, -1.0,  0.5
                             ],
                             [
                        1.0,  0.0,  0.0, 1.0,
                        1.0,  0.0,  0.0, 1.0,
                        1.0,  0.0,  0.0, 1.0,
                        ]
    );

    var cube1 = new cube([   // Vertex coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
  ],[       // Indices of the vertices
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ],[     // Colors
    0.4, 0.4, 1.0,1,  0.4, 0.4, 1.0,1,  0.4, 0.4, 1.0,1,  0.4, 0.4, 1.0,1,  // v0-v1-v2-v3 front(blue)
    0.4, 1.0, 0.4,1,  0.4, 1.0, 0.4,1,  0.4, 1.0, 0.4,1,  0.4, 1.0, 0.4,1,  // v0-v3-v4-v5 right(green)
    1.0, 0.4, 0.4,1,  1.0, 0.4, 0.4,1,  1.0, 0.4, 0.4,1,  1.0, 0.4, 0.4,1,  // v0-v5-v6-v1 up(red)
    1.0, 1.0, 0.4,1,  1.0, 1.0, 0.4,1,  1.0, 1.0, 0.4,1,  1.0, 1.0, 0.4,1,  // v1-v6-v7-v2 left
    1.0, 1.0, 1.0,1,  1.0, 1.0, 1.0,1,  1.0, 1.0, 1.0,1,  1.0, 1.0, 1.0,1,  // v7-v4-v3-v2 down
    0.4, 1.0, 1.0,1,  0.4, 1.0, 1.0,1,  0.4, 1.0, 1.0,1,  0.4, 1.0, 1.0,1  // v4-v7-v6-v5 back
  ]);

     view.add(triangle1);
     view.add(triangle2);
     view.add(cube1);

    triangle1.translation(1,0,2);
    triangle2.translation(1,0,4);


    var lastTime = Date.now(),angleStep = 20;
    function animate(){

        var now = Date.now();
        var timeLapse = now - lastTime;
        var angle = angleStep * timeLapse / 1000.0;
        angle %= 360;
        lastTime = now;
        view.rotation(angle,0,1,0);
        //triangle1.rotation(angle,1,0,0);
        cube1.rotation(angle,1,0,0);
        view.run();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);


});

