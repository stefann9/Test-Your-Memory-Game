const container = document.querySelector('.container');

function makeRand(min, max) {
    return Math.random() * (max - min) + min;
}

let tSize = 38;
let tCount = 80;
// impartim containerul in spati disponibile pe rand si coloane pentru 
// grosimea si inaltimea numerelor
let numRow = Math.floor(container.offsetWidth/tSize);
let numCol = Math.floor(container.offsetHeight/tSize);
let spacesOnRow = [];
let spacesOnCol = [];

// salveaza numerele disponibile pe rand
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
//   amesteca spatiile disponibile
shuffle(spacesOnRow)
shuffle(spacesOnCol)

const keepWH = []

// tCountloop:
for (let i = 1; i <= tCount; i++) {

    // in cazul in care marimea lui spacesOnRow si spacesOnCol este depasita adauga mai multe spatii
    while(spacesOnCol.length < tCount || spacesOnRow.length < tCount){
        if(spacesOnCol.length < tCount){
            spacesOnCol.push(...spacesOnCol)
        }else if(spacesOnRow.length < tCount){
            spacesOnRow.push(...spacesOnRow)
        }else{
            break
        }
        
    }

    const div1 = document.createElement('div')
    div1.classList.add('randNum');
    div1.innerText = i

    randLeft = `${spacesOnRow[i]*tSize}px`
    randTop = `${spacesOnCol[i]*tSize}px`

    // whileLoop:
    keepLoop = true
    while(keepLoop && keepWH.length>1){
        // console.log('x')
        for(let x of keepWH){
             if(randLeft === x.W && randTop === x.H){
                 console.log(randLeft === x.W && randTop === x.H)
                 shuffle(spacesOnRow)
                 shuffle(spacesOnCol)
                 randLeft = `${spacesOnRow[i]*tSize}px`
                 randTop = `${spacesOnCol[i]*tSize}px`
                 keepLoop = true
                 break
             }else{
                 keepLoop = false
             }
         }
    }


    // for(let x of keepWH){
    //          while(randLeft === x.W && randTop === x.H){
    //              console.log(randLeft === x.W && randTop === x.H)
    //              shuffle(spacesOnRow)
    //              shuffle(spacesOnCol)
    //              randLeft = `${spacesOnRow[i]*tSize}px`
    //              randTop = `${spacesOnCol[i]*tSize}px`
    //          }
    //      }

    // for(let x of keepWH){
    //     if(randLeft === x.W && randTop === x.H){
    //         console.log(randLeft === x.W && randTop === x.H)
    //         // shuffle(spacesOnRow)
    //         // shuffle(spacesOnCol)
    //         // randLeft = `${spacesOnRow[i]*tSize}px`
    //         // randTop = `${spacesOnCol[i]*tSize}px`
    //         continue tCountloop
    //     }
    // }

    keepWH.push({W:randLeft,H:randTop})

    div1.style.left = randLeft
    div1.style.top = randTop
    container.append(div1)
}

 // listH.push(randTop)
    // listW.push(randLeft)

 // let x = document.createElement('div');
    // x.innerText = 1
    // x.style.position = 'static'
    // div1.append(x)













container.addEventListener('click', (e) => {
    console.log(e.target)
})