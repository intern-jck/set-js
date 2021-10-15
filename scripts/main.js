var card = [0, 0, 0, 0];

var cardImages = [];
var deckSize = 81;

var isClicked = [];


var cardDeck = [];

function getImages() {

    for (var i = 0; i < deckSize; i++) {
        var imgPath = "images/cards/card_" + i + ".png";
        var cardId = "card-" + i;
        var cardImage = document.createElement("img");
        //Set each image to unclicked to start
        cardImage.setAttribute("class", "card-image card-unclicked");
        cardImage.setAttribute("id", cardId);
        cardImage.setAttribute("src", imgPath);
        cardImage.setAttribute("onclick", "cardClicked(this.id)");
        cardImages.push(cardImage);
    }

}

getImages();

function newGame() {

    if (cardDeck.length == 0) {

        var k = 0;
        while (k < deckSize) {
            cardDeck.push(k);
            k++;
        }

        cardDeck = shuffleDeck(cardDeck);

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 4; j++) {
                cardDrawn = cardDeck[0];
                document.getElementById("card-grid").appendChild(cardImages[cardDrawn]);
                cardDeck.shift();
            }
        }

    } else {
        var cardGridId = document.getElementById("card-grid");
        while (cardGridId.firstChild) {
            cardGridId.removeChild(cardGridId.lastChild);
        }
        cardDeck = [];
    }
}


function shuffleDeck(array) {
    array.sort(() => Math.random() - 0.5);
    return array;
}

function showImage() {
    document.getElementById("card-grid").appendChild(cardImages[0]);
}

function cardClicked(cardId) {

    console.log(cardId);
    var splitArray = cardId.split("-");
    var cardNum = splitArray[1];
    isClicked[cardNum] = !isClicked[cardNum];
    console.log(cardNum, isClicked[cardNum]);

    clickVal = isClicked[cardNum];

    if (clickVal === true) {
        document.getElementById(cardId).classList.remove("card-unclicked");
        document.getElementById(cardId).classList.add("card-clicked");
        console.log(document.getElementById(cardId).classList);
    } else if (clickVal === false) {
        document.getElementById(cardId).classList.remove("card-clicked");
        document.getElementById(cardId).classList.add("class", "card-unclicked");
        console.log(document.getElementById(cardId).classList);
    }

}


function buttonTest() {
    console.log("Test");
}