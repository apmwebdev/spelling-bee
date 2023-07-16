import { BlankPuzzle, PuzzleFormat } from "./puzzleSlice"

const getPerfectPangrams = (puzzle: PuzzleFormat) => {
  return puzzle.pangrams.filter((pangram) => {
    return (
      pangram.toUpperCase().split("").sort().toString() ===
      puzzle.validLetters.toString()
    )
  })
}

const getPuzzleSampleData = (inputDate: string): PuzzleFormat => {
  const puzzle = puzzleSampleData.find((el) => el.printDate === inputDate)
  console.log(puzzle)
  if (puzzle) {
    /* Probably just an artifact of using hardcoded dummy data, but if you
    remove the following guard condition, TypeScript will complain that the
    perfectPangrams property is read-only.
     */
    if (puzzle.perfectPangrams.length === 0) {
      puzzle.perfectPangrams = getPerfectPangrams(puzzle)
    }
    return puzzle
  }
  return BlankPuzzle
}

const puzzleSampleData: PuzzleFormat[] = [
  {
    printDate: "2023-06-20",
    centerLetter: "M",
    outerLetters: ["D", "E", "H", "O", "T", "U"],
    validLetters: ["D", "E", "H", "M", "O", "T", "U"],
    pangrams: ["mouthed"],
    perfectPangrams: [],
    answers: [
      "deem",
      "deemed",
      "demo",
      "demoed",
      "demote",
      "demoted",
      "dome",
      "domed",
      "doom",
      "doomed",
      "dumdum",
      "emote",
      "emoted",
      "heme",
      "hemmed",
      "home",
      "homed",
      "hummed",
      "meet",
      "meme",
      "memed",
      "memo",
      "mete",
      "meted",
      "meth",
      "method",
      "mode",
      "modem",
      "mood",
      "mooed",
      "moot",
      "mooted",
      "mote",
      "motet",
      "moth",
      "motto",
      "moue",
      "mouth",
      "mouthed",
      "mute",
      "muted",
      "mutt",
      "muumuu",
      "odeum",
      "outmode",
      "outmoded",
      "teem",
      "teemed",
      "them",
      "theme",
      "themed",
      "tome",
      "totem",
    ],
  },
  {
    printDate: "2023-06-21",
    centerLetter: "M",
    outerLetters: ["D", "E", "H", "O", "T", "U"],
    validLetters: ["D", "E", "H", "M", "O", "T", "U"],
    pangrams: ["mouthed"],
    perfectPangrams: [],
    answers: [
      "deem",
      "deemed",
      "demo",
      "demoed",
      "demote",
      "demoted",
      "dome",
      "domed",
      "doom",
      "doomed",
      "dumdum",
      "emote",
      "emoted",
      "heme",
      "hemmed",
      "home",
      "homed",
      "hummed",
      "meet",
      "meme",
      "memed",
      "memo",
      "mete",
      "meted",
      "meth",
      "method",
      "mode",
      "modem",
      "mood",
      "mooed",
      "moot",
      "mooted",
      "mote",
      "motet",
      "moth",
      "motto",
      "moue",
      "mouth",
      "mouthed",
      "mute",
      "muted",
      "mutt",
      "muumuu",
      "odeum",
      "outmode",
      "outmoded",
      "teem",
      "teemed",
      "them",
      "theme",
      "themed",
      "tome",
      "totem",
    ],
  },
]

export function fetchPuzzle(
  dateString: string,
): Promise<{ data: PuzzleFormat }> {
  return new Promise<{ data: PuzzleFormat }>((resolve) => {
    return setTimeout(
      () => resolve({ data: getPuzzleSampleData(dateString) }),
      500,
    )
  })
}
