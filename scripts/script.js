// Matching Game written in JavaScript
// Justin C Kirk 2021

// Inspired by the popular card game Set:
// https://www.playmonster.com/brands/set/


// Which has their own daily puzzle version:
// https://www.setgame.com/set/puzzle


// The concept works the same as the card game.

// There is a deck of 81 cards. 
// Each card has 4 attributes.
// Each attribute has 3 possibilities.

// In order to get a match, the player needs to find 3 cards which 
// have either all different or all of the same types for each of the 4 attributes.

// For example, this game uses the following attribute and types:
// _ATTRIBUTES_|_____________TYPES_______________
// Color       |   Red    |  Green   |  Blue    |
// Texture     |  Filled  |  Shaded  |  Filled  |
// Amount      |   One    |  Two     |  Three   |
// Shape       | Triangle |  Square  |  Circle  |

// If arranged correctly, every card can then be represented by a 4 bit ternary number
// Each bit represents on of the 4 attributes.  

//For example, a Red, Shaded,  Three, Square card is represented by:
//  Decimal Number: 16
//  Ternary Number: 0121

// The decimal is its place in line when the deck is sorted.
// A deck for each game can be made by storing all the card's decimal numbers
// into an array.  We can then shuffle the array's order to shuffle our deck.
// Accessing the first element of the card deck array represents drawing the top card of our deck.
// Removing this element from the array represents removing it from the deck.
// Using the card number, we can get the card's <img> file and it's ternary value. 
// To check for a possible match, we simply compare the 3 ternary numbers of the cards.

// Additional features of the game are drawing an additional 3 cards if a player gets stuck
// and the option to get a hint to find  a possible match.  

// This game was the first of its kind for me and is a work in progress. 

// Enjoy!!



// Holds <img> elements
var cardImages = [];
// 81 cards in a Set Deck
const deckSize = 81;
// A deck is represented by number 0 to 80 inclusive.
// We can then "shuffle" the deck by randomly sorting the array.
var cardDeck = [];
// Each card's attributes can be represented by a 4 bit ternary number
var cardValues = [];
// Toggle states of cards to take actions when selected
var isClicked = [];
// Possible match to check
var match = [];
// Score 3 points when a match is found
var points = 0;
// Array to store cards currently in play
//var cardsOnTable = [];



// The cells of the card table are arranged as:

// cell-0  cell-1  cell-2  cell-3   cell-12

// cell-4  cell-5  cell-6  cell-7   cell-13

// cell-8  cell-9  cell-10 cell-11  cell-14

// The cells 12, 13, 14 are only for an optional 3 cards.
// The majority of the game is played with the first 12 cards.
// Placing them into a single array makes it easy to index



// Alert window to tell players this game is very much a work in progress

//alert("This is my first game so there may be bugs. \nIf the game stops working, try to refresh your browser!");



var cardsOnTable = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,];
// Create the img elements when the page first loads
getImages();

//Creates the img elements for the cards
function getImages() {
    cardImages = [];
    for (var i = 0; i < deckSize; i++) {
        //Get pngs
        //Change replace unnderscore with dash in file names?
        var imgPath = "images/cards/png/card-" + i + ".png";
        //Give each card an id
        var cardId = "card-" + i;

        //Create the card images
        var cardImage = document.createElement("img");
        cardImage.setAttribute("id", cardId);
        cardImage.setAttribute("src", imgPath);
        cardImage.setAttribute("onclick", "cardClicked(this.id)");

        //Save them for later
        cardImages.push(cardImage);
    }
}


function newGame() {

    // Reset stuff
    updateScoreboard(0);
    points = 0;
    match = [];
    cardDeck = [];

    // If there are any cards already on the table, clear the whole table
    for (let card in cardsOnTable) {
        if (cardsOnTable[card]) {
            clearTable();
        }
    }

    // Store card values and numbers
    for (let i = 0; i < deckSize; i++) {
        cardValues.push(ternary(i));
        cardDeck.push(i);
        isClicked[i] = false;
    }

    //Comment out this line for easy mode
    cardDeck = shuffleDeck(cardDeck);

    // Place a card in the first 12 slots of the card table
    for (let i = 0; i < 12; i++) {
        drawCard("cell-" + i);
    }

    console.log("NEW GAME:", cardsOnTable);

}

