class Sandbox {

  constructor() {
    this.deckSize = 81;
    this.match = [];
    this.deck = {};
    this.exampleCard = [0, 0, 0, 0];
  }

  createDeck() {
    for (let i = 0; i < this.deckSize; i++) {

      let cardId = "card-" + i;
      let imgPath = "assets/card-" + i + ".png";

      let cardImage = document.createElement("img");
      cardImage.setAttribute("id", cardId);
      cardImage.setAttribute("src", imgPath);
      cardImage.setAttribute("onclick", "cardClicked(this.id)");

      let cardVal = this.intToTernary(i);
      this.deck[cardId] = {
        "click": false,
        "id": cardId,
        "img": cardImage,
        "num": i,
        "val": cardVal,
      }
    }
    // console.log(this.deck);

  }

  ternaryToInt(arr) {
    let int = 0;
    for (let i = arr.length - 1; i >= 0; i--) {
      let exponent = (arr.length - 1) - i;
      let digit = arr[i];
      int += digit * (3 ** exponent);
    }
    return int;
  }

  intToTernary(num) {
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
      ternaryNum.unshift(remainder);
      num = parseInt(num / 3);
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

  // Takes an string input in the form of "attribute-type".
  // For example, "color-red" or "amount-two".
  // The example card array is updated with each function call.
  setExampleCard(attributeId) {
    let attributes = attributeId.split("-");
    switch (attributes[0]) {
      case "color":
        switch (attributes[1]) {
          case "red":
            this.exampleCard[0] = 0;
            break;
          case "green":
            this.exampleCard[0] = 1;
            break;
          case "blue":
            this.exampleCard[0] = 2;
            break;
        }
        break;

      case "texture":
        switch (attributes[1]) {
          case "empty":
            this.exampleCard[1] = 0;
            break;
          case "shaded":
            this.exampleCard[1] = 1;
            break;
          case "filled":
            this.exampleCard[1] = 2;
            break;
        }
        break;

      case "amount":
        switch (attributes[1]) {
          case "one":
            this.exampleCard[2] = 0;
            break;
          case "two":
            this.exampleCard[2] = 1;
            break;
          case "three":
            this.exampleCard[2] = 2;
            break;
        }
        break;

      case "shape":
        switch (attributes[1]) {
          case "triangle":
            this.exampleCard[3] = 0;
            break;
          case "square":
            this.exampleCard[3] = 1;
            break;
          case "circle":
            this.exampleCard[3] = 2;
            break;
        }
        break;
    }
  }

  displayExampleCard(cardArr) {
    let cardNum = this.ternaryToInt(cardArr);
    let cardId = "card-" + cardNum;
    let card = this.deck[cardId];
    card.img.classList.add("sandbox-card-example");
    card.img.setAttribute("onclick", "showAllMatches(this.id);")
    document.getElementById("example-card-section").append(card.img);
  }

  clearExampleCard() {
    let element = document.getElementById("example-card-section");
    if (element.childNodes.length > 1) {
      element.removeChild(element.getElementsByTagName('img')[0]);
    }
  }

  // Displays all possible matches for the example card.
  // Each match will be in its own row.
  getCardMatches(cardId) {

    let card1 = this.deck[cardId];
    let matchesSection = document.getElementById('example-card-matches');

    for (let i = 0; i < this.deckSize; i++) {
      let card2 = this.deck["card-" + i];

      for (let j = i; j < this.deckSize; j++) {
          let card3 = this.deck["card-" + j];

        if (this.checkMatch(card1.val, card2.val, card3.val)
          && card1.val !== card2.val
          && card1.val !== card3.val) {

            // Create a row for the match
            let matchRow = document.createElement("div");

            matchRow.classList.add("row");
            matchRow.classList.add("my-2");
            matchRow.classList.add("mx-auto");
            matchRow.classList.add("py-2");
            matchRow.classList.add("w-auto");
            matchRow.classList.add("justify-content-center");

            //Create a col for each card.
            let match1Col = document.createElement("div");
            match1Col.classList.add("col-auto");
            match1Col.classList.add("col-s-4");
            match1Col.classList.add("mx-2");
            match1Col.classList.add("text-center");

            let match2Col = document.createElement("div");
            match2Col.classList.add("col-auto");
            match2Col.classList.add("col-s-4");
            match2Col.classList.add("mx-2");
            match2Col.classList.add("text-center");

            let match3Col = document.createElement("div");
            match3Col.classList.add("col-auto");
            match3Col.classList.add("col-s-4");
            match3Col.classList.add("mx-2");
            match3Col.classList.add("text-center");

            // Copy the img from each card to advoid issues with events, style clashes, etc.
            let card1Copy = new Image();
            let card2Copy = new Image();
            let card3Copy = new Image();

            card1Copy.src = card1.img.src;
            card2Copy.src = card2.img.src;
            card3Copy.src = card3.img.src;

            card1Copy.classList.add("sandbox-card-match");
            card2Copy.classList.add("sandbox-card-match");
            card3Copy.classList.add("sandbox-card-match");

            match1Col.appendChild(card1Copy);
            match2Col.appendChild(card2Copy);
            match3Col.appendChild(card3Copy);

            matchRow.appendChild(match1Col);
            matchRow.appendChild(match2Col);
            matchRow.appendChild(match3Col);

            matchesSection.appendChild(matchRow);
        }
      }
    }
  }

  clearCardMatches() {
    let element = document.getElementById("example-card-matches");
    console.log(element.children.length);
    while (element.children.length >= 1) {
      element.removeChild(element.children[0]);
    }
  }

  checkMatch(card1Val, card2Val, card3Val) {

    let isMatch = [];
    for (let i = 0; i < 4; i++) {
      let vals = [card1Val[i], card2Val[i], card3Val[i]];
      isMatch.push(this.allEqual(vals) || this.allDifferent(vals))
    }

    if (isMatch.every(val => val === true)) {
      return true;
    }
    else {
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

}

// Should I put this into the class?
function setAttributeActive(attributeId) {
  let attributes = attributeId.split("-");

  switch (attributes[0]) {
    case "color":
      clearActiveAttributes(attributeId);
      switch (attributes[1]) {
        case "red":
          document.getElementById(attributeId).classList.add('attribute-active');
          break;
        case "green":
          document.getElementById(attributeId).classList.add('attribute-active');
          break;
        case "blue":
          document.getElementById(attributeId).classList.add('attribute-active');
          break;
      }
      break;

    case "texture":
      clearActiveAttributes(attributeId);
      switch (attributes[1]) {
        case "empty":
          document.getElementById(attributeId).classList.add('attribute-active');
          break;
        case "shaded":
          document.getElementById(attributeId).classList.add('attribute-active');
          break;
        case "filled":
          document.getElementById(attributeId).classList.add('attribute-active');
          break;
      }
      break;

    case "amount":
      clearActiveAttributes(attributeId);
      switch (attributes[1]) {
        case "one":
          document.getElementById(attributeId).classList.add('attribute-active');
          break;
        case "two":
          document.getElementById(attributeId).classList.add('attribute-active');
          break;
        case "three":
          document.getElementById(attributeId).classList.add('attribute-active');
          break;
      }
      break;

    case "shape":
      clearActiveAttributes(attributeId);
      switch (attributes[1]) {
        case "triangle":
          document.getElementById(attributeId).classList.add('attribute-active');
          break;
        case "square":
          document.getElementById(attributeId).classList.add('attribute-active');
          break;
        case "circle":
          document.getElementById(attributeId).classList.add('attribute-active');
          break;
      }
      break;
  }
}

function clearActiveAttributes(attributeId) {
  let attributes = attributeId.split("-");

  switch (attributes[0]) {
    case "color":
      let colorButtons = document.getElementById(attributes[0] + "-attributes").getElementsByTagName('button');
      for (let i = 0; i < colorButtons.length; i++) {
        let btnClasses = colorButtons[i].classList;
        if (btnClasses.contains("attribute-active") === true) {
          btnClasses.remove("attribute-active");
        }
      }
      break;

    case "texture":
      let textureButtons = document.getElementById(attributes[0] + "-attributes").getElementsByTagName('button');
      for (let i = 0; i < textureButtons.length; i++) {
        let btnClasses = textureButtons[i].classList;
        if (btnClasses.contains("attribute-active") === true) {
          btnClasses.remove("attribute-active");
        }
      }
      break;

    case "amount":
      let amountButtons = document.getElementById(attributes[0] + "-attributes").getElementsByTagName('button');
      for (let i = 0; i < amountButtons.length; i++) {
        let btnClasses = amountButtons[i].classList;
        if (btnClasses.contains("attribute-active") === true) {
          btnClasses.remove("attribute-active");
        }
      }
      break;

    case "shape":
      let shapeButtons = document.getElementById(attributes[0] + "-attributes").getElementsByTagName('button');
      for (let i = 0; i < shapeButtons.length; i++) {
        let btnClasses = shapeButtons[i].classList;
        if (btnClasses.contains("attribute-active") === true) {
          btnClasses.remove("attribute-active");
        }
      }
      break;
  }
}


//  Run the script
let box = new Sandbox();
box.createDeck();
// window.onload(box.displayExampleCard([0, 0, 0, 0]));

function updateCard(cardAttrs) {
  box.clearExampleCard();
  box.setExampleCard(cardAttrs);

  console.log(box.setExampleCard(cardAttrs));
  box.displayExampleCard(box.exampleCard);
  setAttributeActive(cardAttrs);
}

function showAllMatches(cardId) {
  box.clearCardMatches();
  box.getCardMatches(cardId);
}