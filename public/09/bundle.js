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
/******/ 	return __webpack_require__(__webpack_require__.s = 89);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var THREE = __webpack_require__(0);
var processShader = __webpack_require__(10);

function Pass() {
  this.shader = null;
  this.loaded = null;
  this.params = {};
  this.isSim = false;
}

module.exports = Pass;

Pass.prototype.setShader = function(vs, fs) {
  this.shader = processShader(vs, fs);
};

Pass.prototype.run = function(composer) {
  composer.pass(this.shader);
};

Pass.prototype.getOfflineTexture = function(w, h, useRGBA) {
  return new THREE.WebGLRenderTarget(w, h, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: useRGBA ? THREE.RGBAFormat : THREE.RGBFormat
  });
};


/***/ }),

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var THREE = __webpack_require__(0);

module.exports = function processShader(vertexShaderCode, fragmentShaderCode) {

  var regExp = /uniform\s+([^\s]+)\s+([^\s]+)\s*;/gi;
  var regExp2 = /uniform\s+([^\s]+)\s+([^\s]+)\s*\[\s*(\w+)\s*\]*\s*;/gi;

  var typesMap = {
    sampler2D: { type: 't', value: function() { return new THREE.Texture(); } },
    samplerCube: { type: 't', value: function() {} },

    bool: { type: 'b', value: function() { return 0; } },
    int: { type: 'i', value: function() { return 0; } },
    float: { type: 'f', value: function() { return 0; } },

    vec2: { type: 'v2', value: function() { return new THREE.Vector2(); } },
    vec3: { type: 'v3', value: function() { return new THREE.Vector3(); } },
    vec4: { type: 'v4', value: function() { return new THREE.Vector4(); } },

    bvec2: { type: 'v2', value: function() { return new THREE.Vector2(); } },
    bvec3: { type: 'v3', value: function() { return new THREE.Vector3(); } },
    bvec4: { type: 'v4', value: function() { return new THREE.Vector4(); } },

    ivec2: { type: 'v2', value: function() { return new THREE.Vector2(); } },
    ivec3: { type: 'v3', value: function() { return new THREE.Vector3(); } },
    ivec4: { type: 'v4', value: function() { return new THREE.Vector4(); } },

    mat2: { type: 'v2', value: function() { return new THREE.Matrix2(); } },
    mat3: { type: 'v3', value: function() { return new THREE.Matrix3(); } },
    mat4: { type: 'v4', value: function() { return new THREE.Matrix4(); } }
  };

  var arrayTypesMap = {
    float: { type: 'fv', value: function() { return []; } },
    vec3: { type: 'v3v', value: function() { return []; } }
  };

  var matches;
  var uniforms = {
    resolution: { type: 'v2', value: new THREE.Vector2( 1, 1 ), default: true },
    time: { type: 'f', value: Date.now(), default: true },
    tInput: { type: 't', value: new THREE.Texture(), default: true }
  };

  var uniformType, uniformName, arraySize;

  while ((matches = regExp.exec(fragmentShaderCode)) !== null) {
    if (matches.index === regExp.lastIndex) {
      regExp.lastIndex++;
    }
    uniformType = matches[1];
    uniformName = matches[2];

    uniforms[uniformName] = {
      type: typesMap[uniformType].type,
      value: typesMap[uniformType].value()
    };
  }

  while ((matches = regExp2.exec(fragmentShaderCode)) !== null) {
    if (matches.index === regExp.lastIndex) {
      regExp.lastIndex++;
    }
    uniformType = matches[1];
    uniformName = matches[2];
    arraySize = matches[3];

    uniforms[uniformName] = {
      type: arrayTypesMap[uniformType].type,
      value: arrayTypesMap[uniformType].value()
    };
  }

  var shader = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShaderCode,
    fragmentShader: fragmentShaderCode,
    shading: THREE.FlatShading,
    depthWrite: false,
    depthTest: false,
    transparent: true
  });

  return shader;
};

/***/ }),

/***/ 11:
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\nuniform sampler2D tInput;\n\nvoid main() {\n  gl_FragColor = texture2D( tInput, vUv );\n\n}"

