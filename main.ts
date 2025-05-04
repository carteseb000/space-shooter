namespace SpriteKind {
    export const Asteroid = SpriteKind.create()
}
let numCols = 0
function spawnAsteriod (numToGen: number) {
    for (let index = 0; index < numToGen; index++) {
        if (Math.percentChance(15)) {
            BogeySquare = sprites.create(assets.image`Asteroid0`, SpriteKind.Asteroid)
        } else {
            BogeySquare = sprites.create(assets.image`Asteroid`, SpriteKind.Asteroid)
        }
        BogeySquare.setPosition(randint(16, 155), 0)
        BogeySquare.setFlag(SpriteFlag.AutoDestroy, true)
    }
    moveAsteriod()
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    scene.setBackgroundImage(assets.image`GameBG`)
    hasPlayer = true
    info.changeLifeBy(1)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (info.life() != 0 && hasPlayer != false && sprites.allOfKind(SpriteKind.Projectile).length < maxShots) {
        music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.UntilDone)
        dart = sprites.createProjectileFromSprite(assets.image`player-laser`, playerSquare, 0, -100)
    }
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Asteroid, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    otherSprite.startEffect(effects.disintegrate)
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.UntilDone)
    sprites.destroy(otherSprite)
    info.changeScoreBy(randint(0, 10))
})
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
info.onScore(10000, function () {
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
    info.changeLifeBy(1)
})
function moveAliens () {
    sprite_list = sprites.allOfKind(SpriteKind.Enemy)
    aliensMoveDown = 0
    for (let index = 0; index <= numCols; index++) {
        if (index < sprite_list.length) {
            if (aliensMoveLeft == 1 && sprite_list[index].x <= AsteroidShiftAmt) {
                aliensMoveDown = 1
            } else if (aliensMoveLeft == 0 && sprite_list[index].x >= scene.screenWidth() - AsteroidShiftAmt) {
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
sprites.onOverlap(SpriteKind.Player, SpriteKind.Asteroid, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.UntilDone)
    scene.cameraShake(4, 500)
    sprite.startEffect(effects.fire, 200)
    info.changeLifeBy(-1)
})
function moveAlienHoriz () {
    for (let value of sprites.allOfKind(SpriteKind.Enemy)) {
        value.x += alienDelta
    }
}
function moveAlienDown () {
    for (let value of sprites.allOfKind(SpriteKind.Enemy)) {
        value.y += 4
        if (value.y > scene.screenHeight() - value.height / 2) {
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
function nuke () {
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    Level += 1
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    otherSprite.startEffect(effects.disintegrate)
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.UntilDone)
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
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.UntilDone)
    scene.cameraShake(4, 500)
    sprite.startEffect(effects.fire, 200)
    info.changeLifeBy(-1)
})
let alienLaser: Sprite = null
let MysteryBoxSprite: Sprite = null
let nextAlienMove = 0
let alienDelta = 0
let aliensMoveDown = 0
let sprite_list: Sprite[] = []
let AlienSquare: Sprite = null
let aliensMoveLeft = 0
let AsteroidShiftAmt = 0
let dart: Sprite = null
let BogeySquare: Sprite = null
let maxShots = 0
let playerSquare: Sprite = null
let AlienCount = 0
let Level = 0
let hasPlayer = false
scene.setBackgroundImage(assets.image`CreditScreen`)
effects.starField.startScreenEffect()
hasPlayer = false
let FPS = 1500
let AlienGenCount = 1
Level = 0
AlienCount = 0
let EnemyVel = 35
info.setScore(0)
pauseUntil(() => hasPlayer != false)
playerSquare = sprites.create(assets.image`Player`, SpriteKind.Player)
maxShots = 3
info.changeLifeBy(-2)
playerSquare.setPosition(75, 116)
playerSquare.setStayInScreen(true)
controller.moveSprite(playerSquare, 100, 0)
game.onUpdateInterval(FPS, function () {
    spawnAsteriod(1)
})
