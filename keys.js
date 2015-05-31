/**
 * Class used to handle key motions and actions.
 * Handling functions take the current x and y position of the
 * cursor along with the text and key code.  They return the
 * new positions of the cursor, or false if it is an invalid key.
 */
function KeyHandler() {
    this.lastX = 0;
    this.handlers = {
        36:  dollarSign,
        48:  zero,
        104: h,
        106: j,
        107: k,
        108: l,
        119: w,
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
function h(x, y, code, text) {
    var newX = Math.max(0, x - 1); 
    this._parent.lastX = newX;
    return [newX, y]; 
}

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
function j(x, y, code, text) {
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
}

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
function k(x, y, code, text) {
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
}

/**
 * The l key; move the cursor one character to the right.
 * If the cursor is already at the end of the line, do nothing.
 */
function l(x, y, code, text) {
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
}

/**
 * The 0 key; move the cursor to the beginning of the line.
 */
function zero(x, y, code, text) {
    this._parent.lastX = 0;    
    return [0, y];
}


/**
 * The $ key; move the cursor to the end of the line.
 */
function dollarSign(x, y, code, text) {
    var newX = Math.max(0, text[y].length - 1);
    this._parent.lastX = newX;
    return [newX, y];
}

/**
 * The w key; move the cursor to the beginning of the next word.
 *
 * A word consists of a sequence of letters, digits, and underscores,
 * or a sequence of other non-blank characters separated by whitespace
 * (spaces, tabs, or <EOL>). See :h word for more details.
 * 
 * If there are no more words on the current line, move to the next line
 * that is empty or contains a word.
 */
function w(x, y, code, text) {
    // Try current line 
    var newX = x;
    var newY = y;
    var line = text[y];
    var res = findNextWordOnLine(newX, newY, line);
    if (res) {
        this._parent.lastX = res[0];
        return res;
    }
    
    // Try remaining lines
    for (newY = y + 1; newY < text.length; newY++) {
        line = text[newY];

        // Empty lines work
        if (line.length == 0) {
            this._parent.lastX = 0;
            return [0, newY];
        }

        // Find first non-whitespace character
        var match = matchAfter("\\S", line, 0);
        if (match) {
            this._parent.lastX = match.index;
            return [match.index, newY];
        }
    }

    // Go to last character of last line
    newX = Math.max(0, line.length - 1);
    this._parent.lastX = newX;
    return [newX, text.length - 1];
}

/**
 * Helper function to find the position of the next word on the 
 * given line, or false if there are no more words on the line.
 */
function findNextWordOnLine(x, y, line) {
    var len = line.length;
    var c = line[x];
    var pos = x;

    // Go to end of current word
    if (!isWhiteSpace(c)) {
        pos = endOfWord(x, line);
    }

    // Find next non-whitespace character
    var match = matchAfter("\\S", line, pos + 1);
    if (match) {
        return [match.index, y]; 
    }
    
    return false;
}

/**
 * Given the current position of the cursor, move to the end of the
 * current word.
 */
function endOfWord(x, line) {
    var pattern;

    var c = line[x];
    if (isAlphaNumeric(c)) {
        // Find next non-alphanumeric character
        pattern = "[^a-zA-Z0-9]";
    }
    else if (isSymbolic(c)) {
        // Find next whitespace or alphanumeric character
        pattern = "[a-zA-Z0-9\\s]";
    }
    
    var match = matchAfter(pattern, line, x + 1);
    if (match) {
        return match.index - 1;
    }
    
    return line.length - 1;
}

/**
 * Find first regex match in the given string that is after the
 * starting position.
 */
function matchAfter(pattern, str, start) {
    var match;
    var regex = new RegExp(pattern, "gi");
    while (match = regex.exec(str)) {
        var pos = match.index;
        if (pos >= start) {
            return { index: pos };
        }
    }

    return false;
}
