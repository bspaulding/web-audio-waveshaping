var waveshapers = {};

var makeShaper = function (fn) {
  var curve = new Float32Array(44100),
    i,x;
  for (i = 0; i < curve.length; i += 1) {
    x = i * 2 / curve.length - 1;
    curve[i] = fn(x);
  }
  curve.equation = fn;
  return curve;
};

waveshapers.passthrough = makeShaper(function(x) {
  return x;
});

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



