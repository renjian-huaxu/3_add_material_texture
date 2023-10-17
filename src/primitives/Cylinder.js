import Face4 from "../core/Face4";
import Geometry from "../core/Geometry";
import Vector3 from "../core/Vector3";
import Vertex from "../core/Vertex";


export default class Cylinder extends Geometry {

    constructor(numSegs, topRad, botRad, height, topOffset, botOffset) {
        super()

        var scope = this, i;

        // VERTICES
    
        // Top circle vertices
        for (i = 0; i < numSegs; i++) {
    
            v( 
                Math.sin(2 * 3.1415 * i / numSegs)*topRad,
                Math.cos(2 * 3.1415 * i / numSegs)*topRad,
                0);
        }
    
        // Bottom circle vertices
        for (i = 0; i < numSegs; i++) {
    
            v(  
                Math.sin(2 * 3.1415 * i / numSegs)*botRad,
                Math.cos(2 * 3.1415 * i / numSegs)*botRad,
                height);
        }
    
    
        // FACES
    
        // Body	
        for (i = 0; i < numSegs; i++) {
    
            f4(i, i + numSegs, numSegs + (i + 1) % numSegs, (i + 1) % numSegs, '#ff0000');
        }
    
        // Bottom circle
        if (botRad != 0) {
    
            v(0, 0, -topOffset);
    
            for (i = numSegs; i < numSegs + (numSegs / 2); i++) {
    
                f4(2 * numSegs,
                (2 * i - 2 * numSegs) % numSegs,
                (2 * i - 2 * numSegs + 1) % numSegs,
                (2 * i - 2 * numSegs + 2) % numSegs);
            }
        }
    
        // Top circle
        if (topRad != 0) {
    
            v(0, 0, height + topOffset);
    
            for (i = numSegs + (numSegs / 2); i < 2 * numSegs; i++) {
    
                f4(	(2 * i - 2 * numSegs + 2) % numSegs + numSegs,
                    (2 * i - 2 * numSegs + 1) % numSegs + numSegs,
                    (2 * i - 2 * numSegs) % numSegs+numSegs, 
                    2 * numSegs + 1);
            }
        }
    
        this.computeNormals();
    
        function v(x, y, z) {
    
            scope.vertices.push( new Vertex( new Vector3( x, y, z ) ) );
        }
    
        function f4(a, b, c, d) {
    
            scope.faces.push( new Face4( a, b, c, d ) );
        }
    }
}