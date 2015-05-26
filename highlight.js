
function Highlight() {
}

Highlight.prototype.highlight = function(line, start, end, id) {
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
