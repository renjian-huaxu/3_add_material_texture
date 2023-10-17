import Matrix4 from "../core/Matrix4";
import Vector3 from "../core/Vector3";

export default class Camera {

	constructor(fov, aspect, near, far) {
		this.fov = fov;
		this.aspect = aspect;
		this.position = new Vector3( 0, 0, 0 );
		this.target = { position: new Vector3( 0, 0, 0 ) };
	
		this.projectionMatrix = Matrix4.makePerspective( fov, aspect, near, far );
		this.up = new Vector3( 0, 1, 0 );
		this.matrix = new Matrix4();
	
		this.autoUpdateMatrix = true;
	}

	updateMatrix() {
		this.matrix.lookAt( this.position, this.target.position, this.up );
	}

	toString() {
		return 'MTHREE.Camera ( ' + this.position + ', ' + this.target.position + ' )';
	}
}
