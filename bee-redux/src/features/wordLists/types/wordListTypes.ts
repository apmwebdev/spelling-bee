/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { SortOrderKeys } from "@/types/globalTypes";

//TODO: Find a consistent format for enums. Having the keys and values be equal is probably best.
/** Sort word list alphabetically or chronologically in the order the words were found */
export enum SortType {
  Alphabetical = "alphabetical",
  FoundOrder = "foundOrder",
}

/** All word lists have these settings */
export type WordListBaseSettings = {
  /** Sort words in ascending order ("asc") or descending order ("desc") */
  sortOrder: SortOrderKeys;
  /** Only show known words beginning with certain letters */
  letterFilter: string[];
  /** Whether the settings for this word list are expanded or collapsed */
  settingsCollapsed: boolean;
};

export type KnownWordsSettingsFormat = WordListBaseSettings & {
  /** Can be sorted either alphabetically or in the order that the words were guessed/revealed */
  sortType: SortType;
  /** Show the total number of answers in the puzzle in the status */
  wordsShowTotal: boolean;
  /** Show the total number of pangrams in the puzzle in the status */
  pangramsShowTotal: boolean;
  /** Show the number of known perfect pangrams (separate from all pangrams) */
  showPerfectPangrams: boolean;
  /** Show the total number of perfect pangrams in the puzzle. Only relevant if
   * showPerfectPangrams is true. */
  perfectPangramsShowTotal: boolean;
};

export type WrongGuessesSettingsFormat = WordListBaseSettings & {
  /** Can be sorted either alphabetically or in the order that the words were guessed */
  sortType: SortType;
};

export type ExcludedWordsSettingsFormat = WordListBaseSettings & {
  /** Can only be sorted alphabetically. This setting is just here for compatibility. */
  sortType: SortType.Alphabetical;
};

export type AnswerListSettingsFormat = WordListBaseSettings & {
  /** Can only be sorted alphabetically. This setting is just here for compatibility. */
  sortType: SortType.Alphabetical;
  /** Whether to hide (true) or show (false) already guessed answers */
  remainingAndSpoiledOnly: boolean;
  /** For remaining answers, should the spoiler show the first letter of the answer? */
  remainingRevealFirstLetter: boolean;
  /** For remaining answers, should the spoiler show the length of the answer? */
  remainingRevealLength: boolean;
  /** For remaining answers, should they be grouped all together or mixed in with known answers?
   * True = mixed in with known answers, false = grouped by themselves */
  remainingGroupWithFirstLetter: boolean;
  /** For remaining answers, should they be grouped before or after the known answers? */
  remainingLocation: RemainingAnswersLocations;
};

export type WordListSettingsFormat = {
  knownWords: KnownWordsSettingsFormat;
  wrongGuesses: WrongGuessesSettingsFormat;
  excludedWords: ExcludedWordsSettingsFormat;
  answers: AnswerListSettingsFormat;
  general: {
    /** Should the word lists group their words by first letter, making it easier to see where one
     * letter ends and another begins? Applies to all tabs. */
    groupByFirstLetter: boolean;
  };
};

/** For the Answers word list, should remaining (i.e., unknown) answers be sorted before the known
 * answers, or after? */
export enum RemainingAnswersLocations {
  beginning = "beginning",
  end = "end",
}

export const isRemainingAnswersLocation = (
  toTest: any,
): toTest is RemainingAnswersLocations => {
  return toTest in RemainingAnswersLocations;
};
