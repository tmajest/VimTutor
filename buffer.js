(function(buffer) {
    buffer.lines = [];

    buffer.init = function(text) {
        var len = text.length;
        for (var i = 0; i < len; i++) {
            this.lines[i] = new buffer.line(text[i], i);
        }
    }

    /**
     * Calculates the new row based on the current row and the
     * given offset and returns the line at the new row.  
     *
     * If the new row is less than zero, return the first line.
     * If the new row is greater than the number of lines, return
     * the the last line.
     */
    buffer.offset = function(row, diff) {
        var numLines = this.lines.length;
        var newRow = row + diff;
        newRow = Math.max(0, newRow);
        if (newRow >= numLines)
            newRow = Math.max(0, numLines - 1);

        return this.lines[newRow];
    };

    /**
     * Get a string array of all the lines in the buffer.
     */
    buffer.allLines = function() {
        var allLines = [];
        var len = this.lines.length;
        for (var i = 0; i < len; i++) {
            allLines.push(this.lines[i].toString());
        }

        return allLines;
    }
})(window.buffer = window.buffer || {});
