import { GuessesFormat } from "./guessesSlice"

const getGuessesSampleData = (
  userId: number,
  puzzleId: string,
): GuessesFormat | undefined => {
  return guessesSampleData.find(
    (el) => el.puzzleId === puzzleId && el.userId === userId,
  )
}

export const guessesSampleData: GuessesFormat[] = [
  {
    userId: 0,
    puzzleId: "1234",
    guesses: [
      {
        word: "mouthed",
        timestamp: 0,
      },
      {
        word: "dehm",
        timestamp: 1,
      },
      {
        word: "deem",
        timestamp: 2,
      },
      {
        word: "motu",
        timestamp: 3,
      },
      {
        word: "deemed",
        timestamp: 4,
      },
    ],
  },
]

export function fetchGuesses(
  userId: number,
  puzzleId: string,
): Promise<{ data: GuessesFormat | undefined }> {
  return new Promise<{ data: GuessesFormat | undefined }>((resolve) => {
    return setTimeout(
      () => resolve({ data: getGuessesSampleData(userId, puzzleId) }),
      500,
    )
  })
}
