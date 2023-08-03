import { BlankPuzzle, PuzzleFormat, PuzzleState } from "./puzzleSlice";

// const getPuzzleSampleData = (inputDate: string): PuzzleFormat => {
//   const puzzle = puzzleSampleData.find((el) => el.printDate === inputDate)
//   if (puzzle) {
//     return puzzle
//   }
//   return BlankPuzzle
// }

// const puzzleSampleData: PuzzleFormat[] = [
//   {
//     date: "2023-06-20",
//     centerLetter: "m",
//     outerLetters: ["d", "e", "h", "o", "t", "u"],
//     validLetters: ["d", "e", "h", "m", "o", "t", "u"],
//     pangrams: ["mouthed"],
//     perfectPangrams: ["mouthed"],
//     answers: [
//       "deem",
//       "deemed",
//       "demo",
//       "demoed",
//       "demote",
//       "demoted",
//       "dome",
//       "domed",
//       "doom",
//       "doomed",
//       "dumdum",
//       "emote",
//       "emoted",
//       "heme",
//       "hemmed",
//       "home",
//       "homed",
//       "hummed",
//       "meet",
//       "meme",
//       "memed",
//       "memo",
//       "mete",
//       "meted",
//       "meth",
//       "method",
//       "mode",
//       "modem",
//       "mood",
//       "mooed",
//       "moot",
//       "mooted",
//       "mote",
//       "motet",
//       "moth",
//       "motto",
//       "moue",
//       "mouth",
//       "mouthed",
//       "mute",
//       "muted",
//       "mutt",
//       "muumuu",
//       "odeum",
//       "outmode",
//       "outmoded",
//       "teem",
//       "teemed",
//       "them",
//       "theme",
//       "themed",
//       "tome",
//       "totem",
//     ],
//   },
//   {
//     date: "2023-07-16",
//     centerLetter: "n",
//     outerLetters: ["a", "d", "o", "r", "t", "u"],
//     validLetters: ["a", "d", "n", "o", "r", "t", "u"],
//     pangrams: ["rotunda", "turnaround"],
//     perfectPangrams: ["rotunda"],
//     answers: [
//       "adorn",
//       "annotator",
//       "anon",
//       "around",
//       "arrant",
//       "aunt",
//       "darn",
//       "daunt",
//       "donor",
//       "donut",
//       "dunno",
//       "naan",
//       "nada",
//       "nana",
//       "narrator",
//       "natant",
//       "nonart",
//       "noon",
//       "notator",
//       "noun",
//       "onto",
//       "orotund",
//       "outran",
//       "outrun",
//       "radon",
//       "rand",
//       "rando",
//       "rant",
//       "rattan",
//       "roan",
//       "rondo",
//       "rotund",
//       "rotunda",
//       "round",
//       "runaround",
//       "runout",
//       "runt",
//       "tandoor",
//       "tantara",
//       "tantra",
//       "tartan",
//       "taunt",
//       "toon",
//       "torn",
//       "tornado",
//       "truant",
//       "tuna",
//       "tundra",
//       "turn",
//       "turnaround",
//       "turnout",
//       "udon",
//       "undo",
//       "unto",
//     ],
//   },
// ]

const API_URL = "http://localhost:3000/api/v1/";

export async function fetchPuzzle(identifier: string) {
  return fetch(`${API_URL}/puzzles/${identifier}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error: ", error);
      return BlankPuzzle;
    });
}

// export function fetchPuzzleOld(
//   identifier: string,
// ): Promise<{ data: PuzzleFormat }> {
//   return new Promise<{ data: PuzzleFormat }>((resolve) => {
//     return setTimeout(
//       () => resolve({ data: getPuzzleSampleData(identifier) }),
//       500,
//     )
//   })
// }
