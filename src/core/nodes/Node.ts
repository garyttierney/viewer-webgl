import {mat4, vec2, vec3} from 'gl-matrix';
import NodeVisitor from "./NodeVisitor";

abstract class ViewerNode {
    protected modelMatrix: mat4 = mat4.create();

    translate(position: vec3): void {
        mat4.translate(this.modelMatrix, this.modelMatrix, position);
    }

    scale(ratio: number): void {
        mat4.scale(this.modelMatrix, this.modelMatrix, [ratio, ratio, ratio]);
    }

    rotate(radians: number, rotateX: boolean = true, rotateY: boolean = true, rotateZ: boolean = true) {
        mat4.rotate(this.modelMatrix, this.modelMatrix, radians, [rotateX ? 1 : 0, rotateY ? 1 : 0, rotateZ ? 1 : 0]);
    }

    abstract accept(visitor: NodeVisitor): void;

    abstract init(context: WebGLRenderingContext): void;

    abstract render(context: WebGLRenderingContext): void;
}

export default ViewerNode;