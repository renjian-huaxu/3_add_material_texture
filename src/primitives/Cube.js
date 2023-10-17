import Face4 from "../core/Face4";
import Geometry from "../core/Geometry";
import Vector3 from "../core/Vector3";
import Vertex from "../core/Vertex";


export default class Cube extends Geometry {

    constructor(width, height, depth) {
        super()

        var scope = this,
        width_half = width / 2,
        height_half = height / 2,
        depth_half = depth / 2;
    
        v(  width_half,  height_half, -depth_half );
        v(  width_half, -height_half, -depth_half );
        v( -width_half, -height_half, -depth_half );
        v( -width_half,  height_half, -depth_half );
        v(  width_half,  height_half,  depth_half );
        v(  width_half, -height_half,  depth_half );
        v( -width_half, -height_half,  depth_half );
        v( -width_half,  height_half,  depth_half );
    
        f4( 0, 1, 2, 3 );
        f4( 4, 7, 6, 5 );
        f4( 0, 4, 5, 1 );
        f4( 1, 5, 6, 2 );
        f4( 2, 6, 7, 3 );
        f4( 4, 0, 3, 7 );
    
        function v(x, y, z) {
    
            scope.vertices.push( new Vertex( new Vector3( x, y, z ) ) );
        }
    
        function f4(a, b, c, d) {
    
            scope.faces.push( new Face4( a, b, c, d ) );
        }
    
        this.computeCentroids();
        this.computeNormals();
    }
}