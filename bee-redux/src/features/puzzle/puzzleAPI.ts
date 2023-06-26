export interface PuzzleFormat {
  printDate: string
  centerLetter: string
  outerLetters: string[]
  validLetters: string[]
  pangrams: string[]
  answers: string[]
}

const getPuzzleSampleData = (inputDate: string): PuzzleFormat | undefined => {
  return puzzleSampleData.find((el) => el.printDate === inputDate)
}

const puzzleSampleData: PuzzleFormat[] = [
  {
    printDate: "2023-06-20",
    centerLetter: "M",
    outerLetters: ["D", "E", "H", "O", "T", "U"],
    validLetters: ["D", "E", "H", "M", "O", "T", "U"],
    pangrams: ["mouthed"],
    answers: [
      "mouthed",
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
): Promise<{ data: PuzzleFormat | undefined }> {
  return new Promise<{ data: PuzzleFormat | undefined }>((resolve) => {
    return setTimeout(
      () => resolve({ data: getPuzzleSampleData(dateString) }),
      500,
    )
  })
}
