namespace SpriteKind {
    export const Asteroid = SpriteKind.create()
}
let numCols = 0
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.UntilDone)
    scene.cameraShake(4, 500)
    sprite.startEffect(effects.fire, 200)
    info.changeLifeBy(-1)
})
function InitPlayer () {
    playerSquare = sprites.create(assets.image`Player`, SpriteKind.Player)
    info.setScore(0)
    info.changeLifeBy(-2)
    playerSquare.setPosition(75, 116)
    playerSquare.setStayInScreen(true)
    controller.moveSprite(playerSquare, 100, 0)
}
function InitVariables () {
    hasPlayer = false
    FPS = 1000
    AlienGenCount = 1
    Level = 0
    AlienCount = 0
    EnemyVel = 35
    maxShots = 3
}
function spawnAsteriod (numToGen: number) {
    for (let index = 0; index < numToGen; index++) {
        if (Math.percentChance(15)) {
            BogeySquare = sprites.create(assets.image`Asteroid0`, SpriteKind.Asteroid)
        } else {
            BogeySquare = sprites.create(assets.image`Asteroid`, SpriteKind.Asteroid)
        }
        BogeySquare.setPosition(randint(16, 155), 0)
        BogeySquare.setVelocity(0, EnemyVel)
        BogeySquare.setFlag(SpriteFlag.AutoDestroy, true)
    }
}
function startGame () {
    sprites.destroy(textSprite, effects.disintegrate, 500)
    sprites.destroy(textSprite2, effects.disintegrate, 500)
    sprites.destroy(textSprite3, effects.disintegrate, 500)
    music.play(music.melodyPlayable(music.beamUp), music.PlaybackMode.InBackground)
    scene.setBackgroundImage(assets.image`GameBG`)
    hasPlayer = true
    info.changeLifeBy(1)
    InitPlayer()
}
function moveAsteriod () {
    for (let value of sprites.allOfKind(SpriteKind.Asteroid)) {
        value.y += 4
        if (value.y > scene.screenHeight() - value.height / 2) {
            game.gameOver(false)
        }
    }
}
function SpawnGreenAlien () {
    AsteroidShiftAmt = -4
    aliensMoveLeft = 1
    AlienSquare = sprites.create(assets.image`Alien`, SpriteKind.Enemy)
    AlienSquare.setPosition(16, randint(0, 50))
    AlienCount += 1
    moveAliens()
    calcNextAlienMove()
}
function moveAliens () {
    sprite_list = sprites.allOfKind(SpriteKind.Enemy)
    aliensMoveDown = 0
    for (let index2 = 0; index2 <= numCols; index2++) {
        if (index2 < sprite_list.length) {
            if (aliensMoveLeft == 1 && sprite_list[index2].x <= AsteroidShiftAmt) {
                aliensMoveDown = 1
            } else if (aliensMoveLeft == 0 && sprite_list[index2].x >= scene.screenWidth() - AsteroidShiftAmt) {
                aliensMoveDown = 1
            }
        }
    }
    if (aliensMoveDown == 1) {
        aliensMoveLeft = 1 - aliensMoveLeft
        moveAlienDown()
    } else {
        if (aliensMoveLeft == 1) {
            alienDelta = 0 - AsteroidShiftAmt
        } else {
            alienDelta = AsteroidShiftAmt
        }
        moveAlienHoriz()
    }
}
function moveAlienHoriz () {
    for (let value2 of sprites.allOfKind(SpriteKind.Enemy)) {
        value2.x += alienDelta
    }
}
info.onScore(5000, function () {
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
    info.changeLifeBy(1)
})
function moveAlienDown () {
    for (let value3 of sprites.allOfKind(SpriteKind.Enemy)) {
        value3.y += 4
        if (value3.y > scene.screenHeight() - value3.height / 2) {
            game.gameOver(false)
        }
    }
}
function calcNextAlienMove () {
    let currAlienPause = 0
    nextAlienMove = game.runtime() + currAlienPause
}
function SpawnMysterySupplyDrop (otherSprite: Sprite) {
    MysteryBoxSprite = sprites.create(assets.image`MysteryBox`, SpriteKind.Player)
    MysteryBoxSprite.x = otherSprite.x
    MysteryBoxSprite.y = otherSprite.y
    MysteryBoxSprite.setVelocity(0, 25)
    MysteryBoxSprite.setFlag(SpriteFlag.AutoDestroy, true)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Asteroid, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.InBackground)
    scene.cameraShake(4, 500)
    sprite.startEffect(effects.fire, 200)
    info.changeLifeBy(-1)
})
function FireAlienLasers (amount: number) {
    for (let index = 0; index < amount; index++) {
        if (Math.percentChance(50)) {
            alienLaser = sprites.create(assets.image`alien-laser`, SpriteKind.Player)
            alienLaser.setPosition(AlienSquare.x, AlienSquare.y)
            alienLaser.setVelocity(0, 100)
            alienLaser.setFlag(SpriteFlag.AutoDestroy, true)
        }
    }
}
function InitCreditScreen () {
    textSprite = textsprite.create("Infinite Space Shooter", 0, 5)
    textSprite.setPosition(scene.screenWidth() / 2, 16)
    textSprite2 = textsprite.create("Press any button to start", 0, 5)
    textSprite2.setPosition(scene.screenWidth() / 2, scene.screenHeight() / 2)
    textSprite3 = textsprite.create("the game.", 0, 5)
    textSprite3.setPosition(scene.screenWidth() / 2, scene.screenHeight() / 2 + 8)
    effects.starField.startScreenEffect()
    music.play(music.createSong(assets.song`mySong`), music.PlaybackMode.LoopingInBackground)
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Asteroid, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    otherSprite.startEffect(effects.disintegrate)
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.InBackground)
    sprites.destroy(otherSprite)
    info.changeScoreBy(25)
})
function nuke () {
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    Level += 1
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (info.life() != 0 && hasPlayer != false && sprites.allOfKind(SpriteKind.Projectile).length < maxShots) {
        music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.InBackground)
        dart = sprites.createProjectileFromSprite(assets.image`player-laser`, playerSquare, 0, -100)
    }
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    otherSprite.startEffect(effects.disintegrate)
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.InBackground)
    sprites.destroy(otherSprite)
    AlienCount += -1
    info.changeScoreBy(randint(0, 100))
})
function checklevel () {
    if (AlienCount == 0) {
        Level += 1
        if (Level == 1) {
            SpawnGreenAlien()
            FireAlienLasers(1)
        } else if (Level == 2) {
            SpawnGreenAlien()
            FireAlienLasers(1)
        } else if (Level == 3) {
            SpawnGreenAlien()
            FireAlienLasers(1)
        } else if (Level == 4) {
            SpawnGreenAlien()
            FireAlienLasers(1)
        } else if (Level == 5) {
            EnemyVel += 10
            SpawnGreenAlien()
            FireAlienLasers(1)
        } else {
            game.gameOver(true)
        }
    }
}
let dart: Sprite = null
let alienLaser: Sprite = null
let MysteryBoxSprite: Sprite = null
let nextAlienMove = 0
let alienDelta = 0
let aliensMoveDown = 0
let sprite_list: Sprite[] = []
let AlienSquare: Sprite = null
let aliensMoveLeft = 0
let AsteroidShiftAmt = 0
let textSprite3: TextSprite = null
let textSprite2: TextSprite = null
let textSprite: TextSprite = null
let BogeySquare: Sprite = null
let maxShots = 0
let EnemyVel = 0
let AlienCount = 0
let Level = 0
let AlienGenCount = 0
let FPS = 0
let hasPlayer = false
let playerSquare: Sprite = null
InitCreditScreen()
InitVariables()
pauseUntil(() => controller.anyButton.isPressed())
startGame()
game.onUpdateInterval(FPS, function () {
    spawnAsteriod(1)
})
