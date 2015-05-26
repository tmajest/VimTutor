
function KeyHandler() {
    this.lastX = 0;
    this.handlers = {
        104: this.h,
        106: this.j,
        107: this.k,
        108: this.l,
        _parent: this
    };
}

KeyHandler.prototype.handle = function(x, y, code, text) {
    if (code in this.handlers) {
        return this.handlers[code](x, y, code, text);
    }

    return false;
};

KeyHandler.prototype.h = function(x, y, code, text) {
    var newX = Math.max(0, x - 1); 
    this._parent.lastX = newX;
    return [newX, y]; 
};

KeyHandler.prototype.j = function(x, y, code, text) {
    var rows = text.length;
    var newY = Math.min(y + 1, rows - 1);

    var len = text[newY].length;
    var newX;
    if (len < this._parent.lastX) {
        newX = Math.max(0, len - 1);
    }
    else {
        newX = this._parent.lastX;
    }

    return [newX, newY];
};

KeyHandler.prototype.k = function(x, y, code, text) {
    var newY = Math.max(0, y - 1);
    var len = text[newY].length;
    var newX;
    if (len < this._parent.lastX) {
        newX = Math.max(0, len - 1);
    }
    else {
        newX = this._parent.lastX;
    }

    return [newX, newY];
};

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
