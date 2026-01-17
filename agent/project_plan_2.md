# bernhaeckt Phase 2 Project Plan
## Overview
Phase 2.0 enhances functionality, design and user experience.         

## Story Status Legend

    ⏳ Pending - Not started
    🔄 In Progress - Currently being worked on
    ✅ Completed - Implemented and verified
    🧪 Testing - Implementation complete, awaiting verification

## Story 2.1: Color scheme for players
Status: ✅ Completed

### Acceptance Criteria:
 - Each player column gets a different color based on a well choosen color scheme for easy distiction: Each player is able to easily locate her score-column by color
 - Invert highlighting: At the beginning, only the column header is tinted in the player's exclusive color. Every time a value gets entered in a cell, the cell gets the player's column color as well. 


### Technical Implementation:
 - Create or download a nice, well chosen color scheme for the columns
 - Implement the column tinting as described in the acceptance criteria

### Testing:


## Story 2.2: Localization
Status: ✅ Completed

### Acceptance Criteria:
- Language chooser in top right corner (right of the "clear" button). 
- Supported languages: en, de, ft, it
- Translate the strings in the scoreboard to the specified languages
- Allow to select language in the language chooser
- Set default language to "de"

### Technical Implementation

### Testing:
- Test the language choosing

## Story 2.3: Administrative functions
Status: ✅ Completed

### Acceptance Criteria:
- Create a Hamburger menu in the top right
- move the "clear (scroeboard)" button and the language selector to the menu
- Rename the "clear" button (now in the menu) to "new game"
- Add another menu entry with the name "clear scorebaord"
- Add another menu entry with the name "clear hisstory"

### Technical Implementation
- The "new game" label is the new label for the "clear" button, now moved to the menu
- The new "clear scoreboard" function in the menu resets the player columns to the default/startup value (only one player)
- Clear history removes the entries from the game history

### Testing:
- Test the language choosing

## Story 2.4: Preserve column color when dragging colums
Status: ✅ Completed

### Acceptance Criteria:
- When moving the player column, the current color of the column should be preserved.

### Technical Implementation
- n/a

### Testing:
- n/a

## Story 2.5: Preselected values 
Status: ✅ Completed

### Acceptance Criteria:
- The value selector-popup for the "two pairs" result cells whould show the predefined values  6,8,10,12,14,16,18,20,22
- The ​​​value selector-popup for the "full house" result cells whould show the predefined values 7,8,9,11,12,13,14,15,16,17,18,19,20,21,22,23,24,26,27,28
 