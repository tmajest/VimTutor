
function Vim() {
    this.x = 0;
    this.y = 0;
    this.text = [
        "Welcome to VimTutor.",
        "",
        "Press the h, j, k, and l keys to start moving around."];

    this.keyHandler = new KeyHandler();

    this.render = new Render();
    var html = this.getHTML();
    this.render.renderPage(html);
};

Vim.prototype.handleKey = function(code) {
    var result = this.keyHandler.handle(
        this.x, 
        this.y, 
        code, 
        this.text);

    if (!result) {
        return;
    }

    var newX = result[0];
    var newY = result[1];

    if (newX != this.x || newY != this.y) {
        this.x = newX;
        this.y = newY;
        var html = this.getHTML();
        this.render.renderPage(html);
    }
};

Vim.prototype.getHTML = function() {
    var html = []
    html.push("<pre id=\"text\">");

    var rows = this.text.length;
    for (var i = 0; i < rows; i++) {
        var line = this.text[i];

        if (i == this.y) {
            // Add span between character under the cursor to
            // activate css highlighting
            html.push(line.substring(0, this.x));
            html.push("<span id=\"highlight\">");

            var c = line.substring(this.x, this.x + 1);
            if (c.length > 0) {
                html.push(c);
            }
            else {
                // If the line is empty, add a space so the cursor will still
                // be displayed
                html.push(" ");
            }
            html.push("</span>");
            html.push(line.substring(this.x + 1));
        }
        else {
            // If it's not the line with the cursor, just add the text
            html.push(line);
        }

        if (i < rows - 1) {
            html.push("<br>");
        }
    }

    html.push("</pre>")
    return html.join("");
};