/***/ }),

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Stack(shadersPool) {
  this.passItems = [];
  this.shadersPool = shadersPool;
  this.passes = [];
}

module.exports = Stack;

Stack.prototype.addPass = function(shaderName, enabled, params, index) {
  var length = 0;
  var passItem = {
    shaderName: shaderName,
    enabled: enabled || false
  };

  // TODO use and store params values

  this.passItems.push(passItem);
  length = this.passItems.length;

  this.updatePasses();

  if (index) {
    return this.movePassToIndex(this.passItems[length], index);
  }
  else {
    return length - 1;
  }
};

Stack.prototype.removePass = function(index) {
  this.passItems.splice(index, 1);
  this.updatePasses();
};

Stack.prototype.enablePass = function(index) {
  this.passItems[index].enabled = true;
  this.updatePasses();
};

Stack.prototype.disablePass = function(index) {
  this.passItems[index].enabled = false;
  this.updatePasses();
};

Stack.prototype.isPassEnabled = function(index) {
  return this.passItems[index].enabled;
};

Stack.prototype.movePassToIndex = function(index, destIndex) {
  this.passItems.splice(destIndex, 0, this.passItems.splice(index, 1)[0]);
  this.updatePasses();

  // TODO check if destIndex is final index
  return destIndex;
};

Stack.prototype.reverse = function() {
  this.passItems.reverse();
  this.updatePasses();
};

Stack.prototype.updatePasses = function() {
  this.passes = this.shadersPool.getPasses(this.passItems);

  // init default params for new passItems
  this.passItems.forEach(function(passItem, index) {
    if (passItem.params === undefined) {
      passItem.params = JSON.parse(JSON.stringify(this.passes[index].params)); // clone params without reference to the real shader instance params
    }
  }.bind(this));
};

Stack.prototype.getPasses = function() {
  return this.passes;
};


/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n}"

/***/ }),

/***/ 24:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Pass = __webpack_require__(1);
var vertex = __webpack_require__(2);
var fragment = __webpack_require__(25);

function VignettePass(boost, reduction) {
  Pass.call(this);

  this.setShader(vertex, fragment);

  this.params.boost = boost || 2;
  this.params.reduction = reduction || 2;
}

module.exports = VignettePass;

VignettePass.prototype = Object.create(Pass.prototype);
VignettePass.prototype.constructor = VignettePass;

VignettePass.prototype.run = function(composer) {
  this.shader.uniforms.boost.value = this.params.boost;
  this.shader.uniforms.reduction.value = this.params.reduction;
  composer.pass(this.shader);
};


/***/ }),

/***/ 25:
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\nuniform sampler2D tInput;\nuniform vec2 resolution;\n\nuniform float reduction;\nuniform float boost;\n\nvoid main() {\n\n  vec4 color = texture2D( tInput, vUv );\n\n  vec2 center = resolution * 0.5;\n  float vignette = distance( center, gl_FragCoord.xy ) / resolution.x;\n  vignette = boost - vignette * reduction;\n\n  color.rgb *= vignette;\n  gl_FragColor = color;\n\n}"

/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Pass = __webpack_require__(1);
var vertex = __webpack_require__(2);
var fragment = __webpack_require__(11);

function CopyPass() {
  Pass.call(this);
  this.setShader(vertex, fragment);
}

module.exports = CopyPass;

CopyPass.prototype = Object.create(Pass.prototype);
CopyPass.prototype.constructor = CopyPass;


/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports.Composer = __webpack_require__(5);
module.exports.CopyPass = __webpack_require__(3);
module.exports.BlendMode = {
  Normal: 1,
  Dissolve: 2, // UNAVAILABLE
  Darken: 3,
  Multiply: 4,
  ColorBurn: 5,
  LinearBurn: 6,
  DarkerColor: 7, // UNAVAILABLE
  Lighten: 8,
  Screen: 9,
  ColorDodge: 10,
  LinearDodge: 11,
  LighterColor: 12, // UNAVAILABLE
  Overlay: 13,
  SoftLight: 14,
  HardLight: 15,
  VividLight: 16, // UNAVAILABLE
  LinearLight: 17,
  PinLight: 18, // UNAVAILABLE
  HardMix: 19, // UNAVAILABLE
  Difference: 20,
  Exclusion: 21,
  Substract: 22, // UNAVAILABLE
  Divide: 23 // UNAVAILABLE
};


