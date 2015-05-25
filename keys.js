
function KeyHandler() {
    this.handlers = {
        104: this.h,
        108: this.l
    };
}

KeyHandler.prototype.handle = function(x, y, code, len) {
    if (code in this.handlers) {
        return this.handlers[code](x, y, code, len);
    }

    return false;
};

KeyHandler.prototype.h = function h(x, y, code, len) {
    var newX = Math.max(0, x - 1); 
    return [newX, y]; 
};

KeyHandler.prototype.l = function l(x, y, code, len) {
    var newX = Math.min(x + 1, len - 1);
    return [newX, y];
}
