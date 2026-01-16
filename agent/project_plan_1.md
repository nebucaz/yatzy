# bernhaeckt Phase 1 Project Plan
## Overview
Phase 1.0 creates a functional MVP. The focus is to create a single page application that helps to record the scores of multiple players for the dice game 'yatzy'. Players can be added at any time and their order be changed by dragging and dropping. Each player is a column, each row stands for one of the results to achieve during the game. There is a top section, that may result in a bonus, if bonus criteria is met. The score of each player is calculated automatically. By tapping on a cell (result/player) the value may be entered or, the cell may be marked as 'skipped'. Cells, that do not have a result yet are highlighted.         

## Story Status Legend

    ⏳ Pending - Not started
    🔄 In Progress - Currently being worked on
    ✅ Completed - Implemented and verified
    🧪 Testing - Implementation complete, awaiting verification

## Story 1.1: Implement the score dashboard
Status: ✅ Completed

### Acceptance Criteria:
 - The single page app shows a scrore dashboard for as single player. The dashboard is a table, where there is one column for the player
 - A (+) button should alow to add more players 
 - A 'clear' button allows to clear the score dashboard. Before clearing, a confirmation dialog appears.
 - When clicking the header of the player column, the name of the player can be entered, or the player column may be removed.
 - Each row stands for one result in the game as there are: "ones", "twos", "threes", "fours", "fives", "sixes", "one pair", "two pairs", "tree of a kind", "four of a kind", "small straight", "large straight", "full house", "chance", "yatzy"
 - A bonus row is added between "sixes" and "one pair". The bonus of 35 points is added onto this cell (row/player) if the total of points for the rows "ones" ... "sixes" is >= 63 for a player


### Technical Implementation:
 - Create the main page displaying the score dashboard

### Testing:
 - Test the adding of player colums
 - Test defining the name of the player in the column header

## Story 1.2: Improve Result entering
Status: ✅ Completed

### Acceptance Criteria:
- When clicking a cell to enter a value, a popup should be displayed. The Popup shows the possible values to be entered, a "skip" button and a "cancel" button. The "skip" button is replaced by a "unskip" button, if the cell has been marked as skipped. 
- The possible values to be shown in the popup are calculated according to the row, where the cell is located. For example: "ones" only allows recording of the values 1,2,3,4 and 5 where "twos" only allows the values 2,4,6,8,10. Where the number of possible value exceeds 9 options, a number pad allows entering arbitrary value.

### Technical Implementation:
 - Change the value entering logic and behaviour
 - Create the popup for entering the values

### Testing:
 - Thes the value constraints in the popup for ones, twos, threes, fours, fives, sixes, one pair, two pairs, three of a kind, four of a kind and yatzy

## Story 1.3: Automatic result and bonus calculation
Status: ⏳ Pending

### Acceptance Criteria:
- The column with should be at least the with of the player name. It should not exceed 150px in any case
- Bonus and overall result for each player should be calculated whenever a new result value is entered or changed
- Bonus-row should display bonus to be added according to the rule. It must not be edited by the user
- The restrictions fof "two pairs" are wrong. Please show the num-pad instead
- The values for "small street" and "large street" are fixed: 15 points for small street, 25 points for large street

### Technical Implementation

### Testing


## Story 1.4: Store results, when screboard is cleared
Status: ⏳ Pending

### Acceptance Criteria
- Below the scroreboard, the results (player name with total) are shown in a table
- The results are organized in a table, where the first colum shows a date and timestamp
- The results table rows are sorted descending, showing the newest entry at the top

### Technical Implementation

### Testing

## Story 1.5: Edit player name and order
Status: ⏳ Pending

### Acceptance Criteria
- When clicking on the player name, a popup shows where the name may be edited
- The order of the player columns may be changed using drag and drop

### Technical Implementation
- Change the edit-behaviour for the player name
- Allow reordering of the player columns by drag and drop

### Testing