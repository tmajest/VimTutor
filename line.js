(function(buffer, strings) {

    /**
     * Class to store a single line of text.
     */
    buffer.line = function(str, row) {
        this.chars = str.toArray();
        this.row = row;
        var that = this;

        /**
         * Returns the length of the line; ignores the EOL character.
         */
        this.length = function() {
            return Math.max(0, that.chars.length - 1);
        };

        /**
         * Insert the character into the line at the given column.
         */
        this.insert = function(char, col) {
            var len = that.chars.length;
            for (var i = len - 1; i >= col; i--) {
                that.chars[i + 1] = that.chars[i];
            }
            that.chars[col] = char;
        };

        /**
         * Append a character to the end of the line.
         */
        this.append = function(char) {
            that.chars.push(char); 
        };
            
        /**
         * Remove the character at the given column and return it.
         */
        this.remove = function(col) {
            var c = that.chars[col];
            that.chars.remove(col);
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
            return that.chars.join("");
        }
    };

})(window.buffer = window.buffer || {}, strings);

/**
 * Array Remove - By John Resig (MIT Licensed)
 * http://ejohn.org/blog/javascript-array-remove/
 */ 
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
