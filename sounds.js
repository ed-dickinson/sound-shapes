

//////////////////////////////////////////////////////////////

const audioContext = new AudioContext();

const SAMPLE_RATE = audioContext.sampleRate;
const timeLength = 1; // measured in seconds

const buffer = audioContext.createBuffer(
  1,
  SAMPLE_RATE * timeLength,
  SAMPLE_RATE
);

const startAudio = () => {

  unplayed = false; //remove

  const node = audioContext.createBufferSource();
  node.buffer = buffer;
  node.start(0);

  canvas.removeEventListener('click', startAudio);
}

canvas.addEventListener('click', startAudio);



const channelData = buffer.getChannelData(0);

for (let i = 0; i < buffer.length; i++) {
  channelData[i] = Math.random() * 2 - 1;
}

const primaryGainControl = audioContext.createGain();
primaryGainControl.gain.setValueAtTime(0.05, 0);

const secondaryGainControl = audioContext.createGain();
secondaryGainControl.gain.setValueAtTime(0.01, 0);

// const squareButton = document.querySelector('#shape-picker .square');
// squareButton.addEventListener('click', () => {
//   console.log('square');
//   const squareOscillator = audioContext.createOscillator();
//   squareOscillator.type = 'square';
//   squareOscillator.frequency.setValueAtTime(261.6, 0);
//   squareOscillator.connect(primaryGainControl);
//   squareOscillator.start();
//   squareOscillator.stop(audioContext.currentTime + 0.5);
// })
//
// const circleButton = document.querySelector('#shape-picker .circle-se');
// circleButton.addEventListener('click', () => {
//   console.log('circle');
//   const circleOscillator = audioContext.createOscillator();
//   circleOscillator.type = 'sine';
//   circleOscillator.frequency.setValueAtTime(261.6, 0);
//   circleOscillator.connect(primaryGainControl);
//   circleOscillator.start();
//   circleOscillator.stop(audioContext.currentTime + 0.5);
// })
//
// const triangleButton = document.querySelector('#shape-picker .triangle-sw');
// triangleButton.addEventListener('click', () => {
//   console.log('triangle');
//   const triangleOscillator = audioContext.createOscillator();
//   triangleOscillator.type = 'triangle';
//   triangleOscillator.frequency.setValueAtTime(293.66, 0);
//   triangleOscillator.frequency.linearRampToValueAtTime(261.6, audioContext.currentTime + 0.25) // 293.66 / 349.23
//
//   const triangleGain = audioContext.createGain();
//   triangleGain.gain.setValueAtTime(1, 0);
//   triangleGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.25);
//   triangleOscillator.connect(triangleGain);
//
//   triangleOscillator.connect(primaryGainControl);
//   triangleOscillator.start(1);
//   triangleOscillator.stop(audioContext.currentTime + 0.5);
// })

//shape colour, x, y (top left coords), w, h (bottom right coords)
const playShape = (s, c, x, y, w, h) => {
  const oscillator = audioContext.createOscillator();
  console.log(s);
  oscillator.type = s.includes('triangle') ? 'triangle' : s.includes('circle') ? 'sine' : 'square';
  // oscillator.gain
  console.log(s);
}

primaryGainControl.connect(audioContext.destination);
secondaryGainControl.connect(audioContext.destination);


////////
// wavetables

// const wave = audioContext.createPeriodicWave(ethnic33.real, ethnic33.imag)
const wave1 = audioContext.createPeriodicWave(celeste.real, celeste.imag)
const wave2 = audioContext.createPeriodicWave(bass.real, bass.imag)
const wave3 = audioContext.createPeriodicWave(dynaep_med.real, dynaep_med.imag)

////////


let canvas_width = canvas.offsetWidth;
let canvas_height = canvas.offsetHeight;

const loFrqLimit = 20;
const hiFrqLimit = 500;

let tempo = 60.0;
// const bpmCpontrol

const lookahead = 25.0; // how frequently to call scheduling function (in milliseconds)
const scheduleAheadTime = 0.1; // how far ahead to schedule audio (sec)


// inital time line 1px every 10 msecs

let current_note = 0;


// so what yu wanna o is have the scheduler checking every 25/50/100 msecs/pixels if anythng new has been drawn in front of it, - so check all the drawn shapes for an x reading, afor any in that block of time, schedule them using the one vairbale input for osc.start()

let schedule_time = 0;

const yToFrq = (y) => {
  let frequency = (canvas_height - y) / (hiFrqLimit - loFrqLimit) * 100;
  return frequency + loFrqLimit;
}

