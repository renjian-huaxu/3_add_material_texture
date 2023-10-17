import Color from "../core/Color";

export default class Light {

    constructor(hex) {
        this.color = new Color( 0xff << 24 | hex );
    }

}