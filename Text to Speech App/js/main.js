// initliase SpeechSynth API
const synth = window.speechSynthesis;

// DOM elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

// initiliase voices array
let voices = [];

const getVoices = () => {
    voices = synth.getVoices();

    // loop through voices and create an option for each one
    voices.forEach(voice => {
        // create an option element
        const option = document.createElement('option');
        // fill option with voice and language
        option.textContent = voice.name + '('+ voice.lang +')';

        // set needed option attributes
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        // adds list to select list
        voiceSelect.appendChild(option);
    });
}

getVoices();
if(synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

// speak
const speak = () => {
    // check if speaking
    if(synth.speaking) {
        console.error('Already speaking...');
        return;
    }
    if(textInput.value !== '') {
        // add background animation
        body.style.background ='#141414 url(../img/AM.gif)';
        body.style.backgroundRepeat = 'repeat-x';
        body.style.backgroundSize = '100% 100%';
    
        // get speak text
        const speakText = new SpeechSynthesisUtterance(textInput.value);
        
        // speak end
        speakText.onend = e => {
            console.log('Done speaking...');
            body.style.background = '#141414';
        }

        // speak error
        speakText.onerror = e => {
            console.error('Something went wrong');
        }

        // selected voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

        // loop through voices
        voices.forEach(voice => {
            if(voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        });

        // set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        // speak
        synth.speak(speakText);
    }
    if(textInput.value == '') {
        // alert user that text is empty
        alert('The text box is empty.  Please enter your chosen phrase.')
    }
};

// event listeners

// text form submit
textForm.addEventListener('submit', e => {
    e.preventDefault();
    speak();
    textInput.blur();
});

// rate value change
rate.addEventListener('change', e => rateValue.textContent = rate.value);

// pitch value change
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value);

// voice select change
voiceSelect.addEventListener('change', e => speak());