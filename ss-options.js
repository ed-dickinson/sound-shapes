//////////////////////////////////////////////////////////////
//OPTIONS

let optionsOpen = true;
const options_box = document.querySelector('#options');
let displayOn = true;
let headingOn = true;
const heading_title = document.querySelector('h1#main-title');

const openOptions = (e) => {
  switch (e.code) {
    case 'KeyO':
      optionsOpen ? options_box.style.display = 'none' : options_box.style.display = 'block';
      optionsOpen = !optionsOpen;
      break;
    case 'KeyD':
      // optionsOpen ? options_box.style.display = 'none' : options_box.style.display = 'block';
      displayOn = !displayOn;
      displaySwitch();
      break;
    case 'KeyH':
      heading_title.style.display = displayOn ? 'block' : 'none';
      displayOn = !displayOn;
      break;
    case 'KeyA':
      activateSound();
      activateSwitch();
      break;
    case 'KeyB':
      blankCanvasSelect();
      break;
  }

  if (optionsOpen) {
    if (e.code === 'KeyC') {curve = curve === 'frequency' ? 'filter' : 'frequency'}
    else if (e.code === 'KeyS') {slope = slope === 'frequency' ? 'filter' : 'frequency'}
    else if (e.code === 'KeyP') {switchOption(pitch)}
  }

  if (blank_canvas_2nd_stage_active) {
    if (e.code === 'KeyY') {clearShapes(); blankCanvasSelect();}
    else if (e.code === 'KeyN') {blankCanvasSelect();}
  }
}

const switchOption = (option) => {
  if (option === pitch) {
    pitch = pitch === 'linear' ? 'exponential' : 'linear';
    let options = document.querySelectorAll('#options .pitch .option');
    if (pitch === 'linear') {
      options[1].classList.remove('selected');
      options[0].classList.add('selected');
    } else {
      options[0].classList.remove('selected');
      options[1].classList.add('selected');
    }
  }
}

document.addEventListener('keydown', openOptions);

let curve = 'frequency'; //filter
let slope = 'frequency'; //filter
let pitch
          // = 'linear'; //exponential
          = 'exponential';
let tuning = 'free';

const pitch_linear = document.querySelector('#options .pitch .linear');
pitch_linear.addEventListener('click', () => {
  pitch = 'linear';
  pitch_exponential.classList.remove('selected');
  pitch_linear.classList.add('selected');
  frequencyLog();
});
const pitch_exponential = document.querySelector('#options .pitch .exponential');
pitch_exponential.addEventListener('click', () => {
  pitch = 'exponential';
  pitch_linear.classList.remove('selected');
  pitch_exponential.classList.add('selected');
  frequencyLog();
});

let tuning_options = document.querySelectorAll('#options .tuning .option');
tuning_options.forEach(dom => {
  dom.addEventListener('click', ()=>{
    tuning = dom.innerHTML;
    tuning_options.forEach(option => {
      option.classList.remove('selected')
    })
    dom.classList.add('selected');
  })
})

let display_options = document.querySelectorAll('#options .display .option');
const displaySwitch = () => {
  // frequency_display.style.display = displayOn ? 'block' : 'none';
  // timer_display.style.display = displayOn ? 'block' : 'none';
  // document.querySelector('#function-buttons').style.display = displayOn ? 'block' : 'none';
  // play_button.style.display = displayOn ? 'block' : 'none';

  [frequency_display, timer_display, play_button, document.querySelector('#function-buttons')].forEach(element => {
    element.style.display = displayOn ? 'block' : 'none';
  })

  display_options.forEach(option => {
    option.classList.remove('selected')
    if (displayOn && option.innerHTML === 'On') {option.classList.add('selected')}
    else if (!displayOn && option.innerHTML === 'Off') {option.classList.add('selected')}
  })
  heading_title.style.left = displayOn ? '50px' : '0px';
  options_box.style.left = displayOn ? '50px' : '0px';
}
display_options.forEach(dom => {
  dom.addEventListener('click', ()=>{
    displayOn = dom.innerHTML === 'On' ? true : false;
    displaySwitch();
  })
})

let activate_options = document.querySelectorAll('#options .activate .option');
const activateSwitch = () => {
  activate_options.forEach(dom => {
    dom.classList.remove('selected');
  })
  playing ? activate_options[0].classList.add('selected') : activate_options[1].classList.add('selected');
}
activate_options.forEach(dom => {
  dom.addEventListener('click', activateSwitch);
})

const blank_canvas_2nd_stage = document.querySelector('#options .blank-canvas .second-stage');
let blank_canvas_2nd_stage_active = false;
const blankCanvasSelect = () => {
  blank_canvas_2nd_stage_active = !blank_canvas_2nd_stage_active;
  blank_canvas_2nd_stage.style.display = blank_canvas_2nd_stage_active ? 'inline' : 'none';

}
document.querySelector('.blank-canvas > .slash').addEventListener('click', blankCanvasSelect);
document.querySelectorAll('#options .blank-canvas .second-stage .option').forEach(dom => {
  dom.addEventListener('click', () => {
    if (dom.innerHTML === 'Yes') {clearShapes();}
    blankCanvasSelect();
  })
})
