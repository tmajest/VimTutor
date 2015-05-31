
function Vim() {
    this.x = 0;
    this.y = 0;
    this.text = [
        "Lorem ipsum dolor sit amet, ut mei errem constituto,",
        "illud errem vidisse nam te. Nam quis scripserit at,",
        "pro posse mediocrem no, per illud dolorem ad. Ne mei", 
        "diceret appetere. Ex ius malorum nominavi.",
        "",
        "Reque scriptorem no cum, in per impetus vocibus convenire.",
        "Sale splendide eam et, in atqui voluptua conclusionemque sea,", 
        "eu usu quando platonem. Quodsi diceret eam eu, vel ea exerci",
        "appellantur. Labore eligendi partiendo cum no, nobis delicata",
        "qui ut, his dictas virtute ex."];

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
        var html = this.render.getHtml(this.text, this.x, this.y);
        this.render.renderPage(html);
    }
};
