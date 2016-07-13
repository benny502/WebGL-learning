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

        this.translation  =  function(x,y,z){

            this.mformMatrix.translate(x, y, z);

        }

        this.rotation = function(angle, x, y, z){

            this.mformMatrix.rotate(angle, x, y, z);

        }

        this.add  =  function(gameobject){

            gameobject.init(this.WebGLContext);

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

    }

});