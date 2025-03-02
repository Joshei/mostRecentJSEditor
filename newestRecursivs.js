//3/1/25 - took from jseditor - remote - is now : 5:20 PM
//This will be refactored.
//newest to refactor, copy this into recursiverightbefore...
//save and merge

class RecursiveClass {
    constructor() {
      this.lastRowIndexToPushOn = -1;
      this.bottomRow = -1;
      this.bottomRowFromLastRound = [];
      this.tracksRow = 0;
      this.hasBeenInZeroHorizPosition = false;
    }
  
    deleteRow(arr, rowNumber) {
      arr.splice(rowNumber, 1);
      return arr;
    }
  
    createRow(grid, rowIndex) {
      grid.push(["-", "-", "-", "-", "-", "-" , "-", "-", "-", "-", "-", "-", "-" , "-", "-", "-", "-", "-", "-", "-" , "-","-", "-", "-", "-", "-", "-","-" ])
      //important, allows new line to display in the drawgrid
      HEIGHT++;
      //drawGrid(HEIGHT, WIDTH)
      return grid;
    }
  
    getLastSpaceOrNull(grid, topRow) {  
      //get left phrase before last dash
      //checks for either space or dash, whichever is less characters
      let lastIndexOfNullOnTopRow = topRow.lastIndexOf("-");
      let lastIndexOfSpaceOnTopRow = topRow.lastIndexOf(" ");
      let maxIndexOfNullOrString = -1;
      //row has dash or space on last character
      if (lastIndexOfSpaceOnTopRow >= lastIndexOfNullOnTopRow) {
        maxIndexOfNullOrString = lastIndexOfSpaceOnTopRow;
      }
    
      else
      {
        //choose space or null character that is farthest right on row
        maxIndexOfNullOrString = lastIndexOfNullOnTopRow;
      }
      //row does not have a space or dash
    //   if (maxIndexOfNullOrString === -1) {
    //     const left = ""
    //     const rightWordAtEndOfRowOne = ""
    //     for(let i = 0; i < WIDTH-1; i++ )
    //     rightWordAtEndOfRowOne[i] = "-"
    //   }
    //   return { leftSide: left, rightSide: rightWordAtEndOfRowOne };
  
  
      //gets the word after dash or space
      const [left, rightWordAtEndOfRowOne] = this.splitAtIndex(
        topRow,
        maxIndexOfNullOrString + 1
      );
      //@@
      //check this: right word can be empty string, dash or space on last space?
      return { leftSide: left, rightSide: rightWordAtEndOfRowOne };
    }
    //2/7/25
    lastLineWorkings(grid, rowIndex) {
      if (rowIndex <= 0 || rowIndex >= grid.length) return grid;
      // 3/1/25 - reverted with meld///////
      let topRow = grid[rowIndex - 1];
      let bottomRow = grid[rowIndex];
      //find the index of rightmost dash (start of right word, from next statements +1)
      let lastIndexOfNullOnTopRow = topRow.lastIndexOf("-");
      //get top right word
      const [leftOfWordTopRow, rightWordTopRow] = this.splitAtIndex(
        topRow,
        lastIndexOfNullOnTopRow + 1
      );
      //to here///////////////////////////
      
      //get left word for bottom
      const firstIndexOfNullOnBottomRow = bottomRow.indexOf("-");
      const [leftWordBottomRow, rightSide] = this.splitAtIndex(
        bottomRow,
        firstIndexOfNullOnBottomRow
      );
      //cobine the two words
      const combine = [...rightWordTopRow, ...leftWordBottomRow];
      grid[rowIndex] = combine;
      
      //set cursor
      horizontalCursorPosition = combine.length * 5;
      //cover rest of bottom row with dashes (after word from top)
      for (let i = combine.length; i < WIDTH; i++) {
        grid[rowIndex][i] = "-";
      }
      //cover top row where word was, with dashes
      for (let i = WIDTH - rightWordTopRow.length; i < WIDTH; i++) {
        grid[rowIndex - 1][i] = "-";
      }
  
      return grid;
    }
  
    
    
    
    
    
    
    
    pushWordsDoThisSecond(grid, newRemainder, rowIndex, fromIndex) {
      if (rowIndex > HEIGHT - 1) return grid;
    
      // Handle the case of the last row and the last column.
      if (rowIndex === HEIGHT - 1 && grid[HEIGHT - 1][WIDTH - 1] !== "-") {
        // Perform necessary actions for the last row and column (commented out for now).
        return grid;
      }
    
      // If there's no row above, push an empty row and recurse.
      if (rowIndex === 0) {
        this.pushWordsDoThisSecond(grid, [""], rowIndex + 1, false);
        return grid;
      }
    
      let topRow = grid[rowIndex - 1];
      let bottomRow = grid[rowIndex];
    
      // Get the word at the end of the top row.
      let wordAtEndOfRowOne = this.getLastSpaceOrNull(grid, topRow).rightSide;
      let lengthOfRightWordAtRowOne = wordAtEndOfRowOne.length;
    
      // Handle the case where we are on the last line and certain conditions are met.
      if (this.isOnLastLineWithoutDash(rowIndex, grid)) {
        console.log("here");
        // Perform actions for last line without dash (commented out for now).
        return grid;
      }
    
      // Find indices of spaces or dashes in the bottom row.
      let lastIndexOfFirstWord = this.findRightmostSpaceOrDash(bottomRow);
    
      // Split the bottom row at the rightmost space or dash.
      const [firstWordBottomRow, phraseAfterLeftWordBottomRow] = this.splitAtIndex(bottomRow, lastIndexOfFirstWord);
    
      let lengthOfFirstWordBottomRow = firstWordBottomRow.length;
      let remainingNullSpaces = this.countRemainingNullsAndSpaces(grid, rowIndex, lengthOfFirstWordBottomRow);
    
      // No room to push, continue with the next recursion.
      if (remainingNullSpaces === 0) {
        this.pushWordsDoThisSecond(grid, [""], rowIndex + 1, false);
        return grid;
      }
    
      // If the word fits below in the available space, combine and split rows.
      if (lengthOfRightWordAtRowOne < remainingNullSpaces) {
        let combined = [...wordAtEndOfRowOne, ...firstWordBottomRow, ...phraseAfterLeftWordBottomRow];
        const [newBottomRow, newRemainder] = this.splitAtIndex(combined, WIDTH);
    
        if (this.shouldShortCircuit(grid, rowIndex)) {
          this.pushWordsDoThisSecond(grid, [""], rowIndex + 1, false);
          return grid;
        }
    
        // Handle the cursor repositioning logic.
        this.repositionCursor(grid, rowIndex, wordAtEndOfRowOne, firstWordBottomRow);
    
        // Set the new bottom row and fill in the moved text space with dashes on the top row.
        grid[rowIndex] = newBottomRow;
        this.fillDashesInTopRow(grid, rowIndex, lengthOfRightWordAtRowOne);
    
        this.pushWordsDoThisSecond(grid, newRemainder, rowIndex + 1, false);
        return grid;
      }
    
      // If the word doesn't fit, continue with the next recursion.
      this.pushWordsDoThisSecond(grid, [""], rowIndex + 1, false);
      return grid;
    }
    



    




