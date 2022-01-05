// get game boxes
const boxes = Array.prototype.slice.call(document.getElementsByClassName('game-box'));
const gameController = document.getElementById('game-controller');
const gameTypeContainer = document.getElementById('game-type-container');
const gameContainer = document.getElementById('game-container');
let gameType;
let gameInProgress;
let starter;
let currentPlayer;

/* Game Type
1 - Single Player
2 - Multiplayer
*/

/**
 * Starter
 * 1 - user/player one
 * 2 - cpu/player 2
 */

// add event listener to game controller button
gameController.addEventListener('click', gameControllerHandler);

/*
functions
*/

function mainGame() {
    if(gameType === 1) {
        console.log(gameType);
    } else if(gameType === 2) {
        // add event listener to all boxes
        boxes.forEach(box => {
            box.addEventListener('click', clickHandlerMP);
        });
    }
}

// function to get row or column elements
function getRowColElements(data, dataType) {
    return Array.prototype.slice.call(document.querySelectorAll(`[${dataType}='${data}']`));
}

// function to populate status of row or column
function populateStatusArray(element, statusArray) {
    if(element.dataset.status !== 'used') {            
        statusArray.push(element);
    }
}

// function to check for unfilled boxes and similarity of contents of boxes
function checkBoxes(statusArray, elementsArray) {
    if(statusArray.length > 0) {
        return false;
    } else {
        if(elementsArray[0].innerText === elementsArray[1].innerText && elementsArray[1].innerText === elementsArray[2].innerText) {
            return true;
        } else {
            return false;
        }
    }
}

// function to check for horizontal similarity of box contents
function horizontalSimilarity(element) {
    const currentRow = parseInt(element.dataset.row);
    let rowElements = getRowColElements(currentRow, 'data-row');
    let rowStatus = [];
    rowElements.forEach(element => {
        populateStatusArray(element, rowStatus);
    });

    return checkBoxes(rowStatus, rowElements);
}

// function to check vertical similarity of box contents
function verticalSimilarity(element) {
    const currentCol = parseInt(element.dataset.col);
    const colElements = getRowColElements(currentCol, 'data-col');
    let colStatus = [];
    colElements.forEach(element => {
        populateStatusArray(element, colStatus);
    });

    return checkBoxes(colStatus, colElements);
}

// function to check for diagonal similarity
function diagonalSimilarity(element) {
    // check for validity of diagonal similarity
    const currentId = element.getAttribute('id');
    let diagonalElements = [];
    elementStatus = [];
    let j = -8;
    for(i = 0; i < 4; i++) {
        if(j === 0) {
            j+=4;
        }
        if(document.getElementById(parseInt(currentId) + j)) {
            diagonalElements.push(document.getElementById(parseInt(currentId) + j));
        }
        j+=4;
    }
    diagonalElements.push(element);
    diagonalElements.forEach(element => {
        populateStatusArray(element, elementStatus);
    });

    return checkBoxes(elementStatus, diagonalElements);
}

// function to check win status
function checkWinStatus(event) {
    if(horizontalSimilarity(event.target)) {
        return true;
    } else if(verticalSimilarity(event.target)) {
        return true;
    } else if(diagonalSimilarity(event.target)) {
        return true;
    } else {
        return false;
    }
    
}

// function to handle clicks on the boxes
function clickHandlerMP(event) {
    let element = Array.prototype.slice.call(gameTypeContainer.childNodes)[0];
    if(currentPlayer === '1' && event.target.dataset.status !== 'used') {
        event.target.innerText = 'X';        

        // give the elements a status of used
        event.target.dataset.status = 'used';

        // check win status
        if(checkWinStatus(event)) {
            displayWinner();
        }

        // change current player
        currentPlayer = '2';

        // update current player display
        updateCP(element);
    } else if(currentPlayer === '2' && event.target.dataset.status !== 'used') {
        event.target.innerText = 'O';

        // give the elements a status of used
        event.target.dataset.status = 'used';

        // check win status
        if(checkWinStatus(event)) {
            displayWinner();
        } else {
            // change current player
            currentPlayer = '1';

            // update current player display
            updateCP(element);
        }
    }
}

// function to display game winner
function displayWinner() {    
    // remove event listeners from boxes
    boxes.forEach(box => {
        box.removeEventListener('click', clickHandlerMP);
        box.style.opacity = 0.4;
    });

    // display winner
    const winner = document.createTextNode(`Player ${currentPlayer} Wins!`);
    winner
    winnerText.appendChild(winner);
    winnerDiv.appendChild(winnerText);
    winnerDiv.appendChild(winnerResetBtn);
    winnerResetBtn.addEventListener('click', resetGame);
    gameContainer.appendChild(winnerDiv);


}

// function to reset game components to initial values
function resetGame() {
    boxes.forEach(box => {
        box.innerText = "";
        box.dataset.status = "";
    });

    // clear all global variables
    gameType = undefined;
    gameInProgress = undefined;
    starter = undefined;
    currentPlayer = undefined;

    // reset view
    removeGameOptions();

    // remove winner view
    removeWinnerDisplay();   

    // reset gameController text
    resetStartStop();
}

