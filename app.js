const container = document.querySelector('.container');
const startGameBtn = document.querySelector('button');
const timeBar = document.querySelector('.timeBar')


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

function appendScore(score,adjSibling){
    scoreDisplay.innerText = `Your score is: ${score}`
    scoreDisplay.classList.add('scoreClass')
    adjSibling.insertAdjacentElement('afterend',scoreDisplay);
    // return scoreDisplay
}

function newGame(){
    clearInterval(timeOutHideNumId)
    clearInterval(timeToChooseId)

    for(let e of container.children){
        removeAfterTransition(e)
    }

    numCount = 2
    score = 0
    startGame()

    //disabled btn and remove e after newGame
    startGameBtn.setAttribute('disabled', "");
    startGameBtn.removeEventListener('click', newGame)
}


function removeAfterTransition(element){
    element.classList.add('removeNum')
    element.addEventListener('transitionend',()=>{
        element.remove();
    })
}

function resetGameVar(currentCount,currentScore) {
    // container.

    


    numCount = currentCount

    listOfNum = []
    listOfPositions = []
    spacesOnCol = [];
    spacesOnRow = [];
    

    choice = NaN
    listOfChoices = [-1]
    score = currentScore

    timeBar.style.transition= ``
    timeBar.classList.remove('timeBarShrink')

    scoreDisplay.remove()
}

function spacesInContainer(numSize,spacesColOrRow,heightOrWidth) {
    // save and return available spaces in .container on row/height
    // func arg: numSize with (spacesOnRow and container.width) or (spacesOnCol and container.height)
    let numColOrRow = Math.floor(heightOrWidth/ numSize);
    
    spacesColOrRow.push(...arrayInRange(numColOrRow))
    
    shuffle(spacesColOrRow)

    return spacesColOrRow
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
const title = document.querySelector('h1')
const scoreDisplay = document.createElement('p');



startGameBtn.addEventListener('click',newGame)


const startGame = () => {
    clearTimeout(timeToChooseId) 
    resetGameVar(numCount,score);

    title.innerHTML = `Lv. ${score}`

   
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

            timeBar.style.transition= `width ${timeToChooseDelay/1000}s ease-in, background-color ${timeToChooseDelay/1000}s ease-in`
            timeBar.classList.add('timeBarShrink')

            return timeToChoose(timeToChooseDelay)
        })
        .then(()=>{

            revealNums(container.children)
            resetGameVar(numCount,score);
            
            title.innerHTML = `End of Game`;
            appendScore(score,title)

            startGameBtn.removeAttribute('disabled')
            startGameBtn.addEventListener('click',newGame)
        })
}



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
           
            revealNums(container.children)
            resetGameVar(numCount,score)

            
            title.innerHTML = `End of Game`
            appendScore(score,title)

            startGameBtn.removeAttribute('disabled')
            startGameBtn.addEventListener('click', newGame)

            clearInterval(timeToChooseId)
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




function revealNums(container){
    // container.children.forEach((x) => {
    //     x.classList.add('hideNum')
    // })
    for(let x of container){
        x.classList.remove('hideNum')
        x.classList.add('revealNums')
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
