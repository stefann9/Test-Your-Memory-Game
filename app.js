const container = document.querySelector('.container');

function makeRand(min, max) {
    return Math.random() * (max - min) + min;
}

let tSize = 38;
let tCount = 20;
// impartim containerul in spati disponibile pe rand si coloane pentru 
// grosimea si inaltimea numerelor
let numRow = Math.floor(container.offsetWidth/tSize);
let numCol = Math.floor(container.offsetHeight/tSize);
let spacesOnRow = [];
let spacesOnCol = [];

for(let x of Array(numRow).keys()){
    spacesOnRow.push(x)
}
for(let x of Array(numCol).keys()){
    spacesOnCol.push(x)
}
function shuffle(array) {
    array.sort(function() {
      return Math.random() - .5;
    });
  }
shuffle(spacesOnRow)
 shuffle(spacesOnCol)
// let listWidth = []
// let listHeight = []
for (let i = 0; i <= 13; i++) {


    const div1 = document.createElement('div')
    div1.classList.add('randNum');
    div1.innerText = 1

    randLeft = `${spacesOnRow[i]* tSize}px`
    randTop = `${spacesOnCol[i]*tSize}px`
    // randLeft = makeRand(0, container.offsetWidth) + 'px'
    // randTop = makeRand(0, container.offsetHeight) + 'px'

   
    div1.style.left = randLeft
    div1.style.top = randTop


    container.append(div1)
}

 // listHeight.push(randTop)
    // listWidth.push(randLeft)

 // let x = document.createElement('div');
    // x.innerText = 1
    // x.style.position = 'static'
    // div1.append(x)













container.addEventListener('click', (e) => {
    console.log(e.target)
})