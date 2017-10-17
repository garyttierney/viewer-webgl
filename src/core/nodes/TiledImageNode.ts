import ViewerNode from "./Node";
import NodeVisitor from "./NodeVisitor";

const MIPMAP_LEVEL = 0;

/**
 * Check if a number is a power of 2.
 *
 * @param {number} value The number to check.
 * @returns {boolean} {@code true} iff {@code value} is a power of 2.
 */
function isPowerOf2(value: number): boolean {
    return (value & (value - 1)) == 0;
}

/**
 * Normalize a number in the range of [{@code min},{@code max}) to [0,1).
 *
 * @param {number} value The number to be normalized into the range of 0-1.
 * @param {number} min The minimum valid number in the given range.
 * @param {number} max The maximum valid number in the given range.
 */
function normalize(value: number, min: number, max: number) {
    return (value - min) / (max - min);
}

/**
 * A {@link ViewerNode} that represents a {@link TiledImage} as a single mesh large enough to accommodate
 * any arrangement of tiles without updating any VRAM buffers.
 */
export default class TiledImageNode extends ViewerNode {

    /**
     * The backing OpenGL texture for this image.
     */
    private texture: WebGLTexture;

    /**
     * A buffer containing vertex coordinates for this image.
     */
    private vertexBuffer: WebGLBuffer;

    /**
     * A buffer containing texture coordinates for this image.
     */
    private texCoordBuffer: WebGLBuffer;

    constructor(private imageData: ImageData, private scaleFactor: number) {
        super()
    }

    accept(visitor: NodeVisitor): void {
        visitor.visitImage(this);
    }

    render(context: WebGLRenderingContext): void {

    }

    init(gl: WebGLRenderingContext): void {
        this.texture = gl.createTexture();
        this.vertexBuffer = gl.createBuffer();
        this.texCoordBuffer = gl.createBuffer();

        const width = this.imageData.width;
        const height = this.imageData.height;
        const tileWidth = Math.ceil(width / this.scaleFactor);
        const tileHeight = Math.ceil(height / this.scaleFactor);

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, MIPMAP_LEVEL, gl.RGBA, width, height, this.imageData);

        if (isPowerOf2(width) && isPowerOf2(height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }

        const vertexCount = (tileWidth / width) * (tileHeight / height) * 3 * 2;
        const positionArray = [];
        const texCoordArray = [];

        let x: number, y: number;
        for (x = 0; x < width; x += tileWidth) {
            for (y = 0; y < height; y += tileHeight) {
                const left = normalize(x, 0, width);
                const top = normalize(y, 0, height);
                const right = normalize(x + tileWidth, 0, width);
                const bottom = normalize(y + tileHeight, 0, height);

                positionArray.push([
                    left, top, 0.0,
                    right, top, 0.0,
                    left, bottom, 0.0,
                    right, bottom, 0.0,
                ]);
            }
        }
    }
}