/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var THREE = __webpack_require__(0);
var CopyPass = __webpack_require__(3);
var Stack = __webpack_require__(12);
var Pass = __webpack_require__(1);

function Composer(renderer, settings) {
  var pixelRatio = renderer.getPixelRatio();

  this.width  = Math.floor(renderer.context.canvas.width  / pixelRatio) || 1;
  this.height = Math.floor(renderer.context.canvas.height / pixelRatio) || 1;

  this.output = null;
  this.input = null;
  this.read = null;
  this.write = null;

  this.settings = settings || {};
  this.useRGBA = this.settings.useRGBA || false;

  this.renderer = renderer;
  this.copyPass = new CopyPass(this.settings);

  this.defaultMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: false});
  this.scene = new THREE.Scene();
  this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), this.defaultMaterial);
  this.scene.add(this.quad);
  this.camera = new THREE.OrthographicCamera(1, 1, 1, 1, -10000, 10000);

  this.front = new THREE.WebGLRenderTarget(1, 1, {
    minFilter: this.settings.minFilter !== undefined ? this.settings.minFilter : THREE.LinearFilter,
    magFilter: this.settings.magFilter !== undefined ? this.settings.magFilter : THREE.LinearFilter,
    wrapS: this.settings.wrapS !== undefined ? this.settings.wrapS : THREE.ClampToEdgeWrapping,
    wrapT: this.settings.wrapT !== undefined ? this.settings.wrapT : THREE.ClampToEdgeWrapping,
    format: this.useRGBA ? THREE.RGBAFormat : THREE.RGBFormat,
    type: this.settings.type !== undefined ? this.settings.type : THREE.UnsignedByteType,
    stencilBuffer: this.settings.stencilBuffer !== undefined ? this.settings.stencilBuffer : true
  });

  this.back = this.front.clone();
  this.startTime = Date.now();
  this.passes = {};

  this.setSize(this.width, this.height);
}

module.exports = Composer;

Composer.prototype.swapBuffers = function() {
  this.output = this.write;
  this.input = this.read;

  var t = this.write;
  this.write = this.read;
  this.read = t;
};

Composer.prototype.render = function(scene, camera, keep, output) {
  if (keep) this.swapBuffers();
  this.renderer.render(scene, camera, output ? output : this.write, true);
  if (!output) this.swapBuffers();
};

Composer.prototype.toScreen = function() {
  this.quad.material = this.copyPass.shader;
  this.quad.material.uniforms.tInput.value = this.read;
  this.quad.material.uniforms.resolution.value.set(this.width, this.height);
  this.renderer.render(this.scene, this.camera);
};

Composer.prototype.toTexture = function(t) {
  this.quad.material = this.copyPass.shader;
  this.quad.material.uniforms.tInput.value = this.read;
  this.renderer.render(this.scene, this.camera, t, false);
};

Composer.prototype.pass = function(pass) {
  if (pass instanceof Stack) {
    this.passStack(pass);
  }
  else {
    if (pass instanceof THREE.ShaderMaterial) {
      this.quad.material = pass;
    }
    if (pass instanceof Pass) {
      pass.run(this);
      return;
    }

    if (!pass.isSim) {
      this.quad.material.uniforms.tInput.value = this.read;
    }

    this.quad.material.uniforms.resolution.value.set(this.width, this.height);
    this.quad.material.uniforms.time.value = 0.001 * (Date.now() - this.startTime);
    this.renderer.render(this.scene, this.camera, this.write, false);
    this.swapBuffers();
  }
};

Composer.prototype.passStack = function(stack) {
  stack.getPasses().forEach(function(pass) {
    this.pass(pass);
  }.bind(this));
};

Composer.prototype.reset = function() {
  this.read = this.front;
  this.write = this.back;
  this.output = this.write;
  this.input = this.read;
};

