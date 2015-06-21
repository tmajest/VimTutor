
(function(vim, commands, buffer, render, modes) {
    var row = 0;
    var col = 0;
    var mode = modes.NORMAL;
    var text = [
        "Lorem e ipsum dolor sit amet, ut mei errem constituto,\n",
        "illud errem vidisse nam te. Nam quis scripserit at,\n",
        "pro posse mediocrem no, per illud dolorem ad. Ne mei\n", 
        "diceret appetere. Ex ius malorum nominavi.\n",
        "\n",
        "Reque scriptorem no cum, in per impetus vocibus convenire.\n",
        "Sale splendide eam et, in atqui voluptua conclusionemque sea,\n", 
        "eu usu quando platonem. Quodsi diceret eam eu, vel ea exerci\n",
        "appellantur. Labore eligendi partiendo cum no, nobis delicata\n",
        "qui ut, his dictas virtute ex.\n"];

    var needsPageRefresh = function(commandResult) {
        return commandResult.row != row ||
               commandResult.col != col ||
               commandResult.mode != mode ||
               commandResult.pageRefresh;
    };

    vim.init = function() {
        render.init();
        buffer.init(text);
        render.renderPage(row, col, mode);
    }

    vim.handleKey = function(code) {
        var result = commands.handle(row, col, code);
        if (!result) {
            return;
        }

        if (needsPageRefresh(result)) {
            row = result.row;
            col = result.col;
            mode = result.mode;
            render.renderPage(row, col, mode);
        }
    };
})(window.vim = window.vim || {}, commands, buffer, render, modes)