    // Helper functions for better readability and separation of concerns.
    
    isOnLastLineWithoutDash(rowIndex, grid) {
      return rowIndex !== 0 &&
        grid[rowIndex][0] !== "-" &&
        grid[rowIndex - 1][WIDTH - 1] !== "-" &&
        rowIndex === HEIGHT - 1;
    }
    
    findRightmostSpaceOrDash(row) {
      let firstIndexOfNullOnBottomRow = row.indexOf("-");
      let firstIndexOfSpaceOnBottomRow = row.indexOf(" ");
      firstIndexOfNullOnBottomRow = firstIndexOfNullOnBottomRow === -1 ? 27 : firstIndexOfNullOnBottomRow;
      firstIndexOfSpaceOnBottomRow = firstIndexOfSpaceOnBottomRow === -1 ? 27 : firstIndexOfSpaceOnBottomRow;
    
      return Math.min(firstIndexOfSpaceOnBottomRow, firstIndexOfNullOnBottomRow);
    }
    
    countRemainingNullsAndSpaces(grid, rowIndex, lengthOfFirstWordBottomRow) {
      let remainingNullSpaces = 0;
      if (rowIndex !== HEIGHT - 1) {
        for (let i = lengthOfFirstWordBottomRow; i < WIDTH - 1; i++) {
          if (grid[rowIndex + 1][i] !== "-") break;
          remainingNullSpaces++;
        }
      }
      return remainingNullSpaces;
    }
    