Composer.prototype.setSource = function(src) {
  this.quad.material = this.copyPass.shader;
  this.quad.material.uniforms.tInput.value = src;
  this.renderer.render(this.scene, this.camera, this.write, true);
  this.swapBuffers();
};

Composer.prototype.setSize = function(w, h) {
  this.width = w;
  this.height = h;

  this.camera.projectionMatrix.makeOrthographic( w / - 2, w / 2, h / 2, h / - 2, this.camera.near, this.camera.far );
  this.quad.scale.set( w, h, 1 );

  this.front.setSize( w, h );
  this.back.setSize( w, h );
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

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

// stats.js - http://github.com/mrdoob/stats.js
(function(f,e){ true?module.exports=e():"function"===typeof define&&define.amd?define(e):f.Stats=e()})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});


/***/ }),

/***/ 89:
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

var _three2 = __webpack_require__(90);

var _wagner = __webpack_require__(4);

var _wagner2 = _interopRequireDefault(_wagner);

var _VignettePass = __webpack_require__(24);

var _VignettePass2 = _interopRequireDefault(_VignettePass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CURVE_POINTS = 500;
var ITERATIONS = 9;
var BACKGROUND = new _three.Color(0x222222);
var FOREGROUND = new _three.Color(0xeeeeee);
var FREQUENCY = 100;

Object.assign(_three2.MeshLine.prototype, _three.EventDispatcher.prototype);

var Experiment = function (_ThreeApp) {
  _inherits(Experiment, _ThreeApp);

  function Experiment() {
    _classCallCheck(this, Experiment);

    return _possibleConstructorReturn(this, (Experiment.__proto__ || Object.getPrototypeOf(Experiment)).apply(this, arguments));
  }

  _createClass(Experiment, [{
    key: 'init',
    value: function init() {
      this.renderer.setClearColor(BACKGROUND);
      this.verts = [];
      this.geometry = new _three.Geometry();

      this.line = new _three2.MeshLine();

      this.updateGeometry();
      this.mesh = new _three.Mesh(this.line.geometry, new _three2.MeshLineMaterial({
        color: new _three.Color(0xeeeeee),
        lineWidth: 0.03,
        resolution: new _three.Vector2(window.innerWidth, window.innerHeight)
      }));
      this.mesh.frustumCulled = false;
      this.scene.add(this.mesh);
      this.pivot = new _three.Object3D();
      this.pivot.position.set(0, 0, 0);
      this.pivot.add(this.camera);
      this.scene.add(this.pivot);

      this.camera.position.set(0, 0, 0.9);
      this.composer = new _wagner2.default.Composer(this.renderer);
      this.pass = new _VignettePass2.default(1.0, 0.5);
      this.flipClip = 0;
      this.lastFlip = -Infinity;
    }
  }, {
    key: 'flip',
    value: function flip() {
      if (this.flipCount++ % 2) {
        this.renderer.setClearColor(FOREGROUND);
        this.mesh.material.uniforms.color.value = BACKGROUND;
      } else {
        this.renderer.setClearColor(BACKGROUND);
        this.mesh.material.uniforms.color.value = FOREGROUND;
      }
      this.updateGeometry(Math.random() + 1.2);
    }
  }, {
    key: 'updateGeometry',
    value: function updateGeometry() {
      var mod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      for (var i = 0; i < CURVE_POINTS; i++) {
        var vert = this.geometry.vertices[i];
        if (!vert) {
          vert = new _three.Vector3();
          this.geometry.vertices.push(vert);
        }
        var val = ITERATIONS * i / CURVE_POINTS * Math.PI * 2 + Math.random() * mod;
        var scale = 1 - i / CURVE_POINTS;
        var x = Math.cos(val) * scale;
        var y = Math.sin(val) * scale;
        if (Math.floor(mod) % 2) {
          var tmp = x;
          x = y;
          y = tmp;
        }
        vert.set(x, y, i / CURVE_POINTS * scale);
      }
      this.line.setGeometry(this.geometry);
    }
  }, {
    key: 'update',
    value: function update(t, delta) {
      this.pivot.rotation.z = t * 0.00009;
      if (this.lastFlip + FREQUENCY < t) {
        this.flip();
        this.lastFlip = t;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      this.renderer.clear();
      this.composer.reset();
      this.composer.render(this.scene, this.camera);
      this.composer.pass(this.pass);
      this.composer.toScreen();
      //    this.renderer.render(this.scene, this.camera);
    }
  }]);

  return Experiment;
}(_ThreeApp3.default);

exports.default = new Experiment();

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

/***/ }),

