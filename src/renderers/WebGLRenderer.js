import Face3 from "../core/Face3";
import Face4 from "../core/Face4";
import Matrix4 from "../core/Matrix4";
import AmbientLight from "../lights/AmbientLight";
import DirectionalLight from "../lights/DirectionalLight";
import PointLight from "../lights/PointLight";
import MeshBitmapUVMappingMaterial from "../materials/MeshBitmapUVMappingMaterial";
import MeshColorFillMaterial from "../materials/MeshColorFillMaterial";
import MeshColorStrokeMaterial from "../materials/MeshColorStrokeMaterial";
import MeshFaceColorFillMaterial from "../materials/MeshFaceColorFillMaterial";
import MeshFaceColorStrokeMaterial from "../materials/MeshFaceColorStrokeMaterial";
import Mesh from "../objects/Mesh";

var _canvas = document.createElement('canvas'), 
    _gl, 
    _program,
    _viewMatrix = new Matrix4(), 
    _normalMatrix;

var COLORFILL = 0, COLORSTROKE = 1, FACECOLORFILL = 2, FACECOLORSTROKE = 3, BITMAP = 4;

export default class WebGLRenderer {
    domElement = _canvas
    autoClear = true

    constructor() {
        this.initGL()
        this.initProgram()
    }

    setSize(width, height) {
        _canvas.width = width;
        _canvas.height = height;
        _gl.viewport(0, 0, _canvas.width, _canvas.height);
    }

