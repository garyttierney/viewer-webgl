import Viewer from "./core/Viewer";

document.addEventListener('DOMContentLoaded', e => init(), false);

function init() {

    const canvas = document.querySelector('canvas');
    const viewer = new Viewer();

    viewer.bindTo(canvas);
}

