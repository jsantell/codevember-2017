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
/******/ 	return __webpack_require__(__webpack_require__.s = 105);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
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
/* 2 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n}"

/***/ }),
/* 3 */
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
/* 4 */
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
/* 5 */
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
/* 6 */
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
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// stats.js - http://github.com/mrdoob/stats.js
(function(f,e){ true?module.exports=e():"function"===typeof define&&define.amd?define(e):f.Stats=e()})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});


/***/ }),
/* 9 */
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
/* 10 */
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
/* 11 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\nuniform sampler2D tInput;\n\nvoid main() {\n  gl_FragColor = texture2D( tInput, vUv );\n\n}"

/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Pass = __webpack_require__(1);
var BoxBlurPass = __webpack_require__(15);

function FullBoxBlurPass(amount) {
  Pass.call(this);

  amount = amount || 2;

  this.boxPass = new BoxBlurPass(amount, amount);
  this.params.amount = amount;
}

module.exports = FullBoxBlurPass;

FullBoxBlurPass.prototype = Object.create(Pass.prototype);
FullBoxBlurPass.prototype.constructor = FullBoxBlurPass;

FullBoxBlurPass.prototype.run = function(composer) {
  var s = this.params.amount;
  this.boxPass.params.delta.set( s, 0 );
  composer.pass( this.boxPass );
  this.boxPass.params.delta.set( 0, s );
  composer.pass( this.boxPass );
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var THREE = __webpack_require__(0);
var Pass = __webpack_require__(1);
var Composer = __webpack_require__(5);
var BlendMode = __webpack_require__(4).BlendMode;
var FullBoxBlurPass = __webpack_require__(13);
var BlendPass = __webpack_require__(17);
var ZoomBlurPass = __webpack_require__(19);
var BrightnessContrastPass = __webpack_require__(21);

function MultiPassBloomPass(options) {
  Pass.call(this);

  options = options || {};

  this.composer = null;

  this.tmpTexture = this.getOfflineTexture( options.width, options.height, true );
  this.blurPass = new FullBoxBlurPass(2);
  this.blendPass = new BlendPass();
  this.zoomBlur = new ZoomBlurPass();
  this.brightnessContrastPass = new BrightnessContrastPass();

  this.width = options.width || 512;
  this.height = options.height || 512;

  this.params.blurAmount = options.blurAmount || 2;
  this.params.applyZoomBlur = options.applyZoomBlur || false;
  this.params.zoomBlurStrength = options.zoomBlurStrength || 0.2;
  this.params.useTexture = options.useTexture || false;
  this.params.zoomBlurCenter = options.zoomBlurCenter || new THREE.Vector2(0.5, 0.5);
  this.params.blendMode = options.blendMode || BlendMode.Screen;
  this.params.glowTexture = null;
}

module.exports = MultiPassBloomPass;

MultiPassBloomPass.prototype = Object.create(Pass.prototype);
MultiPassBloomPass.prototype.constructor = MultiPassBloomPass;

MultiPassBloomPass.prototype.run = function(composer) {
  if (!this.composer) {
    this.composer = new Composer(composer.renderer, {useRGBA: true});
    this.composer.setSize(this.width, this.height);
  }

  this.composer.reset();

  if (this.params.useTexture === true) {
    this.composer.setSource(this.params.glowTexture);
  } else {
    this.composer.setSource(composer.output);
  }

  this.blurPass.params.amount = this.params.blurAmount;
  this.composer.pass(this.blurPass);
  
  if (this.params.applyZoomBlur) {
    this.zoomBlur.params.center.set(0.5, 0.5);
    this.zoomBlur.params.strength = this.params.zoomBlurStrength;
    this.composer.pass(this.zoomBlur);
  }

  if (this.params.useTexture === true) {
    this.blendPass.params.mode = BlendMode.Screen;
    this.blendPass.params.tInput = this.params.glowTexture;
    composer.pass(this.blendPass);
  }

  this.blendPass.params.mode = this.params.blendMode;
  this.blendPass.params.tInput2 = this.composer.output;
  composer.pass(this.blendPass);
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var THREE = __webpack_require__(0);
var Pass = __webpack_require__(1);
var vertex = __webpack_require__(2);
var fragment = __webpack_require__(16);

function BoxBlurPass(deltaX, deltaY) {
  Pass.call(this);

  this.setShader(vertex, fragment);
  this.params.delta = new THREE.Vector2(deltaX || 0, deltaY || 0);
}

module.exports = BoxBlurPass;

BoxBlurPass.prototype = Object.create(Pass.prototype);
BoxBlurPass.prototype.constructor = BoxBlurPass;

BoxBlurPass.prototype.run = function(composer) {
  this.shader.uniforms.delta.value.copy(this.params.delta);
  composer.pass(this.shader);

};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\nuniform sampler2D tInput;\nuniform vec2 delta;\nuniform vec2 resolution;\n\nvoid main() {\n\n  vec4 sum = vec4( 0. );\n  vec2 inc = delta / resolution;\n\n  sum += texture2D( tInput, ( vUv - inc * 4. ) ) * 0.051;\n  sum += texture2D( tInput, ( vUv - inc * 3. ) ) * 0.0918;\n  sum += texture2D( tInput, ( vUv - inc * 2. ) ) * 0.12245;\n  sum += texture2D( tInput, ( vUv - inc * 1. ) ) * 0.1531;\n  sum += texture2D( tInput, ( vUv + inc * 0. ) ) * 0.1633;\n  sum += texture2D( tInput, ( vUv + inc * 1. ) ) * 0.1531;\n  sum += texture2D( tInput, ( vUv + inc * 2. ) ) * 0.12245;\n  sum += texture2D( tInput, ( vUv + inc * 3. ) ) * 0.0918;\n  sum += texture2D( tInput, ( vUv + inc * 4. ) ) * 0.051;\n\n  gl_FragColor = sum;\n\n}"

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var THREE = __webpack_require__(0);
var Pass = __webpack_require__(1);
var vertex = __webpack_require__(2);
var fragment = __webpack_require__(18);

function BlendPass(options) {
  Pass.call(this);

  options = options || {};

  this.setShader(vertex, fragment);

  this.params.mode = options.mode || 1;
  this.params.opacity = options.opacity || 1;
  this.params.tInput2 = options.tInput2 || null;
  this.params.resolution2 = options.resolution2 || new THREE.Vector2();
  this.params.sizeMode = options.sizeMode || 1;
  this.params.aspectRatio = options.aspectRatio || 1;
  this.params.aspectRatio2 = options.aspectRatio2 || 1;
}

module.exports = BlendPass;

BlendPass.prototype = Object.create(Pass.prototype);
BlendPass.prototype.constructor = BlendPass;

BlendPass.prototype.run = function(composer) {
  this.shader.uniforms.mode.value = this.params.mode;
  this.shader.uniforms.opacity.value = this.params.opacity;
  this.shader.uniforms.tInput2.value = this.params.tInput2;
  this.shader.uniforms.sizeMode.value = this.params.sizeMode;
  this.shader.uniforms.aspectRatio.value = this.params.aspectRatio;
  this.shader.uniforms.aspectRatio2.value = this.params.aspectRatio2;
  composer.pass(this.shader);
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\nuniform sampler2D tInput;\nuniform sampler2D tInput2;\nuniform vec2 resolution;\nuniform vec2 resolution2;\nuniform float aspectRatio;\nuniform float aspectRatio2;\nuniform int mode;\nuniform int sizeMode;\nuniform float opacity;\n\nvec2 vUv2;\n\nfloat applyOverlayToChannel( float base, float blend ) {\n\n  return (base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend)));\n\n}\n\nfloat applySoftLightToChannel( float base, float blend ) {\n\n  return ((blend < 0.5) ? (2.0 * base * blend + base * base * (1.0 - 2.0 * blend)) : (sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend)));\n\n}\n\nfloat applyColorBurnToChannel( float base, float blend ) {\n\n  return ((blend == 0.0) ? blend : max((1.0 - ((1.0 - base) / blend)), 0.0));\n\n}\n\nfloat applyColorDodgeToChannel( float base, float blend ) {\n\n  return ((blend == 1.0) ? blend : min(base / (1.0 - blend), 1.0));\n\n}\n\nfloat applyLinearBurnToChannel( float base, float blend ) {\n\n  return max(base + blend - 1., 0.0 );\n\n}\n\nfloat applyLinearDodgeToChannel( float base, float blend ) {\n\n  return min( base + blend, 1. );\n\n}\n\nfloat applyLinearLightToChannel( float base, float blend ) {\n\n  return ( blend < .5 ) ? applyLinearBurnToChannel( base, 2. * blend ) : applyLinearDodgeToChannel( base, 2. * ( blend - .5 ) );\n\n}\n\nvoid main() {\n\n  vUv2 = vUv;\n  \n  if( sizeMode == 1 ) {\n    \n    if( aspectRatio2 > aspectRatio ) {\n      vUv2.x = vUv.x * aspectRatio / aspectRatio2;\n      vUv2.x += .5 * ( 1. - aspectRatio / aspectRatio2 ); \n      vUv2.y = vUv.y;\n    }\n\n    if( aspectRatio2 < aspectRatio ) {\n      vUv2.x = vUv.x;\n      vUv2.y = vUv.y * aspectRatio2 / aspectRatio;\n      vUv2.y += .5 * ( 1. - aspectRatio2 / aspectRatio );\n    }\n\n  }\n\n  vec4 base = texture2D( tInput, vUv );\n  vec4 blend = texture2D( tInput2, vUv2 );\n\n  if( mode == 1 ) { // normal\n\n    gl_FragColor = base;\n    gl_FragColor.a *= opacity;\n    return;\n\n  }\n\n  if( mode == 2 ) { // dissolve\n\n  }\n\n  if( mode == 3 ) { // darken\n\n    gl_FragColor = min( base, blend );\n    return;\n\n  }\n\n  if( mode == 4 ) { // multiply\n\n    gl_FragColor = base * blend;\n    return;\n\n  }\n\n  if( mode == 5 ) { // color burn\n\n    gl_FragColor = vec4(\n      applyColorBurnToChannel( base.r, blend.r ),\n      applyColorBurnToChannel( base.g, blend.g ),\n      applyColorBurnToChannel( base.b, blend.b ),\n      applyColorBurnToChannel( base.a, blend.a )\n    );\n    return;\n\n  }\n\n  if( mode == 6 ) { // linear burn\n\n    gl_FragColor = max(base + blend - 1.0, 0.0);\n    return;\n\n  }\n\n  if( mode == 7 ) { // darker color\n\n  }\n\n  if( mode == 8 ) { // lighten\n\n    gl_FragColor = max( base, blend );\n    return;\n\n  }\n\n  if( mode == 9 ) { // screen\n\n    gl_FragColor = (1.0 - ((1.0 - base) * (1.0 - blend)));\n    gl_FragColor = gl_FragColor * opacity + base * ( 1. - opacity );\n    return;\n\n  }\n\n  if( mode == 10 ) { // color dodge\n\n    gl_FragColor = vec4(\n      applyColorDodgeToChannel( base.r, blend.r ),\n      applyColorDodgeToChannel( base.g, blend.g ),\n      applyColorDodgeToChannel( base.b, blend.b ),\n      applyColorDodgeToChannel( base.a, blend.a )\n    );\n    return;\n\n  }\n\n  if( mode == 11 ) { // linear dodge\n\n    gl_FragColor = min(base + blend, 1.0);\n    return;\n\n  }\n\n  if( mode == 12 ) { // lighter color\n\n  }\n\n  if( mode == 13 ) { // overlay\n\n    gl_FragColor = gl_FragColor = vec4( \n      applyOverlayToChannel( base.r, blend.r ),\n      applyOverlayToChannel( base.g, blend.g ),\n      applyOverlayToChannel( base.b, blend.b ),\n      applyOverlayToChannel( base.a, blend.a )\n    );\n    gl_FragColor = gl_FragColor * opacity + base * ( 1. - opacity );\n  \n    return;\n\n  }\n\n  if( mode == 14 ) { // soft light\n\n    gl_FragColor = vec4( \n      applySoftLightToChannel( base.r, blend.r ),\n      applySoftLightToChannel( base.g, blend.g ),\n      applySoftLightToChannel( base.b, blend.b ),\n      applySoftLightToChannel( base.a, blend.a )\n    );\n    return;\n\n  }\n\n  if( mode == 15 ) { // hard light\n\n    gl_FragColor = vec4( \n      applyOverlayToChannel( base.r, blend.r ),\n      applyOverlayToChannel( base.g, blend.g ),\n      applyOverlayToChannel( base.b, blend.b ),\n      applyOverlayToChannel( base.a, blend.a )\n    );\n    gl_FragColor = gl_FragColor * opacity + base * ( 1. - opacity );\n    return;\n\n  }\n\n  if( mode == 16 ) { // vivid light\n\n  }\n\n  if( mode == 17 ) { // linear light\n\n    gl_FragColor = vec4( \n      applyLinearLightToChannel( base.r, blend.r ),\n      applyLinearLightToChannel( base.g, blend.g ),\n      applyLinearLightToChannel( base.b, blend.b ),\n      applyLinearLightToChannel( base.a, blend.a )\n    );\n    return;\n\n  }\n\n  if( mode == 18 ) { // pin light\n\n  }\n\n  if( mode == 19 ) { // hard mix\n\n  }\n\n  if( mode == 20 ) { // difference\n\n    gl_FragColor = abs( base - blend );\n    gl_FragColor.a = base.a + blend.b;\n    return;\n\n  }\n\n  if( mode == 21 ) { // exclusion\n\n    gl_FragColor = base + blend - 2. * base * blend;\n    \n  }\n\n  if( mode == 22 ) { // substract\n\n  }\n\n  if( mode == 23 ) { // divide\n\n  }\n\n  gl_FragColor = vec4( 1., 0., 1., 1. );\n\n}"

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var THREE = __webpack_require__(0);
var Pass = __webpack_require__(1);
var vertex = __webpack_require__(2);
var fragment = __webpack_require__(20);

function ZoomBlurPass(options) {
  Pass.call(this);

  options = options || {};

  this.setShader(vertex, fragment);

  this.params.center = new THREE.Vector2(options.centerX || 0.5, options.centerY || 0.5);
  this.params.strength = options.strength || 0.1;
}

module.exports = ZoomBlurPass;

ZoomBlurPass.prototype = Object.create(Pass.prototype);
ZoomBlurPass.prototype.constructor = ZoomBlurPass;

ZoomBlurPass.prototype.run = function(composer) {
  this.shader.uniforms.center.value.set(composer.width * this.params.center.x, composer.height * this.params.center.y);
  this.shader.uniforms.strength.value = this.params.strength;
  composer.pass(this.shader);
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nuniform sampler2D tInput;\nuniform vec2 center;\nuniform float strength;\nuniform vec2 resolution;\nvarying vec2 vUv;\n\nfloat random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}\n\nvoid main(){\n  vec4 color=vec4(0.0);\n  float total=0.0;\n  vec2 toCenter=center-vUv*resolution;\n  float offset=random(vec3(12.9898,78.233,151.7182),0.0);\n  for(float t=0.0;t<=40.0;t++){\n    float percent=(t+offset)/40.0;\n    float weight=4.0*(percent-percent*percent);\n    vec4 sample=texture2D(tInput,vUv+toCenter*percent*strength/resolution);\n    sample.rgb*=sample.a;\n    color+=sample*weight;\n    total+=weight;\n  }\n  gl_FragColor=color/total;\n  gl_FragColor.rgb/=gl_FragColor.a+0.00001;\n}"

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Pass = __webpack_require__(1);
var vertex = __webpack_require__(2);
var fragment = __webpack_require__(22);

function BrightnessContrastPass(brightness, contrast) {
  Pass.call(this);

  this.setShader(vertex, fragment);

  this.params.brightness = brightness || 1;
  this.params.contrast = contrast || 1;
}

module.exports = BrightnessContrastPass;

BrightnessContrastPass.prototype = Object.create(Pass.prototype);
BrightnessContrastPass.prototype.constructor = BrightnessContrastPass;

BrightnessContrastPass.prototype.run = function(composer) {
  this.shader.uniforms.brightness.value = this.params.brightness;
  this.shader.uniforms.contrast.value = this.params.contrast;
  composer.pass(this.shader);
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nuniform float brightness;\nuniform float contrast;\nuniform sampler2D tInput;\n\nvarying vec2 vUv;\n\nvoid main() {\n\n  vec3 color = texture2D(tInput, vUv).rgb;\n  vec3 colorContrasted = (color) * contrast;\n  vec3 bright = colorContrasted + vec3(brightness,brightness,brightness);\n  gl_FragColor.rgb = bright;\n  gl_FragColor.a = 1.;\n\n}"

/***/ }),
/* 23 */
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
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _three = __webpack_require__(0);

