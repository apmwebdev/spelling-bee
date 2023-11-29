import Dexie, { Table } from "dexie";
import { GuessFormat } from "@/features/guesses";
import { AttemptFormat } from "@/features/userPuzzleAttempts/types";
import { SearchPanelSearchData } from "@/features/searchPanelSearches";
import { HintProfileData } from "@/features/hintProfiles";
import { HintPanelData } from "@/features/hintPanels";

export class SsbDexie extends Dexie {
  attempts!: Table<AttemptFormat>;
  guesses!: Table<GuessFormat>;
  hintProfiles!: Table<HintProfileData>;
  hintPanels!: Table<HintPanelData>;
  searchPanelSearches!: Table<SearchPanelSearchData>;

  constructor() {
    super("ssb");
    this.version(1).stores({
      attempts: "&uuid, puzzleId",
      hintProfiles: "&[type+uuid]",
      hintPanels: "&uuid, [hintProfileType+hintProfileUuid]",
      guesses: "&uuid, attemptUuid, &[text+attemptUuid]",
      searchPanelSearches: "&uuid, attemptUuid, searchPanelUuid",
    });
  }
}

export const idb = new SsbDexie();
