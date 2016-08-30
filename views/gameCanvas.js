/**
 * Created by alexa on 26.08.2016.
 */

function Canvas() {
    this.element = document.createElement('canvas');
    this.width = GameConstants.GAME_WIDTH;
    this.height = GameConstants.GAME_HEIGHT;
    this.context = this.element.getContext('2d');
}

Canvas.prototype.add = function () {
    this.element.width = this.width;
    this.element.height = this.height;
    this.element.style.border = '2px dotted grey';
    document.body.appendChild(this.element);
};

Canvas.prototype.setSize = function (width, height) {
    this.width = width;
    this.height = height;
};

var requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
