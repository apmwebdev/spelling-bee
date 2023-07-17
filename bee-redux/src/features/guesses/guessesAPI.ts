import { GuessesFormat } from "./guessesSlice"

const getGuessesSampleData = (
  userId: number,
  puzzleId: string,
): GuessesFormat => {
  const result = guessesSampleData.find(
    (el) => el.puzzleId === puzzleId && el.userId === userId,
  )
  if (result) {
    return result
  }
  return {
    userId: 0,
    puzzleId: "not found",
    guesses: [],
  }
}

export const guessesSampleData: GuessesFormat[] = [
  {
    userId: 0,
    puzzleId: "1234",
    guesses: [
      {
        word: "mouthed",
        timestamp: 0,
        isAnswer: true,
      },
      {
        word: "dehm",
        timestamp: 1,
        isAnswer: false,
      },
      {
        word: "deem",
        timestamp: 2,
        isAnswer: true,
      },
      {
        word: "motu",
        timestamp: 3,
        isAnswer: false,
      },
      {
        word: "deemed",
        timestamp: 4,
        isAnswer: true,
      },
      {
        word: "demo",
        timestamp: 5,
        isAnswer: true,
      },
      {
        word: "demoed",
        timestamp: 6,
        isAnswer: true,
      },
      {
        word: "demote",
        timestamp: 7,
        isAnswer: true,
      },
      {
        word: "demoted",
        timestamp: 8,
        isAnswer: true,
      },
      {
        word: "dome",
        timestamp: 9,
        isAnswer: true,
      },
      {
        word: "domed",
        timestamp: 10,
        isAnswer: true,
      },
      {
        word: "doom",
        timestamp: 11,
        isAnswer: true,
      },
      {
        word: "doomed",
        timestamp: 12,
        isAnswer: true,
      },
      {
        word: "dumdum",
        timestamp: 13,
        isAnswer: true,
      },
      {
        word: "emote",
        timestamp: 14,
        isAnswer: true,
      },
      {
        word: "emoted",
        timestamp: 15,
        isAnswer: true,
      },
      {
        word: "heme",
        timestamp: 16,
        isAnswer: true,
      },
      {
        word: "hemmed",
        timestamp: 17,
        isAnswer: true,
      },
      {
        word: "home",
        timestamp: 18,
        isAnswer: true,
      },
      {
        word: "homed",
        timestamp: 19,
        isAnswer: true,
      },
    ],
    // includes(searchTerm: string) {
    //   return (
    //     this &&
    //     this.guesses &&
    //     this.guesses.some(
    //       (guessObject: GuessFormat) => guessObject.word === searchTerm,
    //     )
    //   )
    // },
  },
]

export function fetchGuesses(
  userId: number,
  puzzleId: string,
): Promise<{ data: GuessesFormat }> {
  return new Promise<{ data: GuessesFormat }>((resolve) => {
    return setTimeout(
      () => resolve({ data: getGuessesSampleData(userId, puzzleId) }),
      500,
    )
  })
}
