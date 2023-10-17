
import Vector3 from '../core/Vector3'
import Matrix4 from '../core/Matrix4'

export default class Object3D {

    constructor(material) {
        this.position = new Vector3();
        this.rotation = new Vector3();
        this.scale = new Vector3( 1, 1, 1 );
    
        this.matrix = new Matrix4();
        this.matrixTranslation = new Matrix4();
        this.matrixRotation = new Matrix4();
        this.matrixScale = new Matrix4();
    
        this.screen = new Vector3();
    
        this.autoUpdateMatrix = true;
    }

    updateMatrix() {
      this.matrixPosition = Matrix4.translationMatrix( this.position.x, this.position.y, this.position.z );

      this.matrixRotation = Matrix4.rotationXMatrix( this.rotation.x );
      this.matrixRotation.multiplySelf( Matrix4.rotationYMatrix( this.rotation.y ) );
      this.matrixRotation.multiplySelf( Matrix4.rotationZMatrix( this.rotation.z ) );

      this.matrixScale = Matrix4.scaleMatrix( this.scale.x, this.scale.y, this.scale.z );

      this.matrix.copy( this.matrixPosition );
      this.matrix.multiplySelf( this.matrixRotation );
      this.matrix.multiplySelf( this.matrixScale );
    }
}