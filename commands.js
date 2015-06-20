/**
 * Module used to handle key motions and actions.
 * Handling functions take the current row and column of the
 * cursor along with the text and character pressed.  They return the
 * new positions of the cursor, or false if it is an invalid key.
 */
(function(commands, buffer, modes, match, strings) {
    var lastCol = 0;
    var mode = modes.NORMAL;

    /**
     * The h key; move the cursor one character to the left.
     * If the cursor's x position is already at 0, don't move the cursor.
     */
    var h = function(row, col) {
        var newCol = buffer.lines[row].offset(col, -1);
        return new commands.Result(row, newCol, newCol, mode);
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
    var j = function(row, col) {
        var newLine = buffer.offset(row, 1);
        var len = newLine.length();

        var newCol;
        if (len <= lastCol) {
            newCol = newLine.last();
        }
        else {
            newCol = lastCol;
        }

        return new commands.Result(newLine.row, newCol, lastCol, mode);
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
    var k = function(row, col) {
        var newLine = buffer.offset(row, -1);
        var len = newLine.length();

        var newCol;
        if (len <= lastCol) {
            newCol = newLine.last();
        }
        else {
            newCol = lastCol;
        }

        return new commands.Result(newLine.row, newCol, lastCol, mode);
    };

    /**
     * The l key; move the cursor one character to the right.
     * If the cursor is already at the end of the line, do nothing.
     */
    var l = function(row, col) {
        var newCol = buffer.lines[row].offset(col, 1);
        return new commands.Result(row, newCol, newCol, mode);
    };

    /**
     * The 0 key; move the cursor to the beginning of the line.
     */
    var zero = function(row, col) {
        return new commands.Result(row, 0, 0, mode);
    };

    /**
     * The $ key; move the cursor to the end of the line.
     */
    var dollarSign = function(row, col) {
        var newCol = buffer.lines[row].last();
        return new commands.Result(row, newCol, newCol, mode);
    };

    /**
     * Delete the character under the cursor.
     */
    var x = function(row, col) {
        var line = buffer.lines[row];
        line.remove(col);

        // If the cursor was on the last character in the line,
        // move to the previous character.
        var len = line.length();
        var newCol = col == len
            ? line.offset(col, -1)
            : col;

        return new commands.Result(row, newCol, newCol, mode, true);
    };

    /**
     * Go into insert mode.
     */
    var i = function(row, col) {
        return new commands.Result(row, col, lastCol, modes.INSERT, true);
    };

    /**
     * Go into normal mode.  If the previous mode was insert mode,
     * move the cursor to the left.
     */
    var esc = function(row, col) {
        if (mode == modes.NORMAL) {
            return null;
        }
        var newCol = buffer.lines[row].offset(col, -1);
        return new commands.Result(row, newCol, newCol, modes.NORMAL, true);
    };

    /**
     * The w key; move the cursor to the beginning of the next word.
     *
     * If there are no more words on the current line, move to the next line
     * that is empty or contains a word.

     * A word consists of a sequence of letters, digits, and underscores,
     * or a sequence of other non-blank characters separated by whitespace
     * (spaces, tabs, or <EOL>). See :h word for more details.
     */
    var w = function(row, col) {
        var currentLineFunc = function(r, c) {
            // Try to find next word on current line
            var line = buffer.lines[r];
            var newCol = wHelper(line, c);
            return newCol >= 0 
                ? new commands.Result(r, newCol, newCol, mode) 
                : null;
        };

        var restOfLinesFunc = function(r, c) {
            // If the next line is empty, go to the beginning of it
            var line = buffer.lines[r];
            if (line.length() == 0)
                return new commands.Result(r, 0, 0, mode);
            
            // Go to the beginning of the next word
            var newCol = match.forward(line.chars, strings.nonWhiteSpaceRegex, 0);
            return newCol >= 0 
                ? new commands.Result(r, newCol, newCol, mode) 
                : null;
        };

        var defaultFunc = function(r, c) {
            // Otherwise, go to the end of the last line
            var line = buffer.last();
            var newCol = line.last();
            return new commands.Result(line.row, newCol, newCol, mode);
        };

        return multilineAction(row, col, currentLineFunc,
            restOfLinesFunc, defaultFunc, 1);
    };

    /**
     * Go to end of the word the cursor is on.  If the cursor is already on
     * the end of the word, go to the end of the next word.
     *
     * If there are no more words on the current line, move to the next line
     * that contains a word and move to the end of it.

     * A word consists of a sequence of letters, digits, and underscores,
     * or a sequence of other non-blank characters separated by whitespace
     * (spaces, tabs, or <EOL>). See :h word for more details.
     */
    var e = function(x, y, text) {
        var findEndOfWordFunc = function(i, j, line) {
            var newX = findEndOfNextWord(i, line);
            return newX >= 0 
                ? new commands.Result(newX, j, null, null, null) 
                : false;
        };

        var defaultFunc = function(i, j, line) {
            var newX = Math.max(0, line.length - 2);
            return new commands.Result(newX, j, null, null, null);
        };

        var increment = function(x) { return x + 1 };

        var result = multilineAction(x, y, text, findEndOfWordFunc,
            findEndOfWordFunc, defaultFunc, increment);

        return new commands.Result(result.x, result.y, result.x, null, null);
    };

    /**
     * Go to the beginning of the word that the cursor is on.  If the cursor is
     * already on the beginning of the word, go to the beginning of the previous
     * word.
     *
     * If there are no more words on the current line, move to the previous line
     * that is empty or contains a word and move to the beginning of it.

     * A word consists of a sequence of letters, digits, and underscores,
     * or a sequence of other non-blank characters separated by whitespace
     * (spaces, tabs, or <EOL>). See :h word for more details.
     */
    var b = function(x, y, text) {
        // Not implemented
        return null;
    };

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
    var multilineAction = function(
        row,
        col,
        currentLineFunc,
        restOfLinesFunc,
        defaultFunc,
        offset) {

        // Try current line
        var result = currentLineFunc(row, col);
        if (result)
            return result;

        // Try remaining lines
        var newRow;
        for (newRow = row + offset; 
             newRow >= 0 && newRow < buffer.lines.length;
             newRow += offset) {
             result = restOfLinesFunc(newRow, 0);
            if (result)
                return result;
        }

        // Default action
        return defaultFunc(newRow, 0);
    };

    /**
     * Helper function to find the position of the next word on the 
     * given line, or -1 if there are no more words on the line.
     */
    var wHelper = function(line, col) {
        if (line.length() == 0 || col > line.last())
            return -1;

        var lastChar = line.chars[col];
        var regexFactory = function(c) {
            if (strings.isAlphaNumeric(lastChar)) {
                // If the last char was alphanumeric, look for symbolic char
                lastChar = c;
                return strings.symbolicRegex;
            }
            else if (strings.isSymbolic(c)) {
                // If the last char was symbolic, look for next alphanumeric char
                lastChar = c;
                return strings.alphaNumericRegex;
            }
            else {
                // Last char was whitespace, look for next non-whitespace char
                lastChar = c;
                return strings.nonWhiteSpaceRegex;
            }
        };

        return match.forwardFactory(line.chars, regexFactory, col + 1);
    };

    /**
     * Helper function for e key.  Finds the end of the word that the cursor
     * is on.  If the cursor is already on the end of a word, return the
     * position of the end of the next word.  If there are no more words
     * on the current line, return -1;
     */
    var findEndOfNextWord = function(x, line) {
        var pos = x + 1;
        if (line.length == 0 || pos > line.length - 2)
            return -1;

        var c = line[pos];
        if (strings.isWhiteSpace(c)) {
            var match = matchAt("\\S", line, pos);
            if (!match)
                return -1;

            pos = match.index;
        }

        return findEndOfWord(pos, line);
    };

    /**
     * Given that x is on a non-whitespace character, find the end of the word
     * that the character is on.
     */
    var findEndOfWord = function(x, line) {
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
    };

    /**
     * Used in insert mode. Add the character to the line at the position that
     * the cursor is on. Move the character one position to the left.
     */
    var addChar = function(row, col, c) {
        buffer.lines[row].insert(c, col);
        var newCol = col + 1;
        return new commands.Result(row, newCol, newCol, mode, true);
    };

    /**
     * Return the command function that corresponds to the given key code.
     */
    var getFunc = function(code) {
        switch (code) {
            case 27:  return esc;
            case 36:  return dollarSign;
            case 48:  return zero;
            case 105: return i;
            case 104: return h;
            case 106: return j;
            case 107: return k;
            case 108: return l;
            case 119: return w;
            case 120: return x;
            default:  return null;
        }
    };

    /**
     * Used to store the result of a command action.
     */
    commands.Result = function(row, col, lastCol, mode, pageRefresh) {
        this.row = row;
        this.col = col;
        this.lastCol = lastCol;
        this.mode = mode;
        this.pageRefresh = pageRefresh;
    };

    /**
     * Given the corrent position of the cursor, the key that
     * was typed, and the current mode, execute the proper command.
     */
    commands.handle = function(row, col, code) {
        var result;

        if (mode == modes.NORMAL) {
            // User is executing a command in normal mode
            func = getFunc(code);
            result = func ? func(row, col, mode) : null;
        }
        else if (code == 27) {
            // User hit escape to leave insert mode
            result = esc(row, col);
        }
        else {
            // User is typing text in insert mode
            var c = String.fromCharCode(code);
            result = addChar(row, col, c);
        }

        if (!result)
            return;

        lastCol = result.lastCol;
        mode = result.mode;
        return result;
    };

})(window.commands = window.commands || {}, buffer, modes, match, strings);
