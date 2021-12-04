const canvas = document.querySelector('#canvas');

const rendered_shapes = [];

// const shapes = [{name: 'circle', path:name: 'square'}]
const shapes = ['circle-sw','circle-nw','circle-ne','circle-se','square','sw-triangle','nw-triangle','ne-triangle','se-triangle']
const colours = ['blue','red','yellow']
let colours_i = 0;

const initial_size = 20;

const cloner = document.querySelector('#cloner .shape')

const Shape = (x, y) => {

  let shape = 'square';
  let colour = colours[colours_i];
  colours_i === colours.length - 1 ? colours_i = 0 : colours_i++;

  let clone = cloner.cloneNode(true);

  let w = 0, h = 0;

  clone.style.left = x + 'px';
  clone.style.top = y + 'px';
  clone.style.width = 0 + 'px';
  clone.style.height = 0 + 'px';

  clone.classList.remove('blue');
  clone.classList.add(colour);

  canvas.appendChild(clone);
  // must be rendered to have size

  let target = undefined;
  let click_hold = undefined;
  // clone.addEventListener('click', ()=>{
  //   click_hold ? changeColour() : changeShape();
  // })

  let click_hold_timer;
  clone.addEventListener('mousedown', ()=>{
    target = event.path[0].nodeName === "svg" ? event.path[0] : event.path[1]; //nodeName or tagName
    click_hold = false;
    clearTimeout(click_hold_timer)
    click_hold_timer = setTimeout(()=>{click_hold = true; clone.style.cursor = 'alias';},300)

    // clone.style.cursor = 'grab';
    mousedown = {x: event.x, y: event.y};
    let m = 20;
    if (event.x > w - m && event.y > h - m) {
      clearTimeout(click_hold_timer)
      canvas.addEventListener('mousemove', resizeSE);
      canvas.addEventListener('mouseup', resizeSEDone);
    } else {
      canvas.addEventListener('mousemove', moveShape);
      canvas.addEventListener('mouseup', moveEnd);
    }

    clone.removeEventListener('mousemove', changeResizeCursor);
  })

  const moveEnd = () => {
    canvas.removeEventListener('mousemove', moveShape)
    clearTimeout(click_hold_timer);
    if (mousedown.x !== event.x || mousedown.y !== event.y) {
      x -= (mousedown.x - event.x);
      y -= (mousedown.y - event.y);
      w -= (mousedown.x - event.x);
      h -= (mousedown.y - event.y);
      clone.style.cursor = 'pointer';
      console.log(x, y, w, h, clone)
    } else {
      clone.style.cursor = 'pointer';
      click_hold ? changeColour() : changeShape();
    }
    canvas.removeEventListener('mouseup', moveEnd);
    clone.addEventListener('mousemove', changeResizeCursor);
  }

  const resizeSE = () => {
    clone.style.width = w - x - (mousedown.x - event.x);
    clone.style.height = h - y - (mousedown.y - event.y);
  }

  const resizeSEDone = () => {
    canvas.removeEventListener('mousemove', resizeSE);
    // clearTimeout(click_hold_timer);
    clone.style.cursor = 'pointer';
    w -= (mousedown.x - event.x);
    h -= (mousedown.y - event.y);
    canvas.removeEventListener('mouseup', resizeSEDone)
    clone.addEventListener('mousemove', changeResizeCursor);
  }

  let resizing
  const changeResizeCursor = () => {
    let m = 20; // margin
    if (event.x < x + m && event.y < y + m) {
      clone.style.cursor = 'nw-resize';
    } else if (event.x > w - m && event.y < y + m) {
      clone.style.cursor = 'ne-resize';
    } else if (event.x > w - m && event.y > h - m) {
      clone.style.cursor = 'se-resize';
    } else if (event.x < x + m && event.y > h - m) {
      clone.style.cursor = 'sw-resize';
    } else {
      clone.style.cursor = 'pointer';
    }
  }
  clone.addEventListener('mousemove', changeResizeCursor);

  let dom = clone;

  const changeShape = () => {
    console.log('changeShape')
    clone.classList.remove(shape)
    shapes.indexOf(shape) === shapes.length - 1 ? shape = shapes[0] : shape = shapes[shapes.indexOf(shape)+1];
    clone.classList.add(shape)
  }
  const changeColour = () => {
    console.log('changeColour', 'from', colour)
    clone.classList.remove(colour)
    colours.indexOf(colour) === colours.length - 1 ? colour = colours[0] : colour = colours[colours.indexOf(colour)+1];
    console.log('to', colour)
    clone.classList.add(colour)
  }
  const changeSize = (xx,yy,ww,hh) => {
    w = ww;
    h = hh;
    x = xx;
    y = yy;
    clone.style.left = xx;
    clone.style.top = yy + 'px';
    clone.style.width = ww - xx + 'px';
    clone.style.height = hh - yy + 'px';
  }
  const moveShape = () => {
    console.log('moveShape', mousedown.x, mousedown.y, '>',event.x, event.y)
    clone.style.cursor = 'move';
    clone.style.left = x - (mousedown.x - event.x);
    clone.style.top = y - (mousedown.y - event.y);
  }
  const getCoords = () => {
    return {x: clone.style.left}
  }
  // console.log(shape)
  return {changeShape, x,y,w,h, changeSize, getCoords, dom}
}

