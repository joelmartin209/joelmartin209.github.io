var level01 = function (window) {

    window.opspark = window.opspark || {};

    var draw = window.opspark.draw;
    var createjs = window.createjs;

    window.opspark.runLevelInGame = function(game) {
        // some useful constants 
        var groundY = game.groundY;

        // this data will allow us to define all of the
        // behavior of our game
        var levelData = {
            "name": "Robot Romp",
            "number": 1, 
            "speed": -3,
            "gameItems": [
                { "type": "sawblade", "x": 400, "y": groundY },
                { "type": "sawblade", "x": 600, "y": groundY },
                { "type": "sawblade", "x": 900, "y": groundY },
                { "type": "enemy", "x": 1000, "y": groundY-50 },
                //{ "type": "lego", "x": 1500, "y": groundY },
                { "type": "reward", "x": 1750, "y": groundY-70 },
            ]
        };
        for (var i = 0; i < levelData.gameItems.length; i++) {
            var gameItemObject = levelData.gameItems[i];
            var objectX = gameItemObject.x;
            var objectY = gameItemObject.y;
            var type = gameItemObject.type;

            if (type === "sawblade") {
                createSawBlade(objectX, objectY);
            } else if (type === "enemy") {
                createEnemy(objectX, objectY);
            } else if (type === "lego") {
                createLego(objectX);
            } else {
                createReward(objectX, objectY);
            }
        }
        window.levelData = levelData;
        // set this to true or false depending on if you want to see hitzones
        game.setDebugMode(true);

        // TODO 6 and on go here
        // BEGIN EDITING YOUR CODE HERE
        function createSawBlade(x, y) {
            var hitZoneSize = 25;
            var damageFromObstacle = 10;
            var sawBladeHitZone = game.createObstacle(hitZoneSize, damageFromObstacle);
            
            sawBladeHitZone.x = x;
            sawBladeHitZone.y = groundY - y;
            game.addGameItem(sawBladeHitZone);

            var obstacleImage = draw.bitmap('img/sawblade.png');
            sawBladeHitZone.addChild(obstacleImage);

            obstacleImage.x = -25;
            obstacleImage.y = -25;
        }
        /*
        function createLego(x) {
            var hitZoneSize = 50;
            var damageFromObstacle = 10;
            var legoHitZone = game.createObstacle(hitZoneSize, damageFromObstacle);
            
            legoHitZone.x = x;
            legoHitZone.y = groundY;
            game.addGameItem(legoHitZone);

            var obstacleImage = draw.bitmap('https://lh3.googleusercontent.com/proxy/LG0W9Uezc5EbcSFCcr8u3g3EqaKJScXSQg4kJMXhk_Ej8Knt9cuXjZbmCBUTlWgu9HFLLCMCcV-89g_ZGkPTtXLP6k9VnVxAHIp6Dt2ilC5V894waUi_bUdolBq6WTylUcl7NcLMC6k');
            legoHitZone.addChild(obstacleImage);

            obstacleImage.x = -50;
            obstacleImage.y = -50;
        }
        */

        function createEnemy(x, y) {
            var enemy = game.createGameItem('enemy',25);
            var redSquare = draw.rect(50,50,'red');
            redSquare.x = -25;
            redSquare.y = -25;
            enemy.addChild(redSquare);

            enemy.x = x;
            enemy.y = groundY-y;

            game.addGameItem(enemy);
            enemy.velocityX = -1;
            enemy.rotationalVelocity = 10;

            enemy.onPlayerCollision = function(){
                console.log("The enemy has hit Halle");
                game.changeIntegrity(-10);
                enemy.fadeOut();
            }
            enemy.onProjectileCollision = function(){
                console.log("Halle has hit the enemy.");
                game.increaseScore(100);
            }
        }

        function createReward(x, y) {
            var reward = game.createGameItem('reward',25);
            var yellowSquare = draw.rect(50,50,'yellow');
            yellowSquare.x = -25;
            yellowSquare.y = -25;
            reward.addChild(yellowSquare);

            reward.x = x;
            reward.y = groundY-y;

            game.addGameItem(reward);
            reward.velocityX = -1;

            reward.onPlayerCollision = function() {
                game.changeIntegrity(30);
                game.fadeOut();
            }
        }
        // DO NOT EDIT CODE BELOW HERE
    }
};

// DON'T REMOVE THIS CODE //////////////////////////////////////////////////////
if((typeof process !== 'undefined') &&
    (typeof process.versions.node !== 'undefined')) {
    // here, export any references you need for tests //
    module.exports = level01;
}
