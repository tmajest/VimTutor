/**
 * Module to provide utility functions for strings.
 */
(function(strings) {
    /**
     * Returns true if the character is alpha numeric, otherwise false.
     * An alpha numeric character is a-z, A-Z, 0-9, or _ (underscore).
     */
    strings.isAlphaNumeric = function(c) {
        return this.alphaNumericRegex.test(c);
    };

    /**
     * Return true if the character is not alphanumeric or whitespace,
     * otherwise false.
     */
    strings.isSymbolic = function(c) {
        return this.symbolicRegex.test(c);
    };

    /**
     * Returns true if the character is a space, tab, or newline, otherwise false.
     */
    strings.isWhiteSpace = function(c) {
        return this.whiteSpaceRegex.test(c);
    };

    /**
     * Returns true if the character is not a whitespace character, otherwise false.
     */
    strings.isNonWhiteSpace = function(c) {
        return this.nonWhiteSpaceRegex.test(c);
    };

    /**
     * Combines two regular expressions into one.
     */
    strings.combineRegex = function(regex1, regex2) {
        return new RegExp(regex1.source + "|" + regex2.source);
    };

    /**
     * Regular expression for alpha numeric characters.
     */
    strings.alphaNumericRegex = /[a-zA-Z0-9]/;

    /**
     * Regular expression for non alpha numeric characters.
     */
    strings.nonAlphaNumericRegex = /[^a-zA-Z0-9]/;


    /**
     * Regular expression for symbol characters.
     */
    strings.symbolicRegex = /[^a-zA-Z0-9\s]/;

    /**
     * Regular expression for non symbol characters.
     */
    strings.nonSymbolicRegex = /[a-zA-Z0-9\s]/;

    /**
     * Regular expression for whitespace characters.
     */
    strings.whiteSpaceRegex = /\s/;

    /**
     * Regular expression for non whitespace characters.
     */
    strings.nonWhiteSpaceRegex = /\S/;
})(window.strings = window.strings || {});