    shouldShortCircuit(grid, rowIndex) {
      return rowIndex !== 0 &&
        (grid[rowIndex - 1][WIDTH - 1] === "-" || grid[rowIndex][0] === "-");
    }
    
    repositionCursor(grid, rowIndex, wordAtEndOfRowOne, firstWordBottomRow) {
      let flagContainedInBorderCrossing = false;
      for (let i = WIDTH - wordAtEndOfRowOne.length; i < WIDTH; i++) {
        if (grid[rowIndex][0] !== "-" && verticalCursorPosition / 10 === rowIndex - 1 && horizontalCursorPosition / 5 === i + 1) {
          verticalCursorPosition = rowIndex * 10;
          horizontalCursorPosition = (wordAtEndOfRowOne.length * 5) + (firstWordBottomRow.length * 5);
          flagContainedInBorderCrossing = true;
          break;
        }
      }
    
      if (!flagContainedInBorderCrossing) {
        for (let i = 0; i < firstWordBottomRow.length; i++) {
          if (grid[rowIndex - 1][WIDTH - 1] !== "-" && verticalCursorPosition / 10 === rowIndex && horizontalCursorPosition / 5 === i + 1) {
            horizontalCursorPosition = (wordAtEndOfRowOne.length * 5) + (firstWordBottomRow.length * 5);
            break;
          }
        }
      }
    }
    
    fillDashesInTopRow(grid, rowIndex, lengthOfRightWordAtRowOne) {
      for (let i = WIDTH - lengthOfRightWordAtRowOne; i < WIDTH; i++) {
        grid[rowIndex - 1][i] = "-";
      }
    }




    splitAtIndex(arr, index) {
      //cuts array at index
      const front = arr.slice(0, index);
      const back = arr.slice(index);
      return [front, back];
    }
  
    //1/22/25- Looks good.
    divideNextRowsAsNeeded(grid, colIndex, rowIndex, remainder) {
      this.tracksRow++;
      let bottomRow = grid[rowIndex];
      let topRow = grid[rowIndex + 1];
  
      //taking the rigth top row and adhering it in front of next bottom row, pushes row right
      //loop
      //remove right end and adhere again
      let [bottomLeftRow, BottomRightRow] = this.splitAtIndex(
        bottomRow,
        colIndex
      );
      if (rowIndex > HEIGHT - 2) {
        drawGrid(HEIGHT, WIDTH);
        return grid;
      } else {
        //splits top in to at cursor
        let [leftTopRow, rightTopRow] = this.splitAtIndex(topRow, colIndex);
  
        let buildNextRow = "";
        //happens on first loop
        if (remainder == "") {
          //sets this to upper-lines right side and the entire lower
          buildNextRow = [...BottomRightRow, ...topRow];
        } else {
          //add extra characters than repeat: put on and take off a row  - LIFO.  "last in first out"
          buildNextRow = [...remainder, ...topRow];
        }
  
        const [oneRowsWorth, newRemainder] = this.splitAtIndex(
          buildNextRow,
          WIDTH
        );
        grid[rowIndex + 1] = oneRowsWorth;
        drawGrid(HEIGHT, WIDTH);
        //puts extra in remainder - starts at loop 1
        this.divideNextRowsAsNeeded(grid, colIndex, rowIndex + 1, newRemainder);
      }
  
      for (let i = colIndex; i < WIDTH; i++) {
        grid[verticalCursorPosition / 10][i] = "-";
      }
      return grid;
    }
  
    //1/22/25: looks okay
    pressedEnter(grid, rowIndex, colIndex, remainder, IsFirstTime, counter) {
      this.createRow(grid, rowIndex);
      this.divideNextRowsAsNeeded(grid, colIndex, rowIndex, [""]);
      horizontalCursorPosition = 0;
      verticalCursorPosition = verticalCursorPosition + 10;
      drawCursor(
        horizontalCursorPosition + HOFFSET,
        verticalCursorPosition + VOFFSET
      );
      return grid;
    }
  
