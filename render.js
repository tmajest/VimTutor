
(function(render, buffer, modes) {
    var highlightCursor;
    var timer;

    var initTimer = function() {
        return window.setInterval(renderCursor, 650);
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

    var getHtml = function(cursorRow, cursorCol) {
        var lines = buffer.allLines();
        var rows = lines.length; 
        var trimmedText = rtrimText(lines);
        var html = trimmedText.map(function(line, i) {
            return getHtmlLine(line, i, cursorRow, cursorCol);
        });

        return html.join("");
    };

    var getHtmlLine = function(line, i, cursorRow, cursorCol) {
        var htmlLine = ["<pre>"]
        if (i == cursorRow) {
            htmlLine.push(highlight.setHtml(line, cursorCol, cursorCol, "highlight"));
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
        return text.map(function(line) {
            return line.substring(0, line.length - 1);
        });
    };

    var renderHtml = function(html) {
        $(".text").empty();
        $(".text").html(html);
    };

    var renderCommandWindow = function(commandText) {
        $(".commandWindow").empty();
        var text = ["<p>"];
        text.push(commandText);
        text.push("</p>");
        $(".commandWindow").html(text.join(""));
    };

    render.init = function() {
        highlightCursor = true; 
        resetTimer();
    };

    render.renderPage = function(row, col, mode) {
        var html = getHtml(row, col);
        highlightCursor = true;
        resetTimer();
        renderHtml(html);
        renderCursor();

        var commandText = mode == modes.INSERT ? "-- INSERT --" : "";
        renderCommandWindow(commandText);
    };
})(window.render = window.render || {}, buffer, modes);
