define('webgl.cube3d',['cuon.utils','cuon.matrix','webgl.gameobject3d'],function(utils,matrix,gameobject){

	function cube(vertices,indices){

		this.vertices = vertices;

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

            if(!this.texcoords){
                this.colorBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            }else{
                this.texcoordBuffer = gl.createBuffer();
                var texcoords = new Float32Array(this.texcoords);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, texcoords, gl.STATIC_DRAW);
            }

            this.indexBuffer = gl.createBuffer();

            var indices = new Uint8Array(this.indices);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        }

        this._setVertexBuffer = function(gl){

			//console.log('webgl:','vertext buffer');
        	//设置顶点位置
            gl.useProgram(this.program);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

            var a_Position = gl.getAttribLocation(this.program, 'a_Position');

            gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

            gl.enableVertexAttribArray(a_Position);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

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

            gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);

        }

	}

    cube.prototype = new gameobject();
    cube.prototype.constructor = cube;

    return cube;

});