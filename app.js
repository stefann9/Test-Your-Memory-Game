const container = document.querySelector('.container');

function makeRand(min,max){
    return Math.random() * (max - min) + min;
}

const div1 = document.createElement('div')

randLeft = makeRand(0,container.offsetWidth) + 'px'
randTop = makeRand(0,container.offsetHeight) + 'px'

div1.innerText = 1
div1.style.position = 'absolute'
div1.style.backgroundColor = 'red'
div1.style.fontSize = '1.5rem'
div1.style.width = '35px'
div1.style.height = '35px'
div1.style.borderRadius = '50%'
div1.style.textAlign = 'center'
div1.style.padding = '0'
div1.style.left = randLeft
div1.style.top = randTop
div1.style.lineHeight = '1.5'
container.append(div1)

const div2 = document.createElement('div')

randLeft = makeRand(0,container.offsetWidth) + 'px'
randTop = makeRand(0,container.offsetHeight) + 'px'

div2.innerText = 9
div2.style.position = 'absolute'
div2.style.backgroundColor = 'red'
div2.style.fontSize = '1.5rem'
div2.style.width = '35px'
div2.style.height = '35px'
div2.style.borderRadius = '50%'
div2.style.textAlign = 'center'
div2.style.lineHeight = '1.5'
// div2.style.padding = '0'
div2.style.left = randLeft
div2.style.top = randTop
container.append(div2)

container.addEventListener('click', (e)=>{
    console.log(e.target)
})