/***/ 90:
/***/ (function(module, exports, __webpack_require__) {

;(function() {

"use strict";

var root = this

var has_require = "function" !== 'undefined'

var THREE = root.THREE || has_require && __webpack_require__(0)
if( !THREE )
	throw new Error( 'EquirectangularToCubemap requires three.js' )

function MeshLine() {

	this.positions = [];

	this.previous = [];
	this.next = [];
	this.side = [];
	this.width = [];
	this.indices_array = [];
	this.uvs = [];
	this.counters = [];
	this.geometry = new THREE.BufferGeometry();

	this.widthCallback = null;

}

MeshLine.prototype.setGeometry = function( g, c ) {

	this.widthCallback = c;

	this.positions = [];
	this.counters = [];

	if( g instanceof THREE.Geometry ) {
		for( var j = 0; j < g.vertices.length; j++ ) {
			var v = g.vertices[ j ];
			var c = j/g.vertices.length;
			this.positions.push( v.x, v.y, v.z );
			this.positions.push( v.x, v.y, v.z );
			this.counters.push(c);
			this.counters.push(c);
		}
	}

	if( g instanceof THREE.BufferGeometry ) {
		// read attribute positions ?
	}

	if( g instanceof Float32Array || g instanceof Array ) {
		for( var j = 0; j < g.length; j += 3 ) {
			var c = j/g.length;
			this.positions.push( g[ j ], g[ j + 1 ], g[ j + 2 ] );
			this.positions.push( g[ j ], g[ j + 1 ], g[ j + 2 ] );
			this.counters.push(c);
			this.counters.push(c);
		}
	}

	this.process();

}

MeshLine.prototype.compareV3 = function( a, b ) {

	var aa = a * 6;
	var ab = b * 6;
	return ( this.positions[ aa ] === this.positions[ ab ] ) && ( this.positions[ aa + 1 ] === this.positions[ ab + 1 ] ) && ( this.positions[ aa + 2 ] === this.positions[ ab + 2 ] );

}

MeshLine.prototype.copyV3 = function( a ) {

	var aa = a * 6;
	return [ this.positions[ aa ], this.positions[ aa + 1 ], this.positions[ aa + 2 ] ];

}

MeshLine.prototype.process = function() {

	var l = this.positions.length / 6;

	this.previous = [];
	this.next = [];
	this.side = [];
	this.width = [];
	this.indices_array = [];
	this.uvs = [];

	for( var j = 0; j < l; j++ ) {
		this.side.push( 1 );
		this.side.push( -1 );
	}

	var w;
	for( var j = 0; j < l; j++ ) {
		if( this.widthCallback ) w = this.widthCallback( j / ( l -1 ) );
		else w = 1;
		this.width.push( w );
		this.width.push( w );
	}

	for( var j = 0; j < l; j++ ) {
		this.uvs.push( j / ( l - 1 ), 0 );
		this.uvs.push( j / ( l - 1 ), 1 );
	}

	var v;

	if( this.compareV3( 0, l - 1 ) ){
		v = this.copyV3( l - 2 );
	} else {
		v = this.copyV3( 0 );
	}
	this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
	this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
	for( var j = 0; j < l - 1; j++ ) {
		v = this.copyV3( j );
		this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
		this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
	}

	for( var j = 1; j < l; j++ ) {
		v = this.copyV3( j );
		this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );
		this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );
	}

	if( this.compareV3( l - 1, 0 ) ){
		v = this.copyV3( 1 );
	} else {
		v = this.copyV3( l - 1 );
	}
	this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );
	this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );

	for( var j = 0; j < l - 1; j++ ) {
		var n = j * 2;
		this.indices_array.push( n, n + 1, n + 2 );
		this.indices_array.push( n + 2, n + 1, n + 3 );
	}

	if (!this.attributes) {
		this.attributes = {
			position: new THREE.BufferAttribute( new Float32Array( this.positions ), 3 ),
			previous: new THREE.BufferAttribute( new Float32Array( this.previous ), 3 ),
			next: new THREE.BufferAttribute( new Float32Array( this.next ), 3 ),
			side: new THREE.BufferAttribute( new Float32Array( this.side ), 1 ),
			width: new THREE.BufferAttribute( new Float32Array( this.width ), 1 ),
			uv: new THREE.BufferAttribute( new Float32Array( this.uvs ), 2 ),
			index: new THREE.BufferAttribute( new Uint16Array( this.indices_array ), 1 ),
			counters: new THREE.BufferAttribute( new Float32Array( this.counters ), 1 )
		}
	} else {
		this.attributes.position.copyArray(new Float32Array(this.positions));
		this.attributes.position.needsUpdate = true;
		this.attributes.previous.copyArray(new Float32Array(this.previous));
		this.attributes.previous.needsUpdate = true;
		this.attributes.next.copyArray(new Float32Array(this.next));
		this.attributes.next.needsUpdate = true;
		this.attributes.side.copyArray(new Float32Array(this.side));
		this.attributes.side.needsUpdate = true;
		this.attributes.width.copyArray(new Float32Array(this.width));
		this.attributes.width.needsUpdate = true;
		this.attributes.uv.copyArray(new Float32Array(this.uvs));
		this.attributes.uv.needsUpdate = true;
		this.attributes.index.copyArray(new Uint16Array(this.indices_array));
		this.attributes.index.needsUpdate = true;
    }

	this.geometry.addAttribute( 'position', this.attributes.position );
	this.geometry.addAttribute( 'previous', this.attributes.previous );
	this.geometry.addAttribute( 'next', this.attributes.next );
	this.geometry.addAttribute( 'side', this.attributes.side );
	this.geometry.addAttribute( 'width', this.attributes.width );
	this.geometry.addAttribute( 'uv', this.attributes.uv );
	this.geometry.addAttribute( 'counters', this.attributes.counters );

	this.geometry.setIndex( this.attributes.index );

}

