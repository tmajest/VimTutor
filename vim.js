
function Vim() {
    this.x = 0;
    this.y = 0;
    this.text = [
        "Lorem ipsum dolor sit amet, ut mei errem constituto,\n",
        "illud errem vidisse nam te. Nam quis scripserit at,\n",
        "pro posse mediocrem no, per illud dolorem ad. Ne mei\n", 
        "diceret appetere. Ex ius malorum nominavi.\n",
        "\n",
        "Reque scriptorem no cum, in per impetus vocibus convenire.\n",
        "Sale splendide eam et, in atqui voluptua conclusionemque sea,\n", 
        "eu usu quando platonem. Quodsi diceret eam eu, vel ea exerci\n",
        "appellantur. Labore eligendi partiendo cum no, nobis delicata\n",
        "qui ut, his dictas virtute ex.\n"];

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
