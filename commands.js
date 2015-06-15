/**
 * Module used to handle key motions and actions.
 * Handling functions take the current x and y position of the
 * cursor along with the text and character pressed.  They return the
 * new positions of the cursor, or false if it is an invalid key.
 */
(function(commands, modes, strings) {
    var lastX = 0;
    var mode = modes.NORMAL;

    /**
     * The h key; move the cursor one character to the left.
     * If the cursor's x position is already at 0, don't move the cursor.
     */
    var h = function(x, y, text) {
        var newX = Math.max(0, x - 1); 
        return new commands.Result(newX, y, newX, null, null);
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
    var j = function(x, y, text) {
        var rows = text.length;
        var newY = Math.min(y + 1, rows - 1);

        var len = text[newY].length - 1;
        var newX;
        if (len <= lastX) {
            newX = Math.max(0, len - 1);
        }
        else {
            newX = lastX;
        }

        return new commands.Result(newX, newY, null, null, null);
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
    var k = function(x, y, text) {
        var newY = Math.max(0, y - 1);
        var len = text[newY].length - 1;
        var newX;
        if (len <= lastX) {
            newX = Math.max(0, len - 1);
        }
        else {
            newX = lastX;
        }

        return new commands.Result(newX, newY, null, null, null);
    };

    /**
     * The l key; move the cursor one character to the right.
     * If the cursor is already at the end of the line, do nothing.
     */
    var l = function(x, y, text) {
        var len = text[y].length - 1;
        var newX = len == 0 ? 0 : Math.min(x + 1, len - 1);
        return new commands.Result(newX, y, newX, null, null);
    };

    /**
     * The 0 key; move the cursor to the beginning of the line.
     */
    var zero = function(x, y, text, mode) {
        return new commands.Result(0, y, 0, null, null);
    };

    /**
     * Delete the character under the cursor.
     */
    var x = function(x, y, text) {
        var line = text[y];
        var newLine = []

        if (line.length == 1) {
            return;
        }

        newLine.push(line.substring(0, x));
        newLine.push(line.substring(x + 1));
        text[y] = newLine.join("");

        var newX = x == line.length - 2 ? x - 1 : x;
        return new commands.Result(newX, y, newX, text, null);
    };

    /**
     * Go into insert mode.
     */
    var i = function(x, y, text) {
        return new commands.Result(x, y, null, null, modes.INSERT);
    };

    /**
     * Go into normal mode.  If the previous mode was insert mode,
     * move the cursor to the left.
     */
    var esc = function(x, y, text) {
        if (mode == modes.NORMAL) {
            return null;
        }
        var newX = Math.max(0, x - 1); 
        return new commands.Result(newX, y, newX, null, modes.NORMAL);
    };

    /**
     * The $ key; move the cursor to the end of the line.
     */
    var dollarSign = function(x, y, text) {
        var newX = Math.max(0, text[y].length - 2);
        return new commands.Result(newX, y, newX, null, null);
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
    var w = function(x, y, text) {
        var currentLineFunc = function(i, j, line) {
            // Try to find next word on current line
            var newX = findNextWord(i, line);
            return newX >= 0 
                ? new commands.Result(newX, j, null, null, null) 
                : null;
        };

        var restOfLinesFunc = function(i, j, line) {
            // If the line is empty, go to the beginning of that line
            if (line.length == 1)
                return new commands.Result(0, j, null, null, null);
            
            // If there is a word on that line, go to the beginning of it
            var result = matchAt("\\S", line, 0);
            return result 
                ? new commands.Result(result.index, j, null, null, null) 
                : null;
        };

        var defaultFunc = function(i, j, line) {
            // Otherwise, go to the end of the last line
            var newX = Math.max(0, line.length - 2);
            return new commands.Result(newX, j, null, null, null);
        };

        var increment = function(x) { return x + 1 };

        var result = multilineAction(x, y, text, currentLineFunc,
            restOfLinesFunc, defaultFunc, increment);

        return new commands.Result(result.x, result.y, result.x, null, null);
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
    };

    /**
     * Helper function to find the position of the next word on the 
     * given line, or -1 if there are no more words on the line.
     */
    var findNextWord = function(x, line) {
        if (line.length == 0 || x >= line.length - 2)
            return -1;

        var c = line[x];
        var pos = x + 1;
        var pattern;

        // If on whitespace, look for next non-whitespace character
        if (strings.isWhiteSpace(c)) {
            var match = matchAt("\\S", line, pos);
            return match ? match.index : -1;
        }

        // If the character is alphanumeric, look for the next symbol character
        if (strings.isAlphaNumeric(c)) {
            pattern = "[^a-zA-Z0-9_\\s]";
        }
        // If the character is symbolic, look for the next alphanumeric character
        else if (strings.isSymbolic(c)) {
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
     * Find first regex match in the given string that is on or after the
     * starting position of the string.
     */
    var matchAt = function(pattern, str, start) {
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
    };

    /**
     * Used in insert mode. Add the character to the line at the position that
     * the cursor is on. Move the character one position to the left.
     */
    var addText = function(x, y, code, text) {
        var line = text[y];
        var newLine = []

        newLine.push(line.substring(0, x));
        newLine.push(String.fromCharCode(code));
        newLine.push(line.substring(x));

        text[y] = newLine.join("");
        return new commands.Result(x + 1, y, null, text, null);
    };

    var normalHandlers = {
        36: dollarSign,
        48: zero,
        27: esc,
        105: i,
        104: h,
        106: j,
        107: k,
        108: l,
        101: e,
        119: w,
        120: x,
    };

    /**
     * Used to store the result of a command action.
     */
    commands.Result = function(x, y, lastX, newText, mode) {
        this.lastX = lastX;
        this.x = x;
        this.y = y;
        this.newText = newText;
        this.mode = mode;
    };

    /**
     * Given the corrent position of the cursor, the key that
     * was typed, and the current text, generate the new position
     * for the cursor.
     */
    commands.handle = function(x, y, code, text) {
        var result;

        if (mode == modes.NORMAL) {
            // User is executing a command in normal mode
            result = code in normalHandlers
                ? normalHandlers[code](x, y, text)
                : null;
        }
        else if (code == 27) {
            // User hit escape to leave insert mode
            result = esc(x, y, text, mode);
        }
        else {
            // User is typing text in insert mode
            result = addText(x, y, code, text);
        }

        if (!result)
            return;

        if (result.lastX !== null)
            lastX = result.lastX;

        if (result.mode === modes.NORMAL || result.mode === modes.INSERT) 
            mode = result.mode;

        return result;
    };

})(window.commands = window.commands || {}, modes, strings);
