
/**
 * Module to handle highlighting functions.
 */
(function(hl, $) {

    /**
     * Add a span around region of text to highlight.
     */
    hl.setHtml = function(line, start, end, id) {
        var html = [] 
        html.push(line.substring(0, start));
        html.push("<span id=\"");
        html.push(id);
        html.push("\">");

        // If the highlighted string is empty, add a space so the highlighted
        // portion will still appear
        var highlightedPortion = line.substring(start, end + 1);
        if (highlightedPortion.length == 0) {
            html.push(" ");
        }
        else {
            html.push(highlightedPortion);
        }

        html.push("</span>")
        html.push(line.substring(end + 1));
        return html.join("");
    };

    /**
     * Set the text color and background color of the element with the
     * given id.
     */
    hl.set = function(id, color, backgroundColor) {
        $(id).css("color", color);
        $(id).css("background-color", backgroundColor);
    };
})(window.highlight = window.highlight || {}, jQuery);
