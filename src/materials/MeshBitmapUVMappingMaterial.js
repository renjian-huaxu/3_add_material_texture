
export default class MeshBitmapUVMappingMaterial {

    constructor(bitmap) {

        this.bitmap = bitmap;
        this.loaded = 0;
        this.decalIndex = -1;

    }

    toString() {

        return 'THREE.MeshBitmapUVMappingMaterial ( bitmap: ' + this.bitmap + ' )';
        
    }
}