
(function(vim, commands, render, modes) {
    var x = 0;
    var y = 0;
    var mode = modes.NORMAL;
    var text = [
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

    vim.init = function() {
        render.init();
        var html = render.getHtml(text, x, y);
        render.renderPage(html);
    }

    vim.handleKey = function(code) {
        var result = commands.handle(
            x, 
            y, 
            code, 
            text);

        if (!result) {
            return;
        }

        var newX = result.x;
        var newY = result.y;
        var newText = result.newText || text;
        var newMode = result.mode !== null ? result.mode : mode;

        if (newX != x || newY != y || newText) {
            x = newX;
            y = newY;
            text = newText;
            var html = render.getHtml(text, x, y);
            render.renderPage(html);
        }

        if (newMode != mode) {
            mode = newMode;
            var commandText = newMode == 0 ? "" : "-- INSERT --";
            render.renderCommandWindow(commandText);
        }
    };
})(window.vim = window.vim || {}, commands, render, modes)
