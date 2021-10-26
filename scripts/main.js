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
        //cardImage.setAttribute("class", "card-image card-unclicked");
        cardImage.setAttribute("id", cardId);
        cardImage.setAttribute("src", imgPath);
        cardImage.setAttribute("onclick", "cardClicked(this.id)");
        cardImages.push(cardImage);
    }

}

getImages();

function ternary(n) {
    if (n === 0) {
        return [0, 0, 0, 0];
    }


}


/*  Function to create a ternary value based on input
    def ternary(self, n):
        if n == 0:
            return [0, 0, 0, 0]
        num = []
        while n:
            n, r = divmod(n, 3)
            num.append(r)
        num = num[::-1]
        if len(num) == 1:
            num.insert(0, 0)
            num.insert(0, 0)
            num.insert(0, 0)
            return num
        elif len(num) == 2:
            num.insert(0, 0)
            num.insert(0, 0)
            return num
        elif len(num) == 3:
            num.insert(0, 0)
            return num
        elif len(num) == 4:
            return num


*/













function newGame() {

    if (cardDeck.length == 0) {

        var k = 0;
        while (k < deckSize) {
            cardDeck.push(k);
            k++;
        }

        cardDeck = shuffleDeck(cardDeck);
        console.log(cardDeck);

        for (var i = 1; i <= 12; i++) {
            //Draw a card from the top of the deck
            cardDrawn = cardDeck[0];
            console.log(cardDrawn);
            //Add the card image to the page
            cardImages[cardDrawn].classList.add("card-image", "card-unclicked");
            cardImages[cardDrawn].classList.add("cell-" + i);

            document.getElementById("card-section").appendChild(cardImages[cardDrawn]);
            //Remove this card from the deck
            cardDeck.shift();
        }
        console.log(cardDeck);

    } else {
        clearTable();
        newGame();
    }
}


function clearTable() {

    var cardGridId = document.getElementById("card-grid");
    //console.log(cardGridId.children);

    while (cardGridId.firstChild) {
        cardGridId.lastChild.classList = [];
        //cardGridId.lastChild.classList.toggle("card-image", "card-unclicked");
        console.log(cardGridId.lastChild.classList);
        cardGridId.removeChild(cardGridId.lastChild);
    }

    //var cardGridId = document.getElementById("card-grid");
    console.log(cardGridId.children);
    cardDeck = [];
}


function shuffleDeck(array) {
    array.sort(() => Math.random() - 0.5);
    return array;
}

// function showImage() {
//     document.getElementById("card-grid").appendChild(cardImages[0]);
// }

function cardClicked(cardId) {

    //console.log(cardId);
    //console.log(document.getElementById(cardId).attributes);

    var splitArray = cardId.split("-");
    var cardNum = splitArray[1];
    isClicked[cardNum] = !isClicked[cardNum];
    //console.log(cardNum, isClicked[cardNum]);

    clickVal = isClicked[cardNum];

    if (clickVal === true) {
        document.getElementById(cardId).classList.remove("card-unclicked");
        document.getElementById(cardId).classList.add("card-clicked");
        console.log(document.getElementById(cardId).classList);
    } else if (clickVal === false) {
        document.getElementById(cardId).classList.remove("card-clicked");
        document.getElementById(cardId).classList.add("card-unclicked");
        console.log(document.getElementById(cardId).classList);
    }

}


function buttonTest() {
    console.log("Test");
}