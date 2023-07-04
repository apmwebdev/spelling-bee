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
        word: "MOUTHED",
        timestamp: 0,
        isAnswer: true,
      },
      {
        word: "DEHM",
        timestamp: 1,
        isAnswer: false,
      },
      {
        word: "DEEM",
        timestamp: 2,
        isAnswer: true,
      },
      {
        word: "MOTU",
        timestamp: 3,
        isAnswer: false,
      },
      {
        word: "DEEMED",
        timestamp: 4,
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
