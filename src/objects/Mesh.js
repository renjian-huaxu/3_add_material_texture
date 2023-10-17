import Object3D from "./Object3D";

export default class Mesh extends Object3D {

    constructor(geometry, material, normUVs) {
        super(material)

        this.geometry = geometry;
        this.material = material ? 
            material instanceof Array ? material : [material]
            : []

        this.flipSided = false;
        this.doubleSided = false;

        this.overdraw = false;

        this.materialFaces = {};

        this.sortFacesByMaterial();
        if (normUVs) this.normalizeUVs();

        this.geometry.computeBoundingBox();
    }


    sortFacesByMaterial() {
        var material;

        this.geometry.faces.forEach((face, index) => {
            material = face.material;

            if (this.materialFaces[material] == undefined)
                this.materialFaces[material] = { 'faces': [] };

            this.materialFaces[material].faces.push(index);
        });
       
    }

    normalizeUVs() {
        this.geometry.uvs.forEach(uvArr => {
            uvArr.forEach(uv => {
                if (uv.u != 1.0) uv.u = uv.u - Math.floor(uv.u);
                if (uv.v != 1.0) uv.v = uv.v - Math.floor(uv.v);
            })
        });

    }

}