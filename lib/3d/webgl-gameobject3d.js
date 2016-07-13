define('webgl.gameobject3d',['cuon.utils','cuon.matrix'],function(utils,matrix){

    return function gameobject(vertices){

        this.vertices = vertices;

        this.colors = [];

        this.texcoords = [];

        this.texture = new Object();

        this.mformMatrix = new matrix.Matrix4();; //模型矩阵

        this.vertexBuffer = new Object();

        this.colorBuffer = new Object();

        this.image = new Object();

        this.VSHADER_SOURCE = '';

        this.FSHADER_SOURCE = '';

        this.TEXTURE_VSHADER_SOURCE = '';

        this.TEXTURE_FSHADER_SOURCE = '';

        this.program = new Object();

        this.setTexture  = function(image,texcoords){

        	this.image = image;

        	this.texcoords = texcoords;

        }

        this.setColors = function(colors){

            this.colors = colors;

        }

        this.setVertices = function(vertices){

            this.vertices = vertices;

        }

        this.translation  =  function(x,y,z){

            this.mformMatrix.translate(x, y, z);

        }

        this.rotation = function(angle, x, y, z){

            this.mformMatrix.rotate(angle, x, y, z);

        }

        this.scale = function(x, y, z){
            this.mformMatrix.scale(x, y, z);
        }

        this._caculate = function(){

            var mvpMatrix = new matrix.Matrix4();

            return mvpMatrix.set(this.mformMatrix);

        }

        this.initBuffer = function(gl){

            this.vertexBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

            var vertext  = new Float32Array(this.vertices);

            gl.bufferData(gl.ARRAY_BUFFER, vertext, gl.STATIC_DRAW);

            this.vertexBuffer.num = 3;

            this.vertexBuffer.type = gl.FLOAT;

            if(!this.texcoords){
            	this.colorBuffer = gl.createBuffer();
            	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            }else{
            	this.texcoordBuffer = gl.createBuffer();
            	var texcoords = new Float32Array(this.texcoords);
            	gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
            	gl.bufferData(gl.ARRAY_BUFFER, texcoords, gl.STATIC_DRAW);
            }

        }

        this._setTextCoord = function(gl){

        	gl.useProgram(this.program);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);

            var a_TexCoord = gl.getAttribLocation(this.program, 'a_TexCoord');

            gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 0, 0);

            gl.enableVertexAttribArray(a_TexCoord);

        }

        this._setMvpMatrix = function(gl,g_mvpMatrix){

            var m_mvpMatrix = this._caculate();

            var mvpMatrix = new matrix.Matrix4();

            mvpMatrix.set(g_mvpMatrix).multiply(m_mvpMatrix); //模型矩阵到世界矩阵的

            var u_xformMatrix = gl.getUniformLocation(this.program, 'u_xformMatrix');

            gl.uniformMatrix4fv(u_xformMatrix, false, mvpMatrix.elements);

        }

        this._setVertexBuffer = function(gl){

            //console.log('webgl:','vertext buffer');
            //设置顶点位置
            gl.useProgram(this.program);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

            var a_Position = gl.getAttribLocation(this.program, 'a_Position');

            gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

            gl.enableVertexAttribArray(a_Position);

        }

        this._setFragColorBuffer = function(gl){

            //console.log('webgl:','color buffer');

            //设置顶点的颜色信息

            gl.useProgram(this.program);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);

            var colors = new Float32Array(this.colors);

            gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

            var a_Color = gl.getAttribLocation(this.program, 'a_Color');

            gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);

            gl.enableVertexAttribArray(a_Color);

        }

        this._createTexture = function(gl){

			//console.log('webgl:','set textrue');

            var u_Sampler = gl.getUniformLocation(this.program,'u_Sampler');

            //console.log('webgl:','textrue image loaded');

            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);

            gl.activeTexture(gl.TEXTURE0);

            gl.bindTexture(gl.TEXTURE_2D, this.texture);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.image);

            gl.uniform1i(u_Sampler, 0);
        }

        this.init = function(gl){

        	//创建独立的着色器
        	this.VSHADER_SOURCE =   "attribute vec4 a_Position;\n" +
                                    "attribute float a_PointSize;\n" +
                                    "attribute vec4 a_Color;\n" +
                                    "varying highp vec4 v_Color;\n" +
                                    "uniform mat4 u_xformMatrix;\n" +
                                    "void main() {\n" +
                                    " gl_Position = u_xformMatrix * a_Position;\n" +
                                    " gl_PointSize = a_PointSize;\n" +
                                    " v_Color = a_Color;\n" +
                                    "}\n";

            this.FSHADER_SOURCE = "varying highp vec4 v_Color;\n" +
                                    "void main() {\n" +
                                    "  gl_FragColor = v_Color;\n" +
                                    "}\n";

            this.TEXTURE_VSHADER_SOURCE =   "attribute vec4 a_Position;\n" +
                                    "attribute float a_PointSize;\n" +
                                    "attribute vec2 a_TexCoord;\n" +
                                    "varying highp vec2 v_TexCoord;\n" +
                                    "uniform mat4 u_xformMatrix;\n" +
                                    "void main() {\n" +
                                    " gl_Position = u_xformMatrix * a_Position;\n" +
                                    " gl_PointSize = a_PointSize;\n" +
                                    " v_TexCoord = a_TexCoord;\n" +
                                    "}\n";

            this.TEXTURE_FSHADER_SOURCE = "varying highp vec2 v_TexCoord;\n" +
                                    "varying highp vec4 v_Color;\n" +
                                    "uniform sampler2D u_Sampler;\n" +
                                    "void main() {\n" +
                                    " gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n" +
                                    "}\n";

            if(this.texcoords){
            	console.log('webgl:','texture program');
            	this.program = utils.createProgram(gl,this.TEXTURE_VSHADER_SOURCE,this.TEXTURE_FSHADER_SOURCE);
            }else{
            	this.program = utils.createProgram(gl,this.VSHADER_SOURCE,this.FSHADER_SOURCE);
            }

            this.initBuffer(gl);

            this.texture = gl.createTexture();

        }

        this.draw = function(gl,g_mvpMatrix){

        	if(!this.texcoords){

        		this._setFragColorBuffer(gl);

        	}else{

				this._createTexture(gl);

				this._setTextCoord(gl);

        	}

            this._setVertexBuffer(gl);

            this._setMvpMatrix(gl,g_mvpMatrix);

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            //console.log('webgl:','draw');

            gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);

        }

    }

});