const container = document.querySelector('.container');
const startGameBtn = document.querySelector('button');
const timeBar = document.querySelector('.timeBar')

const title = document.querySelector('h1')
const scoreDisplay = document.createElement('p');

// max space occupied by num
let numSize = 38;
// how many num to gen
let numCount = 2;
let maxNumCount = maxOfNumsInContainer(numSize, container.offsetWidth, container.offsetHeight)
// spaces available on col
let spacesOnCol = [];
let spacesOnRow = [];
// list of num in .container
let listOfNum = []
// list with position of nums
let listOfPositions = []

let choice = NaN
let listOfChoices = [-1]

let score = 0;

startGameBtn.addEventListener('click', newGame)
///////////////////////////////////////////////////////////
function newGame() {

    //remove nums after transition
    for (let e of container.children) {
        removeAfterTransition(e)
    }

    numCount = 2
    score = 0

    startGame()

    //disabled btn / remove eve after newGame
    startGameBtn.setAttribute('disabled', "");
    startGameBtn.removeEventListener('click', newGame)
}
///////////////////////////////////////////////////////////

function startGame() {

    // del old timeout
    clearTimeout(timeToChooseId)
    clearInterval(hideNumId)

    resetGameVar(numCount, score);

    // update title
    title.innerHTML = `Lv. ${score}`
    //update maxNumCount
    maxNumCount = maxOfNumsInContainer(numSize, container.offsetWidth, container.offsetHeight)

    // check if max number of nums
    if (containerIsFull(maxNumCount, numCount) === true) {
        endOfGame('You win')
        return 'win'
    }

    // save spaces available on row/col
    spacesOnRow = spacesInContainer(numSize, spacesOnRow, container.offsetWidth)
    spacesOnCol = spacesInContainer(numSize, spacesOnCol, container.offsetHeight)

    // avoid typig nums before hideNum
    container.removeEventListener('mouseup', startChoosing)

    genRandNum(numCount)

    hideNum(hideNumDelay)
        .then(() => {
            // hide nums
            listOfNum.forEach(x => { x.classList.add('hideNum') })
            // let player choose
            container.addEventListener('mouseup', startChoosing)
            // set time bar
            timeBar.style.transition = `width ${timeToChooseDelay / 1000}s ease-in, background-color ${timeToChooseDelay / 1000}s ease-in`
            timeBar.classList.add('timeBarShrink')
            // set time to choose
            return timeToChoose(timeToChooseDelay)
        })
        .then(() => {
            // if time to choose = over => end of game
            endOfGame('End of Game')
        })
}
///////////////////////////////////////////////////////////
const startChoosing = function (e) {

    if (e.target.classList[0] === 'randNum' && e.target.tagName === 'BUTTON') {

        choice = parseInt(e.target.innerText)
        prevChoice = listOfChoices[listOfChoices.length - 1]

        if (ascNums(choice, prevChoice)) {

            listOfChoices.push(choice)

            removeAfterTransition(listOfNum[choice])

            if (listOfNum.length === listOfChoices.length - 1) {
                //win: 
                numCount++
                score++
                startGame()
            }
        } else {
            // lose:
            // stop timeBar and time to choose
            clearInterval(timeToChooseId)

            endOfGame('End of Game')
        }
    }
}
///////////////////////////////////////////////////////////
// promises
let hideNumId = NaN;
let hideNumDelay = 2000;
function timeToChoose(timeToChoosedelay) {
    return new Promise((resolve, reject) => {
        timeToChooseId = setTimeout(() => {
            resolve();
        }, timeToChoosedelay)
    })
}

let timeToChooseId = NaN
let timeToChooseDelay = 3000;
function hideNum(hideNumDelay) {
    return new Promise((resolve, refect) => {
        hideNumId = setTimeout(() => {
            resolve();
        }, hideNumDelay)
    })
}

// functions
///////////////////////////////////////////////////////////
//win
function containerIsFull(maxNumCount, numCount) {
    if (maxNumCount < numCount) {
        console.log('win')
        return true
    } else {
        return false
    }
}
///////////////////////////////////////////////////////////
// lose
function endOfGame(message) {
    // show nums
    revealNums(container.children)
    // reset game
    resetGameVar(numCount, score);

    // update title and show score
    title.innerHTML = message;
    appendScore(score, title)

    startGameBtn.removeAttribute('disabled')
    startGameBtn.addEventListener('click', newGame)
}

///////////////////////////////////////////////////////////

