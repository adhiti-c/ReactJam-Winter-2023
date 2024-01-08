// we can change these
/**
 * amount of time starting out before players lose
 */
export const StartTimeSeconds = 5;


/**
 * how many times the players must build the current hint before it leaves
 */
export const HintRepeatCount = 1;

/**
 * amount of time to increase in seconds upon a successful combo
 */
export const FlatTimeIncreaseOnComboSeconds = 5;

/**
 * number of seconds to decrease when the players place a wrong ingredient
 */
export const FlatTimePenaltySeconds = 5;

/**
 * show the streak feedback every x successes
 */
export const StreakFeedbackFrequency = 3;

/**
 * building something gives you 1 score per ingredient (PlacableIngredient). Multiply this amount for bigger numbers
 * ex: a basic_cake is worth 4 since it's made of [(eggs, flour), (butter, sugar)], or 4 atomic ingredients (PlacableIngredient)
 * we can multiply this amount by this score multiplier
 */
export const ScoreMultiplier = 1;


// ----------- Don't touch these ------------

/**
 * amount of time starting out before players lose, in milliseconds. Modify the StartTimeSeconds in `logicConfig.ts` instead of this value
 */
export const StartTimeLeftMilliseconds = StartTimeSeconds * 1000;

export const FlatTimeIncreaseOnComboMilliseconds = FlatTimeIncreaseOnComboSeconds * 1000;

export const FlatTimePenaltyMilliseconds = FlatTimePenaltySeconds * 1000;
