function customCurve() {
  var k = parseInt(document.querySelector('#custom-k').value, 10);
  var m = parseInt(document.querySelector('#custom-m').value, 10);
  console.log('k:', k, 'm:', m);
  var curve = waveshapers.custom(k, m);
  return curve;
}

function updateWaveShaperCurve() {
  var curveName = document.querySelector('select#waveshaper-curve').value;
  if (curveName === 'custom') {
    waveshaper.curve = customCurve();
  } else if (waveshapers[curveName]) {
    waveshaper.curve = waveshapers[curveName];
  } else {
    console.warn(`No curve named ${curveName}!`);
  }
  graphCurrentCurve();
}

function loadWaveShaperCurves() {
  var select = document.querySelector('select#waveshaper-curve'),
    option;

  for (var curveName in waveshapers) {
    if (waveshapers.hasOwnProperty(curveName)) {
      option = document.createElement('option');
      option.value = curveName;
      if ('undefined' !== typeof window.waveshaper && waveshapers[curveName] === waveshaper.curve) {
        option.selected = true;
      }
      option.appendChild(document.createTextNode(curveName));
      select.appendChild(option);
    }
  }
}

function updateGain() {
  if (!inited) { return; }
  gain.gain.value = document.querySelector('input#gain').value;
}

function updateCustomCurve() {
  if (document.querySelector('select#waveshaper-curve').value !== 'custom') {
    return;
  }

  waveshaper.curve = customCurve();
  graphCurrentCurve();
}

function graphCurrentCurve() {
  if (!waveshaper.curve) {
    return;
  }

  var canvas = document.getElementById('transfergraph')
    , ctx = canvas.getContext('2d')
    , height = canvas.height
    , width = canvas.width
    , len = waveshaper.curve.length
    , curve = waveshaper.curve;
  ctx.clearRect(0, 0, width, height)
  ctx.strokeStyle = '#ccc'
  ctx.lineWidth = 1
  // x axis
  ctx.beginPath()
  ctx.moveTo(0, height / 2)
  ctx.lineTo(width, height / 2)
  ctx.stroke()
  // y axis
  ctx.beginPath()
  ctx.moveTo(width / 2, 0)
  ctx.lineTo(width / 2, height)
  ctx.stroke()
  // curve
  ctx.strokeStyle = 'red'
  ctx.beginPath()
  var i = 0;
  for (var i = 0; i < len; ++i) {
    let x = width / len * i;
    // -1 => 1000, 1 => 0
    // *-1, 1 => 1000, -1 => 0
    // +1, 2 => 1000, 0 => 0
    let y = (curve[i] * -1 + 1) * height / 2;
    if (i < 5 || i > len - 5) {
      console.log({ i, ['curve[i]']: curve[i], x, y });
    }
    ctx[(i === 0 ? 'moveTo' : 'lineTo')](x, y)
  }
  ctx.stroke()
}

function loadCabinets() {
  var select = document.querySelector('select#cabinet');
  for (var cab in convolutions) {
    if (convolutions.hasOwnProperty(cab)) {
      var option = document.createElement('option');
      option.value = cab;
      option.appendChild(document.createTextNode(cab));
      select.appendChild(option);
    }
  }
}

function updateCabinet() {
  if (!inited) { return; }
  loadIR(convolutions[document.querySelector('select#cabinet').value]);
}

function togglePlaying() {
  const playButton = document.querySelector('button#play-toggle');
  if (playing) {
    rawGuitar.stop();
    playing = false;
    playButton.textContent = 'Play';
  } else {
    play();
    playButton.textContent = 'Stop';
  }
}

window.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button#play-toggle').addEventListener('click', togglePlaying);
});

function initUI() {
  console.log('initUI');

  loadWaveShaperCurves();
  document.querySelector('select#waveshaper-curve').addEventListener('change', updateWaveShaperCurve);
  updateWaveShaperCurve();

  document.querySelector('input#gain').addEventListener('input', updateGain);
  updateGain();

  document.querySelector('#custom-k').addEventListener('input', updateCustomCurve);
  document.querySelector('#custom-m').addEventListener('input', updateCustomCurve);

  loadCabinets();
  document.querySelector('select#cabinet').addEventListener('change', updateCabinet);
  updateCabinet();
};