function memcpy (src, srcOffset, dst, dstOffset, length) {
	var i

	src = src.subarray || src.slice ? src : src.buffer
	dst = dst.subarray || dst.slice ? dst : dst.buffer

	src = srcOffset ? src.subarray ?
	src.subarray(srcOffset, length && srcOffset + length) :
	src.slice(srcOffset, length && srcOffset + length) : src

	if (dst.set) {
		dst.set(src, dstOffset)
	} else {
		for (i=0; i<src.length; i++) {
			dst[i + dstOffset] = src[i]
		}
	}

	return dst
}

/**
 * Fast method to advance the line by one position.  The oldest position is removed.
 * @param position
 */
MeshLine.prototype.advance = function(position) {

	var positions = this.attributes.position.array;
	var previous = this.attributes.previous.array;
	var next = this.attributes.next.array;
	var l = positions.length;

	// PREVIOUS
	memcpy( positions, 0, previous, 0, l );

	// POSITIONS
	memcpy( positions, 6, positions, 0, l - 6 );

	positions[l - 6] = position.x;
	positions[l - 5] = position.y;
	positions[l - 4] = position.z;
	positions[l - 3] = position.x;
	positions[l - 2] = position.y;
	positions[l - 1] = position.z;

    // NEXT
	memcpy( positions, 6, next, 0, l - 6 );

	next[l - 6]  = position.x;
	next[l - 5]  = position.y;
	next[l - 4]  = position.z;
	next[l - 3]  = position.x;
	next[l - 2]  = position.y;
	next[l - 1]  = position.z;

	this.attributes.position.needsUpdate = true;
	this.attributes.previous.needsUpdate = true;
	this.attributes.next.needsUpdate = true;

};