    //2/7/25
    deleteAndPullCharacters(rowIndex, columnIndex, grid) {
      
      //On last row
      if (rowIndex > HEIGHT - 2) {
        
        let topRow = grid[rowIndex];
        let combine = [];
        if(columnIndex != 0){
          let [topRowLeftOfColumn, topRowRightOfColumn] = this.splitAtIndex(
            topRow,
            columnIndex - 1
          );
          let [leftCharacterRightRow, topRowRightOfColumnWithoutFirstCharacter] =
            this.splitAtIndex(topRowRightOfColumn, 1);
            //is same, except character is removed from display 
            combine = [
            ...topRowLeftOfColumn,
            ...topRowRightOfColumnWithoutFirstCharacter,
          ];
  
        }
        //column index is on most left space - on top line
        else {
          //breaks row into to phrases
          let [topRowLeftOfColumn, topRowRightOfColumn] = this.splitAtIndex(
            topRow,
            columnIndex
          );
          //removes first character
          let [lastRowLeftChracterRemoved, lastRowRightSideAfterFirstColumn] =
            this.splitAtIndex(topRowRightOfColumn, 1);
          
          
  
  
            //row is without first character
          combine = [...lastRowRightSideAfterFirstColumn];
          //2nd to last rows right character is lastrows first character
          grid[HEIGHT - 2][WIDTH - 1] = grid[HEIGHT - 1][0];
        }
        CursorMovements.cursorLeft()
        grid[rowIndex] = combine;
        //last character pulls a dash from end because there is a delete on this row 
        grid[HEIGHT - 1][WIDTH - 1] = "-";
        return grid;
      }
  
      //the following row code is anything except last row
      let topRow = grid[rowIndex];
      let bottomRow = grid[rowIndex + 1];
      let bottomRowLeftmostCharacter = bottomRow[0];
      
      let topLeftRow = [];
      let topRightRow = [];
      //cursor is on first column
      if (horizontalCursorPosition === 0) {
        //split at cursor 
        [topLeftRow, topRightRow] = this.splitAtIndex(topRow, columnIndex);
      } else {
        //somethi8ng to do with not being on first row
        [topLeftRow, topRightRow] = this.splitAtIndex(topRow, columnIndex - 1);
        
      }
      //remove front character from right hand side, this is the character being deleted
      let [leftOnecharacterDiscarded, topRightRowNoFirstCharacter] = this.splitAtIndex(topRightRow, 1);
      let combinedRow = [...topLeftRow, ...topRightRowNoFirstCharacter];
      
      
      //if on current row, first colum
      if(rowIndex != 0 && columnIndex === 0 && rowIndex == verticalCursorPosition/10)
      {
        //line above current TOP row takes value from left hand side of TOP
        let character = grid[rowIndex][0];
        grid[rowIndex - 1][WIDTH - 1] = character;
      }
      //rightmost character is added on bext recursive call
      grid[rowIndex] = combinedRow;
      CursorMovements.cursorLeft()
      this.removeLeftCharacterFrom2ndRowAndReplaceAboveOnMostRightSide(
        //onto next row, the next top row is the row just after rowindex - 1 (see above) 
        rowIndex + 1,
        columnIndex,
        grid
      );
      return grid;
      // }
    }
  
