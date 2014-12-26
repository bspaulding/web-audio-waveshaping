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

var convolutionUrls = [
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ BBAE 0.wav",
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ BBAE-1.wav",
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ BBAE-half.wav",
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ BETWEEN 0.wav",
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ BETWEEN-1.wav",
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ BETWEEN-HALF.wav",
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ CENTRE 0.wav",
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ CENTRE-1.wav",
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ CENTRE-HALF.wav",
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ CENTRE45 0.wav",
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ CENTRE45-1.wav",
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ CENTRE45-HALF.wav",
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ EDGE 0.wav",
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ EDGE-1.wav",
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ EDGE-HALF.wav",
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ FRED45 0.wav",
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ FRED45-1.wav",
  "audio/convolutions/GuitarHacks Impulses/JJ Powertube Impulses/GuitarHack JJ FRED45-HALF.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Full Set Straight/Between-1 bottom speaker.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Full Set Straight/Between-1.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Full Set Straight/Between-1andhalf.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Full Set Straight/Between-half.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Full Set Straight/Between0.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Full Set Straight/Centre -1 bottom speaker.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Full Set Straight/Centre-1.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Full Set Straight/Centre-half.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Full Set Straight/Centre0.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Full Set Straight/Edge Sneap.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Full Set Straight/Edge-1 bottom speaker.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Full Set Straight/Edge-1.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Full Set Straight/Edge-1andhalf.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Full Set Straight/Edge-half.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Full Set Straight/Edge0.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Samples/BBAC-Half.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Samples/Between- Half.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Samples/Edge-1.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Samples/Edge-Half.wav",
  "audio/convolutions/GuitarHacks Impulses/Louder JJ Powertube Impulses Samples/Inch off Edge-1.wav",
  "audio/convolutions/GuitarHacks Impulses/Multiple Fredman, Straight and 45/GuitarHack Between 45.wav",
  "audio/convolutions/GuitarHacks Impulses/Multiple Fredman, Straight and 45/GuitarHack Between Straight -10.wav",
  "audio/convolutions/GuitarHacks Impulses/Multiple Fredman, Straight and 45/GuitarHack Between Straight -20.wav",
  "audio/convolutions/GuitarHacks Impulses/Multiple Fredman, Straight and 45/GuitarHack Centre 45.wav",
  "audio/convolutions/GuitarHacks Impulses/Multiple Fredman, Straight and 45/GuitarHack Edge 45.wav",
  "audio/convolutions/GuitarHacks Impulses/Multiple Fredman, Straight and 45/GuitarHack Edge Straight -10.wav",
  "audio/convolutions/GuitarHacks Impulses/Multiple Fredman, Straight and 45/GuitarHack Edge Straight -20.wav",
  "audio/convolutions/GuitarHacks Impulses/Multiple Fredman, Straight and 45/GuitarHack Fredman Angled -10.wav",
  "audio/convolutions/GuitarHacks Impulses/Multiple Fredman, Straight and 45/GuitarHack Fredman Angled -5.wav",
  "audio/convolutions/GuitarHacks Impulses/Multiple Fredman, Straight and 45/GuitarHack Fredman Straight -20.wav",
  "audio/convolutions/GuitarHacks Impulses/Original 3 Impulses/GuitarHack Original Between.wav",
  "audio/convolutions/GuitarHacks Impulses/Original 3 Impulses/GuitarHack Original Centre.wav",
  "audio/convolutions/GuitarHacks Impulses/Original 3 Impulses/GuitarHack Original Edge.wav",
  "audio/convolutions/GuitarHacks Impulses/Single Fredman Style and Sneap Edge/EDGE -1 I Inch ala Sneap pic.wav",
  "audio/convolutions/GuitarHacks Impulses/Single Fredman Style and Sneap Edge/Fredman Angled.wav",
  "audio/convolutions/GuitarHacks Impulses/Single Fredman Style and Sneap Edge/Fredman Straight.wav",
];
var convolutions = {};
for (var i = 0; i < convolutionUrls.length; i += 1) {
  var name = /audio\/convolutions\/(.*).wav/.exec(convolutionUrls[i])[1];
  convolutions[name] = { url: convolutionUrls[i] };
}

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
