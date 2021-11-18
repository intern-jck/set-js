var cardImages = [];
var cardValues = [];
var deckSize = 81;
var isClicked = [];
var cardDeck = [];
var cardSet = [];
var points = 0;

//Array to store cards currently in play
var cardsOnTable = [];

function newGame() {

    //Check to see if a deck has been created    
    if (cardDeck.length == 0) {

        getImages();
        updateScoreboard(0);
        points = 0;
        cardSet = [];

        // Each card has a number and a value
        // Number is used for indexing and value is a ternary number respresenting its attributes
        for (let i = 0; i < deckSize; i++) {
            cardValues.push(ternary(i));
            isClicked[i] = false;
            cardDeck.push(i);
        }

        //cardDeck = shuffleDeck(cardDeck);

        // Place a card in the first 12 slots of the card table
        for (let i = 0; i < 12; i++) {
            drawCard();
        }

    } else {
        clearTable();
        newGame();
    }
}

//Remove all the cards from the table.
function clearTable() {
    //Reset points
    updateScoreboard(0);
    points = 0;

    //Get all the cards and remove all the cards img from the table
    let cardSection = document.getElementById("card-section");

    while (cardSection.firstChild) {
        //cardSection.lastChild.classList = [];
        cardSection.removeChild(cardSection.lastChild);
    }

    for (let img in cardImages) {
        cardImages[img].classList = [];
        isClicked[img] = false;
    }

    //Clear the deck
    cardDeck = [];
    cardsOnTable = [];
}

function getCardClasses(cardId) {
    let cardClasses = [];
    let currentCard = document.getElementById(cardId);
    let cardClassName = currentCard.className;
    cardClasses = cardClassName.split(" ");
    return cardClasses;
}


//Removes a card from the table
function clearCard(cardId) {

    //console.log(cardId, cardsOnTable.indexOf(cardId));
    cardsOnTable.slice(cardsOnTable.indexOf(cardId), 1);
    let cardClasses = getCardClasses(cardId);
    let regex = /cell/;
    let cardNum = cardId.split("-")[1];

    if (regex.test(cardClasses)) {
        let card = document.getElementById(cardId);
        card.classList.remove(getCellLocation(cardId));
        card.parentNode.removeChild(card);
        isClicked[cardNum] = false;
    }
    console.log(cardsOnTable);
}
//Add three more cards to the table
function drawThree() {

    for (let i = 0; i < 3; i++) {
        let cardDrawn = cardDeck[0];
        cardImages[cardDrawn].classList.add("cell-" + (12 + i));
        document.getElementById("card-section").appendChild(cardImages[cardDrawn]);
        cardDeck.shift();
        cardsOnTable.push("card-" + cardDrawn)
    }
    console.log(cardsOnTable);

}


// Places card at cell location by adding a string 'cell-#' to its class
function drawCard() {
    //Draw a card from the top of the deck
    let cardDrawn = cardDeck[0];
    //console.log(cardsOnTable.length);

    if (cardsOnTable.length < 12) {
        cardImages[cardDrawn].classList.add("cell-" + cardsOnTable.length);
        //console.log("cell-" + cardsOnTable.length % 12);
        document.getElementById("card-section").appendChild(cardImages[cardDrawn]);

        cardsOnTable.push("card-" + cardDrawn)
        cardDeck.shift();
    }

    console.log(cardsOnTable);
}


//Rearanges cards to keep the layout neat
function sortCards() {

    cardsOnTable = [];
    let cards = [];

    let cardSection = document.getElementById("card-section").children;

    for (let i in cardSection) {
        if (typeof (cardSection[i]) == 'object') {
            cards.push(cardSection[i]);
        }
    }

    // Get all cards on table
    for (let card in cards) {
        //let cardId = cards[card].id;
        let cellLocation = getCellLocation(cards[card].id);
        cards[card].classList.remove(cellLocation);
        cards[card].classList.add("cell-" + card);
        cardsOnTable.push(cards[card].id);
    }

}

// Get the selected card's cell location
function getCellLocation(cardId) {
    let regex = /cell/;
    let card = document.getElementById(cardId);

    let cardClasses = card.className;
    let classArr = cardClasses.split(" ");

    for (let c in classArr) {
        if (regex.test(classArr[c])) {
            return classArr[c];
        }
    }
    return false;
}

