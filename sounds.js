

//////////////////////////////////////////////////////////////
console.log(getShapes())

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

const secondaryGainControl = audioContext.createGain();
secondaryGainControl.gain.setValueAtTime(0.012, 0);

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

const circleButton = document.querySelector('#shape-picker .circle-se');
circleButton.addEventListener('click', () => {
  console.log('circle');
  const circleOscillator = audioContext.createOscillator();
  circleOscillator.type = 'sine';
  circleOscillator.frequency.setValueAtTime(261.6, 0);
  circleOscillator.connect(primaryGainControl);
  circleOscillator.start();
  circleOscillator.stop(audioContext.currentTime + 0.5);
})

const triangleButton = document.querySelector('#shape-picker .triangle-sw');
triangleButton.addEventListener('click', () => {
  console.log('triangle');
  const triangleOscillator = audioContext.createOscillator();
  triangleOscillator.type = 'triangle';
  triangleOscillator.frequency.setValueAtTime(293.66, 0);
  triangleOscillator.frequency.linearRampToValueAtTime(261.6, audioContext.currentTime + 0.25) // 293.66 / 349.23

  const triangleGain = audioContext.createGain();
  triangleGain.gain.setValueAtTime(1, 0);
  triangleGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.25);
  triangleOscillator.connect(triangleGain);

  triangleOscillator.connect(primaryGainControl);
  triangleOscillator.start(1);
  triangleOscillator.stop(audioContext.currentTime + 0.5);
})

//shape colour, x, y (top left coords), w, h (bottom right coords)
const playShape = (s, c, x, y, w, h) => {
  const oscillator = audioContext.createOscillator();
  console.log(s);
  oscillator.type = s.includes('triangle') ? 'triangle' : s.includes('circle') ? 'sine' : 'square';
  // oscillator.gain
  console.log(s);
}

const playTriangleSW = (colour, x, y, w, h) => {

}

const playTriangleNW = () => {

}

primaryGainControl.connect(audioContext.destination);
secondaryGainControl.connect(audioContext.destination);


////////

// const wholeLoopTimer = () => {
//
//   setInterval(() => {
//     let current_shapes = getShapes();
//     console.log(current_shapes)
//     current_shapes.forEach(shape => {
//       playShape(shape)
//     })
//
//   }, canvas.offsetWidth * 10)
// }
// wholeLoopTimer();

////////////

let canvas_width = canvas.offsetWidth;
let canvas_height = canvas.offsetHeight;

let tempo = 60.0;
// const bpmCpontrol

const lookahead = 25.0; // how frequently to call scheduling function (in milliseconds)
const scheduleAheadTime = 0.1; // how far ahead to schedule audio (sec)


// inital time line 1px every 10 msecs

let current_note = 0;


// so what yu wanna o is have the scheduler checking every 25/50/100 msecs/pixels if anythng new has been drawn in front of it, - so check all the drawn shapes for an x reading, afor any in that block of time, schedule them using the one vairbale input for osc.start()

let schedule_time = 0;

const scheduleShape = ({s, c, x, y, w, h}, time) => {
  const oscillator = audioContext.createOscillator();
  console.log('scheduling:', c, s);
  // oscillator.type = s.includes('triangle') ? 'triangle' : s.includes('circle') ? 'sine' : 'square';
  oscillator.type = c === 'blue' ? 'square' : c === 'red' ? 'sine' : 'triangle';
  // oscillator.gain
  oscillator.frequency.setValueAtTime(canvas_height - y, 0);
  // oscillator.frequency.linearRampToValueAtTime(261.6, audioContext.currentTime + 0.25)

  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(0.1, time);
  // gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.25);
  oscillator.connect(gain);

  oscillator.connect(c === 'blue' ? secondaryGainControl : primaryGainControl);
  oscillator.start(time);
  let shape_length = ((w - x) / 100);
  oscillator.stop(time + shape_length);
}

const moveScheduler = () => {

}

let loop = 0;
let last_schedule = undefined;
let shapes_scheduled = [];

const scheduler = () => {

  let playhead = ((audioContext.currentTime * 100) % canvas_width);

  let current_time = audioContext.currentTime;
  // while () next 100s contains notes to play, schedule them, and add to notes played this loop
  // while (schedule_time < audioContext.currentTime + lookahead) {
  //   schedule_time += lookahead;
  // }

  // while (current_shapes.in)
  current_shapes.forEach(shape=> {
    // console.log(shapes_scheduled.indexOf(shape));
    if (
      (shape.x > playhead && shape.x < playhead + lookahead)
      && !shapes_scheduled.includes(shape)
    ) {
      let time = ((shape.x - playhead) / 100) + current_time;
      scheduleShape(shape, time);
      shapes_scheduled.push(shape);
      // console.log(shape)
    }
  })

  schedule_dom.add(playhead)
  if (last_schedule > playhead) {
    loop++;
    schedule_dom.reset();
    shapes_scheduled = [];
  }



  last_schedule = playhead;

  // on end of loop, reset notes played and playhead and time
}

setInterval(scheduler, 100);


let msecs = 0;
const timer1 = () => {

  setInterval(() => {msecs++;}, 1)
}
timer1()

const timer_display = document.querySelector('#timer');

let load_time = new Date();

const updateTimeDisplay = () => {

  setInterval(() => {
    // loop_no = ((audioContext.currentTime * 100) % canvas_width)
    let playhead = ((audioContext.currentTime * 100) % canvas_width).toFixed(0);
    timer_display.innerHTML = audioContext.currentTime.toFixed(3) + 's ' + (new Date() - load_time) + ' ' + playhead + ' loop' + loop;

  }, 100)
  // setInterval(() => {
  //
  // }, 100)


}
updateTimeDisplay()

/////////////////////////////////////////////

const timeline = document.querySelector('#time-line');

let id = null;
function timelineMove() {
  clearInterval(id);
  id = setInterval(frame, 10);
  function frame() {
    timeline.style.left = ( (audioContext.currentTime*100) % canvas_width ) + 'px';
  }
}
timelineMove();

const schedule_dom = (() => {
  const dom = document.querySelector('#schedule');
  const reset = () => dom.innerHTML = '';
  const add = (time) => {
    let row = document.createElement('div');
    row.classList.add('row');
    let child = document.createElement('div');
    child.classList.add('child');
    child.style.left = time + 'px';
    child.style.width = lookahead + 'px';
    dom.appendChild(row);
    row.appendChild(child);
  };
  return {reset, add}
})();

schedule_dom.add(time);
