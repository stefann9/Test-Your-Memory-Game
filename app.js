const container = document.querySelector('.container');

function makeRand(min, max) {
    return Math.random() * (max - min) + min;
}

let tSize = 38;
let tCount = 5;
// impartim containerul in spati disponibile pe rand si coloane pentru 
// grosimea si inaltimea numerelor
let numRow = Math.floor(container.offsetWidth / tSize);
let numCol = Math.floor(container.offsetHeight / tSize);
let spacesOnRow = [];
let spacesOnCol = [];

// salveaza numerele disponibile pe rand
for (let x of Array(numRow).keys()) {
    spacesOnRow.push(x)
}
for (let x of Array(numCol).keys()) {
    spacesOnCol.push(x)
}

function shuffle(array) {
    array.sort(function () {
        return Math.random() - .5;
    });
}
//amesteca spatiile disponibile
shuffle(spacesOnRow)
shuffle(spacesOnCol)

const keepWH = []












// const listOfNum = []
// for(let x of Array(tCount).keys()){
//     listOfNum.push(x)
// }


const startGameBtn = document.querySelector('button');

startGameBtn.addEventListener('click', () => {
    genRandNum(tCount)

})

listOfDivs = []
function genRandNum(tCount) {
    // tCountloop:
    for (let i = 0; i < tCount; i++) {

        // in cazul in care marimea lui spacesOnRow si spacesOnCol este depasita adauga mai multe spatii
        while (spacesOnCol.length < tCount || spacesOnRow.length < tCount) {
            if (spacesOnCol.length < tCount) {
                spacesOnCol.push(...spacesOnCol)
            } else if (spacesOnRow.length < tCount) {
                spacesOnRow.push(...spacesOnRow)
            } else {
                break
            }

        }

        const div1 = document.createElement('button')
        div1.classList.add('randNum');
        div1.innerText = i

        randLeft = `${spacesOnRow[i] * tSize}px`
        randTop = `${spacesOnCol[i] * tSize}px`

        // whileLoop:
        keepLoop = true
        while (keepLoop && keepWH.length > 1) {
            // verifica daca noul numar se suprapune cu cele vechi
            for (let x of keepWH) {
                if (randLeft === x.W && randTop === x.H) {
                    console.log(randLeft === x.W && randTop === x.H)
                    shuffle(spacesOnRow)
                    shuffle(spacesOnCol)
                    randLeft = `${spacesOnRow[i] * tSize}px`
                    randTop = `${spacesOnCol[i] * tSize}px`
                    keepLoop = true
                    break
                } else {
                    keepLoop = false
                }
            }
        }

        keepWH.push({ W: randLeft, H: randTop })

        div1.style.left = randLeft
        div1.style.top = randTop
        listOfDivs.push(div1)
        container.append(div1)
    }
}

let choice = NaN
let listOfChoices = [-1]
container.addEventListener('mouseup', (e) => {
    // console.log(e.target.classList)
    if (e.target.classList[0] === 'randNum') {
        choice = parseInt(e.target.innerText)
        console.log(choice)

        if (choice -1   === listOfChoices[listOfChoices.length-1]) {
            console.log(true)

            listOfChoices.push(choice)
            console.log(listOfDivs[choice])
            // container.removeChild(listOfDivs[choice])
            listOfDivs[choice].remove()
            // listOfDivs.pop()
            if(listOfDivs.length === listOfChoices.length - 1){
                listOfChoices = [-1]
                listOfDivs = []
                tCount++
                genRandNum(tCount)
            }
            
        } else {
            container.innerText = '';
            listOfChoices = [-1]
            listOfDivs = []
            tCount = 5
        }

    }

})
