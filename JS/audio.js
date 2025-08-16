// This gets and loads all of the sounds for the game
const soundMove = new Audio("https://s3.csh.rit.edu/devmaze-audio/blip_sound_effect.mp3");
const soundError = new Audio("https://s3.csh.rit.edu/devmaze-audio/error_sound_effect.mp3");
const soundGenerate = new Audio("https://s3.csh.rit.edu/devmaze-audio/item_sound_effect.mp3");
const soundFireworks = new Audio("https://s3.csh.rit.edu/devmaze-audio/fireworks_sound_effect.mp3");
const soundComplete = new Audio("https://s3.csh.rit.edu/devmaze-audio/upgrade_sound_effect.mp3");
const soundRestart = new Audio("https://s3.csh.rit.edu/devmaze-audio/congrats_sound_effect.mp3");
soundMove.load();
soundError.load();
soundGenerate.load();
soundFireworks.load();
soundComplete.load();
soundRestart.load();

/**
 * This plays the sound when the player moves freely.
 */
export function playMove() {
    if (!soundMove.paused) soundMove.pause();
    soundMove.currentTime = 0;
    soundMove.play();
}

/**
 * This plays the error sound when the player tries to move into a wall.
 */
export function playError() {
    if (!soundError.paused) soundError.pause();
    soundError.currentTime = 0;
    soundError.play();
}

/**
 * This plays the sound when the maze is generated.
 */
export function playGenerate() {
    if (!soundGenerate.paused) soundGenerate.pause();
    soundGenerate.currentTime = 0;
    soundGenerate.play();
}

/**
 * This plays fireworks for the player when they complete the maze.
 */
export function playFireworks() {
    if (!soundFireworks.paused) soundFireworks.pause();
    soundFireworks.currentTime = 0;
    soundFireworks.play();
    soundFireworks.loop = true;
}

/**
 * This plays the sound when the player completes the maze.
 */
export function playComplete() {
    if (!soundComplete.paused) soundComplete.pause();
    soundComplete.currentTime = 0;
    soundComplete.play();
}

/**
 * This plays the sound when the player returns from the completed screen.
 */
export function playRestart() {
    if (!soundRestart.paused) soundRestart.pause();
    soundRestart.currentTime = 0;
    soundRestart.play();
}

/**
 * This stops the fireworks and completion sounds.
 */
export function stopFinishSounds() {
    if (!soundFireworks.paused) soundFireworks.pause();
    soundFireworks.currentTime = 0;
    if (!soundComplete.paused) soundComplete.pause();
    soundComplete.currentTime = 0;
}
