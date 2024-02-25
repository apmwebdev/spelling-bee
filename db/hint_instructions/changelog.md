# Hint Instructions Change Log
This document is for tracking changes to the hint generation instructions sent to the OpenAI API, since these changes should be tracked in version control but are stored in the database.

## Background
The OpenAI API is queried for definition hints for puzzle answers. Each API request has a list of words to generate hints for, as well as a set of instructions about how to generate and format the hint response. The list of words changes with each request, but the instructions stay mostly the same. The basic format is this:

```
Provide definition hints for the following words:

[Comma separated word list]

[Instructions for how to format the JSON response]

[Instructions for how to generate a hint]

Please respond only with the JSON object and nothing else.
```

The instructions do change subtly over time as the wording is refined, however, so it would be a good idea to track these changes. This will allow for analysis of how different instructions affect the API response.

It's also pertinent to save information about the API requests and responses in the database so that they can be analyzed more effectively. It seems wasteful to save the full body of the request for each request since the instructions will mostly be the same, and the word list could be better analyzed if it were pulled out and saved separately. A more efficient approach would be to save the instructions in their own table, with each iteration having its own row, and just reference which version was used for each request.

The downside of this approach is that changes to the instructions should really be noted in version control, and storing the instructions in the database places them outside of version control.

## Purpose
The purpose of this change log, then, is to have a place in version control to note changes to the instructions for hint definitions. This is not meant to be a place to note the full text of the instructions, but just a description of changes that are made.

## Implications
In order for tracking instruction changes in version control to matter, the database changes need to be propagated to all environments as well.

## Changes
### 2024-02-06 - Initial tracked version
This is the "initial" version as far as this tracking system is concerned, but there was some iteration on the instructions before this. The changes prior to this involved 2 areas:

1. **Making the instructions text string as compact as possible.** There were some extraneous characters that were only present to aid in human readability, like extra lines between paragraphs and spaces inside of brackets in the example JSON. These could be removed without affecting the ability of the AI model to parse the instructions, so removing them was a no-brainer since it reduced the number of tokens in the request.
2. Refining the instructions about what _not_ to include in the hint. Currently, those instructions are `Each hint [...] should not contain any form of the word you're providing a hint for, or any word or phrase that the submitted word can be an abbreviation for.` The initial version of the instructions just specified that the hints should not contain other forms of the word being defined, but for words that were _abbreviations_, sometimes the hint would still contain the non-abbreviated word or phrase. For example, at one point, the model returned a hint for `gotta` that read `A casual way to say 'have got to' or 'have to'.` This gives away too much information. The clause about not including a word or phrase that the word can be an abbreviation for is attempt to prevent hints like this.