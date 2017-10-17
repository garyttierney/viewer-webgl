import ViewerNode from "./nodes/Node";
import {mat4} from "gl-matrix";

export default class Viewer {
    /**
     * A list of nodes queued to be initialized.
     */
    private inactiveNodes: Array<ViewerNode> = [];

    /**
     * A list of nodes actively being rendered.
     */
    private nodes: Array<ViewerNode> = [];

    /**
     * The host canvas element used as the render target.
     */
    private host: HTMLCanvasElement;

    /**
     * The time since the epoch that the last update occurred at.
     */
    private lastUpdate?: number;

    /**
     * The projection (camera) matrix for the viewer.
     */
    private projectionMatrix: mat4;

    /**
     * The model view matrix (origin of drawing).
     */
    private modelViewMatrix: mat4;

    /**
     * Bind this {@link Viewer} to a canvas element and start requesting render events.
     *
     * @param {HTMLCanvasElement} canvas The canvas element to bind to.
     */
    public bindTo(canvas: HTMLCanvasElement) {
        mat4.ortho(this.projectionMatrix, -1.0, 1.0, 1.0, -1.0, 0.1, 1.0);
        mat4.identity(this.modelViewMatrix);

        this.host = canvas;
        this.requestRedraw();
    }

    /**
     * Queue a {@link ViewerNode} to be added to the viewer.
     *
     * @param {ViewerNode} node The node to be queued.
     */
    public add(node: ViewerNode) {
        this.inactiveNodes.push(node);
    }

    /**
     * Update the viewer, initializing any queued {@link ViewerNode}s any rendering any existing ones.
     *
     * @param {number} delta The time, in seconds, since the last render call.
     */
    public render(delta: number) {
        const gl = this.host.getContext("webgl");

        while (this.inactiveNodes.length > 0) {
            let node = this.inactiveNodes.pop();

            try {
                node.init(gl);
                this.nodes.push(node);
            } catch (err) {
                console.error("Failed to initialize a ViewerNode", err);
            }
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        this.nodes.forEach(node => node.render(gl));
        this.requestRedraw();
    }

    private requestRedraw() {
        window.requestAnimationFrame(timestamp => {
            // Convert millis to seconds.
            timestamp *= 0.001;

            this.render(this.lastUpdate ? timestamp - this.lastUpdate : 0.1);
            this.lastUpdate = timestamp;
        });
    }
}