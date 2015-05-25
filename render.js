
function Render() {
    this.highlightCursor = true; 
    this.resetTimer();
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
