//var card = [0, 0, 0, 0];

var cardImages = [];
var cardValues = [];
var deckSize = 81;
var isClicked = [];
var cardDeck = [];
var cardSet = [];

//Array to store card grid positions
var cardTable = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];


function getImages() {

    for (var i = 0; i < deckSize; i++) {
        //Get pngs
        //Change replace unnderscore with dash in file names?
        var imgPath = "images/cards/card_" + i + ".png";
        //Give each card an id
        var cardId = "card-" + i;
        //Give each card a value
        cardValues.push(ternary(i));
        //console.log(i, ": ", cardValues[i]);

        //Create the card images
        var cardImage = document.createElement("img");
        cardImage.setAttribute("id", cardId);
        cardImage.setAttribute("src", imgPath);
        cardImage.setAttribute("onclick", "cardClicked(this.id)");
        //Save them for later
        cardImages.push(cardImage);

        isClicked[i] = false;
    }


}
//Load the images when the page loads
getImages();


//Each card can be represented by a 4 digit ternary number.  The zeros, ones and twos
//  represent 1 of the 3 types of the 4 attributes each card has.  

//  [Color, Texture, Number, Shape] == [#,#,#,#]
//  # = 0 || 1 || 2
//  [Red, Empty, One, Triangle] == [0, 0, 0, 0]
//  [Green, Filled, Two, Square] == [1, 2, 1, 1]

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

//Roughly shuffles the deck.  Can be improved.
function shuffleDeck(array) {
    array.sort(() => Math.random() - 0.5);
    return array;
}

function newGame() {

    //Check to see if a deck has been created
    if (cardDeck.length == 0) {

        //Create a deck of 81 cards by representing each card by a number
        for (let i = 0; i < deckSize; i++) {
            cardDeck.push(i);
        }

        //console.log(cardDeck);
        //cardDeck = shuffleDeck(cardDeck);

        for (let i = 0; i < 12; i++) {
            drawCard("cell-" + i);
        }

        console.log(cardTable);
    } else {
        clearTable();
        newGame();
    }
}

//Remove all the cards from the table.
function clearTable() {

    let cardSectionId = document.getElementById("card-section");
    //console.log(cardGridId.children);

    //Remove all the cards img from the section
    while (cardSectionId.firstChild) {
        cardSectionId.lastChild.classList = [];
        cardSectionId.removeChild(cardSectionId.lastChild);
    }

    //Clear the deck
    cardDeck = [];
}


//Draw a card from the top of the deck
//Then place it at one of the 15 cell numbers
function drawCard(cell) {

    //Draw a card from the top of the deck
    cardDrawn = cardDeck[0];
    //console.log(cardDrawn);

    //Create the card image element
    cardImages[cardDrawn].classList.add("card-image");
    cardImages[cardDrawn].classList.add(cell);
    cardImages[cardDrawn].classList.add("card-unclicked");

    //Add it to the page
    document.getElementById("card-section").appendChild(cardImages[cardDrawn]);

    let cellNumber = cell.split("-")[1];
    cardTable[cellNumber] = cardDrawn;

    //Remove this card from the deck
    cardDeck.shift();
}

//Removes a card from the table
function clearCard(cell) {

    console.log(cell);
    let card = document.getElementsByClassName(cell)[0];
    console.log(card);

    let cellNumber = card.classList[1].split("-")[1];
    console.log(cellNumber);
    cardTable[cellNumber] = -1;

    // let classes = card.classList;
    // console.log(cardNum, ": ", classes[1]);

    card.parentNode.removeChild(card);

}

//Rearanges cards to keep them compact
function sortCards() {

    //Get the cards on the table
    //let cardSectionChildren = document.getElementById("card-section").children;
    //console.log(cardSectionChildren);

    let index = 0;
    for (let card in cardTable) {

        if (cardTable[card] >= 0) {
            let currentCard = document.getElementById("card-" + cardTable[card]);
            let currentCell = document.getElementById("card-" + cardTable[card]).classList[1];
            console.log(currentCard);
            currentCard.classList.remove(currentCell);
            currentCard.classList.add("cell-" + index)
            index += 1;
            console.log(currentCell);

        }

    }

}

//Check to see if there is a Set
function checkSet() {

    //Only check if there are 3 cards selected
    if (cardSet.length === 3) {

        //Get each card's value
        val1 = cardValues[cardSet[0]];
        val2 = cardValues[cardSet[1]];
        val3 = cardValues[cardSet[2]];

        //Check the values
        if ((allEqual([val1[0], val2[0], val3[0]]) || allDifferent([val1[0], val2[0], val3[0]])) &&
            (allEqual([val1[1], val2[1], val3[1]]) || allDifferent([val1[1], val2[1], val3[1]])) &&
            (allEqual([val1[2], val2[2], val3[2]]) || allDifferent([val1[2], val2[2], val3[2]])) &&
            (allEqual([val1[3], val2[3], val3[3]]) || allDifferent([val1[3], val2[3], val3[3]]))
        ) {
            console.log("Set Found!");

            console.log(cardSet[0], val1);
            console.log(cardSet[1], val2);
            console.log(cardSet[2], val3);

            let cellLocation1 = document.getElementById("card-" + cardSet[0]).classList[1];
            let cellLocation2 = document.getElementById("card-" + cardSet[1]).classList[1];
            let cellLocation3 = document.getElementById("card-" + cardSet[2]).classList[1];

            clearCard(cellLocation1);
            clearCard(cellLocation2);
            clearCard(cellLocation3);

            drawCard(cellLocation1);
            drawCard(cellLocation2);
            drawCard(cellLocation3);

            sortCards();

            //Clear the card set
            cardSet.shift();
            cardSet.shift();
            cardSet.shift();

        } else {
            console.log("Not A Set!");
        }

    } else if (cardSet.length < 3 || cardSet.length == 0) {
        console.log("Nedd more cards!");
    }

}

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


//Actions to take when a card is clicked.
function cardClicked(cardId) {

    let clickedId = cardId.slice();

    //Parse the id to get a card number
    var splitArray = clickedId.split("-");
    var cardNum = parseInt(splitArray[1]);
    //Mark it as clicked
    isClicked[cardNum] = !isClicked[cardNum];

    //Maybe redundant but easier to read
    clickVal = isClicked[cardNum];


    switch (clickVal) {

        case true:

            if (cardSet.length < 3) {
                document.getElementById(cardId).classList.remove("card-unclicked");
                document.getElementById(cardId).classList.add("card-clicked");
                cardSet.push(cardNum);
                console.log("SET: ", cardSet);
            }

            console.log("Card Val: ", cardValues[cardNum]);
            console.log(cardId, ": ", document.getElementById(cardId).attributes);

            break;


        case false:

            document.getElementById(cardId).classList.remove("card-clicked");
            document.getElementById(cardId).classList.add("card-unclicked");

            if (cardSet.includes(cardNum) == true) {
                //Find it in the card set
                let cardNumIndex = cardSet.indexOf(cardNum);
                //Remove it from the set
                cardSet.splice(cardNumIndex, 1);
            }

            console.log("SET: ", cardSet);
            console.log("Card Val: ", cardValues[cardNum]);
            console.log(cardId, ": ", document.getElementById(cardId).attributes);

            break;

    }
}

