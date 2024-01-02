/**
 * amount of time starting out before players lose
 */
export const StartTimeSeconds = 60;

/**
 * amount of time starting out before players lose, in milliseconds. Modify the StartTimeSeconds in `logicConfig.ts` instead of this value
 */
export const StartTimeLeftMilliseconds = StartTimeSeconds * 1000;

/**
 * how many times the players must build the current hint before it leaves
 */
export const HintRepeatCount = 3;
