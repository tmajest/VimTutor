
/**
 * Module to store the result of the user's action.
 * Keep track of the new x and y positions, the last saved
 * x postion of the cursor, the new text if any, and the new
 * mode if it was changed.
 */
(function(commands) {
    commands.Result = function(x, y, lastX, newText, mode) {
        this.lastX = lastX;
        this.x = x;
        this.y = y;
        this.newText = newText;
        this.mode = mode;
    };
})(window.commands = window.commands || {});
  