var _barycentricVert = __webpack_require__(30);

var _barycentricVert2 = _interopRequireDefault(_barycentricVert);

var _barycentricFrag = __webpack_require__(31);

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
  width: 5.0
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
/* 30 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nattribute vec2 barycentric;\n\nvarying vec2 vBC;\n\nvoid main() {\n  vBC = barycentric;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n"

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = "#extension GL_OES_standard_derivatives : enable\n\nprecision highp float;\nprecision highp int;\n#define GLSLIFY 1\n\nuniform float width;\nuniform vec3 color;\nuniform float alpha;\nuniform vec3 wireframeColor;\nuniform float wireframeAlpha;\nvarying vec2 vBC;\n\nfloat gridFactor (vec2 vBC, float w) {\n  vec3 bary = vec3(vBC.x, vBC.y, 1.0 - vBC.x - vBC.y);\n  vec3 d = fwidth(bary);\n  vec3 a3 = smoothstep(d * (w - 0.5), d * (w + 0.5), bary);\n  return min(min(a3.x, a3.y), a3.z);\n}\n\nvoid main() {\n  float factor = gridFactor(vBC, width);\n  vec3 color = mix(wireframeColor, color, factor);\n  float a = mix(wireframeAlpha, alpha, factor);\n  gl_FragColor = vec4(color, a);\n}\n"

/***/ }),
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */
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

var _wagner = __webpack_require__(4);

var _wagner2 = _interopRequireDefault(_wagner);

var _MultiPassBloomPass = __webpack_require__(14);

var _MultiPassBloomPass2 = _interopRequireDefault(_MultiPassBloomPass);

var _frag = __webpack_require__(106);

var _frag2 = _interopRequireDefault(_frag);

var _vert = __webpack_require__(107);

var _vert2 = _interopRequireDefault(_vert);

var _BarycentricMaterial = __webpack_require__(29);

var _BarycentricMaterial2 = _interopRequireDefault(_BarycentricMaterial);

var _points = __webpack_require__(108);

var _points2 = _interopRequireDefault(_points);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TEXT = 'codevember';
var TEXT_OFFSET = -TEXT.length + 0.5;
var POINTS = 1000;
var P_SIZE = 10;
var COLOR_SPEED = 10;
var TWINKLE_SPEED = 3;
var TWINKLE_OFFSET = 100;
var SCALE = 0.02;
var SCROLL_RATE = 0.001;
var ROTATION_SPEED = 0.0002;
var ROTATION_LIMIT_Y = 0.1;
var ROTATION_LIMIT_X = 0.2;
var FONT_DEPTH = 5;
var CAMERA_Y = 0;
var FONT_PATH = '../assets/hyrax-regular.typeface.json' || '../assets/droidsans.typeface.json';

var Experiment = function (_ThreeApp) {
  _inherits(Experiment, _ThreeApp);

  function Experiment() {
    _classCallCheck(this, Experiment);

    return _possibleConstructorReturn(this, (Experiment.__proto__ || Object.getPrototypeOf(Experiment)).apply(this, arguments));
  }

  _createClass(Experiment, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      // Set the video tiles to be almost "below the fold"
      document.querySelector('#container').style.marginTop = window.innerHeight - 100 + 'px';

      var experiments = document.querySelectorAll('a.experiment');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = experiments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var el = _step.value;

          el.addEventListener('mouseenter', function (e) {
            return _this2.onMouseEnter(e);
          });
          el.addEventListener('mouseleave', function (e) {
            return _this2.onMouseLeave(e);
          });
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

      this.renderer.setClearColor(0x101010);
      this.loader = new _three.FontLoader();
      this.loader.load(FONT_PATH, function (font) {
        _this2.font = font;
        _this2.textGeometry = new _three.TextGeometry(TEXT, {
          font: _this2.font,
          size: 150,
          height: 2,
          curveSegments: 5,
          bevelThickness: 1.5,
          bevelSegments: 1,
          bevelEnabled: true
        });

        _this2.wireframeMaterial = new _BarycentricMaterial2.default({
          width: 0.7,
          wireframeAlpha: 0.3,
          color: new _three.Color(0xffffff)
        });
        _this2.wireframeMaterial.blending = _three.AdditiveBlending;
        _this2.textGeometry = new _three.BufferGeometry().fromGeometry(_this2.textGeometry);
        _this2.textMesh = new _three.Mesh(_this2.textGeometry, _this2.wireframeMaterial);
        _BarycentricMaterial2.default.applyBarycentricCoordinates(_this2.textGeometry);
        _this2.textMesh.scale.set(SCALE, SCALE, SCALE * -FONT_DEPTH);
        _this2.textMesh.position.x = TEXT_OFFSET;
        _this2.textMesh.updateMatrixWorld();

        // Call this function to generate points; pasted into a cache at ./points.js
        // so use that unless we want to generate different results
        // const points = this.generatePoints();
        var points = new Float32Array(_points2.default);
        var offset = new Float32Array(POINTS);
        for (var i = 0; i < points.length / 3; i++) {
          offset[i] = Math.random();
        }

        _this2.geometry = new _three.BufferGeometry();
        _this2.geometry.addAttribute('position', new _three.BufferAttribute(points, 3));
        _this2.geometry.addAttribute('offset', new _three.BufferAttribute(offset, 1));
        _this2.material = new _three.ShaderMaterial({
          transparent: true,
          fragmentShader: _frag2.default,
          vertexShader: _vert2.default,
          uniforms: {
            time: { value: 0 },
            twinkleSpeed: { value: TWINKLE_SPEED },
            twinkleOffset: { value: TWINKLE_OFFSET },
            size: { value: P_SIZE },
            colorSpeed: { value: COLOR_SPEED },
            alphaMap: { value: 0 }
          },
          depthWrite: false
        });
        _this2.material.blending = _three.AdditiveBlending;

        _this2.textureLoader = new _three.TextureLoader();
        _this2.textureLoader.load('../assets/particle.jpg', function (texture) {
          _this2.material.uniforms.alphaMap.value = texture;
        });

        _this2.points = new _three.Points(_this2.geometry, _this2.material);
        _this2.pointsPivot = new _three.Object3D();
        _this2.scene.add(_this2.pointsPivot);
        _this2.pointsPivot.add(_this2.textMesh);
        _this2.pointsPivot.add(_this2.points);
      });

      this.pivot = new _three.Object3D();
      this.pivot.add(this.camera);
      this.scene.add(this.pivot);
      this.camera.position.set(0, CAMERA_Y, 15);
      this.renderer.render(this.scene, this.camera);
      this.composer = new _wagner2.default.Composer(this.renderer);
      this.pass = new _MultiPassBloomPass2.default({
        zoomBlurStrength: 0.2,
        enableZoomBlur: true,
        blurAmount: 0.9
      });

      window.addEventListener('scroll', function (e) {
        var scroll = window.pageYOffset || document.documentElement.scrollTop;
        _this2.camera.position.y = CAMERA_Y + scroll * SCROLL_RATE;
      }, supportsPassive() ? { passive: true } : false);
    }
  }, {
    key: 'generatePoints',
    value: function generatePoints() {
      var raycaster = new _three.Raycaster();
      var points = new Float32Array(POINTS * 3);
      var vec = new _three.Vector2();
      var i = 0;
      var bailout = 0;
      var t = performance.now();
      while (i < POINTS * 3) {
        vec.set(Math.random() * 2 - 1, Math.random() * 2 - 1);
        raycaster.setFromCamera(vec, this.camera);
        var intersects = raycaster.intersectObject(this.textMesh);

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = intersects[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var intersect = _step2.value;

            points[i++] = intersect.point.x;
            points[i++] = intersect.point.y;
            points[i++] = intersect.point.z;
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
      console.log('Generated ' + POINTS + ' intersections in ' + (performance.now() - t) / 1000 + 's');
      return points;
    }
  }, {
    key: 'update',
    value: function update(t, delta) {
      if (!this.pointsPivot) {
        this.offset = t;
        return;
      }
      t = t - this.offset;
      this.camera.lookAt(this.scene.position);
      this.material.uniforms.time.value = t * 0.001;
      this.wireframeMaterial.uniforms.wireframeAlpha.value = 0.05 + (Math.sin(t * 0.001) * 0.5 + 0.5) * 0.1;
      this.pointsPivot.rotation.y = t * 0.00005;
    }
  }, {
    key: 'render',
    value: function render() {
      this.composer.reset();
      this.composer.render(this.scene, this.camera);
      this.composer.pass(this.pass);
      this.composer.toScreen();
    }
  }, {
    key: 'onMouseEnter',
    value: function onMouseEnter(e) {
      e.target.querySelector('video').play();
    }
  }, {
    key: 'onMouseLeave',
    value: function onMouseLeave(e) {
      e.target.querySelector('video').pause();
    }
  }]);

  return Experiment;
}(_ThreeApp3.default);

