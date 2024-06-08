# ServiceNow-GenAi-Prompt-Library

## tables

- [X] prompt table (task: comment editor)
    - [X] prompt
    - [X] the author (opened_by task)
    - [X] score aggregate
    - [X] category
    - [X] instructions/description (description task)
    - [X] to display (for category winners)
- [X] vote table
    - [X] prompt reference
    - [X] user reference
- [X] response table
    - [X] prompt reference
- [X] categories/bounties table
    - [X] name
    - [X] description
    - [X] keywords/key phrases/important keywords
- [X] favorite table
    - [X] prompt reference
    - [X] user reference

- [ ] LLM table?

## UI

- [ ] portal record
- [ ] page
- [ ] widget

## portal

### widget #1
explaining wtf this is
- submit button (opens modal)

### widget #2
categories/bounties and the current chosen prompts for each
keep it narrow, can be expanded if user interested
- categories in a grid

clicked
- show winners highlighted, then show others

### widget #3
the prompt interface
paginated. selecter.
(top level per person)
- Prompt (shortened)
    - exandable to show full
- Category
- Author
- The original author (if forked)
- How many contributors (if more than one)
- Score
- Upvote button
- fork button

clicked
- comments
- history of forks with links
- 
