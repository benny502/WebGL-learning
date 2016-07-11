define('webgl.gameobject3d',['cuon.utils','cuon.matrix'],function(utils,matrix){

	return function gameobject(vertices,colors){

		this.vertices = vertices;

		this.colors = colors;

        this.mformMatrix = new matrix.Matrix4(); //模型矩阵

        this.vertexBuffer = new Object();

        this.colorBuffer = new Object();

		this.setColors = function(colors){

        	this.colors = colors;

        }

        this.setVertices = function(vertices){

        	this.vertices = vertices;

        }

        this.translation  =  function(x,y){

            this.mformMatrix.tranlate(x, y, 0);

        }

        this.rotation = function(angle, x, y, z){

            this.mformMatrix.rotate(angle, x, y, z);

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

            this.colorBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);

            var colors = new Float32Array(this.colors);

            gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

            this.colorBuffer.num = 3;

            this.colorBuffer.type = gl.FLOAT;

        }

        this._setMvpMatrix = function(gl,g_mvpMatrix){

        	var m_mvpMatrix = this._caculate();

        	var mvpMatrix = new matrix.Matrix4();

        	mvpMatrix.set(g_mvpMatrix).multiply(m_mvpMatrix);

			var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');

            gl.uniformMatrix4fv(u_xformMatrix, false, mvpMatrix.elements);

        }

        this._setVertexBuffer = function(gl){

			//console.log('webgl:','vertext buffer');
        	//设置顶点位置

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

            var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

            gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

            gl.enableVertexAttribArray(a_Position);

        }

        this._setFragColorBuffer = function(gl){

			//console.log('webgl:','color buffer');

           	//设置顶点的颜色信息

            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);

            var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

            gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);

            gl.enableVertexAttribArray(a_Color);
        }

        this.draw = function(gl,g_mvpMatrix){

        	this._setFragColorBuffer(gl);

        	this._setVertexBuffer(gl);

        	this._setMvpMatrix(gl,g_mvpMatrix);
        	
            //console.log('webgl:','draw');

            gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);

        }

	}

});