const scheduleShape = ({s, c, x, y, w, h}, time) => {
  let shape_length = ((w - x) / 100);

  const oscillator1 = audioContext.createOscillator();
  const oscillator2 = audioContext.createOscillator();
  // oscillator.type = s.includes('triangle') ? 'triangle' : s.includes('circle') ? 'sine' : 'square';

  // oscillator1.type = c === 'blue' ? 'square' : c === 'red' ? 'sine' : 'triangle';
  // oscillator2.type = c === 'blue' ? 'square' : c === 'red' ? 'sine' : 'triangle';
  // oscillator1.setPeriodicWave(wave);
  // oscillator2.setPeriodicWave(wave);
  oscillator1.setPeriodicWave(c === 'blue' ? wave3 : c === 'red' ? wave2 : wave1);
  oscillator2.setPeriodicWave(c === 'blue' ? wave3 : c === 'red' ? wave2 : wave1);

  // oscillator.gain
  oscillator1.frequency.setValueAtTime(yToFrq(y), 0);
  oscillator2.frequency.setValueAtTime(canvas_height - h, 0);
  if (s === 'triangle-nw') {
    oscillator2.frequency.linearRampToValueAtTime(canvas_height - y, time + shape_length)
  } else if (s === 'triangle-ne') {
    oscillator2.frequency.setValueAtTime(canvas_height - y, time);
    oscillator2.frequency.linearRampToValueAtTime(canvas_height - h, time + shape_length)
  } else if (s === 'triangle-se') {
    oscillator1.frequency.setValueAtTime(canvas_height - h, time);
    oscillator1.frequency.linearRampToValueAtTime(canvas_height - y, time + shape_length)
  } else if (s === 'triangle-sw') {
    oscillator1.frequency.linearRampToValueAtTime(canvas_height - h, time + shape_length)
  }

  // let waveShaperNode = audioContext.createWaveShaper();
  // // waveShaperNode.curve = 0;
  //
  // function makeDistortionCurve(amount) {
  //   let k = typeof amount === 'number' ? amount : 50,
  //     n_samples = 44100,
  //     curve = new Float32Array(n_samples),
  //     deg = Math.PI / 180,
  //     i = 0,
  //     x;
  //   for ( ; i < n_samples; ++i ) {
  //     x = i * 2 / n_samples - 1;
  //     curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  //   }
  //   return curve;
  // };
  //
  // waveShaperNode.curve = makeDistortionCurve(400);
  // waveShaperNode.oversample = '4x';
  //
  // oscillator1.connect(waveShaperNode)
  // oscillator2.connect(waveShaperNode)

  // const amp = audioContext.createGain();
  // amp.gain.setValueAtTime(0.01, audioContext.currentTime);
  //
  // const lfo = audioContext.createOscillator();
  // lfo.type = 'square';
  // lfo.frequency.value = yToFrq(y) * 100;
  // lfo.connect(amp.gain);
  // oscillator1.connect(amp).connect(audioContext.destination);
  // lfo.start();

  // oscillator1.connect(lfo)

  // not working?
  const clickControlGain = audioContext.createGain();
  clickControlGain.gain.setValueAtTime(0.1, time);
  clickControlGain.gain.exponentialRampToValueAtTime(0.001, time + shape_length);
  oscillator1.connect(clickControlGain);
  oscillator2.connect(clickControlGain);

  // oscillator1.connect(c === 'blue' ? secondaryGainControl : primaryGainControl);
  // oscillator2.connect(c === 'blue' ? secondaryGainControl : primaryGainControl);
  oscillator1.connect(primaryGainControl);
  oscillator2.connect(primaryGainControl);

  oscillator1.start(time);
  oscillator2.start(time);

  oscillator1.stop(time + shape_length);
  oscillator2.stop(time + shape_length);
}

let loop = 0;
let last_schedule = undefined;
let shapes_scheduled = [];

const scheduler = () => {

  let playhead = ((audioContext.currentTime * 100) % canvas_width);

  let current_time = audioContext.currentTime;
  // while () next 100s contains notes to play, schedule them, and add to notes played this loop

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
      schedule_dom.sched(time.toFixed(2), shape.c);
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

/// play button
const play_button = document.querySelector('#play-button');
let schedule_interval = setInterval(scheduler, 100);

let playing = true;
let unplayed = true;

play_button.addEventListener('click', () => {
  // startAudio;
  if (unplayed) {
    startAudio;
    unplayed = false;
  }
  else if (playing) {
    clearInterval(schedule_interval)
    playing = false;
    play_button.innerHTML = 'Start';
  } else {
    schedule_interval = setInterval(scheduler, 100);
    playing = true;
    play_button.innerHTML = 'Stop';
  }
})



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
  const sched = (time, colour) => {
    let info = document.createElement('div');
    info.classList.add('schedule-info');
    info.style.left = (time*100 % canvas_width) + 'px';
    info.innerHTML = (time*100 % canvas_width).toFixed(0) + '<br>' + colour;
    dom.appendChild(info);
  }
  return {reset, add, sched}
})();

// schedule_dom.add(time);