//gen rand num 
function genRandNum(numCount) {
    // tCountloop:
    for (let i = 0; i < numCount; i++) {
        /////////////////////////////////////////////////////////
        // check if size of spacesOnCol/Row is exceeded
        addNewSpaces(spacesOnCol, spacesOnRow, numCount)
        ////////////////////////////////////////////////////////
        const newNum = document.createElement('button')
        newNum.classList.add('randNum');
        newNum.innerText = i
        /////////////////////////////////////////////////
        //set position
        randLeft = `${spacesOnRow[i] * numSize}px`
        randTop = `${spacesOnCol[i] * numSize}px`
        ////////////////////////////////////////

        // check collision
        keepLoop = true
        while (keepLoop && listOfPositions.length > 1) {
            for (let x of listOfPositions) {
                if (randLeft === x.posLeft && randTop === x.posTop) {
                    shuffle(spacesOnRow)
                    shuffle(spacesOnCol)
                    randLeft = `${spacesOnRow[i] * numSize}px`
                    randTop = `${spacesOnCol[i] * numSize}px`
                    keepLoop = true
                    break
                } else {
                    keepLoop = false
                }
            }
        }

        ///////////////////////////////////////////////////////////
        listOfPositions.push({ posLeft: randLeft, posTop: randTop })
        listOfNum.push(newNum)
        ///////////////////////////////////////////////////////////////
        newNum.style.left = randLeft
        newNum.style.top = randTop
        container.append(newNum)
        //////////////////////////////////////////////////////////////
    }

}
///////////////////////////////////////////////////////////

function revealNums(container) {
    for (let x of container) {
        x.classList.remove('hideNum')
        x.classList.add('revealNums')
    }
}
///////////////////////////////////////////////////////////
function shuffle(array) {
    array.sort(function () {
        return Math.random() - .5;
    });
}
///////////////////////////////////////////////////////////
function makeRand(min, max) {
    return Math.random() * (max - min) + min;
}
///////////////////////////////////////////////////////////
function arrayInRange(num) {
    let myArray = []
    for (let x of Array(num).keys()) {
        myArray.push(x)
    }
    return myArray
}
///////////////////////////////////////////////////////////
function ascNums(num1, num2) {
    return num1 - 1 === num2
}
///////////////////////////////////////////////////////////
function addNewSpaces(spacesOnCol, spacesOnRow, numCount) {
    // if spacesOnCol/Row.length < numCount then add more
    while (spacesOnCol.length < numCount || spacesOnRow.length < numCount) {
        if (spacesOnCol.length < numCount) {
            spacesOnCol.push(...spacesOnCol)
        } else if (spacesOnRow.length < numCount) {
            spacesOnRow.push(...spacesOnRow)
        } else {
            break
        }
    }
}
///////////////////////////////////////////////////////////
function maxOfNumsInContainer(numSize, containerWidth, containerHeight) {
    // number of nums that can fit in container
    let numCol = Math.floor(containerHeight / numSize);
    let numRow = Math.floor(containerWidth / numSize);
    return numCol * numRow;
}
///////////////////////////////////////////////////////////
//display
function appendScore(score, adjSibling) {
    scoreDisplay.innerText = `Your score is: ${score}`
    scoreDisplay.classList.add('scoreClass')
    adjSibling.insertAdjacentElement('afterend', scoreDisplay);
}
///////////////////////////////////////////////////////////
function removeAfterTransition(element) {
    element.classList.add('removeNum')
    element.addEventListener('transitionend', () => {
        element.remove();
    })
}
///////////////////////////////////////////////////////////
function resetGameVar(currentCount, currentScore) {
    numCount = currentCount

    listOfNum = []
    listOfPositions = []
    spacesOnCol = [];
    spacesOnRow = [];

    choice = NaN
    listOfChoices = [-1]
    score = currentScore

    timeBar.style.transition = ``
    timeBar.classList.remove('timeBarShrink')

    scoreDisplay.remove()
}
///////////////////////////////////////////////////////////
function spacesInContainer(numSize, spacesColOrRow, heightOrWidth) {
    // save and return available spaces in .container on row/height
    // func arg: numSize with (spacesOnRow and container.width) or (spacesOnCol and container.height)
    let numColOrRow = Math.floor(heightOrWidth / numSize);

    spacesColOrRow.push(...arrayInRange(numColOrRow))

    shuffle(spacesColOrRow)

    return spacesColOrRow
}
///////////////////////////////////////////////////////////




// br









// function checkCollision(){
//     keepLoop = true
//     while (keepLoop && listOfPositions.length > 1) {
//         for (let x of listOfPositions) {
//             if (randLeft === x.posLeft && randTop === x.posTop) {
//                 shuffle(spacesOnRow)
//                 shuffle(spacesOnCol)
//                 randLeft = `${spacesOnRow[i] * numSize}px`
//                 randTop = `${spacesOnCol[i] * numSize}px`
//                 keepLoop = true
//                 break
//             } else {
//                 keepLoop = false
//             }
//         }
//     }
// }
