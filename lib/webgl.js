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
        "webgl.object":[
            "common/webgl-object"
        ],
        "webgl.view3d":[
            "3d/webgl-view3d"
        ],
        "webgl.gameobject3d":[
            "3d/webgl-gameobject3d"
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

require(['jquery','webgl.view3d','webgl.gameobject3d'],function($,view,object){
    var canvas = $('canvas')[0];
    var view = new view(canvas);
    view.clearColor(0,0,0,1);
    view.setPerspective(30, canvas.width/canvas.height, 0.1, 100);
    view.setLookAt(0,0,-5,
                0,0,100,
                0,1,0);

    var triangle1 = new object([      0.0,  0.5,   2,   // The front blue one 
                            -0.5, -0.5,   2,
                             0.5, -0.5,   2
                             ],
                             [
                        0.4,  0.4,  1.0, 1.0,
                        0.4,  0.4,  1.0, 1.0,
                        0.4,  0.4,  1.0, 1.0
                        ]);

    view.add(triangle1);

    var triangle2 = new object([ 
                            0.0,  0.4,  2.1,  // The middle yellow one
                            -0.5, -0.4,  2.1,
                             0.5, -0.4,  2.1
                             ],
                             [
                        1.0,  0.0,  0.0, 1.0,
                        1.0,  0.0,  0.0, 1.0,
                        1.0,  0.0,  0.0, 1.0,
                        ]);

    view.add(triangle2);


    var lastTime = Date.now(),angleStep = 20;
    function animate(){

        var now = Date.now();
        var timeLapse = now - lastTime;
        var angle = angleStep * timeLapse / 1000.0;
        angle %= 360;
        lastTime = now;
        view.rotation(angle,0,1,0);
        view.run();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

});

