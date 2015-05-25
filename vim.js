
function Vim() {
    this.x = 0;
    this.y = 0;
    this.rows = 0;
    this.cols = 0;
    this.text = "Hello there, world!";

    this.keyHandler = new KeyHandler();

    this.render = new Render();
    var html = this.getHTML();
    this.render.renderPage(html);
};

Vim.prototype.getHTML = function() {
    var html = []
    html.push("<p id=\"text\">");
    html.push(this.text.substring(0, this.x));

    html.push("<span id=\"highlight\">");
    html.push(this.text.substring(this.x, this.x + 1));
    html.push("</span>");

    html.push(this.text.substring(this.x + 1));
    html.push("</p>")

    return html.join("");
};

Vim.prototype.handleKey = function(code) {
    var result = this.keyHandler.handle(
        this.x, 
        this.y, 
        code, 
        this.text.length);

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
