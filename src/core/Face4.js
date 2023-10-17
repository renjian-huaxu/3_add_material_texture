import Color from "./Color";
import Vector3 from "./Vector3";

export default class Face4 {

    constructor(a, b, c, d, normal, color, material) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    
        this.centroid = new Vector3();
        this.normal = normal instanceof Vector3 ? normal : new Vector3();
    
        this.color = color || new Color( 0xff000000 );
    
        this.vertexNormals = normal instanceof Array ? normal : [];
        this.material = material || 0;
    }

    toString() {
        return 'MTHREE.Face4 ( ' + this.a + ', ' + this.b + ', ' + this.c + ' ' + this.d + ' )';
    }

    getCenter() {
        return this.a.clone().addSelf(this.b).addSelf(this.c).addSelf(this.d).divideScalar(4);
    }
}