function MeshLineMaterial( parameters ) {

	var vertexShaderSource = [
'precision highp float;',
'',
'attribute vec3 position;',
'attribute vec3 previous;',
'attribute vec3 next;',
'attribute float side;',
'attribute float width;',
'attribute vec2 uv;',
'attribute float counters;',
'',
'uniform mat4 projectionMatrix;',
'uniform mat4 modelViewMatrix;',
'uniform vec2 resolution;',
'uniform float lineWidth;',
'uniform vec3 color;',
'uniform float opacity;',
'uniform float near;',
'uniform float far;',
'uniform float sizeAttenuation;',
'',
'varying vec2 vUV;',
'varying vec4 vColor;',
'varying float vCounters;',
'',
'vec2 fix( vec4 i, float aspect ) {',
'',
'    vec2 res = i.xy / i.w;',
'    res.x *= aspect;',
'	 vCounters = counters;',
'    return res;',
'',
'}',
'',
'void main() {',
'',
'    float aspect = resolution.x / resolution.y;',
'	 float pixelWidthRatio = 1. / (resolution.x * projectionMatrix[0][0]);',
'',
'    vColor = vec4( color, opacity );',
'    vUV = uv;',
'',
'    mat4 m = projectionMatrix * modelViewMatrix;',
'    vec4 finalPosition = m * vec4( position, 1.0 );',
'    vec4 prevPos = m * vec4( previous, 1.0 );',
'    vec4 nextPos = m * vec4( next, 1.0 );',
'',
'    vec2 currentP = fix( finalPosition, aspect );',
'    vec2 prevP = fix( prevPos, aspect );',
'    vec2 nextP = fix( nextPos, aspect );',
'',
'	 float pixelWidth = finalPosition.w * pixelWidthRatio;',
'    float w = 1.8 * pixelWidth * lineWidth * width;',
'',
'    if( sizeAttenuation == 1. ) {',
'        w = 1.8 * lineWidth * width;',
'    }',
'',
'    vec2 dir;',
'    if( nextP == currentP ) dir = normalize( currentP - prevP );',
'    else if( prevP == currentP ) dir = normalize( nextP - currentP );',
'    else {',
'        vec2 dir1 = normalize( currentP - prevP );',
'        vec2 dir2 = normalize( nextP - currentP );',
'        dir = normalize( dir1 + dir2 );',
'',
'        vec2 perp = vec2( -dir1.y, dir1.x );',
'        vec2 miter = vec2( -dir.y, dir.x );',
'        //w = clamp( w / dot( miter, perp ), 0., 4. * lineWidth * width );',
'',
'    }',
'',
'    //vec2 normal = ( cross( vec3( dir, 0. ), vec3( 0., 0., 1. ) ) ).xy;',
'    vec2 normal = vec2( -dir.y, dir.x );',
'    normal.x /= aspect;',
'    normal *= .5 * w;',
'',
'    vec4 offset = vec4( normal * side, 0.0, 1.0 );',
'    finalPosition.xy += offset.xy;',
'',
'    gl_Position = finalPosition;',
'',
'}' ];

	var fragmentShaderSource = [
		'#extension GL_OES_standard_derivatives : enable',
'precision mediump float;',
'',
'uniform sampler2D map;',
'uniform sampler2D alphaMap;',
'uniform float useMap;',
'uniform float useAlphaMap;',
'uniform float useDash;',
'uniform vec2 dashArray;',
'uniform float visibility;',
'uniform float alphaTest;',
'uniform vec2 repeat;',
'',
'varying vec2 vUV;',
'varying vec4 vColor;',
'varying float vCounters;',
'',
'void main() {',
'',
'    vec4 c = vColor;',
'    if( useMap == 1. ) c *= texture2D( map, vUV * repeat );',
'    if( useAlphaMap == 1. ) c.a *= texture2D( alphaMap, vUV * repeat ).a;',
'	 if( c.a < alphaTest ) discard;',
'	 if( useDash == 1. ){',
'	 	 ',
'	 }',
'    gl_FragColor = c;',
'	 gl_FragColor.a *= step(vCounters,visibility);',
'}' ];

	function check( v, d ) {
		if( v === undefined ) return d;
		return v;
	}

	THREE.Material.call( this );

	parameters = parameters || {};

	this.lineWidth = check( parameters.lineWidth, 1 );
	this.map = check( parameters.map, null );
	this.useMap = check( parameters.useMap, 0 );
	this.alphaMap = check( parameters.alphaMap, null );
	this.useAlphaMap = check( parameters.useAlphaMap, 0 );
	this.color = check( parameters.color, new THREE.Color( 0xffffff ) );
	this.opacity = check( parameters.opacity, 1 );
	this.resolution = check( parameters.resolution, new THREE.Vector2( 1, 1 ) );
	this.sizeAttenuation = check( parameters.sizeAttenuation, 1 );
	this.near = check( parameters.near, 1 );
	this.far = check( parameters.far, 1 );
	this.dashArray = check( parameters.dashArray, [] );
	this.useDash = ( this.dashArray !== [] ) ? 1 : 0;
	this.visibility = check( parameters.visibility, 1 );
	this.alphaTest = check( parameters.alphaTest, 0 );
	this.repeat = check( parameters.repeat, new THREE.Vector2( 1, 1 ) );

	var material = new THREE.RawShaderMaterial( {
		uniforms:{
			lineWidth: { type: 'f', value: this.lineWidth },
			map: { type: 't', value: this.map },
			useMap: { type: 'f', value: this.useMap },
			alphaMap: { type: 't', value: this.alphaMap },
			useAlphaMap: { type: 'f', value: this.useAlphaMap },
			color: { type: 'c', value: this.color },
			opacity: { type: 'f', value: this.opacity },
			resolution: { type: 'v2', value: this.resolution },
			sizeAttenuation: { type: 'f', value: this.sizeAttenuation },
			near: { type: 'f', value: this.near },
			far: { type: 'f', value: this.far },
			dashArray: { type: 'v2', value: new THREE.Vector2( this.dashArray[ 0 ], this.dashArray[ 1 ] ) },
			useDash: { type: 'f', value: this.useDash },
			visibility: {type: 'f', value: this.visibility},
			alphaTest: {type: 'f', value: this.alphaTest},
			repeat: { type: 'v2', value: this.repeat }
		},
		vertexShader: vertexShaderSource.join( '\r\n' ),
		fragmentShader: fragmentShaderSource.join( '\r\n' )
	});

	delete parameters.lineWidth;
	delete parameters.map;
	delete parameters.useMap;
	delete parameters.alphaMap;
	delete parameters.useAlphaMap;
	delete parameters.color;
	delete parameters.opacity;
	delete parameters.resolution;
	delete parameters.sizeAttenuation;
	delete parameters.near;
	delete parameters.far;
	delete parameters.dashArray;
	delete parameters.visibility;
	delete parameters.alphaTest;
	delete parameters.repeat;

	material.type = 'MeshLineMaterial';

	material.setValues( parameters );

	return material;

};

