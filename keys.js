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
        101: e,
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
        return this.handlers[code](x, y, text);
    }

    return false;
};

/**
 * The h key; move the cursor one character to the left.
 * If the cursor's x position is already at 0, don't move the cursor.
 */
function h(x, y, text) {
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
function j(x, y, text) {
    var rows = text.length;
    var newY = Math.min(y + 1, rows - 1);

    var len = text[newY].length - 1;
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
function k(x, y, text) {
    var newY = Math.max(0, y - 1);
    var len = text[newY].length - 1;
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
function l(x, y, text) {
    var len = text[y].length - 1;
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
function zero(x, y, text) {
    this._parent.lastX = 0;    
    return [0, y];
}


/**
 * The $ key; move the cursor to the end of the line.
 */
function dollarSign(x, y, text) {
    var newX = Math.max(0, text[y].length - 2);
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
function w(x, y, text) {

    var currentLineFunc = function(i, j, line) {
        // Try to find next word on current line
        var newX = findNextWord(i, line);
        return newX >= 0 ? [newX, j] : false;
    };

    var restOfLinesFunc = function(i, j, line) {
        // If the line is empty, go to the beginning of that line
        if (line.length == 1)
            return [0, j];
        
        // If there is a word on that line, go to the beginning of it
        var result = matchAt("\\S", line, 0);
        return result ? [result.index, j] : false;
    };

    var defaultFunc = function(i, j, line) {
        // Otherwise, go to the end of the last line
        var newX = Math.max(0, line.length - 2);
        return [newX, j];
    };

    var ySelectorFunc = function(oldY) {
        return oldY + 1;
    };

    var result = multilineAction(x, y, text, currentLineFunc,
        restOfLinesFunc, defaultFunc, ySelectorFunc);

    this._parent.lastX = result[0];
    return [result[0], result[1]];
}

function e(x, y, text) {
    var findEndOfWordFunc = function(i, j, line) {
        var newX = findEndOfNextWord(i, line);
        return newX >= 0 ? [newX, j] : false;
    };

    var defaultFunc = function(i, j, line) {
        var newX = Math.max(0, line.length - 2);
        return [newX, j];
    };

    var ySelectorFunc = function(oldY) {
        return oldY + 1;
    };

    var result = multilineAction(x, y, text, findEndOfWordFunc,
        findEndOfWordFunc, defaultFunc, ySelectorFunc);

    this._parent.lastX = result[0];
    return [result[0], result[1]];
}

/**
 * Helper function for the commands that can move the cursor across lines 
 * if they do not find their next position on the current line. Examples 
 * include the w, b, and e keys.
 *
 * First apply the action to the line that the cursor is on.  If there
 * is no suitable position for the cursor on the current line, get the
 * next line number and apply the restOfLines action to the remaining lines.
 * If there is still no suitable match, apply the default function.
 */
function multilineAction(
    x,
    y,
    text,
    currentLineFunc,
    restOfLinesFunc,
    defaultFunc,
    ySelectorFunc) {

    // Try current line
    var line = text[y];
    var result = currentLineFunc(x, y, line);
    if (result)
        return result;

    // Try remaining lines
    for (var j = ySelectorFunc(y); j >= 0 && j < text.length; j = ySelectorFunc(j)) {
        line = text[j];
        result = restOfLinesFunc(0, j, line);
        if (result)
            return result;
    }

    // Default action
    return defaultFunc(0, y, line);
}

/**
 * Helper function to find the position of the next word on the 
 * given line, or -1 if there are no more words on the line.
 */
function findNextWord(x, line) {
    if (line.length == 0 || x >= line.length - 2)
        return -1;

    var c = line[x];
    var pos = x + 1;
    var pattern;

    // If on whitespace, look for next non-whitespace character
    if (isWhiteSpace(c)) {
        var match = matchAt("\\S", line, pos);
        return match ? match.index : -1;
    }

    // If the character is alphanumeric, look for the next symbol character
    if (isAlphaNumeric(c)) {
        pattern = "[^a-zA-Z0-9_\\s]";
    }
    // If the character is symbolic, look for the next alphanumeric character
    else if (isSymbolic(c)) {
        pattern = "[a-zA-Z0-9_]";
    }

    var patternMatch = matchAt(pattern, line, pos);
    var patternPos = patternMatch 
        ? patternMatch.index
        : Number.MAX_SAFE_INTEGER;
    
    // Also look for the next non-whitespace character after some whitespace
    var wordAfterWhitespaceMatch = matchAt("\\S*\\s+(\\S)", line, pos);
    var wordAfterWhitespacePos = wordAfterWhitespaceMatch
        ? wordAfterWhitespaceMatch.index
        : Number.MAX_SAFE_INTEGER;

    if (patternPos == Number.MAX_SAFE_INTEGER && 
        wordAfterWhitespacePos == Number.MAX_SAFE_INTEGER)
        return -1;

    // Find the nearest of all the matches
    return Math.min(patternPos, wordAfterWhitespacePos);
}

function findEndOfNextWord(x, line) {
    var pos = x + 1;
    if (line.length == 0 || pos > line.length - 2)
        return -1;

    var c = line[pos];
    if (isWhiteSpace(c)) {
        var match = matchAt("\\S", line, pos);
        if (!match)
            return -1;

        pos = match.index;
    }

    return findEndOfWord(pos, line);
}

/**
 * Given that x is on a non-whitespace character, find the end of the word
 * that the character is on.
 */
function findEndOfWord(x, line) {
    if (x == line.length - 2)
        return x;

    var c = line[x];
    var pattern;

    pattern = isAlphaNumeric(c) ? "[^a-zA-Z0-9_\\s]" : "\\s";

    var patternMatch = matchAt(pattern, line, x);
    var patternPos = patternMatch
        ? patternMatch.index
        : Number.MAX_SAFE_INTEGER;

    var whitespaceMatch = matchAt("\\s", line, x);
    var whitespacePos = whitespaceMatch
        ? whitespaceMatch.index
        : Number.MAX_SAFE_INTEGER;

    if (patternPos == Number.MAX_SAFE_INTEGER && 
        whitespacePos == Number.MAX_SAFE_INTEGER)
        return -1;

    return Math.min(patternPos, whitespacePos) == patternPos
        ? patternPos - 1
        : whitespacePos- 1;
}

/**
 * Find first regex match in the given string that is at or after the
 * starting position.
 */
function matchAt(pattern, str, start) {
    var match;
    var regex = new RegExp(pattern, "g");
    while (match = regex.exec(str)) {
        var pos = match.length > 1
            ? str.indexOf(match[1], match.index + match[0].length - 1)
            : match.index;

        if (pos >= start) {
            return { index: pos };
        }
    }

    return false;
}
