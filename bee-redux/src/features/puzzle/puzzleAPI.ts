import { BlankPuzzle, PuzzleFormat } from "./puzzleSlice"

// const getPerfectPangrams = (puzzle: PuzzleFormat) => {
//   return puzzle.pangrams.filter((pangram) => {
//     return (
//       pangram.toUpperCase().split("").sort().toString() ===
//       puzzle.validLetters.toString()
//     )
//   })
// }

const getPuzzleSampleData = (inputDate: string): PuzzleFormat => {
  const puzzle = puzzleSampleData.find((el) => el.printDate === inputDate)
  if (puzzle) {
    /* Probably just an artifact of using hardcoded dummy data, but if you
    remove the following guard condition, TypeScript will complain that the
    perfectPangrams property is read-only.
     */
    // if (puzzle.perfectPangrams.length === 0) {
    //   puzzle.perfectPangrams = getPerfectPangrams(puzzle)
    // }
    return puzzle
  }
  return BlankPuzzle
}

const puzzleSampleData: PuzzleFormat[] = [
  {
    printDate: "2023-06-20",
    centerLetter: "m",
    outerLetters: ["s", "e", "h", "o", "t", "u"],
    validLetters: ["d", "e", "h", "m", "o", "t", "u"],
    pangrams: ["mouthed"],
    perfectPangrams: ["mouthed"],
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
    printDate: "2023-07-16",
    centerLetter: "n",
    outerLetters: ["a", "d", "o", "r", "t", "u"],
    validLetters: ["n", "a", "d", "o", "r", "t", "u"],
    pangrams: ["rotunda", "turnaround"],
    perfectPangrams: ["rotunda"],
    answers: [
      "adorn",
      "annotator",
      "anon",
      "around",
      "arrant",
      "aunt",
      "darn",
      "daunt",
      "donor",
      "donut",
      "dunno",
      "naan",
      "nada",
      "nana",
      "narrator",
      "natant",
      "nonart",
      "noon",
      "notator",
      "noun",
      "onto",
      "orotund",
      "outran",
      "outrun",
      "radon",
      "rand",
      "rando",
      "rant",
      "rattan",
      "roan",
      "rondo",
      "rotund",
      "rotunda",
      "round",
      "runaround",
      "runout",
      "runt",
      "tandoor",
      "tantara",
      "tantra",
      "tartan",
      "taunt",
      "toon",
      "torn",
      "tornado",
      "truant",
      "tuna",
      "tundra",
      "turn",
      "turnaround",
      "turnout",
      "udon",
      "undo",
      "unto",
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
