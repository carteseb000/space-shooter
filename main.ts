function MoveBogey () {
    BogeySquare.setVelocity(0, 35)
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    scene.setBackgroundImage(assets.image`GameBG`)
    hasPlayer = true
    info.changeLifeBy(1)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (info.life() != 0 && hasPlayer != false) {
        music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.UntilDone)
        dart = sprites.createProjectileFromSprite(assets.image`PlayerLaser`, playerSquare, 0, -100)
    }
})
function spawnBogey () {
    BogeySquare = sprites.create(assets.image`Asteroid`, SpriteKind.Enemy)
    BogeySquare.setPosition(randint(0, 160), 0)
    BogeySquare.setFlag(SpriteFlag.DestroyOnWall, true)
}
info.onScore(10000, function () {
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
    info.changeLifeBy(1)
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    otherSprite.startEffect(effects.disintegrate)
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.UntilDone)
    sprites.destroy(otherSprite)
    info.changeScoreBy(150)
    if (Math.percentChance(0.25)) {
        info.changeLifeBy(1)
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.UntilDone)
    scene.cameraShake(4, 500)
    sprite.startEffect(effects.fire, 200)
    info.changeLifeBy(-1)
})
let dart: Sprite = null
let BogeySquare: Sprite = null
let playerSquare: Sprite = null
let hasPlayer = false
scene.setBackgroundImage(assets.image`CreditScreen`)
effects.starField.startScreenEffect()
hasPlayer = false
let FPS = 1500
let EnemyVel = 35
info.setScore(0)
pauseUntil(() => hasPlayer != false)
playerSquare = sprites.create(assets.image`0`, SpriteKind.Player)
info.changeLifeBy(-1)
playerSquare.setPosition(75, 120)
playerSquare.setStayInScreen(true)
controller.moveSprite(playerSquare, 100, 0)
game.onUpdateInterval(FPS, function () {
    if (hasPlayer != false) {
        spawnBogey()
        MoveBogey()
    }
})
