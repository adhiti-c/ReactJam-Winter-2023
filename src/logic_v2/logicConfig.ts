// we can change these
/**
 * amount of time starting out before players lose
 */
export const StartTimeSeconds = 60;


/**
 * how many times the players must build the current hint before it leaves
 */
export const HintRepeatCount = 3;

/**
 * amount of time to increase in seconds upon a successful combo
 */
export const FlatTimeIncreaseOnComboSeconds = 1;


// ----------- Don't touch these ------------

/**
 * amount of time starting out before players lose, in milliseconds. Modify the StartTimeSeconds in `logicConfig.ts` instead of this value
 */
export const StartTimeLeftMilliseconds = StartTimeSeconds * 1000;

export const FlatTimeIncreaseOnComboMilliseconds = FlatTimeIncreaseOnComboSeconds * 1000;