MeshLineMaterial.prototype = Object.create( THREE.Material.prototype );
MeshLineMaterial.prototype.constructor = MeshLineMaterial;

MeshLineMaterial.prototype.copy = function ( source ) {

	THREE.Material.prototype.copy.call( this, source );

	this.lineWidth = source.lineWidth;
	this.map = source.map;
	this.useMap = source.useMap;
	this.alphaMap = source.alphaMap;
	this.useAlphaMap = source.useAlphaMap;
	this.color.copy( source.color );
	this.opacity = source.opacity;
	this.resolution.copy( source.resolution );
	this.sizeAttenuation = source.sizeAttenuation;
	this.near = source.near;
	this.far = source.far;
	this.dashArray.copy( source.dashArray );
	this.useDash = source.useDash;
	this.visibility = source.visibility;
	this.alphaTest = source.alphaTest;
	this.repeat.copy( source.repeat );

	return this;

};

if( true ) {
	if( typeof module !== 'undefined' && module.exports ) {
		exports = module.exports = { MeshLine: MeshLine, MeshLineMaterial: MeshLineMaterial };
	}
	exports.MeshLine = MeshLine;
	exports.MeshLineMaterial = MeshLineMaterial;
}
else {
	root.MeshLine = MeshLine;
	root.MeshLineMaterial = MeshLineMaterial;
}

}).call(this);



/***/ })

/******/ });
});