    clear() {
        _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);
    }


    setupLights(scene, camera) {
        let lightColor, lightPosition;

        //lighting
        _gl.uniform1i(_program.enableLighting, scene.lights.length);

        scene.lights.forEach(light => {

            if (light instanceof AmbientLight) {

                lightColor = light.color;
                _gl.uniform3f(_program.ambientColor, lightColor.r, lightColor.g, lightColor.b);

            } else if (light instanceof DirectionalLight) {

                lightColor = light.color;
                lightPosition = light.position;
                _gl.uniform3f(_program.lightingDirection, lightPosition.x, lightPosition.y, lightPosition.z);
                _gl.uniform3f(_program.directionalColor, lightColor.r, lightColor.g, lightColor.b);

            } else if (light instanceof PointLight) {

                lightColor = light.color;
                lightPosition = light.position;
                _gl.uniform3f(_program.pointPosition, lightPosition.x, lightPosition.y, lightPosition.z);
                _gl.uniform3f(_program.pointColor, lightColor.r, lightColor.g, lightColor.b);

            }
        });
    }

    setupMatrices(object, camera) {

        _viewMatrix.multiply(camera.matrix, object.matrix);

        _program.viewMatrixArray = new Float32Array(_viewMatrix.flatten());
        _program.projectionMatrixArray = new Float32Array(camera.projectionMatrix.flatten());

        _normalMatrix = Matrix4.makeInvert3x3(object.matrix).transpose();
        _program.normalMatrixArray = new Float32Array(_normalMatrix.m);

        _gl.uniformMatrix4fv(_program.viewMatrix, false, _program.viewMatrixArray);
        _gl.uniformMatrix4fv(_program.projectionMatrix, false, _program.projectionMatrixArray);
        _gl.uniformMatrix3fv(_program.normalMatrix, false, _program.normalMatrixArray);
        _gl.uniformMatrix4fv(_program.objMatrix, false, new Float32Array(object.matrix.flatten()));
    }

    createBuffers(object, materialFace) {

        const vertexArray = [];
        const faceArray = [];
        const colorArray = [];
        const normalArray = [];
        const uvArray = [];
        const lineArray = [];
        let vertexIndex = 0;

        //log( "object.geometry.uvs: " + object.geometry.uvs.length + " " + object.geometry.uvs);

        materialFace.faces.forEach(fi => {

            const face = object.geometry.faces[fi];
            const faceColor = face.color;
            let vertexNormals = face.vertexNormals;
            const normal = face.normal;
            const uv = object.geometry.uvs[fi];

            if (face instanceof Face3) {

                const v1 = object.geometry.vertices[face.a].position;
                const v2 = object.geometry.vertices[face.b].position;
                const v3 = object.geometry.vertices[face.c].position;

                vertexArray.push(v1.x, v1.y, v1.z);
                vertexArray.push(v2.x, v2.y, v2.z);
                vertexArray.push(v3.x, v3.y, v3.z);

                if (vertexNormals.length == 3) {

                    normalArray.push(vertexNormals[0].x, vertexNormals[0].y, vertexNormals[0].z);
                    normalArray.push(vertexNormals[1].x, vertexNormals[1].y, vertexNormals[1].z);
                    normalArray.push(vertexNormals[2].x, vertexNormals[2].y, vertexNormals[2].z);

                }
                else {

                    normalArray.push(normal.x, normal.y, normal.z);
                    normalArray.push(normal.x, normal.y, normal.z);
                    normalArray.push(normal.x, normal.y, normal.z);

                }

                colorArray.push(faceColor.r, faceColor.g, faceColor.b, faceColor.a);
                colorArray.push(faceColor.r, faceColor.g, faceColor.b, faceColor.a);
                colorArray.push(faceColor.r, faceColor.g, faceColor.b, faceColor.a);

                if (uv) {

                    uvArray.push(uv[0].u, uv[0].v);
                    uvArray.push(uv[1].u, uv[1].v);
                    uvArray.push(uv[2].u, uv[2].v);

                }

                faceArray.push(vertexIndex, vertexIndex + 1, vertexIndex + 2);

                // TODO: don't add lines that already exist (faces sharing edge)

                lineArray.push(vertexIndex, vertexIndex + 1);
                lineArray.push(vertexIndex, vertexIndex + 2);
                lineArray.push(vertexIndex + 1, vertexIndex + 2);

                vertexIndex += 3;

            } else if (face instanceof Face4) {

                const v1 = object.geometry.vertices[face.a].position;
                const v2 = object.geometry.vertices[face.b].position;
                const v3 = object.geometry.vertices[face.c].position;
                const v4 = object.geometry.vertices[face.d].position;

                vertexArray.push(v1.x, v1.y, v1.z);
                vertexArray.push(v2.x, v2.y, v2.z);
                vertexArray.push(v3.x, v3.y, v3.z);
                vertexArray.push(v4.x, v4.y, v4.z);

                if (vertexNormals.length == 4) {

                    normalArray.push(vertexNormals[0].x, vertexNormals[0].y, vertexNormals[0].z);
                    normalArray.push(vertexNormals[1].x, vertexNormals[1].y, vertexNormals[1].z);
                    normalArray.push(vertexNormals[2].x, vertexNormals[2].y, vertexNormals[2].z);
                    normalArray.push(vertexNormals[3].x, vertexNormals[3].y, vertexNormals[3].z);

                }
                else {

                    normalArray.push(normal.x, normal.y, normal.z);
                    normalArray.push(normal.x, normal.y, normal.z);
                    normalArray.push(normal.x, normal.y, normal.z);
                    normalArray.push(normal.x, normal.y, normal.z);

                }

                colorArray.push(faceColor.r, faceColor.g, faceColor.b, faceColor.a);
                colorArray.push(faceColor.r, faceColor.g, faceColor.b, faceColor.a);
                colorArray.push(faceColor.r, faceColor.g, faceColor.b, faceColor.a);
                colorArray.push(faceColor.r, faceColor.g, faceColor.b, faceColor.a);

                if (uv) {

                    uvArray.push(uv[0].u, uv[0].v);
                    uvArray.push(uv[1].u, uv[1].v);
                    uvArray.push(uv[2].u, uv[2].v);
                    uvArray.push(uv[3].u, uv[3].v);

                }

                faceArray.push(vertexIndex, vertexIndex + 1, vertexIndex + 2);
                faceArray.push(vertexIndex, vertexIndex + 2, vertexIndex + 3);

                // TODO: don't add lines that already exist (faces sharing edge)

                lineArray.push(vertexIndex, vertexIndex + 1);
                lineArray.push(vertexIndex, vertexIndex + 2);
                lineArray.push(vertexIndex, vertexIndex + 3);
                lineArray.push(vertexIndex + 1, vertexIndex + 2);
                lineArray.push(vertexIndex + 2, vertexIndex + 3);

                vertexIndex += 4;
            }
        })


        if (!vertexArray.length) {

            return;

        }

        /*
        log( "vertices: " + vertexArray.length/3 );
        log( "faces: " + faceArray.length/3 );
        log( "normals: " + normalArray.length/3 );
        log( "colors: " + colorArray.length/4 );
        log( "uvs: " + uvArray.length/2 );
        */


        materialFace.__webGLVertexBuffer = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, materialFace.__webGLVertexBuffer);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(vertexArray), _gl.STATIC_DRAW);

        materialFace.__webGLNormalBuffer = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, materialFace.__webGLNormalBuffer);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(normalArray), _gl.STATIC_DRAW);

        materialFace.__webGLColorBuffer = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, materialFace.__webGLColorBuffer);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(colorArray), _gl.STATIC_DRAW);

        materialFace.__webGLUVBuffer = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, materialFace.__webGLUVBuffer);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(uvArray), _gl.STATIC_DRAW);

        materialFace.__webGLFaceBuffer = _gl.createBuffer();
        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, materialFace.__webGLFaceBuffer);
        _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faceArray), _gl.STATIC_DRAW);

        materialFace.__webGLLineBuffer = _gl.createBuffer();
        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, materialFace.__webGLLineBuffer);
        _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lineArray), _gl.STATIC_DRAW);

        materialFace.__webGLFaceCount = faceArray.length;
        materialFace.__webGLLineCount = lineArray.length;
    }

    renderMesh(object, camera) {
        var material, materialFace, color, lineWidth;

        // create separate VBOs per material
        for (var m in object.materialFaces) {

            materialFace = object.materialFaces[m];
            material = object.material[m];
            if (!material) continue;
            //log(material);

            if (!materialFace.__webGLVertexBuffer) {

                this.createBuffers(object, materialFace);

            }

            object.material.forEach((material, mIndex) => {
                if (material instanceof MeshBitmapUVMappingMaterial &&
                    !(mIndex == m || m == material.decalIndex)) {

                    return;
                }

                if (material instanceof MeshColorFillMaterial) {

                    color = material.color;
                    _gl.uniform4f(_program.uniformColor, color.r, color.g, color.b, color.a);

                    _gl.uniform1i(_program.material, COLORFILL);

                } else if (material instanceof MeshColorStrokeMaterial) {

                    lineWidth = material.lineWidth;

                    color = material.color;
                    _gl.uniform4f(_program.uniformColor, color.r, color.g, color.b, color.a);

                    _gl.uniform1i(_program.material, COLORSTROKE);

                } else if (material instanceof MeshFaceColorFillMaterial) {

                    _gl.uniform1i(_program.material, FACECOLORFILL);

                } else if (material instanceof MeshFaceColorStrokeMaterial) {

                    lineWidth = material.lineWidth;

                    _gl.uniform1i(_program.material, FACECOLORSTROKE);

                } else if (material instanceof MeshBitmapUVMappingMaterial) {

                    if (!material.__webGLTexture && material.loaded) {

                        material.__webGLTexture = _gl.createTexture();
                        _gl.bindTexture(_gl.TEXTURE_2D, material.__webGLTexture);
                        _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, material.bitmap);
                        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.LINEAR);
                        //_gl.texParameteri( _gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.LINEAR_MIPMAP_NEAREST );
                        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.LINEAR_MIPMAP_LINEAR);
                        _gl.generateMipmap(_gl.TEXTURE_2D);
                        _gl.bindTexture(_gl.TEXTURE_2D, null);

                    }

                    _gl.activeTexture(_gl.TEXTURE0);
                    _gl.bindTexture(_gl.TEXTURE_2D, material.__webGLTexture);
                    _gl.uniform1i(_program.diffuse, 0);

                    _gl.uniform1i(_program.material, BITMAP);

                }


                // vertices
                _gl.bindBuffer(_gl.ARRAY_BUFFER, materialFace.__webGLVertexBuffer);
                _gl.vertexAttribPointer(_program.position, 3, _gl.FLOAT, false, 0, 0);

                // normals
                _gl.bindBuffer(_gl.ARRAY_BUFFER, materialFace.__webGLNormalBuffer);
                _gl.vertexAttribPointer(_program.normal, 3, _gl.FLOAT, false, 0, 0);

                // colors
                _gl.bindBuffer(_gl.ARRAY_BUFFER, materialFace.__webGLColorBuffer);
                _gl.vertexAttribPointer(_program.color, 4, _gl.FLOAT, false, 0, 0);

                // uvs

                if (material instanceof MeshBitmapUVMappingMaterial) {

                    _gl.bindBuffer(_gl.ARRAY_BUFFER, materialFace.__webGLUVBuffer);

                    _gl.enableVertexAttribArray(_program.uv);
                    _gl.vertexAttribPointer(_program.uv, 2, _gl.FLOAT, false, 0, 0);

                }
                else {

                    _gl.disableVertexAttribArray(_program.uv);

                }

                // render triangles

                if (material instanceof MeshBitmapUVMappingMaterial ||
                    material instanceof MeshFaceColorFillMaterial ||
                    material instanceof MeshColorFillMaterial) {

                    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, materialFace.__webGLFaceBuffer);
                    _gl.drawElements(_gl.TRIANGLES, materialFace.__webGLFaceCount, _gl.UNSIGNED_SHORT, 0);

                }

                // render lines

                else if (material instanceof MeshColorStrokeMaterial ||
                    material instanceof MeshFaceColorStrokeMaterial) {

                    _gl.lineWidth(lineWidth);
                    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, materialFace.__webGLLineBuffer);
                    _gl.drawElements(_gl.LINES, materialFace.__webGLLineCount, _gl.UNSIGNED_SHORT, 0);

                }
            })

        }
    }

    render( scene, camera ) {
		
        if (this.autoClear) {

            this.clear();

        }

        this.setupLights(scene, camera)

        scene.objects.forEach(object => {

            this.setupMatrices(object, camera);

            if (object instanceof Mesh) {

                this.renderMesh(object, camera);
            }
        })
    }

    initGL() {
        try {
            _gl = _canvas.getContext('experimental-webgl');

        } catch (e) { }

        if (!_gl) {

            alert("WebGL not supported");
            throw "cannot create webgl context";

        }

        _gl.clearColor(0, 0, 0, 1);
        _gl.clearDepth(1);

        _gl.enable(_gl.DEPTH_TEST);
        _gl.depthFunc(_gl.LEQUAL);

        _gl.enable(_gl.BLEND);
        _gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA);
        // _gl.blendFunc( _gl.SRC_ALPHA, _gl.ONE ); // cool!
        _gl.clearColor(0, 0, 0, 0);
    }

    initProgram() {

        _program = _gl.createProgram();

        _gl.attachShader(_program, this.getShader("fragment", [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",

            "uniform sampler2D diffuse;",

            "uniform vec4 uniformColor;",

            "varying vec2 vertexUv;",
            "varying vec4 vertexColor;",
            "varying vec3 lightWeighting;",

            "varying vec3 vNormal;",

            "uniform int material;", // 0 - ColorFill, 1 - ColorStroke, 2 - FaceColorFill, 3 - FaceColorStroke, 4 - Bitmap

            "void main(){",
				"if(material==4) {", // texture
					"vec4 texelColor = texture2D(diffuse, vertexUv);",
					"gl_FragColor = vec4(texelColor.rgb * lightWeighting, texelColor.a);",

				"} else if(material==3) {", // wireframe using vertex color 
					"gl_FragColor = vec4(vertexColor.rgb * lightWeighting, vertexColor.a);",

				"} else if(material==2) {", // triangle using vertex color
					"gl_FragColor = vec4(vertexColor.rgb * lightWeighting, vertexColor.a);",

				"} else if(material==1) {", // wireframe using uniform color
					"gl_FragColor = vec4(uniformColor.rgb * lightWeighting, uniformColor.a);",

				"} else {", // triangle using uniform color
					"gl_FragColor = vec4(uniformColor.rgb * lightWeighting, uniformColor.a);",
				//"gl_FragColor = vec4(vNormal, 1.0);",
				"}",
            "}"
        ].join("\n")));

        _gl.attachShader(_program, this.getShader("vertex", [
            "attribute vec3 position;",
            "attribute vec3 normal;",
            "attribute vec4 color;",
            "attribute vec2 uv;",

            "uniform bool enableLighting;",
            "uniform vec3 ambientColor;",
            "uniform vec3 directionalColor;",
            "uniform vec3 lightingDirection;",

            "uniform vec3 pointColor;",
            "uniform vec3 pointPosition;",

            "uniform mat4 viewMatrix;",
            "uniform mat4 projectionMatrix;",
            "uniform mat4 objMatrix;",
            "uniform mat3 normalMatrix;",

            "varying vec4 vertexColor;",
            "varying vec2 vertexUv;",
            "varying vec3 lightWeighting;",

            "varying vec3 vNormal;",

            "void main(void) {",
				"vec4 mvPosition = viewMatrix * vec4( position, 1.0 );",
				"vec4 mPosition = objMatrix * vec4( position, 1.0 );",
				"vec3 transformedNormal = normalize(normalMatrix * normal);",

				"if(!enableLighting) {",
					"lightWeighting = vec3(1.0, 1.0, 1.0);",
				"} else {",
					"vec3 pointLight = normalize(pointPosition.xyz - mPosition.xyz);",
					"float directionalLightWeighting = max(dot(transformedNormal, normalize(lightingDirection)), 0.0);",
					"float pointLightWeighting = max(dot(transformedNormal, pointLight), 0.0);",
					"lightWeighting = ambientColor + directionalColor * directionalLightWeighting + pointColor * pointLightWeighting;",
				"}",

				"vNormal = transformedNormal;",
				"vertexColor = color;",
				"vertexUv = uv;",

				"gl_Position = projectionMatrix * mvPosition;",

            "}"].join("\n")));

        _gl.linkProgram(_program);

        if (!_gl.getProgramParameter(_program, _gl.LINK_STATUS)) {

            alert("Could not initialise shaders");

        }

        _gl.useProgram(_program);

        _program.viewMatrix = _gl.getUniformLocation(_program, "viewMatrix");
        _program.projectionMatrix = _gl.getUniformLocation(_program, "projectionMatrix");
        _program.normalMatrix = _gl.getUniformLocation(_program, "normalMatrix");
        _program.objMatrix = _gl.getUniformLocation(_program, "objMatrix");

        _program.enableLighting = _gl.getUniformLocation(_program, 'enableLighting');
        _program.ambientColor = _gl.getUniformLocation(_program, 'ambientColor');
        _program.directionalColor = _gl.getUniformLocation(_program, 'directionalColor');
        _program.lightingDirection = _gl.getUniformLocation(_program, 'lightingDirection');

        _program.pointColor = _gl.getUniformLocation(_program, 'pointColor');
        _program.pointPosition = _gl.getUniformLocation(_program, 'pointPosition');

        _program.material = _gl.getUniformLocation(_program, 'material');
        _program.uniformColor = _gl.getUniformLocation(_program, 'uniformColor');

        _program.color = _gl.getAttribLocation(_program, "color");
        _gl.enableVertexAttribArray(_program.color);

        _program.position = _gl.getAttribLocation(_program, "position");
        _gl.enableVertexAttribArray(_program.position);

        _program.normal = _gl.getAttribLocation(_program, "normal");
        _gl.enableVertexAttribArray(_program.normal);

        _program.uv = _gl.getAttribLocation(_program, "uv");
        _gl.enableVertexAttribArray(_program.uv);

        _program.diffuse = _gl.getUniformLocation(_program, "diffuse");
        _gl.uniform1i(_program.diffuse, 0);

        _program.viewMatrixArray = new Float32Array(16);
        _program.projectionMatrixArray = new Float32Array(16);
    }

    getShader(type, string) {

        var shader;

        if (type == "fragment") {

            shader = _gl.createShader(_gl.FRAGMENT_SHADER);

        } else if (type == "vertex") {

            shader = _gl.createShader(_gl.VERTEX_SHADER);

        }

        _gl.shaderSource(shader, string);
        _gl.compileShader(shader);

        if (!_gl.getShaderParameter(shader, _gl.COMPILE_STATUS)) {

            alert(_gl.getShaderInfoLog(shader));
            return null;

        }

        return shader;
    }
}