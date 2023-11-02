import Color from "../core/Color";

export default class LineColorMaterial {

    constructor(hex, opacity, lineWidth) {

        this.lineWidth = lineWidth || 1;

        this.color = new Color( ( opacity >= 0 ? ( opacity * 0xff ) << 24 : 0xff000000 ) | hex );
    }

    toString() {

        return 'THREE.LineColorMaterial ( color: ' + this.color + ', lineWidth: ' + this.lineWidth + ' )';
        
    }

}