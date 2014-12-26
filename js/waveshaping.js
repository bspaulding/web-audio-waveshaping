function chain() {
  var nodes = Array.prototype.slice.apply(arguments, [0]);
  for (var i = 0; i < nodes.length - 1; i += 1) {
    nodes[i].connect(nodes[i+1]);
  }
}

var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var rawGuitar = audioContext.createBufferSource();
var gain = audioContext.createGain();
var convolver = audioContext.createConvolver();
var waveshaper = audioContext.createWaveShaper();
waveshaper.curve = waveshapers.passthrough;
waveshaper.oversample = '4x';

chain(rawGuitar, waveshaper, convolver, gain, audioContext.destination);

var loadRawGuitar = new XMLHttpRequest();
loadRawGuitar.open("GET", "audio/guitar-raw.wav", true);
loadRawGuitar.responseType = "arraybuffer";
loadRawGuitar.onload = function () {
  audioContext.decodeAudioData(loadRawGuitar.response, function(buffer) {
    rawGuitar.buffer = buffer;
    rawGuitar.loop = true;
    rawGuitar.start(0);
    console.log('guitar started');
  });
};
loadRawGuitar.send();

var convolutions = {
  "GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ BBAE 0": {
    url: "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ BBAE 0.wav"
  },
  "GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ BBAE-1": {
    url: "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ BBAE-1.wav"
  },
  "GuitarHacks Impulses/Original 3 Impulses/GuitarHack Original Between": {
    url: "audio/convolutions/GuitarHacks Impulses/Original 3 Impulses/GuitarHack Original Between.wav"
  },
  "GuitarHacks Impulses/Original 3 Impulses/GuitarHack Original Centre": {
    url: "audio/convolutions/GuitarHacks Impulses/Original 3 Impulses/GuitarHack Original Centre.wav"
  },
  "GuitarHacks Impulses/Original 3 Impulses/GuitarHack Original Edge": {
    url: "audio/convolutions/GuitarHacks Impulses/Original 3 Impulses/GuitarHack Original Edge.wav"
  },
};

function loadIR(ir) {
  if (ir.buffer) {
    convolver.buffer = ir.buffer;
    console.log('loaded ', ir.url);
    return;
  }

  var loadConvolution = new XMLHttpRequest();
  loadConvolution.open("GET", ir.url, true);
  loadConvolution.responseType = "arraybuffer";
  loadConvolution.onload = function () {
    audioContext.decodeAudioData(loadConvolution.response, function(buffer) {
      ir.buffer = buffer;
      convolver.buffer = buffer;
      console.log('loaded ', ir.url);
    });
  };
  loadConvolution.send();
}