    //12/27/25: looks okay
    removeLeftCharacterFrom2ndRowAndReplaceAboveOnMostRightSide(rowIndex,columnIndex,grid) {
      // bail, out
      if (rowIndex > HEIGHT - 1) {
        return grid;
      }
      //on second to last row - doesn't pull on line below the bottom row
      if (rowIndex > HEIGHT - 2) {
        let currentRow = grid[rowIndex - 1];
        let nextRow = grid[rowIndex];
        //remove first letters from both rows
        let [currentRowLeftCharacter, currentRowRightSideWithoutLeftChar] =
          this.splitAtIndex(currentRow, 1);
        let [nextRowLeftCharacter, nextRowRightSideWithoutLeftChar] = this.splitAtIndex(nextRow, 1);
        //put a charcter from next row, at end of this current row
        //row one above last row
        let combineForCurrentRow = [...currentRow,...nextRowLeftCharacter];
        //same as currentrow
        grid[rowIndex - 1] = combineForCurrentRow;
        //pulls bottom rows left character into most right top row
        grid[rowIndex - 1][WIDTH - 1] = nextRowLeftCharacter;
        //build bottom row
        grid[rowIndex] = [...nextRowRightSideWithoutLeftChar];
        //cover with a dash character, because row is one elemnt less now
        grid[rowIndex][WIDTH - 1] = "-";
        return grid;
      }
       //Not on last row...(all this!)
       //top row is without left most character, from deleteandpull...
      let topRow = grid[rowIndex - 1];
      //row after top row
      let bottomRow = grid[rowIndex];
      //get left most characeter, on bottomrow. Is put on most right side of row above it, top row.
      let leftCharacterofBottomRow =  bottomRow[0];
      //on bottommost and rightmost, so put a dash into variable
      if (rowIndex == HEIGHT - 1) {
        leftCharacterofBottomRow = "-";
      }
      //2/7/25 - deleted code here
      //remove the leftmost character on bottom row
      const [BottomRowLeftCharacter, BottomRowWithoutLeftCharacter] =
      this.splitAtIndex(bottomRow, 1);
      //remove rightmost character of top row
      let [topRowWithoutFinalCharacter, topRightCharacterRemoved] =
      this.splitAtIndex(topRow, topRow.length - 1);
      let newTopRow = [...topRow, ...leftCharacterofBottomRow];
      grid[rowIndex - 1] = newTopRow;
      //final character filled in, in next call
      grid[rowIndex] = [...BottomRowWithoutLeftCharacter];
      //recursion
      this.removeLeftCharacterFrom2ndRowAndReplaceAboveOnMostRightSide(rowIndex + 1,columnIndex,grid);
      return grid;
    }
  
    displayGridAndCursor() {
      drawGrid(HEIGHT, WIDTH)
      drawCursor(
        horizontalCursorPosition + HOFFSET,
        verticalCursorPosition + VOFFSET
      );
    }
   
    //much better version available, using ChatGPT
  
    initialInsertDoThisFirst(rowIndex, colIndex, grid, leftOverChar, fromIndex) {
      drawGrid(HEIGHT, WIDTH)
      if (rowIndex > HEIGHT - 1) {
      return grid;
      }
      //for displaying
      let horizString = (horizontalCursorPosition / 5).toString();
      let vertString = (verticalCursorPosition / 10).toString();
      //when bottom row on right end has a character tha create ana additional row
      if(grid[HEIGHT-1][WIDTH-1] != "-"){
        this.createRow(grid, leftOverChar, rowIndex, colIndex);
      }
      //these are the two rows we are using
      let topRow = grid[rowIndex];
      let lowerRow = grid[rowIndex + 1];
      
      //get both sides of row, broken at cursor
      let [leftTopRow, rightTopRow] = this.splitAtIndex(topRow, colIndex);
      let combineTopRow = []
      //this function run is from the call at index, not a recursive call!
      if (fromIndex){
      //insert character at index
      //leftovervhar is the character being inserted (from index)
      combineTopRow = [...leftTopRow, ...leftOverChar,  ...rightTopRow];
      if(verticalCursorPosition/10 == rowIndex){
        if(horizontalCursorPosition/5 === WIDTH-1){
          this.createRow(grid, leftOverChar, rowIndex, colIndex);
        }
        CursorMovements.cursorRightOneSpace();
        console.log("1")
      }
      }else{
        //leftoverchar is now remiander, so it is added to the fromt
      combineTopRow = [...leftOverChar, ...leftTopRow,  ...rightTopRow];
      
     
    }
      //get the firstt row of characters and the remiander to pass into the recursion
      let [finishedTopRow, leftOver] = this.splitAtIndex(combineTopRow, WIDTH);
      //set row
      grid[rowIndex] = finishedTopRow;
  
      //call for next row
      this.initialInsertDoThisFirst(rowIndex+1, colIndex, grid, leftOver, false) 
      return grid;
    }
  
  
  
    
  }
  