// function remove winner display
function removeWinnerDisplay() {
    const winnerDisplayer =  document.getElementById('winner-div');
    winnerDiv.remove();

    // change the opacity value of boxes to the default
    boxes.forEach(box => {
        box.style.opacity = 1;
    });
};

// remove game options and process(turn for player) display
function removeGameOptions() {
    let childNodes = Array.prototype.slice.call(gameTypeContainer.childNodes);    
    childNodes.forEach(node => {
        node.remove();
    });
}


// reset start and stop buttons
function resetStartStop() {
    if(gameController.dataset.value === 'start') {
        gameController.dataset.value = 'stop';
        gameController.innerText = 'Stop Game';
    } else if(gameController.dataset.value === 'stop') {
        gameController.dataset.value = 'start';
        gameController.innerText = "Start Game"
    }
}

// function to update current player display
function updateCP(element) {
    element.remove();
    element.innerText = 'Turn for player ' +currentPlayer;
    gameTypeContainer.appendChild(element);
}

// function to handle game controller button
function gameControllerHandler() {
    if(gameController.dataset.value === 'start') {
        
        gameController.dataset.value = 'stop';
        gameController.innerText = 'Stop';

        // display game type options
        gameTypeContainer.appendChild(spBtn);
        gameTypeContainer.appendChild(mpBtn);

        spBtn.addEventListener('click', () => {
            gameType=1;

            // remove the game type choice buttons
            mpBtn.remove();
            spBtn.remove();

            // display starter choices
            gameTypeContainer.appendChild(starterTitle);
            gameTypeContainer.appendChild(userBtn);
            gameTypeContainer.appendChild(cpuBtn);

            // listen for clicks in starter choice buttons
            userBtn.addEventListener('click', choiceHandler);
            cpuBtn.addEventListener('click', choiceHandler);
        });

        mpBtn.addEventListener('click', () => {
            gameType=2;
            
            // remove the game type choice buttons
            mpBtn.remove();
            spBtn.remove();

            // display starter choices
            gameTypeContainer.appendChild(starterTitle);
            gameTypeContainer.appendChild(playerOne);
            gameTypeContainer.appendChild(playerTwo);

            // listen for clicks in starter choice buttons
            playerOne.addEventListener('click', choiceHandler);
            playerTwo.addEventListener('click', choiceHandler);
        });
    } else if(gameController.dataset.value === 'stop') {
        // remove event listener from all boxes
        boxes.forEach(box => {
            box.removeEventListener('click', clickHandlerMP);
        });
        
        gameController.dataset.value = 'start';
        gameController.innerText = 'Start Game';

        // change value of game in progress variable
        if(!gameInProgress) {
            gameInProgress = undefined;
        }

        // remove game choice buttons
        removeGameOptions();
    }
}

function choiceHandler(event) {
    // set game starter
    starter = event.target.dataset.value;

    // notify program that game is in progress
    gameInProgress = 1;

    //remove choice buttons
    (Array.prototype.slice.call(gameTypeContainer.childNodes)).forEach(element => {
        element.remove();
    });

    // set initial; value of current player
    setvalue(event)
    .then(value => {
        currentPlayer = value;
        currentPlayerElement.innerText = 'Turn for player  ' + currentPlayer;
    });
    gameTypeContainer.appendChild(currentPlayerElement);

    // run main game function
    mainGame();
}

// function to get initial value of current player
async function setvalue(event) {
    return await event.target.dataset.value
}

/*
elements
*/

// game type elements
const spBtn = document.createElement("button");
spBtn.innerText = "Single Player";
spBtn.setAttribute("id", "spBtn");
const mpBtn = document.createElement("button");
mpBtn.innerText = "local Multiplayer";
mpBtn.setAttribute("id", "mpBtn");

// starter elements
const starterTitle = document.createElement('h3');
starterTitle.innerText = 'Choose starter';
const userBtn = document.createElement('button');
userBtn.innerText = 'User';
userBtn.setAttribute('id', 'user-starter');
userBtn.setAttribute('data-value', '1');
const cpuBtn = document.createElement('button');
cpuBtn.innerText = 'Cpu';
cpuBtn.setAttribute('id', 'cpu-starter');
cpuBtn.setAttribute('data-value', '2');

// multiplayer starter buttons
const playerOne = document.createElement('button');
playerOne.innerText = 'Player One';
playerOne.setAttribute('id', 'player-one');
playerOne.setAttribute('data-value', '1');
const playerTwo = document.createElement('button');
playerTwo.innerText = 'Player Two';
playerTwo.setAttribute('id', 'player-two');
playerTwo.setAttribute('data-value', '2');

// current player element
const currentPlayerElement = document.createElement('p');

/**winner view */
//  background div
const winnerDiv = document.createElement('div');
winnerDiv.setAttribute('id', 'winner-div');
// winner text, i.e 'Player 1/2 Wins'
const winnerText = document.createElement('p');
winnerText.setAttribute('id', 'winner-text');
// winner view reset button
const winnerResetBtn = document.createElement('button');
winnerResetBtn.innerText = 'OK';
winnerResetBtn.setAttribute('id', 'winner-reset');