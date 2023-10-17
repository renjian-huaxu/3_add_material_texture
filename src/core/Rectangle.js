

export default class Rectangle {

    _x1
    _y1
    _x2
    _y2
	_width
    _height
	_isEmpty = true;

    constructor() {

    }

    resize() {
        _width = _x2 - _x1;
		_height = _y2 - _y1;
    }

    getX() {
        return _x1;
    }

    getY() {
        return _y1;
    }

    getWidth() {
        return _width;
    }

    getHeight() {
        return _height;
    }

    getX1() {
        return _x1;
    }

    getY1() {
        return _y1;
    }

    getX2() {
        return _x2;
    }

    getY2() {
        return _y2;
    }

    set(x1, y1, x2, y2) {
        _isEmpty = false;

		_x1 = x1; _y1 = y1;
		_x2 = x2; _y2 = y2;

		this.resize();
    }

    addPoint(x, y) {
		if ( _isEmpty ) {

			_isEmpty = false;
			_x1 = x; _y1 = y;
			_x2 = x; _y2 = y;

		} else {

			_x1 = Math.min( _x1, x );
			_y1 = Math.min( _y1, y );
			_x2 = Math.max( _x2, x );
			_y2 = Math.max( _y2, y );

		}

		this.resize();
    }

    addRectangle(r) {

		if ( _isEmpty ) {

			_isEmpty = false;
			_x1 = r.getX1(); _y1 = r.getY1();
			_x2 = r.getX2(); _y2 = r.getY2();

		} else {

			_x1 = Math.min(_x1, r.getX1());
			_y1 = Math.min(_y1, r.getY1());
			_x2 = Math.max(_x2, r.getX2());
			_y2 = Math.max(_y2, r.getY2());

		}

		this.resize();
    }

    inflate(v) {
		_x1 -= v; _y1 -= v;
		_x2 += v; _y2 += v;

		this.resize();
    }

    minSelf(r) {
        _x1 = Math.max( _x1, r.getX1() );
		_y1 = Math.max( _y1, r.getY1() );
		_x2 = Math.min( _x2, r.getX2() );
		_y2 = Math.min( _y2, r.getY2() );

		this.resize();
    }


    instersects(r) {
        return Math.min( _x2, r.getX2() ) - Math.max( _x1, r.getX1() ) >= 0 && Math.min( _y2, r.getY2() ) - Math.max( _y1, r.getY1() ) >= 0;
    }

    empty() {
        _isEmpty = true;

		_x1 = 0; _y1 = 0;
		_x2 = 0; _y2 = 0;

		this.resize();
    }

    isEmpty() {
        return _isEmpty;
    }

    toString() {
        return "MTHREE.Rectangle (x1: " + _x1 + ", y1: " + _y2 + ", x2: " + _x2 + ", y1: " + _y1 + ", width: " + _width + ", height: " + _height + ")";
    }

}