// Remove all the cards from the table.
function clearTable() {

    console.log("CLEARING TABLE:", cardsOnTable);

    // Get each card on the table
    let currentCards = [];
    for (let card in cardsOnTable) {
        if (cardsOnTable[card] != null) {
            currentCards.push(card);
        }
    }

    // Clear each card on the table
    for (let card in currentCards) {
        clearCard("cell-" + card);
    }

    console.log("CLEARED END:", cardsOnTable);

}

// Places card at cell location
function drawCard(cell) {

    // If there are no more cards to draw, exit
    if (cardDeck.length == 0) {
        return false;
    }

    // Else, draw a card from the top of the deck
    let cardDrawn = cardImages[cardDeck[0]];

    // Add the cell to it's class
    cardDrawn.classList.add(cell);
    // As well as the other classes
    cardDrawn.classList.add("card-image");
    cardDrawn.classList.add("card-unclicked");
    // Add it to the page
    document.getElementById("card-table").appendChild(cardDrawn);

    //Get the cell number
    let cellArr = cell.split("-");
    let cellNum = cellArr[1];
    //Add the card number to the table array
    cardsOnTable[cellNum] = cardDeck[0];
    //console.log("adding:", cardDeck[0], " to:", cellNum);
    //Remove the drawn card from the deck
    cardDeck.shift();

}

//Add three more cards to the end table
function drawThree() {
    drawCard("cell-12");
    drawCard("cell-13");
    drawCard("cell-14");
}

//Removes a single card from the table
function clearCard(cell) {

    // Get the card number at the cell position
    let cellNum = cell.split("-")[1];
    let cardNum = cardsOnTable[cellNum];
    console.log("CLEARING CARD:", cardNum, "from:", cell);
    // Change cardsOnTable value to null
    cardsOnTable[cellNum] = null;

    // Use this number to get th card id
    let card = document.getElementById("card-" + cardNum);
    // Clear the classes for that card
    card.classList = [];
    // Remove it from the page
    card.parentNode.removeChild(card);
}


//Rearanges cards to keep the layout neat
function sortCards() {


    console.log("SORT CARDS:", cardsOnTable);

    // Get the cards currently on the table
    let currentCards = [];
    for (let card in cardsOnTable) {
        if (cardsOnTable[card] != null) {
            // Add it to the list
            currentCards.push(cardsOnTable[card]);
            // Clear the spot
            cardsOnTable[card] = null;
        }
    }

    console.log("SORTING CARDS:", cardsOnTable);
    // Take each of our cards
    for (let card in currentCards) {
        // Add it to the table starting from the 1st index
        cardsOnTable[card] = currentCards[card];
        // Then add the classes
        let currentCard = document.getElementById("card-" + currentCards[card]);
        currentCard.classList = [];
        currentCard.classList.add("card-image", "card-unclicked", "cell-" + card);
        cardsOnTable[card] = currentCards[card];
    }


    console.log("SORTED CARDS:", cardsOnTable);

}

