
function Vim() {
    this.x = 0;
    this.y = 0;
    this.text = [
        "Welcome to VimTutor.",
        "Second line",
        "Press the h, j, k, and l keys to start moving around."];

    this.keyHandler = new KeyHandler();

    this.render = new Render();
    var html = this.render.getHtml(this.text, this.x, this.y);
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
