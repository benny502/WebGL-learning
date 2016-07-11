define('webgl.view3d',['cuon.utils','cuon.matrix'],function(utils,matrix){


    return function view(canvas){

        this.canvas = canvas;

        this.WebGLContext = utils.getWebGLContext(canvas);

        this.VSHADER_SOURCE = '';

        this.FSHADER_SOURCE = '';

        this.vformMatrix = new matrix.Matrix4(); //世界视图矩阵

        this.pformMatrix = new matrix.Matrix4(); //世界投影矩阵

        this.mformMatrix = new matrix.Matrix4(); //世界模型矩阵

        this.gameobject = [];


        this.initShaders = function(){

            console.log('webgl:','init shaders');

            this.VSHADER_SOURCE =   "attribute vec4 a_Position;\n" +
                                    "attribute float a_PointSize;\n" +
                                    "attribute vec2 a_TexCoord;\n" +
                                    "attribute vec4 a_Color;\n" +
                                    "varying highp vec2 v_TexCoord;\n" +
                                    "varying highp vec4 v_Color;\n" +
                                    "uniform mat4 u_xformMatrix;\n" +
                                    "void main() {\n" +
                                    " gl_Position = u_xformMatrix * a_Position;\n" +
                                    " gl_PointSize = a_PointSize;\n" +
                                    " v_TexCoord = a_TexCoord;\n" +
                                    " v_Color = a_Color;\n" +
                                    "}\n";

            this.FSHADER_SOURCE = "varying highp vec2 v_TexCoord;\n" +
                                    "varying highp vec4 v_Color;\n" +
                                    "uniform sampler2D u_Sampler;\n" +
                                    "void main() {\n" +
                                    " if(u_Sampler != 0){\n" +
                                    "  gl_FragColor = v_Color * texture2D(u_Sampler, v_TexCoord);\n" +
                                    " }else{\n" +
                                    "  gl_FragColor = v_Color;\n" +
                                    " }\n" +
                                    "}\n";

            utils.initShaders(this.WebGLContext,this.VSHADER_SOURCE,this.FSHADER_SOURCE);

        }

        this.translation  =  function(x,y){

            this.mformMatrix.tranlate(x, y, 0);

        }

        this.rotation = function(angle, x, y, z){

            this.mformMatrix.rotate(angle, x, y, z);

        }

        this.add  =  function(gameobject){

            gameobject.initBuffer(this.WebGLContext);

            this.gameobject.push(gameobject);

        }

        this.setLookAt = function(eyeX,eyeY,eyeZ,atX,atY,atZ,upX,upY,upZ){

            this.vformMatrix.lookAt(eyeX,eyeY,eyeZ,atX,atY,atZ,upX,upY,upZ);

        }

        this.setOrtho = function(left, right, top, bottom, near, far){

            this.pformMatrix.ortho(left, right, top, bottom, near, far);

        }

        this.setPerspective = function(fovy, aspect, near, far){

            this.pformMatrix.perspective(fovy, aspect, near, far);

        }

        this.clearColor = function(r, g, b, a){

            console.log('webgl:','set clear color');

            this.WebGLContext.clearColor(r, g, b, a);

        }

        this._caculate = function(){

            var mvpMatrix = new matrix.Matrix4();

            return mvpMatrix.set(this.pformMatrix).multiply(this.vformMatrix).multiply(this.mformMatrix);

        }

        this.run = function(){

            var g_mvpMatrix = this._caculate();

            this.WebGLContext.clear(this.WebGLContext.COLOR_BUFFER_BIT);

            for(var i in this.gameobject){

                this.gameobject[i].draw(this.WebGLContext,g_mvpMatrix);

            }

        }

        //init
        this.WebGLContext.enable(this.WebGLContext.DEPTH_TEST);

        this.initShaders();

    }

});