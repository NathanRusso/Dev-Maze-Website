// This gets and loads all of the sounds for the game
const soundMove = new Audio("https://s3.csh.rit.edu/devmaze/blip_sound_effect.mp3");
const soundError = new Audio("https://s3.csh.rit.edu/devmaze/error_sound_effect.mp3");
const soundGenerate = new Audio("https://s3.csh.rit.edu/devmaze/item_sound_effect.mp3");
const soundFireworks = new Audio("https://s3.csh.rit.edu/devmaze/fireworks_sound_effect.mp3");
const soundComplete = new Audio("https://s3.csh.rit.edu/devmaze/upgrade_sound_effect.mp3");
const soundRestart = new Audio("https://s3.csh.rit.edu/devmaze/congrats_sound_effect.mp3");
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
    soundMove.pause();
    soundMove.currentTime = 0;
    soundMove.play();
}

/**
 * This plays the error sound when the player tries to move into a wall.
 */
export function playError() {
    soundError.pause();
    soundError.currentTime = 0;
    soundError.play();
}

/**
 * This plays the sound when the maze is generated.
 */
export function playGenerate() {
    soundGenerate.pause();
    soundGenerate.currentTime = 0;
    soundGenerate.play();
}

/**
 * This plays fireworks for the player when they complete the maze.
 */
export function playFireworks() {
    soundFireworks.pause();
    soundFireworks.currentTime = 0;
    soundFireworks.play();
    soundFireworks.loop = true;
}

/**
 * This plays the sound when the player completes the maze.
 */
export function playComplete() {
    soundComplete.pause();
    soundComplete.currentTime = 0;
    soundComplete.play();
}

/**
 * This plays the sound when the player returns from the completed screen.
 */
export function playRestart() {
    soundRestart.pause();
    soundRestart.currentTime = 0;
    soundRestart.play();
}

/**
 * This stops the fireworks and completion sounds.
 */
export function stopFinishSounds() {
    soundFireworks.pause();
    soundFireworks.currentTime = 0;
    soundComplete.pause();
    soundComplete.currentTime = 0;
}
