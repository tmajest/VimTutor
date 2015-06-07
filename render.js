
function Render() {
    this.highlightCursor = true; 
    this.resetTimer();
    this.highlight = new Highlight();
}

Render.prototype.renderPage = function(html) {
    this.highlightCursor = true;
    this.resetTimer();
    this.renderHtml(html);
    this.renderCursor();
};

Render.prototype.renderHtml = function(html) {
    $(".text").empty();
    $(".text").html(html);
};

Render.prototype.renderCursor = function() {
    if (this.highlightCursor) {
        $("#highlight").css("background-color", "white"); 
        $("#highlight").css("color", "#2C3331");
        this.highlightCursor = false;
    } 
    else {
        $("#highlight").css("background-color", "#2C3331"); 
        $("#highlight").css("color", "white");
        this.highlightCursor = true;
    }
};

Render.prototype.resetTimer = function() {
    window.clearInterval(this.timer);

    var renderCursor = Render.prototype.renderCursor;
    this.timer = window.setInterval(function() { 
        renderCursor(); 
    }, 
    750);
};

Render.prototype.getHtml = function(text, x, y) {
    var html = []
    var rows = text.length; 
    var trimmedText = rtrimText(text);
    
    for (var i = 0; i < rows; i++) {
        var htmlLine = this.getHtmlLine(trimmedText, x, y, i);
        html.push(htmlLine);
    }

    return html.join("");
};

Render.prototype.getHtmlLine = function(text, x, y, i) {
    var htmlLine = ["<pre>"]
    var line = text[i];
    if (i == y) {
        htmlLine.push(this.highlight.highlight(line, x, x, "highlight"));
    }
    else if (line.length == 0) {
        htmlLine.push(" ");
    }
    else {
        htmlLine.push(line);
    }
    htmlLine.push("</pre>");
    return htmlLine.join("");
};

function rtrimText(text) {
    var newText = []
    for (var i = 0; i < text.length; i++) {
        var line = text[i];
        var len = line.length;
        newText.push(line.substring(0, len - 1));
    }
    return newText;
}
