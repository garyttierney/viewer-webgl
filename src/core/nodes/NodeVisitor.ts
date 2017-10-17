
import TiledImageNode from "./TiledImageNode";

abstract class NodeVisitor {
    abstract visitImage(image: TiledImageNode): void

    abstract visitVideoNode(video: VideoNode): void;
}

export default NodeVisitor;