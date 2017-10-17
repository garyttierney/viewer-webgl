import Node from "./Node";
import NodeVisitor from "./NodeVisitor";
import {Texture, GlUtils} from "../../utils/GlUtils";

class VideoNode extends Node {
    private texture: Texture;
    private positionBuffer: WebGLBuffer;
    private texCoordBuffer: WebGLBuffer;
    private indexBuffer: WebGLBuffer;

    constructor(private host: HTMLCanvasElement) {
        super()
    }

    accept(visitor: NodeVisitor): void {
        visitor.visitVideoNode(this)
    }

    init(gl: WebGLRenderingContext): void {
        this.texture = GlUtils.createTexture(gl, this.host);
        this.indexBuffer = gl.createBuffer();
        this.texCoordBuffer = gl.createBuffer();
        this.positionBuffer = gl.createBuffer();

        const positionArray = new Float32Array([
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
        ]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positionArray, gl.STATIC_DRAW);

        const texCoordArray = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, texCoordArray, gl.STATIC_DRAW);

        const indices = new Uint16Array([
            0, 1, 2, 0, 2, 3
        ]);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }

    render(gl: WebGLRenderingContext): void {
        this.texture.bind(gl);
        this.texture.update(gl, this.host);
    }

}