exports.default = new Experiment();

// Test via a getter in the options object to see if the passive property is accessed
// var supportsPassive = false;
// via: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md

function supportsPassive() {
  var passive = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function get() {
        passive = true;
      }
    });
    window.addEventListener("test", null, opts);
  } catch (e) {}

  return passive;
}

/***/ }),
/* 106 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nuniform sampler2D alphaMap;\nuniform vec3 color;\nuniform float colorSpeed;\nuniform float time;\n\nvarying vec3 vPosition;\nvarying float vAlphaOffset;\n\nfloat map_1_0(float value, float inMin, float inMax, float outMin, float outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec2 map_1_0(vec2 value, vec2 inMin, vec2 inMax, vec2 outMin, vec2 outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec3 map_1_0(vec3 value, vec3 inMin, vec3 inMax, vec3 outMin, vec3 outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec4 map_1_0(vec4 value, vec4 inMin, vec4 inMax, vec4 outMin, vec4 outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\n\n\nfloat hue2rgb_2_1(float f1, float f2, float hue) {\n    if (hue < 0.0)\n        hue += 1.0;\n    else if (hue > 1.0)\n        hue -= 1.0;\n    float res;\n    if ((6.0 * hue) < 1.0)\n        res = f1 + (f2 - f1) * 6.0 * hue;\n    else if ((2.0 * hue) < 1.0)\n        res = f2;\n    else if ((3.0 * hue) < 2.0)\n        res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;\n    else\n        res = f1;\n    return res;\n}\n\nvec3 hsl2rgb_2_2(vec3 hsl) {\n    vec3 rgb;\n    \n    if (hsl.y == 0.0) {\n        rgb = vec3(hsl.z); // Luminance\n    } else {\n        float f2;\n        \n        if (hsl.z < 0.5)\n            f2 = hsl.z * (1.0 + hsl.y);\n        else\n            f2 = hsl.z + hsl.y - hsl.y * hsl.z;\n            \n        float f1 = 2.0 * hsl.z - f2;\n        \n        rgb.r = hue2rgb_2_1(f1, f2, hsl.x + (1.0/3.0));\n        rgb.g = hue2rgb_2_1(f1, f2, hsl.x);\n        rgb.b = hue2rgb_2_1(f1, f2, hsl.x - (1.0/3.0));\n    }   \n    return rgb;\n}\n\nvec3 hsl2rgb_2_2(float h, float s, float l) {\n    return hsl2rgb_2_2(vec3(h, s, l));\n}\n\n\n\nvoid main() {\n  vec4 tex = texture2D(alphaMap, gl_PointCoord);\n  float l = clamp(length(vPosition) / 16.0, 0.0, 0.5);\n  float t = fract(l +  (time * colorSpeed * 0.001));\n  float m = t;//map(t, 0.0, 1.0, 0.3, 0.8);\n  vec3 hsl = hsl2rgb_2_2(m, 0.8, 0.5);\n  float alpha = smoothstep(0.1, 0.9, tex.r) * vAlphaOffset;\n  gl_FragColor = vec4(hsl, alpha);\n}\n"

/***/ }),
/* 107 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nuniform float twinkleSpeed;\nuniform float twinkleOffset;\nuniform float size;\nuniform float time;\n\nattribute float offset;\n\nvarying vec3 vPosition;\nvarying float vAlphaOffset;\n\nvoid main() {\n  vAlphaOffset = sin((time * twinkleSpeed) + offset * twinkleOffset) * 0.5 + 0.5;\n  vPosition = position;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  gl_PointSize = size;// length(modelViewMatrix * vec4(position, 1.0));\n}\n"

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = [3.7338249683380127, 0.48440492153167725, 0.15000000596046448, 3.8595430850982666, 0.5007148385047913, -0.3499999940395355, -5.1743998527526855, 0.6007447838783264, -0.1754646748304367, -5.186244964599609, 0.602120041847229, -0.2102041095495224, 5.1234307289123535, 1.4970415830612183, 0.03339880332350731, 5.158315181732178, 1.5072346925735474, -0.06850633770227432, -4.047457695007324, 1.4320945739746094, 0.015966122969985008, -4.11160135269165, 1.4547903537750244, -0.22150015830993652, 2.6638660430908203, 1.483144760131836, 0.15000000596046448, 2.753558397293091, 1.533082365989685, -0.3499999940395355, 6.761350631713867, 0.3155497610569, 0.04820135980844498, 6.827550888061523, 0.31863933801651, -0.09819193929433823, 3.8216958045959473, 1.8602485656738281, 0.005801356863230467, 3.8318419456481934, 1.8651872873306274, -0.0340062752366066, 2.4697635173797607, 0.056965067982673645, 0.005292613059282303, 2.5106048583984375, 0.057907070964574814, -0.2426668256521225, 8.002501487731934, 1.0917377471923828, 0.06456708908081055, 8.224629402160645, 1.1220414638519287, -0.3499999940395355, 10.409061431884766, 2.0808658599853516, -0.05516594648361206, 10.516423225402832, 2.1023285388946533, -0.21044950187206268, -4.639856815338135, 0.39630383253097534, 0.08013132214546204, -4.73114538192749, 0.40410104393959045, -0.2134147584438324, 3.4076621532440186, 1.0785797834396362, 0.014560029841959476, 3.408909797668457, 1.0789746046066284, 0.009073758497834206, 3.4374711513519287, 1.088014841079712, -0.11652766168117523, 3.472357988357544, 1.0990569591522217, -0.26994431018829346, 5.9269022941589355, 0.024671511724591255, 0.1262332797050476, 10.511760711669922, 1.1736706495285034, 0.0886337161064148, 10.820975303649902, 1.208195447921753, -0.3499999940395355, -9.212043762207031, 1.271790623664856, 0.15000000596046448, -9.453482627868652, 1.3051230907440186, -0.23920483887195587, 8.442570686340332, 0.13420337438583374, 0.0038173822686076164, 8.566126823425293, 0.13616742193698883, -0.2156500667333603, 3.3233375549316406, 1.107479214668274, 0.0928703024983406, 3.4006896018981934, 1.133256196975708, -0.2540993094444275, 10.297865867614746, 1.1324388980865479, 0.08326570689678192, 10.391904830932617, 1.1427801847457886, -0.052952833473682404, 10.42111587524414, 1.1459925174713135, -0.09526629000902176, 10.596973419189453, 1.165331244468689, -0.3499999940395355, 8.264330863952637, 0.14661671221256256, 0.0026262819301337004, 8.352516174316406, 0.14818121492862701, -0.15740589797496796, -5.870152473449707, 1.718395471572876, -0.31529510021209717, 10.341564178466797, 1.7957415580749512, 0.14162088930606842, 10.683736801147461, 1.855157494544983, -0.3499999940395355, -2.5404064655303955, 1.7518491744995117, 0.14593373239040375, 1.9773750305175781, 1.3657021522521973, -0.08839600533246994, 1.994560956954956, 1.3775718212127686, -0.21953347325325012, -6.40149450302124, 0.9374686479568481, 0.15000000596046448, -6.6158270835876465, 0.9688566327095032, -0.34720176458358765, -8.316993713378906, 0.47928303480148315, 0.1469808667898178, -8.595279693603516, 0.49531981348991394, -0.3499999940395355, -0.6821334958076477, 0.8672462105751038, 0.15000000596046448, -0.705100953578949, 0.8964464068412781, -0.3499999940395355, 10.713234901428223, 1.0235778093338013, 0.10750288516283035, 11.010087013244629, 1.0519400835037231, -0.30515244603157043, 2.527635335922241, 1.146889567375183, 0.07778210937976837, 2.598982334136963, 1.1792625188827515, -0.3434237539768219, 4.910037040710449, 0.2568857669830322, 0.15000000596046448, 5.075357913970947, 0.2655351161956787, -0.3499999940395355, 7.119671821594238, 0.47198769450187683, -0.17097333073616028, 7.141273498535156, 0.473419725894928, -0.21700288355350494, 6.244576454162598, 2.392504930496216, 0.12806858122348785, 5.549633502960205, 1.9849153757095337, -0.29790472984313965, 4.607767581939697, -0.09054344147443771, 0.0531282052397728, 4.707261085510254, -0.09249850362539291, -0.2696131765842438, 4.98458194732666, 0.750487744808197, 0.15000000596046448, 5.1304755210876465, 0.7724537253379822, -0.2846444547176361, -0.9696468710899353, 1.9743260145187378, 0.05506915599107742, -0.9874899983406067, 2.0106570720672607, -0.21994347870349884, 0.7176473140716553, 0.24151022732257843, -0.3379533886909485, -7.649554252624512, 1.877082109451294, 0.02617388777434826, -7.805435657501221, 1.9153330326080322, -0.27896058559417725, 6.700165748596191, 0.9890892505645752, 0.15000000596046448, 6.866556644439697, 1.0136522054672241, -0.21878306567668915, -6.062943458557129, 0.23911431431770325, -0.1358029991388321, -6.1003642082214355, 0.24059012532234192, -0.2292211353778839, -0.042964283376932144, 1.7051787376403809, 0.15000000596046448, -0.04441089183092117, 1.7625921964645386, -0.3499999940395355, 3.889012336730957, 0.9265920519828796, 0.15000000596046448, 4.019955635070801, 0.9577904343605042, -0.3499999940395355, 4.321053504943848, 1.7562236785888672, 0.05988013371825218, 4.4150390625, 1.7944225072860718, -0.26507583260536194, 9.04678726196289, 0.454782634973526, 0.00575830414891243, 6.464229583740234, 0.41796985268592834, 0.15000000596046448, 6.681879997253418, 0.4320428967475891, -0.3499999940395355, 9.997264862060547, 0.8470423221588135, 0.15000000596046448, 10.278701782226562, 0.8708877563476562, -0.26804813742637634, 4.612021446228027, 0.8267444968223572, 0.15000000596046448, 4.767308235168457, 0.8545809984207153, -0.3499999940395355, -5.868318557739258, 0.1593635529279709, -0.271101713180542, -3.525658369064331, 0.11856107413768768, -0.29741477966308594, 2.068364381790161, 1.234839677810669, 0.05340811237692833, 2.117663860321045, 1.2642720937728882, -0.30284351110458374, 9.830964088439941, 0.35538098216056824, 0.15000000596046448, 10.161972999572754, 0.3673466742038727, -0.3499999940395355, -1.5123430490493774, 0.3797811269760132, 0.14602288603782654, -1.5579618215560913, 0.39123696088790894, -0.3020370304584503, -7.691896915435791, 0.6371795535087585, 0.15000000596046448, -7.9486870765686035, 0.658451497554779, -0.34576016664505005, -3.654834270477295, 1.82576322555542, -0.25930798053741455, -4.11122465133667, 2.0766186714172363, 0.09454148262739182, 4.365555286407471, 0.9802307486534119, 0.01174882147461176, 4.45487117767334, 1.0002855062484741, -0.2948979437351227, 7.986892223358154, 0.46274441480636597, 0.05173206701874733, 7.215420722961426, 0.40526920557022095, 0.10889185965061188, -7.922682762145996, 1.4071202278137207, 0.15000000596046448, -8.18943977355957, 1.454498052597046, -0.3499999940395355, 4.950374126434326, 1.3235284090042114, 0.15000000596046448, 5.0998148918151855, 1.3634828329086304, -0.2982890009880066, 10.225398063659668, 1.079077959060669, 0.14175790548324585, 10.381650924682617, 1.095567226409912, -0.08528871834278107, 10.438185691833496, 1.10153329372406, -0.1674373298883438, 10.49821949005127, 1.1078685522079468, -0.25467121601104736, 7.972998142242432, 1.6235016584396362, -0.29827257990837097, -7.574192523956299, 1.8334569931030273, -0.026695314794778824, -7.691934108734131, 1.8619582653045654, -0.26028648018836975, -2.111025094985962, 0.64476478099823, 0.1495160162448883, -2.1786949634552, 0.6654329895973206, -0.32652175426483154, -0.740401566028595, 1.436263918876648, 0.15000000596046448, -0.7653309106826782, 1.4846229553222656, -0.3499999940395355, -1.523520588874817, 0.45656219124794006, 0.1136578768491745, -1.5632731914520264, 0.4684750735759735, -0.2747649848461151, 8.344158172607422, 1.7314648628234863, 0.09580639749765396, -2.3771347999572754, 0.07467352598905563, 0.04892941564321518, -2.42436146736145, 0.07615707814693451, -0.2481057345867157, -0.4193909466266632, 0.31939488649368286, 0.15000000596046448, -0.4335118532180786, 0.33014893531799316, -0.3499999940395355, -1.186680793762207, 1.0693395137786865, 0.15000000596046448, -1.226636290550232, 1.1053441762924194, -0.3499999940395355, 6.112790107727051, 2.6567418575286865, 0.10913819074630737, -7.449261665344238, 0.5678347945213318, 0.003731565084308386, -7.624974727630615, 0.5812288522720337, -0.3499999940395355, -6.3714599609375, 0.19192633032798767, 0.05647433176636696, -6.496360778808594, 0.19568869471549988, -0.23646637797355652, 4.418004512786865, 0.590709924697876, 0.0737929567694664, 4.543442726135254, 0.6074817180633545, -0.3499999940395355, 3.7786543369293213, 0.05871943011879921, 0.15000000596046448, 3.905881881713867, 0.06069651618599892, -0.3499999940395355, -3.614466905593872, 0.5947318077087402, 0.0690445676445961, -3.6822457313537598, 0.605884313583374, -0.2109420895576477, -2.1373324394226074, 0.9988922476768494, 0.09851899743080139, -2.2016639709472656, 1.0289578437805176, -0.3499999940395355, 6.379100322723389, 0.007045017089694738, 0.1333983838558197, 6.582766056060791, 0.007269944064319134, -0.34124866127967834, -0.1743532121181488, 0.5290075540542603, 0.15000000596046448, -0.18022368848323822, 0.5468192100524902, -0.3499999940395355, 9.40393352508545, 0.7268458008766174, -0.02279616706073284, 9.608756065368652, 0.742676854133606, -0.3499999940395355, 4.218862533569336, 1.5224509239196777, 0.15000000596046448, 4.360911846160889, 1.5737119913101196, -0.3499999940395355, 6.215690612792969, 0.5972062349319458, 0.15000000596046448, 6.424973011016846, 0.6173142194747925, -0.3499999940395355, 0.6533139944076538, 0.8919260501861572, 0.03952362760901451, 0.665141761302948, 0.9080736041069031, -0.23132389783859253, 9.398978233337402, 0.3385123312473297, 0.003282705554738641, 9.620392799377441, 0.34648677706718445, -0.3499999940395355, 1.0543104410171509, 0.3930327296257019, 0.014274809509515762, 1.0715972185134888, 0.3994770348072052, -0.23143671452999115, 7.912467002868652, 0.6617926955223083, -0.17963458597660065, 7.936092853546143, 0.6637687683105469, -0.22495989501476288, -8.178269386291504, 0.11145281791687012, 0.15000000596046448, -8.453631401062012, 0.11520543694496155, -0.3499999940395355, -7.481170654296875, 0.3895002007484436, 0.005743302870541811, -7.658663749694824, 0.398741215467453, -0.3499999940395355, 7.929512023925781, 1.086700677871704, -0.08812770992517471, 8.03754711151123, 1.1015063524246216, -0.29369544982910156, -1.032792568206787, 1.1614516973495483, 0.15000000596046448, -1.0675667524337769, 1.200557827949524, -0.3499999940395355, 7.669999122619629, 0.20619051158428192, 0.13127553462982178, 7.852330207824707, 0.21109206974506378, -0.22218358516693115, -1.2496439218521118, 0.46574610471725464, 0.03617553785443306, -1.2708497047424316, 0.4736495614051819, -0.21775217354297638, 5.649319171905518, 1.4543213844299316, 0.027861356735229492, 5.678810119628906, 1.4619133472442627, -0.0502975694835186, 3.203303337097168, 1.3948551416397095, 0.15000000596046448, 3.3111586570739746, 1.4418199062347412, -0.3499999940395355, -1.9213602542877197, 0.1655971109867096, 0.04082157462835312, -1.9560602903366089, 0.1685878187417984, -0.22934329509735107, -3.051008462905884, 1.0656379461288452, -0.022184990346431732, -3.0961732864379883, 1.0814127922058105, -0.24456124007701874, 3.18670916557312, 1.3893882036209106, 0.15000000596046448, 3.294005870819092, 1.436168909072876, -0.3499999940395355, -5.501507759094238, 0.6453872323036194, -0.28288164734840393, -4.009118556976318, 0.722119152545929, -0.11789140850305557, -4.0380635261535645, 0.7273326516151428, -0.2270391434431076, 10.694084167480469, 1.5629639625549316, 0.15000000596046448, 11.054154396057129, 1.6155890226364136, -0.3499999940395355, 3.1063969135284424, 0.493301123380661, 0.15000000596046448, 3.207494020462036, 0.5093555450439453, -0.33329078555107117, -8.801823616027832, 1.7279444932937622, 0.15000000596046448, -9.08362102508545, 1.7832660675048828, -0.3254348039627075, -2.5854873657226562, 0.7611731886863708, 0.10214933007955551, -2.6548116207122803, 0.7815823554992676, -0.2973034977912903, -7.859859466552734, 0.518103837966919, 0.15000000596046448, -8.12450122833252, 0.5355483889579773, -0.3499999940395355, 7.806987762451172, 0.21418508887290955, 0.03855728358030319, 7.89434814453125, 0.2165818214416504, -0.12886184453964233, -3.6178019046783447, 1.9801286458969116, 0.08994534611701965, -3.692687511444092, 2.021115779876709, -0.21868127584457397, 5.5955986976623535, 1.963380217552185, -0.25585368275642395, -0.15678192675113678, 1.8458189964294434, 0.15000000596046448, -0.16152089834213257, 1.9016116857528687, -0.2988636791706085, -4.737342357635498, 0.10940763354301453, 0.017700277268886566, -4.815814018249512, 0.11121992021799088, -0.2304743081331253, -0.784443199634552, 0.6889742612838745, 0.15000000596046448, -0.8108554482460022, 0.7121720314025879, -0.3499999940395355, -4.143922328948975, 0.8538821339607239, 0.1255272626876831, -4.276400566101074, 0.8811801671981812, -0.3499999940395355, -7.980839252471924, 0.7995127439498901, 0.012705501168966293, -8.008008003234863, 0.8022345304489136, -0.038315631449222565, -7.03209924697876, 0.19287890195846558, 0.12362786382436752, 1.4859012365341187, 1.5843496322631836, 0.0759701281785965, 1.5175843238830566, 1.6181319952011108, -0.2422475516796112, 3.7512450218200684, 1.481433629989624, 0.15000000596046448, 3.877549648284912, 1.5313135385513306, -0.3499999940395355, 1.9514073133468628, 0.8002477884292603, 0.11838836222887039, 2.0110769271850586, 0.8247175216674805, -0.33665773272514343, -2.3978350162506104, 0.2795930802822113, 0.1303519755601883, -2.47123384475708, 0.2881515622138977, -0.3248156011104584, 6.213441848754883, 1.2332674264907837, 0.09140698611736298, 6.397407054901123, 1.269781470298767, -0.3499999940395355, -7.460643291473389, 1.4236024618148804, 0.02570030465722084, -7.647828102111816, 1.4593201875686646, -0.3499999940395355, 2.9693453311920166, 1.6584948301315308, 0.15000000596046448, 3.0693233013153076, 1.7143363952636719, -0.3499999940395355, 1.2624998092651367, 0.8395402431488037, 0.045459844172000885, 1.2887927293777466, 0.857024610042572, -0.26598498225212097, 2.0577054023742676, 0.5843653678894043, 0.07517080754041672, 2.103740930557251, 0.5974389314651489, -0.25873205065727234, -6.575799465179443, 0.4267990291118622, 0.13314196467399597, -6.724828243255615, 0.4364716708660126, -0.2037891298532486, 8.538066864013672, 0.7939060926437378, 0.006158675067126751, 8.674129486083984, 0.8065577745437622, -0.2327830195426941, -6.384913921356201, -0.016721168532967567, 0.09998133033514023, -6.568345069885254, -0.01720154844224453, -0.32807937264442444, 11.01145076751709, 1.8181871175765991, 0.15000000596046448, 11.261089324951172, 1.85940682888031, -0.18666106462478638, -9.370856285095215, 0.8809789419174194, 0.15000000596046448, -9.548407554626465, 0.8976709842681885, -0.13136519491672516, 3.4399404525756836, 1.8138567209243774, 0.01950627751648426, 3.494025707244873, 1.8423755168914795, -0.21602843701839447, -8.611563682556152, 1.2843711376190186, 0.07624202966690063, -8.857521057128906, 1.321054458618164, -0.3499999940395355, -0.904751181602478, 0.9916021227836609, 0.15000000596046448, -0.9352142214775085, 1.024989366531372, -0.3499999940395355, -7.6346611976623535, 0.873778760433197, 0.0025559077039361, -7.719343185424805, 0.8834704756736755, -0.1637924760580063, 10.824217796325684, 1.302159070968628, 0.15000000596046448, 11.176931381225586, 1.344590663909912, -0.33389660716056824, -7.691950798034668, 0.8526791930198669, 0.032889652997255325, -7.8121562004089355, 0.8660044074058533, -0.20100778341293335, -4.007216453552246, 1.1126807928085327, -0.05605649948120117, -4.058350563049316, 1.1268792152404785, -0.2481795996427536, 0.22249746322631836, 1.1047701835632324, 0.12324721366167068, 0.22924712300300598, 1.13828444480896, -0.3280527889728546, 7.0621337890625, 1.711155652999878, 0.1467629075050354, 10.732915878295898, 1.1500481367111206, 0.15000000596046448, 11.094293594360352, 1.1887702941894531, -0.3499999940395355, 10.222917556762695, 1.8935402631759644, 0.05424385890364647, 10.247659683227539, 1.8981231451034546, 0.018070468679070473, 10.294622421264648, 1.906821846961975, -0.05058830603957176, 10.497132301330566, 1.9443317651748657, -0.3466546833515167, 7.942544937133789, 1.1328400373458862, -0.09896069020032883, 8.04015064239502, 1.146761417388916, -0.28451094031333923, 3.543417453765869, 0.6008229851722717, 0.1462220847606659, 3.661792755126953, 0.620894730091095, -0.3499999940395355, 7.6928534507751465, 0.3848237991333008, 0.004900122061371803, 7.699505805969238, 0.3851566016674042, -0.00806734710931778, -3.166762351989746, 0.7409803867340088, 0.07266169786453247, -4.513530254364014, 1.4263954162597656, 0.00764801912009716, -4.529167175292969, 1.4313371181488037, -0.044291917234659195, -7.983865737915039, 1.3925502300262451, 0.15000000596046448, -8.252323150634766, 1.4393746852874756, -0.34933051466941833, -4.191344738006592, 2.143045425415039, 0.12964946031570435, -6.659675598144531, -0.017677240073680878, 0.1422882378101349, -4.589625835418701, 1.185603141784668, 0.15000000596046448, -4.713592529296875, 1.2176265716552734, -0.25110092759132385, 0.15433475375175476, 0.8912158012390137, 0.11478342115879059, 0.15883396565914154, 0.9171968102455139, -0.3191547095775604, -3.672614812850952, 0.9219802021980286, 0.05018956959247589, -3.727175712585449, 0.9356772303581238, -0.1719069629907608, 5.156162738800049, 0.5224551558494568, 0.04386137053370476, 5.203444480895996, 0.5272461175918579, -0.09328680485486984, 2.6976215839385986, 1.6843453645706177, 0.15000000596046448, 2.7879958152770996, 1.7407734394073486, -0.3474970757961273, 5.4980573654174805, 0.15594501793384552, -0.2447168231010437, 3.998556613922119, 1.714760184288025, 0.05935502052307129, 4.062007904052734, 1.7419708967208862, -0.1777307093143463, 10.224787712097168, 1.2758314609527588, 0.15000000596046448, 10.368432998657227, 1.293755292892456, -0.05862445384263992, 10.44633960723877, 1.303476333618164, -0.1717713326215744, 10.569056510925293, 1.318788766860962, -0.3499999940395355, -0.3168066442012787, 1.284496545791626, 0.15000000596046448, -0.32747355103492737, 1.3277456760406494, -0.3499999940395355, 10.336730003356934, 1.6956558227539062, 0.15000000596046448, 10.684767723083496, 1.7527486085891724, -0.3499999940395355, -7.28694486618042, 0.7361366748809814, 0.1145906001329422, -7.462141513824463, 1.6666979789733887, -0.1427757889032364, -7.509898662567139, 1.677364706993103, -0.23968857526779175, 3.966566324234009, 1.3434075117111206, 0.15000000596046448, 4.0935564041137695, 1.3864167928695679, -0.3254240155220032, 4.095518589019775, 1.3870813846588135, -0.33277004957199097, 4.098152160644531, 1.387973427772522, -0.34263062477111816, -4.27780818939209, 1.362187147140503, 0.07694536447525024, -4.374772071838379, 1.3930634260177612, -0.2613104283809662, 7.616372585296631, 0.3548911213874817, -0.2773459255695343, 2.895491600036621, 1.1908905506134033, 0.15000000596046448, 2.992983102798462, 1.2309879064559937, -0.3499999940395355, -1.2683842182159424, 1.1956195831298828, 0.14697161316871643, -1.308124303817749, 1.2330797910690308, -0.31839293241500854, -8.581738471984863, 0.4094078838825226, 0.15000000596046448, -8.870685577392578, 0.4231926500797272, -0.3499999940395355, 3.115917444229126, 0.007608072366565466, 0.09296540915966034, 3.1907265186309814, 0.007790732197463512, -0.2649334967136383, -7.8786468505859375, 1.187346339225769, 0.15000000596046448, -8.123931884765625, 1.2243117094039917, -0.3123222887516022, 5.274947643280029, 0.2619180679321289, 0.040338125079870224, 5.321568489074707, 0.26423290371894836, -0.0918770581483841, 5.4093170166015625, 0.26858991384506226, -0.34073108434677124, 9.564858436584473, 1.252558708190918, 0.12807929515838623, 9.872335433959961, 1.2928240299224854, -0.3499999940395355, -7.5997138023376465, 1.7628772258758545, 0.060972023755311966, -7.808781623840332, 1.8113739490509033, -0.3499999940395355, 6.242407321929932, 0.834505558013916, 0.15000000596046448, 6.452589511871338, 0.8626033663749695, -0.3499999940395355, -7.975619316101074, 1.1832480430603027, 0.15000000596046448, -8.19442081451416, 1.2157090902328491, -0.25739187002182007, 9.040708541870117, 1.1907594203948975, 0.10407784581184387, 3.1150529384613037, 0.9440945982933044, 0.15000000596046448, 3.2167975902557373, 0.9749308228492737, -0.3350343406200409, -6.083749294281006, 0.24442505836486816, 0.018716560676693916, -6.210066795349121, 0.2495000809431076, -0.2923414409160614, -1.83367919921875, 1.523175597190857, 0.05763551965355873, -1.8726298809051514, 1.5555305480957031, -0.259767085313797, 1.3136132955551147, 0.6668074131011963, 0.14953584969043732, 1.3546643257141113, 0.687645435333252, -0.3145478665828705, -9.286666870117188, 0.7075827121734619, 0.15000000596046448, -9.514300346374512, 0.7249268293380737, -0.21400032937526703, -6.6519317626953125, 0.8538881540298462, 0.11335086077451706, -6.773055553436279, 0.8694364428520203, -0.15771690011024475, 0.13366520404815674, 1.2581943273544312, 0.15000000596046448, 0.13816572725772858, 1.3005577325820923, -0.3499999940395355, -4.009799003601074, 0.787487268447876, -0.07610011845827103, -4.053689002990723, 0.7961068749427795, -0.24111919105052948, 2.9335155487060547, 1.6426737308502197, 0.15000000596046448, 3.032287120819092, 1.697982668876648, -0.3499999940395355, -0.5226761698722839, 0.49309685826301575, 0.15000000596046448, -0.5402746796607971, 0.5096994638442993, -0.3499999940395355, -8.589536666870117, 0.3333316743373871, 0.15000000596046448, -8.87874698638916, 0.34455496072769165, -0.3499999940395355, -8.597627639770508, 1.0855412483215332, 0.03434549272060394, -8.81843090057373, 1.113420009613037, -0.3499999940395355, 5.553011894226074, 1.3885656595230103, 0.12007398903369904, 5.674461364746094, 1.4189348220825195, -0.20536312460899353, -0.8428313136100769, 0.20227138698101044, 0.15000000596046448, -0.8712095022201538, 0.20908187329769135, -0.3499999940395355, -7.49479866027832, 1.739443302154541, -0.06878181546926498, -7.586259365081787, 1.7606701850891113, -0.2526701092720032, 4.838711261749268, 0.07334975153207779, 0.15000000596046448, 5.001630783081055, 0.07581944018602371, -0.3499999940395355, -7.8853302001953125, 1.4289525747299194, 0.15000000596046448, -8.150829315185547, 1.4770654439926147, -0.3499999940395355, 5.554105758666992, 0.937841534614563, 0.12810523808002472, 5.680284023284912, 0.9591473937034607, -0.2097543478012085, -7.624477863311768, 0.30720481276512146, 0.10325581580400467, -7.85646390914917, 0.31655198335647583, -0.3499999940395355, 7.185604572296143, 0.3202444314956665, 0.12352918833494186, 4.929477214813232, 1.4326636791229248, 0.15000000596046448, 5.073699474334717, 1.4745792150497437, -0.284467488527298, 8.114669799804688, 0.8198351860046387, 0.03855406492948532, 8.125737190246582, 0.8209533095359802, 0.018148697912693024, 8.214207649230957, 0.8298916220664978, -0.14496898651123047, 8.271617889404297, 0.8356918692588806, -0.2508194148540497, 4.5987725257873535, -0.10972891747951508, 0.03326428309082985, 4.686807155609131, -0.11182946711778641, -0.2532447874546051, 1.466752052307129, 1.0999881029129028, 0.15000000596046448, 1.5161375999450684, 1.1370247602462769, -0.3499999940395355, -3.00789737701416, 1.1549737453460693, -0.1667100489139557, -3.016134262084961, 1.1581366062164307, -0.20824342966079712, 6.270594120025635, 0.8286184668540955, 0.15000000596046448, 6.481725215911865, 0.8565180897712708, -0.3499999940395355, -8.644582748413086, 0.9632682204246521, 0.07323872298002243, -8.889694213867188, 0.9905810356140137, -0.3499999940395355, -6.286326885223389, 0.34109747409820557, 0.15000000596046448, -6.497987747192383, 0.3525822162628174, -0.3499999940395355, -0.5975415110588074, 0.5490288734436035, 0.15000000596046448, -0.6176607608795166, 0.5675147175788879, -0.3499999940395355, -1.0346587896347046, 0.513999879360199, 0.15000000596046448, -1.0694957971572876, 0.531306266784668, -0.3499999940395355, 5.5735578536987305, 2.025357723236084, 0.07364363223314285, 5.650826930999756, 2.053436517715454, -0.13328899443149567, 0.24692609906196594, 1.955505609512329, 0.03837212547659874, 0.25099650025367737, 1.9877408742904663, -0.20826032757759094, 4.071128845214844, 0.9573255777359009, 0.15000000596046448, 4.196772575378418, 0.9868707060813904, -0.3083024322986603, -5.945476531982422, 0.5231219530105591, -0.0660242885351181, -6.029343128204346, 0.5305010676383972, -0.27854475378990173, -9.338703155517578, 1.6261128187179565, 0.02336503006517887, -9.365002632141113, 1.6306922435760498, -0.0188119076192379, 3.410404920578003, 0.6287749409675598, 0.02052116021513939, 3.4800102710723877, 0.6416080594062805, -0.28520599007606506, 4.187808990478516, 0.6921288967132568, 0.07567526400089264, 4.266162872314453, 0.705078661441803, -0.20355896651744843, 4.966650485992432, -0.03673747554421425, 0.08072429895401001, 5.074185371398926, -0.03753289580345154, -0.2422994077205658, 6.224704265594482, 1.1885212659835815, 0.12130511552095413, 6.421881198883057, 1.226169466972351, -0.3499999940395355, -6.698873996734619, 1.789209246635437, 0.13135643303394318, -1.4064120054244995, 1.5460704565048218, 0.13328176736831665, -1.4521311521530151, 1.5963295698165894, -0.3499999940395355, 5.046969413757324, 0.5131934881210327, 0.14528241753578186, 5.173700332641602, 0.5260798931121826, -0.22772343456745148, 8.412796020507812, 0.8834658265113831, 0.07085178047418594, 8.57343864440918, 0.9003356695175171, -0.21422158181667328, -4.719934463500977, 1.4972561597824097, 0.004369453061372042, -4.7967987060546875, 1.5216389894485474, -0.23983396589756012, 8.439367294311523, 1.7261368036270142, 0.08958540111780167, 5.625731468200684, 1.040183424949646, -0.26067033410072327, 0.9955638647079468, 0.207773819565773, 0.0018610829720273614, 0.998699963092804, 0.20842832326889038, -0.04538445547223091, -6.574923038482666, 0.5139880180358887, 0.15000000596046448, -6.736694812774658, 0.5266343355178833, -0.2153744399547577, 7.115898132324219, 1.5850855112075806, 0.07760215550661087, 6.853803634643555, 1.0455880165100098, 0.027005627751350403, 6.882292747497559, 1.0499341487884521, -0.03523177653551102, 8.60439682006836, 1.1198240518569946, 0.11963045597076416, 8.748137474060059, 1.1385313272476196, -0.1289539337158203, 8.235742568969727, 1.6650831699371338, 0.05214238166809082, 8.408978462219238, 1.7001076936721802, -0.2622818052768707, 6.438217639923096, 0.5563000440597534, 0.15000000596046448, 6.654992580413818, 0.5750306844711304, -0.3499999940395355, -1.5637232065200806, 0.6971318125724792, 0.0839078351855278, -1.564358115196228, 0.6974148750305176, 0.07785111665725708, -1.564358115196228, 0.6974148750305176, 0.07785100489854813, -1.56448233127594, 0.6974702477455139, 0.07666610181331635, -1.56448233127594, 0.6974702477455139, 0.07666610181331635, -1.6004682779312134, 0.7135133743286133, -0.2665976881980896, -1.6004682779312134, 0.7135133743286133, -0.2665976881980896, -1.6044000387191772, 0.7152661681175232, -0.30410176515579224, -1.6044000387191772, 0.7152661681175232, -0.30410176515579224, -1.6047042608261108, 0.7154017686843872, -0.30700355768203735, 7.248283386230469, 0.7786332368850708, 0.023463701829314232, 1.5505698919296265, 1.3279118537902832, 0.15000000596046448, 1.6027776002883911, 1.3726227283477783, -0.3499999940395355, 9.365326881408691, 1.326400876045227, -0.008422674611210823, 9.578473091125488, 1.3565884828567505, -0.3499999940395355, -4.102038860321045, 0.7011649012565613, 0.08746682852506638, -4.222373962402344, 0.7217339277267456, -0.3499999940395355, 10.549084663391113, 0.9785599708557129, -0.05716601014137268, 10.70366382598877, 0.9928991794586182, -0.27780425548553467, 6.5951714515686035, 0.5646358728408813, 0.15000000596046448, 6.789829730987549, 0.5813012719154358, -0.28830191493034363, -6.651803970336914, 1.3992302417755127, 0.040273260325193405, -6.694238662719727, 1.4081565141677856, -0.05516211315989494, -3.71401309967041, 1.665725827217102, 0.008047220297157764, -3.722493886947632, 1.6695293188095093, -0.026185616850852966, 9.519344329833984, 0.5725880265235901, 0.11659765988588333, 9.817777633666992, 0.5905387997627258, -0.3499999940395355, 0.3779708743095398, 1.710030436515808, 0.1260925978422165, 0.38901612162590027, 1.7600017786026, -0.3085598945617676, 9.788778305053711, 1.5396229028701782, 0.15000000596046448, 10.118366241455078, 1.5914621353149414, -0.3499999940395355, 4.817133903503418, 1.7265944480895996, 0.1053929552435875, 4.9273681640625, 1.7661055326461792, -0.2354525476694107, -0.7091599702835083, 0.15867209434509277, 0.15000000596046448, -0.7330374121665955, 0.16401457786560059, -0.3499999940395355, 6.720487594604492, 1.4059163331985474, 0.044969260692596436, 6.771113395690918, 1.4165071249008179, -0.06768779456615448, 10.976727485656738, 1.3445252180099487, 0.15000000596046448, 11.274974822998047, 1.3810571432113647, -0.2534884810447693, 5.4429216384887695, 0.1389717310667038, -0.29498016834259033, 8.26407241821289, 0.728977382183075, 0.08236407488584518, 8.44899845123291, 0.7452897429466248, -0.25144922733306885, -4.479233264923096, 1.0420154333114624, 0.15000000596046448, -4.630049228668213, 1.077100157737732, -0.3499999940395355, -4.011315822601318, 0.6863154172897339, 0.0026910610031336546, -4.084550380706787, 0.6988455653190613, -0.27111560106277466, 1.5090540647506714, 0.8994578719139099, 0.08417312055826187, 1.5474319458007812, 0.9223326444625854, -0.2951624095439911, -2.261683225631714, 0.9443473219871521, 0.12395532429218292, -2.3337411880493164, 0.974434494972229, -0.3499999940395355, 0.3131679594516754, 1.7432032823562622, 0.15000000596046448, 0.3235265910625458, 1.8008630275726318, -0.3411923944950104, 8.427770614624023, 0.7176300287246704, 0.077311672270298, 8.631878852844238, 0.735010027885437, -0.28409478068351746, -4.295258045196533, 1.4806125164031982, 0.001185347675345838, -4.354034423828125, 1.500873327255249, -0.20405928790569305, 8.166424751281738, 1.2894697189331055, 0.15000000596046448, 8.441389083862305, 1.3328862190246582, -0.3499999940395355, 6.427868843078613, 1.3566839694976807, 0.15000000596046448, 6.629525661468506, 1.3992462158203125, -0.3158784806728363, 8.2534761428833, 0.8010580539703369, 0.019064268097281456, 8.254322052001953, 0.8011401891708374, 0.017528366297483444, 8.303229331970215, 0.8058869242668152, -0.07124269753694534, 8.380663871765137, 0.8134024739265442, -0.21179413795471191, 6.142812252044678, 1.3063347339630127, -0.128879114985466, 6.183542728424072, 1.3149964809417725, -0.2291930764913559, -7.0907769203186035, 0.4865568280220032, 0.0062927440740168095, -2.3402793407440186, 1.3633842468261719, 0.15000000596046448, -2.419076681137085, 1.4092894792556763, -0.3499999940395355, 6.422245502471924, 0.2757895588874817, 0.11651026457548141, 6.6118035316467285, 0.2839297354221344, -0.32278916239738464, -9.458182334899902, 0.929944634437561, 0.08739735186100006, -9.552647590637207, 0.939232587814331, -0.06154489517211914, 8.724345207214355, 0.09586912393569946, 0.09205478429794312, 8.029151916503906, 1.338208794593811, 0.020942943170666695, 8.227986335754395, 1.371348261833191, -0.3499999940395355, 2.5506725311279297, 1.4155465364456177, 0.15000000596046448, 2.6365537643432617, 1.4632080793380737, -0.3499999940395355, 7.252217769622803, 0.5219568610191345, 0.08543288707733154, 2.67227840423584, 0.09778816252946854, 0.15000000596046448, 2.762253999710083, 0.10108069330453873, -0.3499999940395355, 7.260332107543945, 0.7446881532669067, 0.041216492652893066, 7.447224140167236, 0.7638575434684753, -0.3438456654548645, 6.163567543029785, 0.3015243411064148, -0.1226639598608017, 6.210262775421143, 0.30380868911743164, -0.23723332583904266, -7.026797294616699, 0.2605484127998352, 0.08171447366476059, -4.298200607299805, 1.4283632040023804, 0.021890714764595032, -4.363898277282715, 1.4501956701278687, -0.20704884827136993, 0.858660101890564, 0.11110539734363556, 0.1402367353439331, 0.8856035470962524, 0.11459171772003174, -0.32604026794433594, 10.2991943359375, 0.48214441537857056, 0.08186785876750946, 10.387971878051758, 0.48630040884017944, -0.04672439023852348, 1.5653274059295654, 0.9192306399345398, 0.08271964639425278, 1.6031711101531982, 0.9414541721343994, -0.27792415022850037, -6.380924701690674, 1.34238600730896, 0.15000000596046448, -6.578497409820557, 1.3839503526687622, -0.3098005950450897, -8.889171600341797, 0.3943657875061035, 0.15000000596046448, -9.188469886779785, 0.4076440930366516, -0.3499999940395355, 10.12636947631836, 0.6739108562469482, 0.15000000596046448, 10.356523513793945, 0.6892276406288147, -0.18751400709152222, -5.306578636169434, 0.4906128942966461, 0.14921772480010986, -5.4825639724731445, 0.5068833827972412, -0.3432871103286743, -0.6324743628501892, 0.03576144948601723, 0.15000000596046448, -0.6537697911262512, 0.03696553781628609, -0.3499999940395355, 6.533592700958252, 0.18601660430431366, 0.053019605576992035, 6.655621528625488, 0.18949086964130402, -0.22614717483520508, -8.032709121704102, 1.840618371963501, 0.15000000596046448, -8.303170204162598, 1.9025920629501343, -0.3499999940395355, -8.257588386535645, -0.09316904097795486, 0.07785806059837341, -8.466713905334473, -0.09552857279777527, -0.3000487983226776, -6.095592021942139, 1.2152608633041382, 0.13668124377727509, -6.29518461227417, 1.2550530433654785, -0.3499999940395355, -3.6026577949523926, 0.6641114950180054, -0.29782310128211975, -8.629424095153809, 0.6980066895484924, 0.08218006789684296, -8.879424095153809, 0.7182284593582153, -0.3499999940395355, -4.3221211433410645, 0.6277536749839783, 0.15000000596046448, -4.467647075653076, 0.6488901972770691, -0.3499999940395355, 1.3620128631591797, 0.04323666915297508, 0.07792951166629791, 1.3943755626678467, 0.04426401108503342, -0.2766319513320923, 7.603504657745361, 1.2586597204208374, -0.31029781699180603, 0.004972290247678757, 0.5504844784736633, 0.1288730502128601, 0.005127302370965481, 0.5676459670066833, -0.33473777770996094, -8.723551750183105, 1.6497999429702759, 0.15000000596046448, -9.017273902893066, 1.7053488492965698, -0.3499999940395355, 3.616197109222412, 1.667134165763855, 0.15000000596046448, 3.7364845275878906, 1.7225890159606934, -0.34396326541900635, 10.745189666748047, 1.1659168004989624, 0.15000000596046448, 11.106980323791504, 1.2051732540130615, -0.3499999940395355, 7.214033126831055, 1.160683035850525, -0.1564057320356369, 7.251798629760742, 1.1667592525482178, -0.23574918508529663, 9.579245567321777, 1.2343997955322266, 0.14220629632472992, 9.896584510803223, 1.2752928733825684, -0.3499999940395355, -5.316893577575684, 1.0764496326446533, 0.14879447221755981, -5.47562837600708, 1.1085867881774902, -0.2945849597454071, 1.6226134300231934, 0.6983528137207031, 0.09572827070951462, 1.6640063524246216, 0.7161678075790405, -0.28448015451431274, 9.498167991638184, 0.47355806827545166, 0.0969771221280098, 9.783040046691895, 0.4877611994743347, -0.3499999940395355, -1.7299656867980957, 0.902603805065155, -0.30404946208000183, 4.9042277336120605, 1.2139003276824951, 0.15000000596046448, 5.066082954406738, 1.2539628744125366, -0.3400971293449402, 6.538949966430664, 0.3171246349811554, 0.15000000596046448, 6.728000640869141, 0.3262931704521179, -0.2793347239494324, -6.035493850708008, 0.4311125576496124, 0.06147298961877823, -6.201738357543945, 0.4429872930049896, -0.3499999940395355, -1.6489778757095337, 0.21515952050685883, 0.13136515021324158, -1.6963167190551758, 0.22133630514144897, -0.29548338055610657, -7.568387031555176, 0.4400354325771332, 0.09908904880285263, -7.796485900878906, 0.45329737663269043, -0.3499999940395355, 9.9586763381958, 1.8131170272827148, 0.15000000596046448, 10.237565040588379, 1.8638925552368164, -0.2658674418926239, -6.358145236968994, 0.6565354466438293, 0.15000000596046448, -6.5722246170043945, 0.6786410212516785, -0.3499999940395355, 0.805274486541748, 0.2713102102279663, 0.05772348865866661, 0.8214768767356873, 0.27676907181739807, -0.242920383810997, 8.39067554473877, 0.8682540059089661, 0.06062917411327362, 8.546817779541016, 0.8844113349914551, -0.21737731993198395, 10.267154693603516, 1.6595262289047241, 0.1374313086271286, 10.358272552490234, 1.674254059791565, 0.005530434660613537, 10.364103317260742, 1.6751965284347534, -0.0029110221657902002, 10.603875160217285, 1.713951826095581, -0.3499999940395355, 8.18259048461914, 1.722324013710022, -0.31363385915756226, 3.998943567276001, 0.20790794491767883, 0.15000000596046448, 4.1335883140563965, 0.21490821242332458, -0.3499999940395355, 3.892476797103882, 0.8512269854545593, 0.15000000596046448, 4.023536682128906, 0.8798878192901611, -0.3499999940395355, 4.501748561859131, 1.4403653144836426, 0.15000000596046448, 4.653322696685791, 1.4888625144958496, -0.3499999940395355, 3.2346315383911133, 0.17352721095085144, 0.15000000596046448, 3.331042766571045, 0.17869935929775238, -0.29261839389801025, 7.912815093994141, 0.6742286682128906, -0.17637552320957184, 7.9402360916137695, 0.6765651702880859, -0.2289680689573288, 8.410541534423828, 1.778706669807434, 0.13570374250411987, 9.860099792480469, 1.4578062295913696, 0.15000000596046448, 10.191441535949707, 1.506794810295105, -0.3490234911441803, -2.491642713546753, 1.398146390914917, 0.11597301065921783, -2.5530025959014893, 1.4325774908065796, -0.2505648136138916, 5.060248851776123, 0.9226211309432983, 0.15000000596046448, 5.191827297210693, 0.9466114640235901, -0.23613549768924713, -7.899232387542725, 1.9565716981887817, 0.09246433526277542, -8.116219520568848, 2.01031756401062, -0.31703707575798035, 7.119961261749268, 1.5871427059173584, 0.08184090256690979, 9.872800827026367, 0.43572938442230225, 0.15000000596046448, 10.205218315124512, 0.4504004120826721, -0.3499999940395355, 4.081768989562988, 0.3892629146575928, 0.15000000596046448, 4.195096492767334, 0.40007051825523376, -0.26229923963546753, -7.9401960372924805, 1.776808261871338, 0.15000000596046448, -8.207542419433594, 1.8366334438323975, -0.3499999940395355, 4.956572532653809, 0.2667348384857178, 0.15000000596046448, 5.1210222244262695, 0.2755846083164215, -0.34269556403160095, 10.164342880249023, 0.06092198193073273, 0.15000000596046448, 10.41578197479248, 0.062429029494524, -0.2173493653535843, -0.1724259853363037, 0.23187293112277985, 0.12223508208990097, -0.1776713877916336, 0.23892679810523987, -0.330364853143692, -8.093753814697266, 1.4334862232208252, 0.15000000596046448, -8.34508991241455, 1.4780004024505615, -0.3111383616924286, -5.252011299133301, 0.37472546100616455, 0.13307446241378784, -6.261935234069824, 0.7655429244041443, 0.15000000596046448, -6.472774505615234, 0.7913187742233276, -0.3499999940395355, -6.005650520324707, 1.4482835531234741, -0.04526073485612869, -6.089985370635986, 1.4686211347579956, -0.2565350830554962, -0.7731483578681946, 1.6968894004821777, 0.15000000596046448, -0.799180269241333, 1.7540236711502075, -0.3499999940395355, -5.905491352081299, 0.1196749359369278, 0.08235592395067215, -6.027231216430664, 0.122141994535923, -0.22516568005084991, 6.142325401306152, 0.5146499276161194, 0.07684128731489182, 6.318012237548828, 0.5293702483177185, -0.3499999940395355, -1.2954787015914917, 0.7757105827331543, 0.04284881427884102, -1.3185839653015137, 0.7895455956459045, -0.2239166498184204, -7.724174499511719, 1.0721608400344849, 0.0963265597820282, -7.941445350646973, 1.102319359779358, -0.32289475202560425, -5.048491954803467, 1.3742380142211914, 0.05283042788505554, 4.3812947273254395, 1.3652210235595703, 0.15000000596046448, 4.528813362121582, 1.411188006401062, -0.3499999940395355, -0.6702328324317932, -0.11413715034723282, 0.03313789516687393, -0.6821540594100952, -0.11616726964712143, -0.2330729067325592, -1.241928219795227, 0.1688380092382431, 0.0011257226578891277, -1.2431681156158447, 0.1690065711736679, -0.0138485012575984, -0.9569846391677856, 1.343178391456604, 0.15000000596046448, -0.9892063736915588, 1.388403296470642, -0.3499999940395355, -2.17533016204834, 0.04306967929005623, 0.09500963240861893, -2.231428384780884, 0.044180382043123245, -0.2893674373626709, 6.287410736083984, 0.20014025270938873, -0.012841661460697651, 6.383797645568848, 0.20320843160152435, -0.2429896891117096, 7.622501373291016, 1.2828413248062134, -0.3041113317012787, 5.625149250030518, 0.5531632304191589, -0.2446277141571045, -0.4051889181137085, 0.9944322109222412, 0.14448319375514984, -0.4180930256843567, 1.0261019468307495, -0.328622043132782, 8.416857719421387, 1.3173203468322754, 0.15000000596046448, 8.666046142578125, 1.356320858001709, -0.28964799642562866, -0.6809418797492981, 0.926834225654602, 0.15000000596046448, -0.7038692235946655, 0.9580407738685608, -0.3499999940395355, 1.8392390012741089, 0.5178917050361633, -0.3494133949279785, 8.329023361206055, 0.6797829270362854, -0.31247490644454956, -3.0912210941314697, 1.2568084001541138, 0.1118452250957489, 10.353618621826172, 1.51565420627594, 0.15000000596046448, 10.702225685119629, 1.5666863918304443, -0.3499999940395355, -7.963293075561523, 1.5815317630767822, 0.15000000596046448, -8.231417655944824, 1.6347819566726685, -0.3499999940395355, -2.9149410724639893, 1.3484293222427368, 0.01920609176158905, -2.97236967086792, 1.374995231628418, -0.27593690156936646, 7.339094638824463, 0.8581129312515259, 0.103866346180439, 7.525414943695068, 0.879898190498352, -0.2743070125579834, 7.527556896209717, 0.8266658782958984, 0.06405803561210632, 7.597693920135498, 0.8343681693077087, -0.07510511577129364, -8.669991493225098, 1.9182112216949463, 0.15000000596046448, -8.91897964477539, 1.9732991456985474, -0.276467502117157, 10.185758590698242, 0.07705510407686234, 0.15000000596046448, 10.432329177856445, 0.0789204090833664, -0.20947973430156708, 9.718132019042969, 1.0345851182937622, 0.15000000596046448, 10.045342445373535, 1.0694196224212646, -0.3499999940395355, -6.550190448760986, 1.5113179683685303, 0.060678258538246155, -6.62076473236084, 1.5276014804840088, -0.10028432309627533, -6.538602828979492, 0.44825419783592224, 0.15000000596046448, -6.705152988433838, 0.4596720337867737, -0.22825618088245392, 5.108374118804932, 0.9076821804046631, 0.11226112395524979, 5.2188873291015625, 0.9273187518119812, -0.20981618762016296, 4.029366493225098, 0.40900570154190063, 0.15000000596046448, 4.151507377624512, 0.42140379548072815, -0.30014467239379883, 4.497788429260254, 1.1443397998809814, 0.13838686048984528, 4.645596027374268, 1.1819454431533813, -0.3499999940395355, 8.588726043701172, 0.36575230956077576, -0.3140162229537964, 9.515841484069824, 0.8367128372192383, 0.09860961139202118, 9.802318572998047, 0.8619022369384766, -0.3499999940395355, -8.37268352508545, 0.49060913920402527, 0.12523315846920013, -8.640181541442871, 0.5062835812568665, -0.3499999940395355, -2.4058051109313965, 1.4361258745193481, 0.15000000596046448, -2.475952386856079, 1.4779996871948242, -0.2829892933368683, 2.5862035751342773, 1.4264795780181885, 0.15000000596046448, 2.673281192779541, 1.4745092391967773, -0.3499999940395355, -0.9708644151687622, 2.008510112762451, 0.02301860600709915, -0.9823787808418274, 2.0323307514190674, -0.15460710227489471, -1.0411157608032227, 1.9059479236602783, 0.11443585157394409, -1.0677965879440308, 1.9547920227050781, -0.2670394480228424, 4.386993408203125, 0.7817098498344421, 0.037271905690431595, 4.4977641105651855, 0.8014479279518127, -0.3405347466468811, -6.401900768280029, 1.659055471420288, 0.0052971430122852325, -6.412288665771484, 1.6617474555969238, -0.019033607095479965, -5.333456993103027, 0.7510818243026733, 0.12943685054779053, -5.479162693023682, 0.7716007828712463, -0.27681422233581543, -8.063172340393066, 1.2743529081344604, 0.15000000596046448, -8.279617309570312, 1.3085612058639526, -0.24862827360630035, 3.7621262073516846, 0.09320086240768433, 0.15000000596046448, 3.8887970447540283, 0.09633893519639969, -0.3499999940395355, 1.1912572383880615, 1.0004552602767944, 0.15000000596046448, 1.2313668727874756, 1.034140706062317, -0.3499999940395355, 7.584739685058594, 0.42130616307258606, -0.2823895812034607, 6.57728910446167, 0.11840786784887314, 0.037905801087617874, 6.707515716552734, 0.12075227499008179, -0.2583352029323578, -0.878303587436676, 0.9820406436920166, 0.15000000596046448, -0.9078761339187622, 1.015105962753296, -0.3499999940395355, 0.7399232387542725, 1.185685634613037, 0.039683494716882706, 0.7536108493804932, 1.207619309425354, -0.23706330358982086, -7.865116596221924, 2.011443614959717, 0.03304868936538696, -8.013214111328125, 2.049318313598633, -0.24877393245697021, -6.995702743530273, 1.5336062908172607, 0.05610707029700279, -0.1823960840702057, 0.06712304800748825, 0.021795058622956276, -0.18539579212665558, 0.06822696328163147, -0.22453828155994415, 9.412715911865234, 0.8744125366210938, -0.13588562607765198, 9.507369995117188, 0.8832056522369385, -0.2880922257900238, 6.014435291290283, 0.7763631343841553, -0.045172784477472305, 6.113825798034668, 0.789192795753479, -0.293799489736557, 5.605813026428223, 1.4125864505767822, -0.26987820863723755, -1.1989901065826416, 0.12201264500617981, 0.016891775652766228, -1.21663236618042, 0.12380797415971756, -0.20357346534729004, 4.907221794128418, 1.7126964330673218, 0.08896201848983765, 5.00866174697876, 1.7481005191802979, -0.21927200257778168, -5.93418550491333, 0.8257251381874084, 0.004001460503786802, -6.065152645111084, 0.8439488410949707, -0.32695963978767395, -6.326162338256836, 0.8345452547073364, 0.15000000596046448, -6.539164066314697, 0.862644374370575, -0.3499999940395355, 4.970135688781738, 0.8531717658042908, 0.15000000596046448, 5.12054443359375, 0.878990888595581, -0.29939883947372437, 10.458657264709473, 1.4111921787261963, 0.08933307975530624, 10.766814231872559, 1.4527720212936401, -0.3499999940395355, 10.692166328430176, 1.3833590745925903, 0.15000000596046448, 11.05217170715332, 1.4299368858337402, -0.3499999940395355, 3.5150296688079834, 0.5283751487731934, 0.12251963466405869, 3.626669406890869, 0.545156717300415, -0.3499999940395355, 2.0204222202301025, 1.5399335622787476, 0.11795661598443985, -1.2171998023986816, 1.5749925374984741, 0.15000000596046448, -1.2581830024719238, 1.62802255153656, -0.3499999940395355, 6.231256484985352, 2.256625175476074, 0.1321694254875183, 6.349356174468994, 1.437486171722412, 0.06504780799150467, 6.496102333068848, 1.4707093238830566, -0.280128538608551, 4.762561321258545, 1.8608506917953491, 0.004387257155030966, 4.769178867340088, 1.8634364604949951, -0.016449837014079094, 4.517810344696045, 1.2500776052474976, 0.15000000596046448, 4.669925212860107, 1.2921677827835083, -0.3499999940395355, -9.164557456970215, 1.6494982242584229, 0.15000000596046448, -9.335376739501953, 1.6802433729171753, -0.12679028511047363, 2.8481335639953613, -0.10986588895320892, 0.039929986000061035, 2.900289535522461, -0.11187779903411865, -0.23402436077594757, -5.931087017059326, 0.7167099118232727, -0.02946232445538044, -6.037983417510986, 0.729627251625061, -0.3003397583961487, 4.044172286987305, 1.400273323059082, 0.15000000596046448, 4.059230327606201, 1.4054869413375854, 0.09470804035663605, 4.060247421264648, 1.405839204788208, 0.0909724161028862, 4.180339813232422, 1.4474204778671265, -0.3499999940395355, -7.495080471038818, 1.6435421705245972, 0.0359814427793026, -7.688408374786377, 1.685935616493225, -0.3499999940395355, 8.9761962890625, 0.503585934638977, 0.0115556875243783, 8.997910499572754, 0.5048041343688965, -0.024702375754714012, 9.054637908935547, 0.5079867243766785, -0.11942702531814575, 9.164501190185547, 0.5141503214836121, -0.30287691950798035, 5.603042125701904, 1.3386412858963013, -0.2746906876564026, 8.814164161682129, 0.46995916962623596, 0.07874144613742828, 8.963149070739746, 0.4779027998447418, -0.17347031831741333, -3.56807279586792, 1.9460370540618896, 0.13745152950286865, -3.660881519317627, 1.9966551065444946, -0.2491360455751419, 0.38514822721481323, 1.6438277959823608, 0.11312735080718994, 0.3961469531059265, 1.6907708644866943, -0.31199905276298523, -7.202630043029785, 0.42446422576904297, 0.12446253001689911, -7.196698188781738, 1.3818209171295166, 0.12527047097682953, 9.927971839904785, 1.4159762859344482, 0.15000000596046448, 10.226128578186035, 1.4585007429122925, -0.2959740161895752, 10.23255729675293, 1.459417700767517, -0.3055899739265442, 10.262247085571289, 1.46365225315094, -0.3499999940395355, 7.226704120635986, 0.3991776406764984, 0.12091155350208282, -5.091294765472412, 0.269944965839386, 0.058970995247364044, 3.714212656021118, 1.8064638376235962, 0.06862180680036545, 3.7876625061035156, 1.8421872854232788, -0.22665148973464966, 10.37385082244873, 1.9659844636917114, 0.05883939564228058, 10.637807846069336, 2.016007900238037, -0.32132992148399353, 6.2892842292785645, 1.6437405347824097, 0.06411270797252655, 6.422722339630127, 1.6786153316497803, -0.25277823209762573, 7.1362175941467285, 1.4055951833724976, -0.04915753751993179, 7.2596259117126465, 1.42990243434906, -0.30940619111061096, 9.478294372558594, 0.6475510597229004, 0.07400692999362946, 9.747547149658203, 0.6659462451934814, -0.3499999940395355, -5.396620273590088, 0.8945976495742798, 0.14321205019950867, -5.529378890991211, 0.9166049957275391, -0.22226902842521667, -1.8297308683395386, 0.4458366930484772, 0.03410737216472626, -1.865743637084961, 0.4546116590499878, -0.2604517936706543, 4.005771636962891, 0.5442242622375488, 0.15000000596046448, 4.1314697265625, 0.5613016486167908, -0.3159821331501007, 7.9720001220703125, 1.6127537488937378, 0.09002281725406647, 8.154400825500488, 1.6496539115905762, -0.25112074613571167, 11.269006729125977, 1.7502235174179077, 0.031112607568502426, 11.302659034729004, 1.7554500102996826, -0.01358779240399599, 0.24734912812709808, 1.972076416015625, 0.02332102693617344, 0.25048118829727173, 1.997047781944275, -0.1663208156824112, 7.136316776275635, 0.34103602170944214, 0.07369444519281387, -4.479865074157715, 0.2905934453010559, 0.04597735032439232, -4.564655303955078, 0.29609352350234985, -0.2370579093694687, -9.111618041992188, 0.9570370316505432, 0.15000000596046448, -9.407153129577637, 0.9880785346031189, -0.3316597640514374, -1.2128697633743286, 1.2663278579711914, 0.15000000596046448, -1.2537070512771606, 1.3089652061462402, -0.3499999940395355, -9.107242584228516, 1.793503761291504, 0.10442036390304565, -9.250762939453125, 1.8217673301696777, -0.13031712174415588, -2.7711877822875977, 1.563523769378662, 0.07414055615663528, -2.849304437637329, 1.607597827911377, -0.3466028571128845, 1.6603294610977173, 1.3995057344436646, 0.15000000596046448, 1.7119698524475098, 1.4430338144302368, -0.31187188625335693, -1.024614930152893, 1.3223280906677246, 0.15000000596046448, -1.0591137409210205, 1.3668509721755981, -0.3499999940395355, -2.1006789207458496, 1.294310212135315, 0.15000000596046448, -2.1714088916778564, 1.3378896713256836, -0.3499999940395355, -5.971250057220459, 1.3300981521606445, -0.03716788813471794, -6.068377494812012, 1.3517333269119263, -0.2817600965499878, -2.1287753582000732, 0.026696965098381042, 0.11412159353494644, -2.18920636177063, 0.027454828843474388, -0.3084532618522644, 5.5699849128723145, 0.49606412649154663, 0.08239182829856873, 5.662354946136475, 0.5042906403541565, -0.16499537229537964, 6.044925689697266, 1.821513295173645, 0.036013584583997726, -8.739710807800293, 1.8386859893798828, 0.15000000596046448, -8.999207496643066, 1.8932796716690063, -0.29092147946357727, 2.1715054512023926, 1.1744176149368286, 0.14184588193893433, -1.0382047891616821, 1.3944430351257324, 0.15000000596046448, -1.073161244392395, 1.4413940906524658, -0.3499999940395355, -7.314828872680664, 1.0941510200500488, 0.13522306084632874, -1.1996185779571533, 0.973933756351471, 0.15000000596046448, -1.238864779472351, 1.0057965517044067, -0.33582615852355957, 4.257679462432861, 1.4609664678573608, 0.15000000596046448, 4.401035785675049, 1.5101572275161743, -0.3499999940395355, -7.540787220001221, 0.46468764543533325, 0.0782952755689621, -7.757228851318359, 0.47802549600601196, -0.3499999940395355, 6.211267948150635, 1.17386794090271, 0.117136649787426, 6.406224727630615, 1.2107127904891968, -0.3499999940395355, -7.17779541015625, 1.0141346454620361, -0.19249944388866425, -7.184203147888184, 1.0150399208068848, -0.2060612440109253, -1.2130681276321411, 1.639919638633728, 0.15000000596046448, -1.253912091255188, 1.6951357126235962, -0.3499999940395355, 3.2430129051208496, 0.6426255702972412, 0.0824570506811142, 3.3087515830993652, 0.6556521654129028, -0.21993547677993774, 6.3755059242248535, 1.6060734987258911, 0.0007345611811615527, 6.380837917327881, 1.6074167490005493, -0.011809772811830044, -9.054722785949707, 1.6948719024658203, 0.15000000596046448, -9.279121398925781, 1.7368751764297485, -0.21802105009555817, 8.912006378173828, 1.3172496557235718, -0.13358074426651, 9.000502586364746, 1.3303298950195312, -0.28385597467422485, 10.139238357543945, 1.2361403703689575, 0.15000000596046448, 10.375449180603027, 1.2649383544921875, -0.19595551490783691, 10.382823944091797, 1.2658374309539795, -0.20675645768642426, 10.397769927978516, 1.2676596641540527, -0.2286473959684372, -8.559035301208496, 0.7859490513801575, -0.1402149349451065, -8.62979507446289, 0.7924466729164124, -0.2653824985027313, 6.304309368133545, 0.2559833526611328, 0.0518377311527729, 6.456892490386963, 0.2621789276599884, -0.30995267629623413, -4.25250768661499, 1.5511020421981812, 0.07640869170427322, -4.355283260345459, 1.5885894298553467, -0.2842674255371094, -8.483174324035645, 0.639900267124176, -0.061600297689437866, -8.604886054992676, 0.6490811705589294, -0.27769532799720764, 4.062798500061035, 0.38783949613571167, 0.15000000596046448, 4.179580211639404, 0.39898762106895447, -0.2768513262271881, -4.126247882843018, 2.3240602016448975, -0.1517784744501114, -4.144217491149902, 2.334181547164917, -0.21776428818702698, -9.170272827148438, 1.6048479080200195, 0.15000000596046448, -9.36054515838623, 1.6381466388702393, -0.15812011063098907, 3.639421224594116, 0.6457065939903259, 0.15000000596046448, 3.761960506439209, 0.667447566986084, -0.3499999940395355, -5.936903476715088, 0.6352741718292236, -0.04854870215058327, -6.032016754150391, 0.6454517245292664, -0.2896365523338318, 8.921629905700684, 1.2444483041763306, -0.03245900943875313, 5.583150863647461, 0.3682103455066681, -0.23874835669994354, 6.337578773498535, 1.0769233703613281, 0.15000000596046448, 6.550965309143066, 1.1131833791732788, -0.3499999940395355, 2.0937182903289795, 0.5225813984870911, 0.008700421079993248, 2.116100788116455, 0.5281679630279541, -0.1515609174966812, -8.997838020324707, 1.7828800678253174, 0.15000000596046448, -9.219586372375488, 1.8268184661865234, -0.21597276628017426, 4.907880783081055, 0.8899056911468506, 0.15000000596046448, 5.072086334228516, 0.9196797609329224, -0.34684473276138306, 7.201634883880615, 0.4096958339214325, 0.09559030830860138, -0.23422345519065857, 1.609950304031372, 0.15000000596046448, -0.2421097755432129, 1.6641573905944824, -0.3499999940395355, -3.1801576614379883, 0.6178287863731384, 0.09443075954914093, 8.886556625366211, 0.7855127453804016, 0.1429053395986557, -7.742372035980225, 1.6169546842575073, 0.15000000596046448, -8.003058433532715, 1.6713975667953491, -0.3499999940395355, 5.475877285003662, 0.2483801245689392, -0.2769487500190735, -7.518261432647705, 1.4534114599227905, 0.08262279629707336, -7.736300468444824, 1.495562195777893, -0.3499999940395355, -6.033679008483887, 0.7766152620315552, 0.09677733480930328, -6.214560031890869, 0.7998970746994019, -0.3499999940395355, 6.488210201263428, 1.787320613861084, 0.13806290924549103, 10.92437744140625, 1.3804785013198853, 0.15000000596046448, 11.246896743774414, 1.4212342500686646, -0.28841495513916016, -2.5125961303710938, 1.6175421476364136, 0.017407335340976715, -2.5577006340026855, 1.6465791463851929, -0.2515500485897064, 6.4653544425964355, 0.5497955083847046, 0.15000000596046448, 6.683043003082275, 0.5683071613311768, -0.3499999940395355, -6.145654201507568, 1.3605509996414185, 0.14901013672351837, -6.3521552085876465, 1.4062670469284058, -0.3499999940395355, -4.7860002517700195, 1.6220604181289673, 0.13061581552028656, -1.063461184501648, 1.2522109746932983, 0.15000000596046448, -1.0992679595947266, 1.2943729162216187, -0.3499999940395355, 6.435727119445801, 0.3845108449459076, 0.15000000596046448, 6.652418613433838, 0.3974573314189911, -0.3499999940395355, 8.156917572021484, 1.5467742681503296, -0.0682160034775734, 8.24377155303955, 1.563244104385376, -0.22866138815879822, 9.933053016662598, 0.938381016254425, 0.15000000596046448, 10.240689277648926, 0.9674435257911682, -0.309918612241745, -4.342626094818115, 0.389962762594223, 0.13244569301605225, -4.483449459075928, 0.4026085138320923, -0.34968096017837524, 5.61593770980835, 1.9884684085845947, 0.03565576672554016, 5.653365612030029, 2.001720905303955, -0.06407581269741058, 5.433426856994629, 2.215864658355713, -0.32285502552986145, 10.027019500732422, 0.09644085168838501, 0.15000000596046448, 10.332487106323242, 0.09937886893749237, -0.3023969829082489, 8.338398933410645, 1.6947650909423828, 0.06285810470581055, 8.546873092651367, 1.7371371984481812, -0.31059616804122925, 3.3571648597717285, 0.41498416662216187, 0.023768175393342972, 3.379678249359131, 0.41776707768440247, -0.07666368782520294, 3.3834097385406494, 0.4182283282279968, -0.09330949187278748, 3.4146676063537598, 0.42209216952323914, -0.23275043070316315, -5.987668037414551, 1.0353938341140747, 0.05160832777619362, -6.148534774780273, 1.0632110834121704, -0.3499999940395355, 1.0980043411254883, 0.9201417565345764, 0.057175107300281525, 1.1232478618621826, 0.9412961602210999, -0.2863663136959076, -6.023528575897217, 1.1829683780670166, 0.07318177074193954, -6.194297790527344, 1.216506004333496, -0.3499999940395355, 9.750956535339355, 0.6143753528594971, 0.15000000596046448, 10.079272270202637, 0.6350613832473755, -0.3499999940395355, -0.3093740940093994, 1.7709468603134155, 0.15000000596046448, -0.31940969824790955, 1.828393578529358, -0.3317105770111084, -8.44702434539795, 0.10459308326244354, 0.15000000596046448, -8.731435775756836, 0.10811474174261093, -0.3499999940395355, -4.007603168487549, 1.0920697450637817, -0.10307856649160385, -4.04189395904541, 1.1014138460159302, -0.2323060929775238, 3.0355374813079834, 0.8852456212043762, 0.15000000596046448, 3.137744188308716, 0.9150518774986267, -0.3499999940395355, -7.840229511260986, 0.5073082447052002, 0.15000000596046448, -8.104209899902344, 0.5243893265724182, -0.3499999940395355, 6.484501361846924, 1.0411767959594727, 0.15000000596046448, 6.7028350830078125, 1.0762332677841187, -0.3499999940395355, 9.269043922424316, 1.5034847259521484, 0.03284177929162979, 9.506134986877441, 1.5419421195983887, -0.3499999940395355, -5.245701789855957, 1.193821907043457, 0.12196899950504303, -0.4038248062133789, 0.8162217140197754, 0.15000000596046448, -0.4174216091632843, 0.8437039256095886, -0.3499999940395355, 5.418442726135254, 0.2619367241859436, 0.1302264928817749, 5.5490875244140625, 0.26825231313705444, -0.22830000519752502, -4.196295738220215, 0.38989967107772827, 0.07594010978937149, -4.311558723449707, 0.4006093740463257, -0.33399173617362976, -8.617671012878418, 2.007067918777466, 0.12187765538692474, -8.826557159423828, 2.055717945098877, -0.23875825107097626, 3.7459049224853516, 0.03607494756579399, 0.15000000596046448, 3.8720295429229736, 0.03728959336876869, -0.3499999940395355, 0.6579124331474304, 0.43315914273262024, 0.09150892496109009, 0.6740362644195557, 0.4437748193740845, -0.27386224269866943, -8.51864242553711, 1.6722545623779297, 0.15000000596046448, -8.805464744567871, 1.7285594940185547, -0.3499999940395355, 9.038896560668945, 0.7129862308502197, -0.3324010670185089, 6.6935954093933105, 0.5663638710975647, 0.15000000596046448, 6.861111164093018, 0.5805378556251526, -0.2216401845216751, 5.619243144989014, 1.7730273008346558, -0.24246302247047424, -1.4401625394821167, 1.409312129020691, 0.04265650734305382, -1.4659881591796875, 1.4345844984054565, -0.22556501626968384, -7.751620292663574, 0.9500830769538879, -0.10223114490509033, -7.816344738006592, 0.958016037940979, -0.22833134233951569, -9.06043529510498, 0.28579390048980713, 0.15000000596046448, -9.307951927185059, 0.2936013340950012, -0.25567853450775146, -9.170186996459961, 1.4912207126617432, 0.15000000596046448, -9.399521827697754, 1.5285142660140991, -0.22137977182865143, 4.723744869232178, 0.7143957614898682, 0.15000000596046448, 4.882793426513672, 0.7384495139122009, -0.3499999940395355, 2.719703435897827, 0.8341116309165955, 0.15000000596046448, 2.8112759590148926, 0.8621962070465088, -0.3499999940395355, 9.400410652160645, 0.2197599709033966, 0.000817546620965004, 9.620277404785156, 0.22489996254444122, -0.3499999940395355, -2.222337245941162, 1.0033732652664185, 0.14995819330215454, -2.297156810760498, 1.037153959274292, -0.3499999940395355, 5.128477096557617, 0.9084460735321045, 0.09348205476999283, 5.229318618774414, 0.9263088703155518, -0.19962510466575623, -7.119727611541748, 0.5901584625244141, -0.18823960423469543, -7.128962993621826, 0.5909240245819092, -0.2079411894083023, 4.726123809814453, 0.43471238017082214, 0.15000000596046448];

/***/ })
/******/ ]);
});