const createShape = (x, y) => {
  // console.log(x, y)
  let new_shape = Shape(x, y);
  new_shape.dom.addEventListener('mousedown',()=>{console.log(new_shape)})
  rendered_shapes.push(new_shape)
  return new_shape;
}

canvas.addEventListener('mouseup', () => {
  canvas.removeEventListener('mousemove', dragSize);



  if (event.path[1].classList.contains('shape') || event.path[0].classList.contains('shape')) {
    console.log(event)
  } else {
    // createShape(mousedown.x, mousedown.y, event.x, event.y);
    // if drag doesn't happen
    if (mousedown.x === event.x || mousedown.y === event.y) {
      selected_shape.changeSize(mousedown.x - 10,mousedown.y - 10,mousedown.x + 10,mousedown.y + 10);
    }
    console.log(rendered_shapes)
  }

}, true)

let mousedown = {x: 0, y: 0};

let selected_shape = undefined;

canvas.addEventListener('mousedown', () => {

  // click on shape
  if (event.path[1].classList.contains('shape') || event.path[0].classList.contains('shape')) {
    // selected_shape =
    // if (mousedown.x > selected_shape)
  } else {
    mousedown = {x: event.x, y: event.y};
    selected_shape = createShape(event.x, event.y);
    canvas.addEventListener('mousemove', dragSize)
  }

})

const dragSize = () => {
    console.log('dragSize')
    let x = mousedown.x < event.x ? mousedown.x : event.x;
    let y = mousedown.y < event.y ? mousedown.y : event.y;
    let w = mousedown.x < event.x ? event.x : mousedown.x;
    let h = mousedown.y < event.y ? event.y : mousedown.y;
    selected_shape.changeSize(x,y,w,h);

}



console.log(canvas.offsetWidth, canvas.offsetHeight)

const timeline = document.querySelector('#time-line');

var id = null;
function timelineMove() {
  var elem = timeline;
  var pos = 0;
  clearInterval(id);
  id = setInterval(frame, 10);
  function frame() {
    if (pos >= canvas.offsetWidth) {
      // clearInterval(id);
      pos = 0;
    } else {
      pos++;
      elem.style.left = pos + 'px';
    }
  }
}
timelineMove();


// let msecs = 0;
// const timer1 = () => {
//
//   setInterval(() => {msecs++;console.log(msecs)}, 1)
// }
// timer1()
//
// const timer_display = document.querySelector('#timer');
//
// let load_time = new Date();
//
// const updateTimeDisplay = () => {
//
//   setInterval(() => {
//
//     timer_display.innerHTML = (new Date() - load_time) + ' ' + msecs;
//   }, 100)
// }
// updateTimeDisplay()


//////////////////////////////////////////////////////////////


const audioContext = new AudioContext();

const SAMPLE_RATE = audioContext.sampleRate;
const timeLength = 1; // measured in seconds

const buffer = audioContext.createBuffer(
  1,
  SAMPLE_RATE * timeLength,
  SAMPLE_RATE
);

const channelData = buffer.getChannelData(0);

for (let i = 0; i < buffer.length; i++) {
  channelData[i] = Math.random() * 2 - 1;
}

const primaryGainControl = audioContext.createGain();
primaryGainControl.gain.setValueAtTime(0.05, 0);

const squareButton = document.querySelector('#shape-picker .square');
squareButton.addEventListener('click', () => {
  console.log('square');
  const squareOscillator = audioContext.createOscillator();
  squareOscillator.type = 'square';
  squareOscillator.frequency.setValueAtTime(261.6, 0);
  squareOscillator.connect(primaryGainControl);
  squareOscillator.start();
  squareOscillator.stop(audioContext.currentTime + 0.5);
})

const circleButton = document.querySelector('#shape-picker .circle');
circleButton.addEventListener('click', () => {
  console.log('circle');
  const circleOscillator = audioContext.createOscillator();
  circleOscillator.type = 'sine';
  circleOscillator.frequency.setValueAtTime(261.6, 0);
  circleOscillator.connect(primaryGainControl);
  circleOscillator.start();
  circleOscillator.stop(audioContext.currentTime + 0.5);
})

const triangleButton = document.querySelector('#shape-picker .triangle');
triangleButton.addEventListener('click', () => {
  console.log('triangle');
  const triangleOscillator = audioContext.createOscillator();
  triangleOscillator.type = 'triangle';
  triangleOscillator.frequency.setValueAtTime(261.6, 0);
  triangleOscillator.frequency.linearRampToValueAtTime(293.66, audioContext.currentTime + 0.25) // 293.66 / 349.23
  triangleOscillator.frequency.linearRampToValueAtTime(291.6, audioContext.currentTime + 0.5)
  triangleOscillator.connect(primaryGainControl);
  triangleOscillator.start();
  triangleOscillator.stop(audioContext.currentTime + 0.5);
})

primaryGainControl.connect(audioContext.destination);
