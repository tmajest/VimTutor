/**
 * Module to provide utility functions for strings.
 */
(function(strings) {
    /**
     * Returns true if the character is alpha numeric, otherwise false.
     * An alpha numeric character is a-z, A-Z, 0-9, or _ (underscore).
     */
    strings.isAlphaNumeric = function(c) {
        return /[a-zA-Z0-9_]/.test(c);
    };

    /**
     * Return true if the character is not alphanumeric or whitespace,
     * otherwise false.
     */
    strings.isSymbolic = function(c) {
        return /[^a-zA-Z0-9_\s]/.test(c);
    };

    /**
     * Returns true if the character is a space, tab, or newline, otherwise false.
     */
    strings.isWhiteSpace = function(c) {
        return /\s/.test(c);
    };
})(window.strings = window.strings || {});
