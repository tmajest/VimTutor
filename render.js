
(function(render) {
    var highlightCursor;
    var timer;

    var initTimer = function() {
        return window.setInterval(
            function() { renderCursor(); },
             650);
    }

    var resetTimer = function() {
        if (timer)
            window.clearInterval(timer);
        timer = initTimer();
    };

    var renderCursor = function() {
        if (highlightCursor) {
            highlight.set("#highlight", "#2C3331", "white");
            highlightCursor = false;
        } 
        else {
            highlight.set("#highlight", "white", "#2C3331");
            highlightCursor = true;
        }
    };

    var getHtmlLine = function(text, x, y, i) {
        var htmlLine = ["<pre>"]
        var line = text[i];
        if (i == y) {
            htmlLine.push(highlight.setHtml(line, x, x, "highlight"));
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

    var rtrimText = function(text) {
        var newText = []
        for (var i = 0; i < text.length; i++) {
            var line = text[i];
            var len = line.length;
            newText.push(line.substring(0, len - 1));
        }
        return newText;
    };

    var renderHtml = function(html) {
        $(".text").empty();
        $(".text").html(html);
    };

    render.init = function() {
        highlightCursor = true; 
        resetTimer();
    };

    render.renderPage = function(html) {
        highlightCursor = true;
        resetTimer();
        renderHtml(html);
        renderCursor();
    };


    render.getHtml = function(text, x, y) {
        var html = []
        var rows = text.length; 
        var trimmedText = rtrimText(text);
        
        for (var i = 0; i < rows; i++) {
            var htmlLine = getHtmlLine(trimmedText, x, y, i);
            html.push(htmlLine);
        }

        return html.join("");
    };

    render.renderCommandWindow = function(commandText) {
        $(".commandWindow").empty();
        var text = ["<p>"];
        text.push(commandText);
        text.push("</p>");
        $(".commandWindow").html(text.join(""));
    };
})(window.render = window.render || {});
