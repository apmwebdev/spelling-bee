import { apiSlice } from "../api/apiSlice";
import { RootState } from "@/app/store";
import {
  AttemptFormat,
  GuessFormat,
  GuessFormData,
  RawAttemptFormat,
  RawGuessFormat,
} from "./guessesSlice";
import { selectAnswerWords, selectExcludedWords } from "../puzzle/puzzleSlice";

const processGuess = (
  { attemptId, text, isSpoiled, createdAt }: RawGuessFormat,
  state: RootState,
): GuessFormat => {
  const answerWords = selectAnswerWords(state);
  const isAnswer = answerWords.includes(text);
  let isExcluded = false;
  if (!isAnswer) {
    const excludedWords = selectExcludedWords(state);
    isExcluded = excludedWords.includes(text);
  }
  return {
    attemptId,
    text,
    isSpoiled,
    createdAt: Date.parse(createdAt),
    isAnswer,
    isExcluded,
  };
};

const processAttempts = (rawAttempts: RawAttemptFormat[], state: RootState) => {
  const processedAttempts: AttemptFormat[] = [];
  for (const attempt of rawAttempts) {
    processedAttempts.push({
      id: attempt.id,
      puzzleId: attempt.puzzleId,
      guesses: attempt.guesses.map((guess) => processGuess(guess, state)),
    });
  }
  return processedAttempts;
};

export const guessesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttempts: builder.query({
      query: (puzzleId) => ({
        url: `/user_puzzle_attempts/${puzzleId}`,
      }),
    }),
    getCurrentAttempts: builder.query<AttemptFormat[], void>({
      queryFn: async (_args, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const puzzleId = state.puzzle.data.id;
        if (puzzleId === 0) {
          return { error: { status: 404, data: "No puzzle loaded" } };
        }
        const { data } = await baseQuery(
          `/user_puzzle_attempts_for_puzzle/${puzzleId}`,
        );
        return { data: processAttempts(data as RawAttemptFormat[], state) };
      },
    }),
    addAttempt: builder.mutation({
      query: () => ({
        url: "/user_puzzle_attempts/",
        method: "POST",
        body: {},
      }),
    }),
    deleteAttempt: builder.mutation({
      query: (attemptId: number) => ({
        url: `/user_puzzle_attempts/${attemptId}`,
        method: "DELETE",
      }),
    }),
    addGuess: builder.mutation<GuessFormat, GuessFormData>({
      queryFn: async (
        guessData: GuessFormData,
        api,
        _extraOptions,
        baseQuery,
      ) => {
        const state = api.getState() as RootState;
        const { data } = await baseQuery({
          url: "/guesses",
          method: "POST",
          body: guessData,
        });
        return { data: processGuess(data as RawGuessFormat, state) };
      },
    }),
  }),
});

export const {
  useAddAttemptMutation,
  useDeleteAttemptMutation,
  useLazyGetCurrentAttemptsQuery,
  useAddGuessMutation,
} = guessesApiSlice;
