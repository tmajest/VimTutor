
$(document).ready(function() {
    var v = new Vim();

    $(document).keypress(function (e) {
        v.handleKey(e.keyCode);
    });

    v.render(0, 0);
});

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
    if (code == 104) {
        // h - move to the left
        var newX = Math.max(0, this.x - 1);
        if (newX != this.x) {
            this.render(newX, this.y);
        }
    }
    else if (code == 108) {
        // l - move to the right
        var newX = Math.min(this.x + 1, this.text.length - 1);
        if (newX != this.x) {
            this.render(newX, this.y);
        }
    }
};
