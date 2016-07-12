define('webgl.cube3d',['cuon.utils','cuon.matrix','webgl.gameobject3d'],function(utils,matrix,gameobject){

	function cube(vertices,indices,colors){

        cube.prototype = new gameobject(vertices,colors);

        cube.constructor = cube;

		this.vertices = vertices;

		this.colors = colors;

        this.indices = indices;

        this.indexBuffer = new Object();

        this.setVertices = function(vertices,indices){

        	this.vertices = vertices;

            this.indices = indices;

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

            this.colorBuffer.num = 4;

            this.colorBuffer.type = gl.FLOAT;

            this.indexBuffer = gl.createBuffer();

            var indices = new Uint8Array(this.indices);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        }

        this._setVertexBuffer = function(gl){

			//console.log('webgl:','vertext buffer');
        	//设置顶点位置
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

            var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

            gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

            gl.enableVertexAttribArray(a_Position);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        }

        this.draw = function(gl,g_pformMatrix,g_vformMatrix,g_mformMatrix){

        	this._setFragColorBuffer(gl);

        	this._setVertexBuffer(gl);

        	this._setMvpMatrix(gl,g_pformMatrix,g_vformMatrix,g_mformMatrix);
        	
            //console.log('webgl:','draw');

            gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);

        }

	}

    cube.prototype = new gameobject();
    cube.prototype.constructor = cube;

    return cube;

});