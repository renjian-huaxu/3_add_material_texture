import Color from "../core/Color";

export default class MeshColorFillMaterial {

    constructor(hex, opacity) {
        this.color = new Color( ( opacity >= 0 ? ( opacity * 0xff ) << 24 : 0xff000000 ) | hex );
    }

    toString() {
        return 'THREE.MeshColorFillMaterial ( color: ' + this.color + ' )';
    }

}