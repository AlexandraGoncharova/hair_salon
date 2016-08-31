/**
 * Created by alexa on 26.08.2016.
 */
function GameView(gameCtrl) {
    var self = this;
    var gameController = gameCtrl;
    this.canvas = new Canvas();
    this.ctx = this.canvas.context;
    this.backPattern = null;
    //todo listeners actions by buttons
    var infoContainer = document.getElementById('info');
    this.updateInfoContainer = function(value){
        infoContainer.innerHTML = value;
    };
    var controls = document.getElementById('controls');
    this.addListenerControls = function (){
        controls.addEventListener("click", function(e){
            var target = e.target;
            var buttonId = target.getAttribute('data-action');
            if (!buttonId) return;
            switch (buttonId)
            {
                case "add_master":
                    gameController.addMaster();
                    break;
                case "add_client":
                    gameController.addClient();
                    break;
                case "reset":
                    gameController.resetGame();
                    break;
                case "stop":
                    gameController.stopGame();
                    break;

            }
        })
    }

}

GameView.prototype.startGame = function(){
    this.canvas.add();
    this.backPattern = this.ctx.createPattern(resources.get(GameConstants.BACK_IMG_URL), 'repeat');
    this.addListenerControls();
};

GameView.prototype.drawBackground = function(){
    this.ctx.save();
   // this.ctx.globalAlpha = 0.75;
    this.ctx.fillStyle = this.backPattern;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
};

GameView.prototype.updateCanvas = function(){
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);

};

GameView.prototype.renderMaster = function(master){
    this.ctx.save();
    this.ctx.translate(master.posX, master.posY);
    for (var i = 0; i < master.level; i++){
        star(this.ctx,15 + 15 * i, 0, 10, 5, 0.5);
    }

    this.ctx.font = "16px times";
    this.ctx.fillText(master.name,0,30, 50);
    drawProgressbar(this.ctx,35, master.duration, master.loopService);
    if (master.isAvailable)
    {
        this.ctx.drawImage(resources.get("assets/empty.png"),0, 52,50, 50);
    }
    else
    {
        this.ctx.drawImage(resources.get("assets/default.png"),0, 52,50, 50);

    }

    this.ctx.restore();
};


GameView.prototype.renderEntity = function(entity)
{
    if (entity instanceof Master)
    {
        this.renderMaster(entity);
    }
};

GameView.prototype.renderEntities = function(entitiesList){
    var i;
    for (i = 0; i < entitiesList.length; i++) {
        this.renderEntity(entitiesList[i]);
    }
};

GameView.prototype.updateGameInfo = function (value){
    this.updateGameInfo(value);
};
function star(ctx, x, y, r, p, m)
{
    ctx.save();
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.moveTo(0,0-r);
    for (var i = 0; i < p; i++)
    {
        ctx.rotate(Math.PI / p);
        ctx.lineTo(0, 0 - (r*m));
        ctx.rotate(Math.PI / p);
        ctx.lineTo(0, 0 - r);
    }
    ctx.fill();
    ctx.restore();
}

function drawProgressbar(ctx,y, max, val) {
    var width = 50,
        height = 10;

    // Draw the background
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.fillRect(0, y, width, height);

    // Draw the fill
    ctx.fillStyle = '#CC9966';
    var fillVal = Math.min(Math.max(val / max, 0), 1);
    ctx.fillRect(0, y, fillVal * width, height);
    ctx.restore();
}
