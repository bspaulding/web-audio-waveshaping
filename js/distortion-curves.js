var waveshapers = {};

var makeShaper = function (fn) {
  var curve = new Float32Array(44100);
  var i;
  var x;
  for (i = 0; i < curve.length; i += 1) {
    // for future reference, this is converting
    // 0 - 44100 to a range of -1 to 1,
    // which is the input to a traditional waveshaper
    // transfer function
    x = i * 2 / curve.length - 1;
    curve[i] = fn(x);
  }
  curve.equation = fn;
  return curve;
};

waveshapers.passthrough = makeShaper(function(x) {
  return x;
});

waveshapers.inverter = makeShaper(function(x) {
  return -x;
});

// https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
var mdnExample = function (amount) {
  var k = typeof amount === 'number' ? amount : 50;
  return function (x) {
    return ( 3 + k ) * x * 20 * (Math.PI / 180) / ( Math.PI + k * Math.abs(x) );
  };
};

waveshapers.mdn50  = makeShaper(mdnExample(50));
waveshapers.mdn100 = makeShaper(mdnExample(100));
waveshapers.mdn200 = makeShaper(mdnExample(200));
waveshapers.mdn300 = makeShaper(mdnExample(300));
waveshapers.mdn400 = makeShaper(mdnExample(400));

waveshapers.sin = makeShaper(Math.sin);
waveshapers.cos = makeShaper(Math.cos);
waveshapers.tan = makeShaper(Math.tan);
waveshapers.atan = makeShaper(Math.atan);

waveshapers.transfergraph = makeShaper(function(x) {
  return (3 + 20) * x * 57 * (Math.PI / 180) / (Math.PI + 20 * Math.abs(x));
});

waveshapers.custom = function (k,m) {
  return makeShaper(function(x) {
    return (3 + k) * x * m * (Math.PI / 180) / (Math.PI + k * Math.abs(x));
  });
};

// https://www.cs.sfu.ca/~tamaras/waveshapeSynth/waveshapeSynth_4up.pdf
waveshapers.figureSix = makeShaper(function(x) {
  // if (x >= -0.25 && x <= -0.5) {
  //   return -0.5;
  // }

  // if (x <= -0.25) {
  //   return Math.max(x * 1.25, -1);
  // }
  //
  if (x >= 0.25) {
    return Math.min(x * 2, 1);
  }

  return x;
});

waveshapers.distortionIndexExample = makeShaper(function(x) {
  return x + Math.pow(x, 3) + Math.pow(x, 5);
});

makeChebyshev = function(k) {
  if (k < 0) {
    throw new Error("Chebyshev Requires non-negative integer k");
  }

  if (k === 0) {
    return function(x) {
      return 1;
    };
  }

  if (k === 1) {
    return function(x) {
      return x;
    };
  }

  // Tk+1(x) = 2xTk(x) − Tk−1(x)
  var Tk = makeChebyshev(k - 1);
  var TkMinus1 = makeChebyshev(k - 2);
  return function(x) {
    return 2 * x * Tk(x) - TkMinus1(x)
  };
};

waveshapers.chebyshev5 = makeShaper(function(x) {
  return 16 * Math.pow(x, 5) - 20 * Math.pow(x, 3) + 5 * x;
});

waveshapers.chebyshev5Generated = makeShaper(makeChebyshev(5));

for (var i = 11; i <= 15; i += 1) {
  if (i % 2 !== 0) {
    waveshapers['chebyshev' + i + 'Generated'] = makeShaper(makeChebyshev(i));
  }
}

// F(x) = h0T0(x)+h1T1(x)+h2T2(x)+· · ·+hNTN(x).
function matchSpectrum(harmonics) {
  var chebys = harmonics
    .reduce(
      function(m, harmonic) {
        m[harmonic.n] = makeChebyshev(harmonic.n);
        return m;
      },
      {}
    );

  return function(x) {
    return harmonics
      .reduce(
        function(sum, harmonic) {
          return sum + harmonic.amplitude * chebys[harmonic.n](x);
        },
        0
      )
  }
}

waveshapers.figure12Gen = matchSpectrum([{
  n: 1, amplitude: 5,
  n: 2, amplitude: 1,
  n: 4, amplitude: 4,
  n: 5, amplitude: 3
}])

// 48x 5 + 32x 4 − 60x 3 − 30x 2 + 20x + 3.
waveshapers.figure12 = function(x) {
  return 48 * Math.pow(x, 5)
    + 32 * Math.pow(x, 4)
    - 60 * Math.pow(x, 3)
    - 30 * Math.pow(x, 2)
    + 20 * x
    + 3;
}
