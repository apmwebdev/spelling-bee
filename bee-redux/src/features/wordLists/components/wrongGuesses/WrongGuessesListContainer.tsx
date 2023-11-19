/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { WrongGuessesListHeader } from "./WrongGuessesListHeader";
import { WordListScroller } from "../WordListScroller";

export function WrongGuessesListContainer({
  wordList,
}: {
  wordList: string[];
}) {
  const content = () => {
    if (wordList.length === 0) {
      return <div className="WordList empty">No incorrect guesses</div>;
    }
    return (
      <div className="WordListContainer">
        <WrongGuessesListHeader />
        <WordListScroller wordList={wordList} allowPopovers={false} />
      </div>
    );
  };
  return content();
}
