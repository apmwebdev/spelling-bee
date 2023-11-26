import Dexie, { Table } from "dexie";
import { AttemptFormat, GuessFormat } from "@/features/guesses";

export class SsbDexie extends Dexie {
  attempts!: Table<AttemptFormat>;
  guesses!: Table<GuessFormat>;

  constructor() {
    super("ssb");
    this.version(1).stores({
      attempts: "&uuid, puzzleId",
      guesses: "&uuid, attemptUuid, &[attemptUuid+text]",
    });
  }
}

export const idb = new SsbDexie();
