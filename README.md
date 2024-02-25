# README

Welcome to Super Spelling Bee! To see the live version of the app, go to [superspellingbee.com](https://superspellingbee.com).

This is an enhanced version of the New York Times' [Spelling Bee](https://www.nytimes.com/puzzles/spelling-bee) game, combining the functionality of the game itself with NYT’s [Spelling Bee Buddy](https://www.nytimes.com/interactive/2023/upshot/spelling-bee-buddy.html) hint page and Spelling Bee archive/info sites like [SBSolver](https://www.sbsolver.com/), plus additional custom functionality.

The purpose of this project is to create a version of Spelling Bee with live-updating hints and powerful configuration options.

It was built with Postgres and Ruby on Rails on the back end and React + Redux on the front end.

## Features
The puzzle has all the expected functionality of existing spelling bee games, including scoring and ranking, a found words list, highlighted pangrams and perfect pangrams, and controls that can be used by either keyboard or touch/click.

### Live-Updating Hints
Each puzzle has a Hints section with different hint panels that (optionally) update as new words are found. Each hint panel has detailed configuration options to customize how the hints are presented. The different hint panel types are as follows:
1. **Letter Hints:** Lists the different starting (or ending) letter combinations for words in the puzzle. The data shown for each letter combination can be further customized to show the number of total, found, and/or remaining words for each letter combination, optionally divided by word length.
2. **Search Hints:** Similar to letter hints, but allows you to search for a specific letter combination among puzzle words.
3. **Obscurity Hints:** Shows how "obscure" each word in the puzzle is, measured by how often the word shows up in the combined text of all books in Google Books. Obscurity data is pulled from the [Datamuse API](https://www.datamuse.com/api/).
4. **Definition Hints:** Shows definition hints for each word. Currently, definition hints use the literal dictionary definitions, although the functionality for generating hint definitions using OpenAI's API is nearly complete. See [issue #113](https://github.com/apmwebdev/spelling-bee/issues/113).

### Detailed Status Information
Status information includes data about the user's progress on the current puzzle, like the number of found words in the puzzle, the current score, and the current rank. Status data tracked includes:
- Found and total words
- Found and total points
- Completion percentage of the puzzle
- Rank information
  - Current rank name, point threshold, and percentage threshold
  - Next rank name, point threshold, and percentage threshold
  - Points until the next rank

### Spoiled Words
Allows users to reveal specific answers for the puzzle instead of guessing them. Spoiled words are tracked separately from found words and don't contribute to the user's score or rank.

### Word Lists
Shows sortable word lists for the puzzle, including:
- **Known Words:** Shows words that have been correctly guessed by the user ("found words") and words the user has spoiled. Also highlights pangrams and perfect pangrams.
- **Wrong Guesses:** Tracks guesses the user has made that were incorrect. Allows you to check if you've already made a particular guess if you're not sure.
- **Excluded Words:** Each puzzle's answers do not include every dictionary word that uses only the puzzle's letters. The excluded words list shows the dictionary words that were not included in the puzzle's answers.
- **Answers:** Lists the puzzle answers. Answers that aren't yet known to the user are not shown in their entirety, with only their first letter and length being shown by default. Unknown answers can be clicked on to spoil them.

### Multiple Attempts per Puzzle
Each puzzle can be attempted more than once, with the status, word lists, hints, etc. being reset and tracked separately for each attempt.

### Current and Past Puzzles
New puzzles are added automatically when they're released, and all past puzzles are available.

## Tech Stack
### Back End
- Framework: [Ruby on Rails](https://rubyonrails.org/) in [API mode](https://guides.rubyonrails.org/api_app.html)
- Database: [PostgreSQL](https://www.postgresql.org/)
- Testing: [RSpec](https://rspec.info/), along with [WebMock](https://github.com/bblimke/webmock) and [VCR](https://github.com/vcr/vcr).
- Documentation: [YARD](https://yardoc.org/)
- Deployment: [Capistrano](https://capistranorb.com/)

### Front End
The front end is a single page application (SPA) using [React](https://react.dev/), written in [TypeScript](https://www.typescriptlang.org/). Other prominent front end technologies include:
- [Vite](https://vitejs.dev/): Build tool
- [Redux (Toolkit)](https://redux-toolkit.js.org/): State management
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview): Data fetching/caching
- [React Router](https://reactrouter.com/en/main): Routing
- [Dexie](https://dexie.org/): IndexedDB API 
- [Vitest](https://vitest.dev/): Testing
- [JSDoc](https://jsdoc.app/): Documentation
- [SASS](https://sass-lang.com/): Styling
- [Radix UI Primitives](https://www.radix-ui.com/primitives): Headless UI component library
