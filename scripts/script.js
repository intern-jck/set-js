class Game {

    constructor() {
        this.deckSize = 81;
        this.match = [];
        this.deck = {};
        this.cardTable = [];
        this.easyModeOn = false;
        this.cardsLeft = [];
        this.hintFound = false;
        this.hintSet = [];
        this.newGame();
    }

    updateScoreboard() {
        let cardsLeftElement = document.getElementById('cards-left')
        cardsLeftElement.innerHTML = this.cardsLeft.length;
    }

    easyMode() {
        this.easyModeOn = !this.easyModeOn;
        if (this.easyModeOn) {
            let btnClassList = document.getElementById("easy-btn").classList;
            btnClassList.add("easy-on");
            this.newGame();
        } else {
            let btnClassList = document.getElementById("easy-btn").classList;
            if (btnClassList.contains("easy-on")) {
                btnClassList.remove("easy-on");
            }
            this.newGame();
        }
    }

    createDeck() {
        for (let i = 0; i < this.deckSize; i++) {

            let cardId = "card-" + i;
            let imgPath = "assets/card-" + i + ".png";

            let cardImage = document.createElement("img");
            cardImage.setAttribute("id", cardId);
            cardImage.setAttribute("src", imgPath);
            cardImage.classList.add("card-image");
            cardImage.classList.add("img-fluid");
            cardImage.setAttribute("onclick", "cardClicked(this.id)");

            let cardVal = this.ternary(i);
            this.deck[cardId] = {
                "cell": null,
                "click": false,
                "drawn": false,
                "id": cardId,
                "img": cardImage,
                "num": i,
                "val": cardVal,
            }
            this.cardsLeft.push(cardId);
        }
    }

    clearDeck() {
        for (let card in this.deck) {
            delete this.deck[card];
        }
        this.cardsLeft = [];
    }

    newGame() {
        // Clear table if there are cards
        if (this.cardTable.length > 0) {
            for (let card in this.cardTable) {
                if (this.cardTable[card] != null) {
                    let cellToClear = this.deck[this.cardTable[card]].cell
                    this.clearCard(cellToClear);
                }
            }
        }

        // Reset
        this.clearDeck();
        this.createDeck();
        this.hintFound = false;

        if (this.easyModeOn === false) {
            this.cardsLeft = this.shuffle(this.cardsLeft);
        }

        // Draw 12 cards    
        for (let i = 0; i < 12; i++) {
            let cellId = "cell-" + i;
            this.drawCard(cellId);
        }

        this.updateScoreboard(0);
    }

    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            let randNum = Math.floor(Math.random() * (i + 1));
            let temp = arr[i];
            arr[i] = arr[randNum];
            arr[randNum] = temp;
        }
        return arr;
    }

    getCellNum(cellId) {
        let cellNum = cellId.split("-")[1];
        return cellNum;
    }

    drawCard(cellId) {
        if (this.cardsLeft.length == 0) {
            return false;
        }
        // Draw card from 'top' of deck
        let cardId = this.cardsLeft.shift();
        let card = this.deck[cardId];
        // Update card cell
        card.cell = cellId;
        card.drawn = true;
        // Add to DOM
        document.getElementById(cellId).appendChild(card.img);
        // Update reference array
        this.cardTable[this.getCellNum(cellId)] = cardId;
        this.updateScoreboard();
    }

    drawThree() {
        this.drawCard("cell-12");
        this.drawCard("cell-13");
        this.drawCard("cell-14");
    }

    clearCard(cellId) {
        this.cardTable[this.getCellNum(cellId)] = null;
        let cellNode = document.getElementById(cellId);

        let nodeLength = cellNode.childNodes.length;
        if (nodeLength > 1) {
            let cellImgs = cellNode.getElementsByTagName('img');
            cellImgs.classList = [];
            cellNode.removeChild(cellImgs[0]);
        }
    }

    cardClicked(cardId) {
        let card = this.deck[cardId];
        let cardClassList = document.getElementById(cardId).classList;
        card.click = !card.click;
        switch (card.click) {
            case true:
                if (this.match.length < 3) {
                    if (cardClassList.contains("card-clicked") === false) {
                        cardClassList.add("card-clicked");
                    }
                    this.match.push(card);
                }
                break;

            case false:
                if (cardClassList.contains("card-clicked")) {
                    cardClassList.remove("card-clicked");
                }
                if (this.match.includes(card) == true) {
                    let cardNumIndex = this.match.indexOf(card);
                    this.match.splice(cardNumIndex, 1);
                }
                break;
        }
    }

    sortCards() {

        let cardsOnTable = [];

        // Get the cards on the table
        for (let i in this.cardTable) {
            if (this.cardTable[i] != null) {
                cardsOnTable.push(this.cardTable[i])
                this.cardTable[i] = null;
            }
        }
        // Place them all back starting at the first cell
        for (let i in this.cardTable) {
            if (cardsOnTable.length > 0) {
                let cardToPlace = cardsOnTable.shift();
                this.cardTable[i] = cardToPlace;
                // this.clearCard(this.deck[cardToPlace].cell);
                this.deck[cardToPlace].cell = "cell-" + i;
                document.getElementById("cell-" + i).appendChild(this.deck[cardToPlace].img);

            } else {
                this.cardTable[i] = null;
            }
        }

    }

    checkMatch() {

        if (this.match.length === 3) {

            // Get cards
            let card1 = this.match[0];
            let card2 = this.match[1];
            let card3 = this.match[2];

            // Get vals
            let card1Val = card1.val;
            let card2Val = card2.val;
            let card3Val = card3.val;

            // Check vals
            let isMatch = [];
            for (let i = 0; i < 4; i++) {
                let vals = [card1Val[i], card2Val[i], card3Val[i]];
                isMatch.push(this.allEqual(vals) || this.allDifferent(vals))
            }

            // If a match
            if (isMatch.every(val => val === true)) {

                // Take cards off table
                this.clearCard(card1.cell);
                this.clearCard(card2.cell);
                this.clearCard(card3.cell);

                // Sort cards on table
                this.sortCards();

                // Draw Cards
                for (let cell in this.cardTable) {
                    if (this.cardTable[cell] === null && cell < 12) {
                        this.drawCard("cell-" + cell);
                    }
                }

                // Update score
                this.updateScoreboard();
                this.match = [];
                this.hintFound = false;

                this.checkWinner();
                return true;
            }
            else {
                alert("Not a match!")
                return false;
            }
        }
        else {
            alert("Need more cards!")
            return false;
        }
    }

    allEqual(arr) {
        if (arr[0] === arr[1] && arr[1] === arr[2]) {
            return true;
        } else {
            return false;
        }
    }

    allDifferent(arr) {
        if (arr[0] != arr[1] &&
            arr[1] != arr[2] &&
            arr[2] != arr[0]) {
            return true;
        } else {
            return false;
        }
    }

    getHint() {

        if (this.hintFound === false) {

            // Check for hint

            let cardsOnTable = [];

            for (let card in this.cardTable) {
                if (this.cardTable[card] != null) {
                    cardsOnTable.push(this.cardTable[card]);
                }
            }

            for (let i = 0; i < cardsOnTable.length; i++) {
                for (let j = i + 1; j < cardsOnTable.length; j++) {
                    for (let k = j + 1; k < cardsOnTable.length; k++) {

                        // Get cards
                        let card1 = cardsOnTable[i];
                        let card2 = cardsOnTable[j];
                        let card3 = cardsOnTable[k];

                        // Get vals
                        let card1Val = this.deck[card1].val;
                        let card2Val = this.deck[card2].val;
                        let card3Val = this.deck[card3].val;

                        // Check vals
                        let isMatch = [];

                        for (let i = 0; i < 4; i++) {
                            let vals = [card1Val[i], card2Val[i], card3Val[i]];
                            isMatch.push(this.allEqual(vals) || this.allDifferent(vals))
                        }

                        // If a match
                        if (isMatch.every(val => val === true)) {

                            let card1ClassList = document.getElementById(card1).classList;
                            let card2ClassList = document.getElementById(card2).classList;
                            let card3ClassList = document.getElementById(card3).classList;

                            // Only add the class once
                            if (card1ClassList.contains("card-hint") == false) {
                                card1ClassList.add("card-hint")
                            }
                            if (card2ClassList.contains("card-hint") == false) {
                                card2ClassList.add("card-hint")
                            }
                            if (card3ClassList.contains("card-hint") == false) {
                                card3ClassList.add("card-hint")
                            }

                            this.hintFound = true;
                            return true;
                        }
                    }
                }
            }
        } else {
            alert("Only one hint at a time!")
        }
    }

    checkWinner() {
        if (this.cardsLeft.length === 0 && this.cardTable.some(card => card != null)) {
            console.log("Keep going!");
        } else if (this.cardsLeft.length === 0 && this.cardTable.every(card => card === null)) {
            alert("Winner!");
            this.newGame();
        }
    }

    //Converts a deciaml number 0-80 to an 4 element array representing its ternary value
    ternary(num) {

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
        }

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

}

let myGame = new Game();


function newGame() {
    myGame.newGame();
}

function cardClicked(cardId) {
    myGame.cardClicked(cardId);
}

function checkMatch() {
    myGame.checkMatch();
}

function drawThree() {
    myGame.drawThree();
}
function getHint() {
    myGame.getHint();
}
function easyMode() {
    myGame.easyMode();
}

// Show/Close Rules Overlay
function showRules() {
    document.getElementById("rules").style.height = "100%";
}

function closeRules() {
    document.getElementById("rules").style.height = "0%";
}

// Show/Close Contact Overlay
function showContact() {
    document.getElementById("contact").style.height = "100%";
}

function closeContact() {
    document.getElementById("contact").style.height = "0%";
}