//Check to see if there is a Set
function checkMatch() {

    //Get the current set
    //let posMatch = match.slice();
    console.log("CHECKING:", match);

    //Only check if there are 3 cards in set
    if (match.length === 3) {

        //Get each card's value
        let val1 = cardValues[match[0]];
        let val2 = cardValues[match[1]];
        let val3 = cardValues[match[2]];

        //Check the values
        if ((allEqual([val1[0], val2[0], val3[0]]) || allDifferent([val1[0], val2[0], val3[0]])) &&
            (allEqual([val1[1], val2[1], val3[1]]) || allDifferent([val1[1], val2[1], val3[1]])) &&
            (allEqual([val1[2], val2[2], val3[2]]) || allDifferent([val1[2], val2[2], val3[2]])) &&
            (allEqual([val1[3], val2[3], val3[3]]) || allDifferent([val1[3], val2[3], val3[3]]))
        ) {

            // Get the cards cell locations
            let cellNumbers = [];
            for (let i in match) {
                cellNumbers.push(cardsOnTable.indexOf(match[i]));
            }

            // Remove them from these locations
            clearCard("cell-" + cellNumbers[0]);
            clearCard("cell-" + cellNumbers[1]);
            clearCard("cell-" + cellNumbers[2]);

            // Sort the cards
            sortCards();

            // Add new cards to these locations
            for (let i in cardsOnTable) {
                if (cardsOnTable[i] === null && i < 12) {
                    console.log("cell-" + i);
                    drawCard("cell-" + i);
                }
            }


            // Clear the match
            match.shift();
            match.shift();
            match.shift();

            // Tally points
            points += 1;
            updateScoreboard(points);

            // Should add some more actions when game won
            if (points === 81) {
                alert("Congrats! You Won!");
            }
            return true;
        } else {
            console.log("Not A Set!");
            alert("Not A Set!");
            return false;
        }
    } else if (match.length < 3 || match.length == 0) {
        console.log("Need more cards!");
        alert("Need more cards!");
        return false;
    }
}



// Actions to take when a card is clicked.
function cardClicked(cardId) {

    let cardClassList = document.getElementById(cardId).classList;

    // Parse the id to get a card number
    let splitArray = cardId.split("-");
    let cardNum = parseInt(splitArray[1]);

    // Mark it as clicked
    isClicked[cardNum] = !isClicked[cardNum];
    // Maybe redundant but easier to read
    clickVal = isClicked[cardNum];

    switch (clickVal) {

        case true:

            // If there are less than 3 cards in the current set
            if (match.length < 3) {
                // Remove hint border if present
                if (cardClassList.contains("card-hint")) {
                    cardClassList.remove("card-hint");
                }
                // Remove unclicked border if present
                if (cardClassList.contains("card-unclicked")) {
                    cardClassList.remove("card-unclicked");
                }
                // Add clicked border if not present
                if (cardClassList.contains("card-clicked") === false) {
                    cardClassList.add("card-clicked");
                }
                // Add the card to the match
                match.push(cardNum);
            }
            break;

        case false:
            // Double check to remove hint border
            if (cardClassList.contains("card-hint")) {
                cardClassList.remove("card-hint");
            }
            // Remove clicked border if present
            if (cardClassList.contains("card-clicked")) {
                cardClassList.remove("card-clicked");
            }
            // Add unlcicked border if not present
            if (cardClassList.contains("card-unclicked") === false) {
                cardClassList.add("card-unclicked");
            }

            // Remove the card from the match when card is unselected
            if (match.includes(cardNum) == true) {
                //Find it in the card set
                let cardNumIndex = match.indexOf(cardNum);
                //Remove it from the set
                match.splice(cardNumIndex, 1);
            }
            break;

    }
}


// Utility Functions


//Find a set on the table
function hint() {

    //Start with the first card in upper left corner
    for (let i = 0; i < cardsOnTable.length; i++) {
        //Then check with card to the right
        for (let j = i + 1; j < cardsOnTable.length; j++) {
            //And the card second to the right
            for (let k = j + 1; k < cardsOnTable.length; k++) {

                let card1 = cardsOnTable[i];
                let card2 = cardsOnTable[j];
                let card3 = cardsOnTable[k];

                //If there is a card there
                if (card1 !== null && card2 !== null && card3 !== null) {

                    //console.log(card1, card2, card3);

                    let val1 = cardValues[card1];
                    let val2 = cardValues[card2];
                    let val3 = cardValues[card3];

                    if (quickCheck(val1, val2, val3) === true) {

                        console.log("found a set", val1, val2, val3);
                        //Get the cards and highlight
                        let classes1 = document.getElementById("card-" + cardsOnTable[i]).classList;
                        let classes2 = document.getElementById("card-" + cardsOnTable[j]).classList;
                        let classes3 = document.getElementById("card-" + cardsOnTable[k]).classList;

                        //Only add the class once
                        if (classes1.contains("card-hint") == false) {
                            classes1.add("card-hint")
                        }
                        if (classes2.contains("card-hint") == false) {
                            classes2.add("card-hint")
                        }
                        if (classes3.contains("card-hint") == false) {
                            classes3.add("card-hint")
                        }
                        //Only find one match
                        return;
                    }
                }
            }
        }
    }
}



