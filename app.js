const container = document.querySelector('.container');
const startGameBtn = document.querySelector('button');
const timeBar = document.querySelector('.timeBar')


function shuffle(array) {
    array.sort(function () {
        return Math.random() - .5;
    });
}


function makeRand(min, max) {
    return Math.random() * (max - min) + min;
}

function arrayInRange(num) {
    let myArray = []
    for (let x of Array(num).keys()) {
        myArray.push(x)
    }
    return myArray
}

function ascNums(num1, num2) {
    return num1 - 1 === num2
}
let timeOutHideNumId = NaN;
const hideNum = function (delay) {
    return new Promise((resolve, refect) => {
        timeOutHideNumId = setTimeout(() => {
            resolve();
        }, delay)
    })
}
let timeToChooseId = NaN
let timeToChooseDelay = 5000;
const timeToChoose = function(delay){
    return new Promise((resolve,reject)=>{
        timeToChooseId = setTimeout(()=>{
            resolve();
        },delay)
    })
}

// if spacesOnCol/Row.length < numCount then add more
function addNewSpaces(spacesOnCol,spacesOnRow,numCount){
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

function maxOfNumsInContainer(numSize,containerWidth,containerHeight){
    // number of nums that can fit in container
    let numCol = Math.floor(containerHeight/ numSize);
    let numRow = Math.floor(containerWidth / numSize);
    return numCol * numRow;
}
// max space occupied by num
let numSize = 38;
// how many num to gen
let numCount = 2;

let maxNumCount = maxOfNumsInContainer(numSize,container.offsetWidth,container.offsetHeight)

// list of num in .container
let listOfNum = []
// list with position of nums
let listOfPositions = []

let choice = NaN
let listOfChoices = [-1]

let score = 0;

// let [spacesOnRow, spacesOnCol] = [[], []]
// spaces available on col
let spacesOnCol = [];
let spacesOnRow = [];




const startGame = () => {
    clearTimeout(timeToChooseId) 
    resetGameVar(numCount,score);


    maxNumCount = maxOfNumsInContainer(numSize,container.offsetWidth,container.offsetHeight)
    // console.log(maxNumCount)
    // console.log(numCount)
    // numCount === maxNumCount > true : console.log('f')
    // check if max number of nums reach
    if(maxNumCount < numCount){
        console.log('win')
        numCount = 2
        startGameBtn.addEventListener('click', newGame)
        return 'EndGame'
    }
    // save spaces available on row/col
    // [spacesOnRow, spacesOnCol] = spacesInContainer(numSize)
    spacesOnRow = spacesInContainer(numSize,spacesOnRow,container.offsetWidth)
    spacesOnCol = spacesInContainer(numSize,spacesOnCol,container.offsetHeight)

    // avoid typig nums before hideNum
    container.removeEventListener('mouseup', startChoosing)

    genRandNum(numCount)

    hideNum(3000)
        .then(() => {
            listOfNum.forEach((x) => {
                x.classList.add('hideNum')
            })
            container.addEventListener('mouseup', startChoosing)

            timeBar.style.transition= `width ${timeToChooseDelay/1000}s ease-in`
            timeBar.classList.add('timeBarShrink')

            return timeToChoose(timeToChooseDelay)
        })
        .then(()=>{
            resetGameVar();
            startGameBtn.addEventListener('click',newGame)
        })
}

function newGame(){
    clearInterval(timeOutHideNumId)
    numCount = 2
    score = 0
    startGame()
    // remove e after newGame
    startGameBtn.removeEventListener('click', newGame)
}

startGameBtn.addEventListener('click',newGame)


function resetGameVar(currentCount,currentScore) {
    container.innerText = '';
    numCount = currentCount

    listOfNum = []
    listOfPositions = []
    spacesOnCol = [];
    spacesOnRow = [];
    

    choice = NaN
    listOfChoices = [-1]
    score = currentScore
}



// function spacesInContainer(numSize) {
//     // save and return available spaces in .container
//     let numRow = Math.floor(container.offsetWidth / numSize);
//     let numCol = Math.floor(container.offsetHeight / numSize);

//     spacesOnRow.push(...arrayInRange(numRow))
//     spacesOnCol.push(...arrayInRange(numCol))

//     shuffle(spacesOnRow)
//     shuffle(spacesOnCol)

//     return [spacesOnRow, spacesOnCol]
// }

function spacesInContainer(numSize,spacesColOrRow,heightOrWidth) {
    // save and return available spaces in .container on row/height
    // func arg: numSize with (spacesOnRow and container.width) or (spacesOnCol and container.height)
    let numColOrRow = Math.floor(heightOrWidth/ numSize);
    
    spacesColOrRow.push(...arrayInRange(numColOrRow))
    
    shuffle(spacesColOrRow)

    return spacesColOrRow
}

const startChoosing = function (e) {

    if (e.target.classList[0] === 'randNum' && e.target.tagName === 'BUTTON') {

        choice = parseInt(e.target.innerText)
        prevChoice = listOfChoices[listOfChoices.length - 1]

        if (ascNums(choice, prevChoice)) {

            listOfChoices.push(choice)

            listOfNum[choice].remove()

            
            if (listOfNum.length === listOfChoices.length - 1) {
            //win: 
                numCount++
                // numCount = 109
                score++
                // console.log(maxNumCount)
                timeBar.style.transition= ``
                timeBar.classList.remove('timeBarShrink')

                startGame()
            }
        } else {
            // lose:
            timeBar.style.transition= ``
            timeBar.classList.remove('timeBarShrink')

            resetGameVar(numCount,score)
            startGameBtn.addEventListener('click', newGame)
        }

    }

}



//gen rand num 
function genRandNum(numCount) {
    // tCountloop:
    for (let i = 0; i < numCount; i++) {
        /////////////////////////////////////////////////////////
        // check if size of spacesOnCol/Row is exceeded
        addNewSpaces(spacesOnCol,spacesOnRow,numCount)
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
