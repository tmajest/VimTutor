
function Vim() {
    this.x = 0;
    this.y = 0;
    this.rows = 0;
    this.cols = 0;
    this.text = "Hello there, world!";
};

Vim.prototype.render = function(newX, newY) {
    this.x = newX;
    this.y = newY;
    this.cursor = true;
    this.keyHandler = new KeyHandler();

    window.clearInterval(this.timer);
    var renderCursor = Vim.prototype.renderCursor;
    this.timer = window.setInterval(function() { 
        renderCursor(); 
    }, 
    800);

    var html = this.getHTML();
    $(".text").empty();
    $(".text").html(html);
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

Vim.prototype.renderCursor = function() {
    if (this.cursor) {
        $("#highlight").css("background-color", "white"); 
        $("#highlight").css("color", "#2C3331");
        this.cursor = false;
    } 
    else {
        $("#highlight").css("background-color", "#2C3331"); 
        $("#highlight").css("color", "white");
        this.cursor = true;
    }
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
        this.render(newX, newY);
    }
};
