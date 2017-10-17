type TextureData = ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement;
type MipmapLevel = 0 | 1 | 2 | 3;

const TEX_INTERNAL_FORMAT = WebGLRenderingContext.RGBA;
const TEX_SRC_FORMAT = WebGLRenderingContext.RGBA;
const TEX_SRC_TYPE = WebGLRenderingContext.UNSIGNED_BYTE;

export class Texture {
    public mipmapLevel: MipmapLevel = 0;

    constructor(private texture: WebGLTexture) {
        this.texture = texture;
    }

    bind(gl: WebGLRenderingContext) {
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
    }

    update(gl: WebGLRenderingContext, data: TextureData) {
        gl.texImage2D(gl.TEXTURE_2D, this.mipmapLevel, TEX_INTERNAL_FORMAT, TEX_SRC_FORMAT, TEX_SRC_TYPE, data);
    }
}

export class GlUtils {
    static createTexture(gl: WebGLRenderingContext, data: TextureData) {
        const glTexture = gl.createTexture();
        const texture = new Texture(glTexture);

        texture.bind(gl);
        texture.update(gl, data);
        return texture;
    }
}