//Simple check of a set, used only in hint()
function quickCheck(set1, set2, set3) {

    //Get each card's val
    // console.log("Checking: ", set1, set2, set3);
    let val1 = set1.slice();
    let val2 = set2.slice();
    let val3 = set3.slice();

    if (val1 == false || val2 == false || val3 == false) {
        console.log("Undefined set error");
        return false;
    }

    //Check the values
    if ((allEqual([val1[0], val2[0], val3[0]]) || allDifferent([val1[0], val2[0], val3[0]])) &&
        (allEqual([val1[1], val2[1], val3[1]]) || allDifferent([val1[1], val2[1], val3[1]])) &&
        (allEqual([val1[2], val2[2], val3[2]]) || allDifferent([val1[2], val2[2], val3[2]])) &&
        (allEqual([val1[3], val2[3], val3[3]]) || allDifferent([val1[3], val2[3], val3[3]]))
    ) {
        //console.log("Set! ", set1, set2, set3);
        return true;
    } else {
        return false;
    }
}


function updateScoreboard(score) {
    pointsElement = document.getElementById("points");
    pointsElement.innerHTML = score;
}

//Used to test card values for a match
function allEqual(arr) {
    let equalArr = arr.slice();
    if (equalArr[0] === equalArr[1] && equalArr[1] === equalArr[2]) {
        return true;
    } else {
        return false;
    }
}

function allDifferent(arr) {
    let differentArr = arr.slice();
    if (differentArr[0] != differentArr[1] &&
        differentArr[1] != differentArr[2] &&
        differentArr[2] != differentArr[0]) {
        return true;
    } else {
        return false;
    }
}

//Converts a deciaml number 0-80 to an 4 element array representing its ternary value
function ternary(num) {

    let ternaryNum = [];

    //trivial case
    if (num === 0) {
        ternaryNum.unshift(0);
        ternaryNum.unshift(0);
        ternaryNum.unshift(0);
        ternaryNum.unshift(0);
        return ternaryNum;
    }

    while (num > 0) {
        let remainder = num % 3;
        num = parseInt(num / 3);
        ternaryNum.unshift(remainder);
        //console.log(num, remainder);
    }

    //ternaryNum = ternaryNum.reverse();

    if (ternaryNum.length === 1) {
        ternaryNum.unshift(0);
        ternaryNum.unshift(0);
        ternaryNum.unshift(0);
        return ternaryNum;
    } else if (ternaryNum.length === 2) {
        ternaryNum.unshift(0);
        ternaryNum.unshift(0);
        return ternaryNum;
    } else if (ternaryNum.length === 3) {
        ternaryNum.unshift(0);
        return ternaryNum;
    } else if (ternaryNum.length === 4) {
        return ternaryNum;
    }

}



//Creates a graph of every possible set in game
//Can be modified to find every possible unique set by setting j = i+1 and k = j+ 1
var matchesObj = {};
function getAllSets() {
    let range = 81;

    for (let i = 0; i < range; i++) {
        let matchedSets = [];
        for (let j = 0; j < range; j++) {
            for (let k = 0; k < range; k++) {
                if (i !== j && j !== k) {

                    let isSet = quickCheck(cardValues[i], cardValues[j], cardValues[k]);

                    if (isSet === true) {
                        let match = [cardValues[i], cardValues[j], cardValues[k]];
                        matchedSets.push(match);
                    }
                }
            }
        }

        matchesObj[i] = matchedSets;
    }

    let setTotal = 0;
    console.log("Got All Sets:", Object.keys(matchesObj).length);
    console.log(matchesObj);
    for (let k in matchesObj) {
        setTotal += matchesObj[k].length;
    }
    console.log("Total Sets:", setTotal);
}


//Roughly shuffles the deck.  Can be improved.
function shuffleDeck(array) {
    array.sort(() => Math.random() - 0.5);
    return array;
}


//Needed?
