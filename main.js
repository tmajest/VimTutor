
$(document).ready(function() {
    vim.init();

    $(document).keypress(function(e) {
        vim.handleKey(e.keyCode);
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27)
            vim.handleKey(e.keyCode);
    });
});

