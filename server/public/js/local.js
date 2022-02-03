const rwords = ["cajero", "zorro", "kilogramo", "viento", "diente", "cabello", "fuego", "lluvia", "cosas", "palmera", "levantar", "elefante", "segar", "socorro", "nido", "masa", "gastar", "lanzar", "cuatro", "cortina", "rotar", "emparejar", "alto", "vestuario", "criticar", "ostra", "estatua", "casco", "vertical", "norte", "nido", "rotar"];
const rletters = 'qwertyuiopasdfghjklñzxcvbnm';

let palabra = palabraIa = '', letras = letrasIa = '1', vidas = vidasIa = 7;

const game = document.querySelector('.game__');
const word = document.querySelector('.word__');
const form = document.querySelector('form');
game.style.display = 'none'

form.addEventListener('submit', e => {
  e.preventDefault();
  palabra = form[0].value;
  palabraIa = rwords[Math.round(Math.random() * rwords.length - 1)];
  console.log(palabraIa);
  word.style.display = 'none';
  game.style.display = 'block';
  board();
});


function board() {
  /* letras */
  document.querySelector('.foundedLetters').innerHTML = letrasE(palabraIa, letras);
  document.querySelector('.guestLetters').innerHTML = letrasE(palabra, letrasIa) + ' ';
  /* teclado */
  keyboard();
  /* vidas */
  let hp1 = getLives(palabraIa, letras), hp2 = getLives(palabra, letrasIa);
  ;

  document.querySelector('.lives').innerHTML = vidasPrint(hp1);
  document.querySelector('.guestLives').innerHTML = vidasPrint(hp2);
}

function setLetter(e) {
  letras += e;
  randomletter()
  board();
}

function randomletter() {
  let x = rletters[Math.round(Math.random() * rletters.length - 1)];
  if (!letrasIa.includes(x)) {
    letrasIa += x;
    return true;
  }
  randomletter();
}

/* vidas */
function getLives(p, l) {
  l = l.slice(1)
  p = p.split('').filter((item, pos) => {
    return p.indexOf(item) == pos;
  }).join().replace(/,/g, '');
  let x = l.length;
  for (let i = 0; i < p.length; i++) {
    if (l.split('').includes(p[i])) {
      x -= 1;
    }
  }
  return 7 - x;
}

/* imprimir vidas */

function vidasPrint(h1) {
  let t = '';
  for (let i = 0; i < h1; i++) {
    t += '<img src="./img/h1.png">';
  }
  for (let i = 0; i < 7 - h1; i++) {
    t += '<img src="./img/h2.png">';
  }
  return t;
}

/* letras descubiertas */
function letrasE(p, l) {
  let t = '';
  for (i = 0; i < p.length; i++) {
    if (l.includes(p[i])) {
      t += `<span>${p[i]}</span > `
    } else {
      t += `<span class='bar'></span> `
    }
  }
  return t;
}

/* teclado */
function keyboard() {
  document.querySelector('.keyboard').innerHTML = `
  <div>
          <button ${letras.toUpperCase().includes('Q') ? 'class="disabled"' : 'onclick="setLetter(`Q`)"'}>Q</button>
          <button ${letras.toUpperCase().includes('W') ? 'class="disabled"' : 'onclick="setLetter(`W`)"'}>W</button>
          <button ${letras.toUpperCase().includes('E') ? 'class="disabled"' : 'onclick="setLetter(`E`)"'}>E</button>
          <button ${letras.toUpperCase().includes('R') ? 'class="disabled"' : 'onclick="setLetter(`R`)"'}>R</button>
          <button ${letras.toUpperCase().includes('T') ? 'class="disabled"' : 'onclick="setLetter(`T`)"'}>T</button>
          <button ${letras.toUpperCase().includes('Y') ? 'class="disabled"' : 'onclick="setLetter(`Y`)"'}>Y</button>
          <button ${letras.toUpperCase().includes('U') ? 'class="disabled"' : 'onclick="setLetter(`U`)"'}>U</button>
          <button ${letras.toUpperCase().includes('I') ? 'class="disabled"' : 'onclick="setLetter(`I`)"'}>I</button>
          <button ${letras.toUpperCase().includes('O') ? 'class="disabled"' : 'onclick="setLetter(`O`)"'}>O</button>
          <button ${letras.toUpperCase().includes('P') ? 'class="disabled"' : 'onclick="setLetter(`P`)"'}>P</button>
      </div>
      <div>
          <button ${letras.toUpperCase().includes('A') ? 'class="disabled"' : 'onclick="setLetter(`A`)"'}>A</button>
          <button ${letras.toUpperCase().includes('S') ? 'class="disabled"' : 'onclick="setLetter(`S`)"'}>S</button>
          <button ${letras.toUpperCase().includes('D') ? 'class="disabled"' : 'onclick="setLetter(`D`)"'}>D</button>
          <button ${letras.toUpperCase().includes('F') ? 'class="disabled"' : 'onclick="setLetter(`F`)"'}>F</button>
          <button ${letras.toUpperCase().includes('G') ? 'class="disabled"' : 'onclick="setLetter(`G`)"'}>G</button>
          <button ${letras.toUpperCase().includes('H') ? 'class="disabled"' : 'onclick="setLetter(`H`)"'}>H</button>
          <button ${letras.toUpperCase().includes('J') ? 'class="disabled"' : 'onclick="setLetter(`J`)"'}>J</button>
          <button ${letras.toUpperCase().includes('K') ? 'class="disabled"' : 'onclick="setLetter(`K`)"'}>K</button>
          <button ${letras.toUpperCase().includes('L') ? 'class="disabled"' : 'onclick="setLetter(`L`)"'}>L</button>
          <button ${letras.toUpperCase().includes('Ñ') ? 'class="disabled"' : 'onclick="setLetter(`Ñ`)"'}>Ñ</button>
      </div>
      <div>
          <button ${letras.toUpperCase().includes('Z') ? 'class="disabled"' : 'onclick="setLetter(`Z`)"'}>Z</button>
          <button ${letras.toUpperCase().includes('X') ? 'class="disabled"' : 'onclick="setLetter(`X`)"'}>X</button>
          <button ${letras.toUpperCase().includes('C') ? 'class="disabled"' : 'onclick="setLetter(`C`)"'}>C</button>
          <button ${letras.toUpperCase().includes('V') ? 'class="disabled"' : 'onclick="setLetter(`V`)"'}>V</button>
          <button ${letras.toUpperCase().includes('B') ? 'class="disabled"' : 'onclick="setLetter(`B`)"'}>B</button>
          <button ${letras.toUpperCase().includes('N') ? 'class="disabled"' : 'onclick="setLetter(`N`)"'}>N</button>
          <button ${letras.toUpperCase().includes('M') ? 'class="disabled"' : 'onclick="setLetter(`M`)"'}>M</button>
      </div>
  `
}