//Check to see if there is a Set
function checkSet() {

    //Get the current set
    let set = cardSet.slice();
    console.log("Checking:", set);

    //Only check if there are 3 cards in set
    if (set.length === 3) {

        //Get each card's value
        let val1 = cardValues[set[0]];
        let val2 = cardValues[set[1]];
        let val3 = cardValues[set[2]];

        //Check the values
        if ((allEqual([val1[0], val2[0], val3[0]]) || allDifferent([val1[0], val2[0], val3[0]])) &&
            (allEqual([val1[1], val2[1], val3[1]]) || allDifferent([val1[1], val2[1], val3[1]])) &&
            (allEqual([val1[2], val2[2], val3[2]]) || allDifferent([val1[2], val2[2], val3[2]])) &&
            (allEqual([val1[3], val2[3], val3[3]]) || allDifferent([val1[3], val2[3], val3[3]]))
        ) {
            console.log(set);
            //Remove card from table
            clearCard("card-" + set[0]);
            clearCard("card-" + set[1]);
            clearCard("card-" + set[2]);

            sortCards();

            drawCard();
            drawCard();
            drawCard();

            // //Clear the card set
            cardSet.shift();
            cardSet.shift();
            cardSet.shift();
            // // Tally points
            points += 3;
            updateScoreboard(points);
            return true;
        } else {
            console.log("Not A Set!");
            alert("Not A Set!");
            return false;
        }
    } else if (set.length < 3 || set.length == 0) {
        console.log("Need more cards!");
        alert("Need more cards!");
        return false;
    }
}



//Actions to take when a card is clicked.
function cardClicked(cardId) {

    let cardClassList = document.getElementById(cardId).classList;


    //Parse the id to get a card number
    let splitArray = cardId.split("-");
    let cardNum = parseInt(splitArray[1]);

    //Mark it as clicked
    isClicked[cardNum] = !isClicked[cardNum];
    //Maybe redundant but easier to read
    clickVal = isClicked[cardNum];

    switch (clickVal) {

        case true:

            //If there are less than 3 cards in the current set
            if (cardSet.length < 3) {

                if (cardClassList.contains("card-hint")) {
                    cardClassList.remove("card-hint");
                }

                if (cardClassList.contains("card-unclicked")) {
                    cardClassList.remove("card-unclicked");
                }

                if (cardClassList.contains("card-clicked") === false) {
                    cardClassList.add("card-clicked");
                }

                cardSet.push(cardNum);
                //console.log("SET: ", cardSet);
                console.log(cardNum, cardClassList);
            }
            break;

        case false:

            //     let cardClassList = document.getElementById(cardId).classList;

            if (cardClassList.contains("card-hint")) {
                cardClassList.remove("card-hint");
            }

            if (cardClassList.contains("card-clicked")) {
                cardClassList.remove("card-clicked");
            }

            if (cardClassList.contains("card-unclicked") === false) {
                cardClassList.add("card-unclicked");
            }

            if (cardSet.includes(cardNum) == true) {
                //Find it in the card set
                let cardNumIndex = cardSet.indexOf(cardNum);
                //Remove it from the set
                cardSet.splice(cardNumIndex, 1);
            }

            console.log(cardNum, cardClassList);
            break;

    }
}



//Find a set on the table
// function hint() {

//     //Start with the first card in upper left corner
//     for (let i = 0; i < cardTable.length; i++) {
//         //Then check with card to the right
//         for (let j = i + 1; j < cardTable.length; j++) {
//             //And the card second to the right
//             for (let k = j + 1; k < cardTable.length; k++) {

//                 let card1 = cardTable[i];
//                 let card2 = cardTable[j];
//                 let card3 = cardTable[k];

//                 //If there is a card there
//                 if (card1 !== -1 && card2 !== -1 && card3 !== -1) {

//                     //console.log(card1, card2, card3);

//                     let val1 = cardValues[card1];
//                     let val2 = cardValues[card2];
//                     let val3 = cardValues[card3];

//                     if (quickCheck(val1, val2, val3) === true) {

//                         console.log("found a set", val1, val2, val3);
//                         //Get the cards and highlight
//                         let classes1 = document.getElementById("card-" + cardTable[i]).classList;
//                         let classes2 = document.getElementById("card-" + cardTable[j]).classList;
//                         let classes3 = document.getElementById("card-" + cardTable[k]).classList;

//                         //Only add the class once
//                         if (classes1.contains("card-hint") == false) {
//                             classes1.add("card-hint")
//                         }
//                         if (classes2.contains("card-hint") == false) {
//                             classes2.add("card-hint")
//                         }
//                         if (classes3.contains("card-hint") == false) {
//                             classes3.add("card-hint")
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }

//Simple check of  a set






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

//Used to test card sets
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






//                   Utility Functions





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


//Creates the img elements for the cards
function getImages() {
    cardImages = [];
    for (var i = 0; i < deckSize; i++) {
        //Get pngs
        //Change replace unnderscore with dash in file names?
        var imgPath = "images/cards/card_" + i + ".png";
        //Give each card an id
        var cardId = "card-" + i;

        //Create the card images
        var cardImage = document.createElement("img");
        cardImage.setAttribute("id", cardId);
        cardImage.setAttribute("src", imgPath);
        cardImage.setAttribute("onclick", "cardClicked(this.id)");
        cardImage.classList.add("card-image");
        cardImage.classList.add("card-unclicked");

        //Save them for later
        cardImages.push(cardImage);
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