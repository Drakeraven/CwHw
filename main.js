var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight, 
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

function Ezio(game, spritesheet) {
    this.animation = new Animation(spritesheet, 128, 128, 6, .2, 24, true, .7);
    this.speed = 150;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 100);
}

Ezio.prototype = new Entity();
Ezio.prototype.constructor = Ezio;

Ezio.prototype.update = function () {
    if (this.animation.elapsedTime < this.animation.totalTime * 6 / 24) {
        this.x += this.game.clockTick * this.speed;
    } else if (this. animation.elapsedTime < this.animation.totalTime * 12 / 24) {
        this.y -= this.game.clockTick * this.speed / 1.6;
        this.x += this.game.clockTick * this.speed / 2;
    } else if (this.animation.elapsedTime < this.animation.totalTime * 18 / 24) {
        this.y += this.game.clockTick * this.speed * 1.8;
        this.x += this.game.clockTick * this.speed;
    }
    if (this.x > 600) {
        this.x = 0;
        this.y = 100;
        this.animation.elapsedTime = 0;
    }

    Entity.prototype.update.call(this);
}

Ezio.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./img/background.png");
AM.queueDownload("./img/EzioSprite.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.png")));
    gameEngine.addEntity(new Ezio(gameEngine, AM.getAsset("./img/EzioSprite.png")));

    console.log("All Done!");
});