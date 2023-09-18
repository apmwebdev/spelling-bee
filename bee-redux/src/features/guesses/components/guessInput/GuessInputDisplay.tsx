import { useAppSelector } from "@/app/hooks";
import { selectCenterLetter, selectValidLetters } from "@/features/puzzle";
import uniqid from "uniqid";

export function GuessInputDisplay({
  guessValue,
  additionalCssClasses,
}: {
  guessValue: string;
  additionalCssClasses: string;
}) {
  const validLetters = useAppSelector(selectValidLetters);
  const centerLetter = useAppSelector(selectCenterLetter);

  const letterClasses = (letter: string) => {
    let classList = "sb-guess-input-letter";
    if (centerLetter === letter) {
      return (classList += " center-letter");
    }
    if (validLetters.includes(letter)) {
      return (classList += " valid");
    }
    return (classList += " invalid");
  };

  const containerClasses = (
    guessValue: string,
    additionalCssClasses: string,
  ) => {
    let classList = `sb-guess-input ${additionalCssClasses}`;
    if (guessValue.length > 0) {
      classList += " non-empty";
    }
    return classList;
  };

  const content = (guessValue: string) => {
    const guessArr = guessValue.split("");
    return guessArr.map((letter) => (
      <span key={uniqid()} className={letterClasses(letter)}>
        {letter}
      </span>
    ));
  };

  return (
    <div
      id="sb-guess-input"
      className={containerClasses(guessValue, additionalCssClasses)}
    >
      {content(guessValue)}
    </div>
  );
}
