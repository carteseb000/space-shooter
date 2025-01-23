namespace SpriteKind {
    export const MysteryBox = SpriteKind.create()
    export const Asteroid = SpriteKind.create()
    export const AlienProjectile = SpriteKind.create()
}
function MoveBogey () {
    BogeySquare.setVelocity(0, EnemyVel)
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    scene.setBackgroundImage(assets.image`GameBG`)
    hasPlayer = true
    info.changeLifeBy(1)
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.MysteryBox, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    otherSprite.startEffect(effects.disintegrate)
    music.play(music.melodyPlayable(music.powerDown), music.PlaybackMode.UntilDone)
    sprites.destroy(otherSprite)
    if (Math.percentChance(50)) {
        GenCount += 1
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (info.life() != 0 && hasPlayer != false) {
        music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.UntilDone)
        dart = sprites.createProjectileFromSprite(assets.image`player-laser`, playerSquare, 0, -100)
    }
})
function spawnBogey (genSpeed: number) {
    for (let index = 0; index < genSpeed; index++) {
        BogeySquare = sprites.create(assets.image`Asteroid`, SpriteKind.Asteroid)
        BogeySquare.setPosition(randint(0, 160), 8)
        BogeySquare.setFlag(SpriteFlag.DestroyOnWall, true)
    }
    MoveBogey()
}
function SpawnGreenAlien (num: number) {
    for (let index = 0; index < num; index++) {
        AlienSquare = sprites.create(assets.image`Alien`, SpriteKind.Enemy)
        AlienSquare.setPosition(0, randint(8, 50))
        AlienSquare.setVelocity(EnemyVel, 0)
        AlienSquare.setFlag(SpriteFlag.AutoDestroy, true)
        FireAlienLasers()
    }
}
info.onScore(10000, function () {
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
    info.changeLifeBy(1)
    GenCount += 1
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Asteroid, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.UntilDone)
    scene.cameraShake(4, 500)
    sprite.startEffect(effects.fire, 200)
    info.changeLifeBy(-1)
})
function SpawnMysterySupplyDrop (otherSprite: Sprite) {
    MysteryBoxSprite = sprites.create(assets.image`MysteryBox`, SpriteKind.MysteryBox)
    MysteryBoxSprite.x = otherSprite.x
    MysteryBoxSprite.y = otherSprite.y
    MysteryBoxSprite.setVelocity(0, 25)
    MysteryBoxSprite.setFlag(SpriteFlag.DestroyOnWall, true)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.MysteryBox, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.UntilDone)
    if (Math.percentChance(100)) {
        GenCount = 1
    }
    if (Math.percentChance(25)) {
        info.changeScoreBy(1000)
    } else if (Math.percentChance(75)) {
        info.changeLifeBy(1)
        info.changeScoreBy(10)
    }
})
function FireAlienLasers () {
    if (Math.percentChance(75)) {
        alienLaser = sprites.create(assets.image`alien-laser`, SpriteKind.AlienProjectile)
        alienLaser.setPosition(AlienSquare.x, AlienSquare.y)
        alienLaser.setVelocity(0, 100)
        alienLaser.setFlag(SpriteFlag.AutoDestroy, true)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.AlienProjectile, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.UntilDone)
    scene.cameraShake(4, 500)
    sprite.startEffect(effects.fire, 200)
    info.changeLifeBy(-1)
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    otherSprite.startEffect(effects.disintegrate)
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.UntilDone)
    sprites.destroy(otherSprite)
    if (Math.percentChance(25)) {
        SpawnMysterySupplyDrop(otherSprite)
    } else {
        info.changeScoreBy(75)
    }
})
let alienLaser: Sprite = null
let MysteryBoxSprite: Sprite = null
let AlienSquare: Sprite = null
let dart: Sprite = null
let BogeySquare: Sprite = null
let playerSquare: Sprite = null
let EnemyVel = 0
let GenCount = 0
let hasPlayer = false
scene.setBackgroundImage(assets.image`CreditScreen`)
effects.starField.startScreenEffect()
hasPlayer = false
let FPS = 1500
GenCount = 1
EnemyVel = 35
info.setScore(0)
pauseUntil(() => !(hasPlayer == false))
playerSquare = sprites.create(assets.image`player`, SpriteKind.Player)
info.changeLifeBy(-2)
playerSquare.setPosition(75, 120)
playerSquare.setStayInScreen(true)
controller.moveSprite(playerSquare, 100, 0)
game.onUpdateInterval(FPS, function () {
    if (hasPlayer != false) {
        SpawnGreenAlien(GenCount)
        spawnBogey(1)
    }
})
