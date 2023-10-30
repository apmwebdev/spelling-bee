import { GuessFormat } from "@/features/guesses";
import { GuessMessagesOutput } from "@/features/guesses/hooks/useGuessMessages";
import { useAppSelector } from "@/app/hooks";
import { selectCenterLetter, selectValidLetters } from "@/features/puzzle";

enum ErrorTypes {
  TooShort = "Must be at least 4 letters",
  InvalidLetter = "Contains invalid letter(s)",
  MissingCenterLetter = "Must contain center letter",
  AlreadyGuessed = "Already guessed",
  AlreadyFound = "Already found",
  AlreadySpoiled = "Already spoiled",
}

export type GuessValidationOutput = {
  validate: (guessValue: string, guesses: GuessFormat[]) => boolean;
};

const validationCurry =
  ({
    centerLetter,
    validLetters,
    messages,
  }: {
    centerLetter: string;
    validLetters: string[];
    messages: GuessMessagesOutput;
  }) =>
  (guessValue: string, guesses: GuessFormat[]) => {
    const errors: ErrorTypes[] = [];

    if (guessValue.length < 4) {
      errors.push(ErrorTypes.TooShort);
    }
    if (!guessValue.includes(centerLetter)) {
      errors.push(ErrorTypes.MissingCenterLetter);
    }
    if (
      guessValue !== "" &&
      !guessValue.match(new RegExp(`^[${validLetters.join("")}]+$`))
    ) {
      errors.push(ErrorTypes.InvalidLetter);
    }
    const matchingGuess = guesses.find(
      (guessObject) => guessObject.text === guessValue,
    );
    if (matchingGuess) {
      if (matchingGuess.isAnswer) {
        errors.push(ErrorTypes.AlreadyFound);
      } else if (matchingGuess.isSpoiled) {
        errors.push(ErrorTypes.AlreadySpoiled);
      } else {
        errors.push(ErrorTypes.AlreadyGuessed);
      }
    }
    // Update messages if there are errors
    if (errors.length > 0) {
      messages.update(errors, "error");
    }
    return errors.length === 0;
  };
export const useGuessValidation = (
  messages: GuessMessagesOutput,
): GuessValidationOutput => {
  const validLetters = useAppSelector(selectValidLetters);
  const centerLetter = useAppSelector(selectCenterLetter);

  const validate = validationCurry({ centerLetter, validLetters, messages });
  return { validate };
};
