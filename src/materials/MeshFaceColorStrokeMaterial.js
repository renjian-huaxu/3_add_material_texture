import Color from "../core/Color";

export default class MeshFaceColorStrokeMaterial {

    constructor(lineWidth) {

        this.lineWidth = lineWidth || 1;

    }

    toString() {
        return 'THREE.LineColorMaterial: ' + 'lineWidth: ' + this.lineWidth + ' )';
    }

}