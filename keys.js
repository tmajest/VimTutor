/**
 * Class used to handle key motions and actions.
 * Handling functions take the current x and y position of the
 * cursor along with the text and key code.  They return the
 * new positions of the cursor, or false if it is an invalid key.
 */
function KeyHandler() {
    this.lastX = 0;
    this.handlers = {
        36:  this.dollarSign,
        48:  this.zero,
        104: this.h,
        106: this.j,
        107: this.k,
        108: this.l,
        _parent: this
    };
}

/**
 * Given the corrent position of the cursor, the key that
 * was typed, and the current text, generate the new position
 * for the cursor.
 */
KeyHandler.prototype.handle = function(x, y, code, text) {
    if (code in this.handlers) {
        return this.handlers[code](x, y, code, text);
    }

    return false;
};

/**
 * The h key; move the cursor one character to the left.
 * If the cursor's x position is already at 0, don't move the cursor.
 */
KeyHandler.prototype.h = function(x, y, code, text) {
    var newX = Math.max(0, x - 1); 
    this._parent.lastX = newX;
    return [newX, y]; 
};

/**
 * The j key; move the cursor down to the line below.
 *
 * The location of the cursor's x position on the line below depends
 * on the previous saved x position and the length of the line below.
 * On successful movements left or right, the x position is saved.
 * 
 * If the last saved x position is less than or equal to the length of the
 * line below, move the cursor down and to the last saved x position.
 * 
 * Otherwise, the line below is not long enough so move the cursor down and 
 * to the end of the line.
 */
KeyHandler.prototype.j = function(x, y, code, text) {
    var rows = text.length;
    var newY = Math.min(y + 1, rows - 1);

    var len = text[newY].length;
    var newX;
    if (len <= this._parent.lastX) {
        newX = Math.max(0, len - 1);
    }
    else {
        newX = this._parent.lastX;
    }

    return [newX, newY];
};

/**
 * The k key; move the cursor up to the line above.
 * 
 * Similar to the j key, the location of the cursor's x position on the 
 * line above depends on the previous saved x position and the length of 
 * the line above. On successful movements left or right, the x position 
 * is saved.
 *
 * If the last saved x position is less than or equal to the length of the
 * line above, move the cursor up and to the last saved x position.
 * 
 * Otherwise, the line above is not long enough so move the cursor up and 
 * to the end of the line.
 */
KeyHandler.prototype.k = function(x, y, code, text) {
    var newY = Math.max(0, y - 1);
    var len = text[newY].length;
    var newX;
    if (len <= this._parent.lastX) {
        newX = Math.max(0, len - 1);
    }
    else {
        newX = this._parent.lastX;
    }

    return [newX, newY];
};

/**
 * The l key; move the cursor one character to the right.
 * If the cursor is already at the end of the line, do nothing.
 */
KeyHandler.prototype.l = function(x, y, code, text) {
    var len = text[y].length;
    var newX;
    if (len == 0) {
        newX = 0;
    }
    else {
        newX = Math.min(x + 1, len - 1);
    }

    this._parent.lastX = newX;
    return [newX, y];
};

/**
 * The 0 key; move the cursor to the beginning of the line.
 */
 KeyHandler.prototype.zero = function(x, y, code, text) {
    this._parent.lastX = 0;    
    return [0, y];
};


/**
 * The $ key; move the cursor to the end of the line.
 */
KeyHandler.prototype.dollarSign = function(x, y, code, text) {
    var newX = Math.max(0, text[y].length - 1);
    this._parent.lastX = newX;
    return [newX, y];
};
