import {
  GuessErrorTypes,
  validationCurry,
} from "@/features/guesses/hooks/useGuessValidation";
import { GuessMessagesOutput } from "@/features/guesses/hooks/useGuessMessages";
import { vi } from "vitest";

const centerLetter = "a";
const validLetters = ["a", "b", "c", "d", "e", "f", "g"];
const messages: GuessMessagesOutput = {
  update: vi.fn(),
  value: [],
  status: "answer",
  clearMessagesTimeout: { current: null },
  clear: vi.fn(),
};

const guesses = [
  //already found
  {
    attemptId: 1,
    text: "fade",
    createdAt: 123456789,
    isSpoiled: false,
    isAnswer: true,
    isExcluded: false,
  },
  //already guessed
  {
    attemptId: 1,
    text: "fadd",
    createdAt: 123456789,
    isSpoiled: false,
    isAnswer: false,
    isExcluded: false,
  },
  //already spoiled
  {
    attemptId: 1,
    text: "faef",
    createdAt: 123456789,
    isSpoiled: true,
    isAnswer: false,
    isExcluded: false,
  },
];

const validate = validationCurry({
  centerLetter,
  validLetters,
  messages,
});

// beforeEach(() => {
//   jest.clearAllMocks();
// });

describe("validationCurry", () => {
  it("should return true when guessValue is valid and hasn't already been guessed", () => {
    const isValid = validate("aaaa", guesses);
    expect(isValid).toBe(true);
    expect(messages.update).not.toHaveBeenCalled();
  });

  it("should return false and add a TooShort error for word with length less than 4", () => {
    const isValid = validate("abe", guesses);
    expect(isValid).toBe(false);
    expect(messages.update).toHaveBeenCalledWith(
      [GuessErrorTypes.TooShort],
      "error",
    );
  });

  it("should return false and add an InvalidLetter error for word with invalid letter", () => {
    const isValid = validate("abez", guesses);
    expect(isValid).toBe(false);
    expect(messages.update).toHaveBeenCalledWith(
      [GuessErrorTypes.InvalidLetter],
      "error",
    );
  });

  it("should return false, add a MissingCenterLetter error for word missing center letter", () => {
    const isValid = validate("bbbb", guesses);
    expect(isValid).toBe(false);
    expect(messages.update).toHaveBeenCalledWith(
      [GuessErrorTypes.MissingCenterLetter],
      "error",
    );
  });

  //Already found words are answers the user has already guessed correctly
  it("should return false, add an AlreadyFound error for an already found word", () => {
    const isValid = validate("fade", guesses);
    expect(isValid).toBe(false);
    expect(messages.update).toHaveBeenCalledWith(
      [GuessErrorTypes.AlreadyFound],
      "error",
    );
  });

  //Already guessed words are incorrect guesses the user has already made
  it("should return false, add an AlreadyGuessed error for an already guessed word", () => {
    const isValid = validate("fadd", guesses);
    expect(isValid).toBe(false);
    expect(messages.update).toHaveBeenCalledWith(
      [GuessErrorTypes.AlreadyGuessed],
      "error",
    );
  });

  //Already spoiled words are answers the user has revealed without guessing
  it("should return false, add an AlreadySpoiled error for an already spoiled word", () => {
    const isValid = validate("faef", guesses);
    expect(isValid).toBe(false);
    expect(messages.update).toHaveBeenCalledWith(
      [GuessErrorTypes.AlreadySpoiled],
      "error",
    );
  });

  it("adds multiple errors if multiple validation checks fail", () => {
    const isValid = validate("zz", guesses);
    expect(isValid).toBe(false);
    expect(messages.update).toHaveBeenCalledWith(
      [
        GuessErrorTypes.TooShort,
        GuessErrorTypes.MissingCenterLetter,
        GuessErrorTypes.InvalidLetter,
      ],
      "error",
    );
  });
});