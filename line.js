(function(buffer) {

    /**
     * Class to store a single line of text.
     */
    buffer.line = function(str, row) {
        this.row = row;
        var chars = [];
        var that = this;

        var init = function() {
            var len = str.length;
            for (var i = 0; i < len; i++) {
                chars.push(str.charAt(i));
            }
        };

        /**
         * Returns the length of the line; ignores the EOL character.
         */
        this.length = function() {
            return Math.max(0, chars.length - 1);
        };

        /**
         * Insert the character into the line at the given column.
         */
        this.insert = function(char, col) {
            var len = chars.length;
            for (var i = len - 1; i >= col; i--) {
                chars[i + 1] = chars[i];
            }
            chars[col] = char;
        };

        /**
         * Append a character to the end of the line.
         */
        this.append = function(char) {
            chars.push(char); 
        };
            
        /**
         * Remove the character at the given column and return it.
         */
        this.remove = function(col) {
            var c = chars[col];
            chars.remove(col);
            return c;
        };

        /**
         * Calculates the new column based on the current column and the
         * given offset.  If the new row is less than zero, return 0.
         * If the new column is greater than the last character in the line,
         * return the position of the last character in the line.
         */
        this.offset = function(col, diff) {
            var len = that.length();
            var newCol = col + diff;
            newCol = Math.max(0, newCol);
            if (newCol >= len)
                newCol = Math.max(0, len - 1);
            return newCol;
        };

        /**
         * Returns the position of the last character in the line.
         */
        this.last = function() {
            var len = that.length();
            return Math.max(0, len - 1);
        };

        /**
         * Returns a string representation of the line.
         */
        that.toString = function() {
            return chars.join("");
        }

        init();
    };

})(window.buffer = window.buffer || {});

/**
 * Array Remove - By John Resig (MIT Licensed)
 * http://ejohn.org/blog/javascript-array-remove/
 */ 
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
