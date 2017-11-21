(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("three"));
	else if(typeof define === 'function' && define.amd)
		define(["three"], factory);
	else if(typeof exports === 'object')
		exports["app"] = factory(require("three"));
	else
		root["app"] = factory(root["THREE"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 79);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),

/***/ 23:
/***/ (function(module, exports) {

module.exports = function (mesh, opts) {
  if (!opts) opts = {};
  var vars = opts.attributes ? {} : null;
  var vkeys = vars && Object.keys(opts.attributes)
  if (vars) {
    for (var k = 0; k < vkeys.length; k++) {
      vars[vkeys[k]] = []
    }
  }

  var i, j;
  var pts = [];
  var cells = [];
  var barycentricAttrs = [];

  var mpts = mesh.positions;
  var mcells = mesh.cells;

  var c = 0;
  for (i = 0; i < mesh.cells.length; i++) {
    var cell = mcells[i];
    if (cell.length === 3) {
      pts.push(mpts[cell[0]]);
      pts.push(mpts[cell[1]]);
      pts.push(mpts[cell[2]]);
      barycentricAttrs.push([0, 0]);
      barycentricAttrs.push([1, 0]);
      barycentricAttrs.push([0, 1]);
      cells.push(c++);
      cells.push(c++);
      cells.push(c++);
      if (vkeys) {
        for (j = 0; j < vkeys.length; j++) {
          var vkey = vkeys[j];
          vars[vkey].push(opts.attributes[vkey][cell[0]]);
          vars[vkey].push(opts.attributes[vkey][cell[1]]);
          vars[vkey].push(opts.attributes[vkey][cell[2]]);
        }
      }
    }
  }

  var ret = {
    positions: pts,
    attributes: vars,
    barycentric: barycentricAttrs
  };

  if (mesh.cells) {
    ret.cells = cells;
  }

  return ret;
};


/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

if (window.location.search) {
  var params = window.location.search.substr(1).split('&');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = params[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var param = _step.value;

      var _param$split = param.split('='),
          _param$split2 = _slicedToArray(_param$split, 2),
          prop = _param$split2[0],
          value = _param$split2[1];

      if (prop === 'video') {
        document.querySelector('#info').style.display = 'none';
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _three = __webpack_require__(0);

var _stats = __webpack_require__(8);

var _stats2 = _interopRequireDefault(_stats);

var _inject = __webpack_require__(9);

var _inject2 = _interopRequireDefault(_inject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CCAPTURE_OPTIONS = {
  framerate: 60,
  format: 'webm'
};

var App = function () {
  function App() {
    var _this = this;

    _classCallCheck(this, App);

    if (window.location.search) {
      var params = window.location.search.substr(1).split('&');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = params[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var param = _step.value;

          var _param$split = param.split('='),
              _param$split2 = _slicedToArray(_param$split, 2),
              prop = _param$split2[0],
              value = _param$split2[1];

          if (prop === 'debug') {
            this.stats = new _stats2.default();
            this.stats.showPanel(0);
            document.body.appendChild(this.stats.dom);
          }
          if (prop === 'record') {
            (0, _inject2.default)('../scripts/CCapture.all.min.js').then(function () {
              _this.capturer = new window.CCapture(CCAPTURE_OPTIONS);
              _this.capturer.start();
            });
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    this.renderer = new _three.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;
    document.body.appendChild(this.renderer.domElement);

    this.scene = new _three.Scene();

    this.camera = new _three.PerspectiveCamera(60, this.getAspect(), 0.1, 100);

    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);

    this.init();

    this.lastTick = 0;
    this.onTick = this.onTick.bind(this);
    requestAnimationFrame(this.onTick);
  }

  _createClass(App, [{
    key: 'onTick',
    value: function onTick() {
      var t = performance.now();
      var delta = performance.now() - this.lastTick;
      if (this.stats) {
        this.stats.begin();
      }
      this.update(t, delta);
      this.render(t, delta);
      if (this.stats) {
        this.stats.end();
      }
      this.lastTick = t;
      requestAnimationFrame(this.onTick);
      if (this.capturer) {
        this.capturer.capture(this.renderer.domElement);
      }
    }
  }, {
    key: 'getAspect',
    value: function getAspect() {
      return window.innerWidth / window.innerHeight;
    }
  }, {
    key: 'onResize',
    value: function onResize() {
      this.camera.aspect = this.getAspect();
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }]);

  return App;
}();

exports.default = App;

/***/ }),

/***/ 79:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(6);

var _three = __webpack_require__(0);

var _ThreeApp2 = __webpack_require__(7);

var _ThreeApp3 = _interopRequireDefault(_ThreeApp2);

var _BarycentricMaterial = __webpack_require__(80);

var _BarycentricMaterial2 = _interopRequireDefault(_BarycentricMaterial);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var COUNT = 10;

var Experiment = function (_ThreeApp) {
  _inherits(Experiment, _ThreeApp);

  function Experiment() {
    _classCallCheck(this, Experiment);

    return _possibleConstructorReturn(this, (Experiment.__proto__ || Object.getPrototypeOf(Experiment)).apply(this, arguments));
  }

  _createClass(Experiment, [{
    key: 'init',
    value: function init() {
      this.shapes = [];
      for (var i = 0; i < COUNT; i++) {
        var shape = new _three.CircleBufferGeometry(1, 20);
        _BarycentricMaterial2.default.applyBarycentricCoordinates(shape);
        var mesh = new _three.Mesh(shape, new _BarycentricMaterial2.default({
          width: 0.1,
          alpha: 0,
          wireframeColor: new _three.Color().setHSL(i / COUNT, 0.8, 0.5),
          wireframeAlpha: 0.3
        }));
        mesh.material.blending = _three.AdditiveBlending;
        mesh.position.z = i * 0.1;
        this.shapes.push(mesh);
        this.scene.add(mesh);
      }
      this.camera.position.set(0, 0, 2);
    }
  }, {
    key: 'update',
    value: function update(t, delta) {
      for (var i = 0; i < this.shapes.length; i++) {
        var circle = this.shapes[i];
        circle.rotation.z = t * 0.0001 * (i + 1) + i / this.shapes.length * 10;
        var scale = t * 0.0001 * (1 + (i + 1) / this.shapes.length * 0.4);
        circle.rotation.set(scale, scale, scale);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      this.renderer.render(this.scene, this.camera);
    }
  }]);

  return Experiment;
}(_ThreeApp3.default);

exports.default = new Experiment();

/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

// stats.js - http://github.com/mrdoob/stats.js
(function(f,e){ true?module.exports=e():"function"===typeof define&&define.amd?define(e):f.Stats=e()})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});


/***/ }),

/***/ 80:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _three = __webpack_require__(0);

var _barycentricVert = __webpack_require__(81);

var _barycentricVert2 = _interopRequireDefault(_barycentricVert);

var _barycentricFrag = __webpack_require__(82);

var _barycentricFrag2 = _interopRequireDefault(_barycentricFrag);

var _glslSolidWireframe = __webpack_require__(23);

var _glslSolidWireframe2 = _interopRequireDefault(_glslSolidWireframe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULTS = {
  color: new _three.Color(0x333333),
  wireframeColor: new _three.Color(0xeeeeee),
  alpha: 0.0,
  wireframeAlpha: 1.0,
  width: 0.1
};

var BarycentricMaterial = function (_ShaderMaterial) {
  _inherits(BarycentricMaterial, _ShaderMaterial);

  function BarycentricMaterial() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, BarycentricMaterial);

    var props = Object.assign({}, DEFAULTS, config);
    return _possibleConstructorReturn(this, (BarycentricMaterial.__proto__ || Object.getPrototypeOf(BarycentricMaterial)).call(this, {
      uniforms: {
        color: { value: props.color },
        wireframeColor: { value: props.wireframeColor },
        alpha: { value: props.alpha },
        wireframeAlpha: { value: props.wireframeAlpha },
        width: { value: props.width }
      },
      vertexShader: _barycentricVert2.default,
      fragmentShader: _barycentricFrag2.default,
      transparent: true,
      side: _three.DoubleSide,
      depthWrite: false
    }));
  }

  _createClass(BarycentricMaterial, null, [{
    key: 'applyBarycentricCoordinates',
    value: function applyBarycentricCoordinates(geometry) {
      var positions = [];
      var cells = [];
      var verts = geometry.attributes.position.array;
      var vertCount = geometry.attributes.position.count;
      var faces = []; //geometry.index ? geometry.index.array : [];

      if (!faces.length) {
        for (var i = 0; i < vertCount - 2; i++) {
          faces.push(i);
          faces.push(i + 1);
          faces.push(i + 2);
        }
      }

      var faceCount = faces.length / 3;

      // Convert from long arrays to array-of-arrays
      for (var _i = 0; _i < vertCount; _i++) {
        positions.push([verts[_i * 3 + 0], verts[_i * 3 + 1], verts[_i * 3 + 2]]);
      }
      for (var _i2 = 0; _i2 < faceCount; _i2++) {
        cells.push([faces[_i2 * 3 + 0], faces[_i2 * 3 + 1], faces[_i2 * 3 + 2]]);
      }

      var ret = (0, _glslSolidWireframe2.default)({
        positions: positions,
        cells: cells
      });
      // Convert back from array-of-arrays to long array
      var barycentric = new Float32Array(ret.barycentric.length * 2);
      var count = 0;
      for (var _i3 = 0; _i3 < ret.barycentric.length; _i3++) {
        barycentric[count++] = ret.barycentric[_i3][0];
        barycentric[count++] = ret.barycentric[_i3][1];
      }
      /*
          count = 0;
          for (let i = 0; i < ret.positions.length; i++) {
            verts[count++] = ret.positions[i][0];
            verts[count++] = ret.positions[i][1];
            verts[count++] = ret.positions[i][2];
          }
      
          count = 0;
          for (let i = 0; i < ret.cells.length; i++) {
            faces[count++] = ret.cells[i][0];
            faces[count++] = ret.cells[i][1];
            faces[count++] = ret.cells[i][2];
          }
          geometry.attributes.position.needsUpdate = true;
          geometry.index.needsUpdate = true;
      */
      geometry.addAttribute('barycentric', new _three.BufferAttribute(barycentric, 2));
    }
  }]);

  return BarycentricMaterial;
}(_three.ShaderMaterial);

exports.default = BarycentricMaterial;

/***/ }),

/***/ 81:
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nattribute vec2 barycentric;\n\nvarying vec2 vBC;\n\nvoid main() {\n  vBC = barycentric;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n"

/***/ }),

/***/ 82:
/***/ (function(module, exports) {

module.exports = "#extension GL_OES_standard_derivatives : enable\n\nprecision highp float;\nprecision highp int;\n#define GLSLIFY 1\n\nuniform float width;\nuniform vec3 color;\nuniform float alpha;\nuniform vec3 wireframeColor;\nuniform float wireframeAlpha;\nvarying vec2 vBC;\n\nfloat gridFactor (vec2 vBC, float w) {\n  vec3 bary = vec3(vBC.x, vBC.y, 1.0 - vBC.x - vBC.y);\n  vec3 d = fwidth(bary);\n  vec3 a3 = smoothstep(d * (w - 0.5), d * (w + 0.5), bary);\n  return min(min(a3.x, a3.y), a3.z);\n}\n\nvoid main() {\n  float factor = gridFactor(vBC, width);\n  vec3 color = mix(wireframeColor, color, factor);\n  float a = mix(wireframeAlpha, alpha, factor);\n  gl_FragColor = vec4(color, a);\n}\n"

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inject;
function inject(url) {
  return new Promise(function (resolve) {
    var script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    document.body.appendChild(script);
  });
}

/***/ })

/******/ });
});