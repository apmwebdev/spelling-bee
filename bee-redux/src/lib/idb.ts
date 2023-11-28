import Dexie, { Table } from "dexie";
import { GuessFormat } from "@/features/guesses";
import { AttemptFormat } from "@/features/userPuzzleAttempts/types";
import { SearchPanelSearchData } from "@/features/searchPanelSearches";

export class SsbDexie extends Dexie {
  attempts!: Table<AttemptFormat>;
  guesses!: Table<GuessFormat>;
  searchPanelSearches!: Table<SearchPanelSearchData>;

  constructor() {
    super("ssb");
    this.version(1).stores({
      attempts: "&uuid, puzzleId",
      guesses: "&uuid, attemptUuid, &[attemptUuid+text]",
      searchPanelSearches: "&uuid, attemptUuid, searchPanelId",
    });
  }
}

export const idb = new SsbDexie();
