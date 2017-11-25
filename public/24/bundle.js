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
/******/ 	return __webpack_require__(__webpack_require__.s = 91);
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

    this.camera = new _three.PerspectiveCamera(60, this.getAspect(), 0.1, 1000);

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
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = modify;
/**
 * Make all faces use unique vertices
 * so that each face can be separated from others
 *
 * @author alteredq / http://alteredqualia.com/
 */

function modify(geometry) {

	var vertices = [];

	for (var i = 0, il = geometry.faces.length; i < il; i++) {

		var n = vertices.length;

		var face = geometry.faces[i];

		var a = face.a;
		var b = face.b;
		var c = face.c;

		var va = geometry.vertices[a];
		var vb = geometry.vertices[b];
		var vc = geometry.vertices[c];

		vertices.push(va.clone());
		vertices.push(vb.clone());
		vertices.push(vc.clone());

		face.a = n;
		face.b = n + 1;
		face.c = n + 2;
	}

	geometry.vertices = vertices;
};

/***/ }),
/* 33 */,
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * @license
 * three.ar.js
 * Copyright (c) 2017 Google
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @license
 * gl-preserve-state
 * Copyright (c) 2016, Brandon Jones.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function (global, factory) {
	 true ? factory(exports, __webpack_require__(0)) :
	typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
	(factory((global['three-ar'] = {}),global.THREE));
}(this, (function (exports,three) { 'use strict';

var global$1 = typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {};

var noop = function noop() {};
var opacityRemap = function opacityRemap(mat) {
  if (mat.opacity === 0) {
    mat.opacity = 1;
  }
};
var loadObj = function loadObj(objPath, materialCreator, OBJLoader) {
  return new Promise(function (resolve, reject) {
    var loader = new OBJLoader();
    if (materialCreator) {
      Object.keys(materialCreator.materials).forEach(function (k) {
        return opacityRemap(materialCreator.materials[k]);
      });
      loader.setMaterials(materialCreator);
    }
    loader.load(objPath, resolve, noop, reject);
  });
};
var loadMtl = function loadMtl(mtlPath, MTLLoader) {
  return new Promise(function (resolve, reject) {
    var loader = new MTLLoader();
    loader.setTexturePath(mtlPath.substr(0, mtlPath.lastIndexOf('/') + 1));
    loader.setMaterialOptions({ ignoreZeroRGBs: true });
    loader.load(mtlPath, resolve, noop, reject);
  });
};

var colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800'].map(function (hex) {
  return new three.Color(hex);
});
var LEARN_MORE_LINK = 'https://developers.google.com/ar/develop/web/getting-started';
var UNSUPPORTED_MESSAGE = 'This augmented reality experience requires\n  WebARonARCore or WebARonARKit, experimental browsers from Google\n  for Android and iOS. Learn more at the <a href="' + LEARN_MORE_LINK + '">Google Developers site</a>.';
var ARUtils = Object.create(null);
ARUtils.isTango = function (display) {
  return display && display.displayName.toLowerCase().includes('tango');
};
var isTango = ARUtils.isTango;
ARUtils.isARKit = function (display) {
  return display && display.displayName.toLowerCase().includes('arkit');
};
var isARKit = ARUtils.isARKit;
ARUtils.isARDisplay = function (display) {
  return isARKit(display) || isTango(display);
};
var isARDisplay = ARUtils.isARDisplay;
ARUtils.getARDisplay = function () {
  return new Promise(function (resolve, reject) {
    if (!navigator.getVRDisplays) {
      resolve(null);
      return;
    }
    navigator.getVRDisplays().then(function (displays) {
      if (!displays && displays.length === 0) {
        resolve(null);
        return;
      }
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;
      try {
        for (var _iterator = displays[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var display = _step.value;
          if (isARDisplay(display)) {
            resolve(display);
            return;
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
      resolve(null);
    });
  });
};

ARUtils.loadModel = function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return new Promise(function (resolve, reject) {
    var mtlPath = config.mtlPath,
        objPath = config.objPath;
    var OBJLoader = config.OBJLoader || (global$1.THREE ? global$1.THREE.OBJLoader : null);
    var MTLLoader = config.MTLLoader || (global$1.THREE ? global$1.THREE.MTLLoader : null);
    if (!config.objPath) {
      reject(new Error('`objPath` must be specified.'));
      return;
    }
    if (!OBJLoader) {
      reject(new Error('Missing OBJLoader as third argument, or window.THREE.OBJLoader existence'));
      return;
    }
    if (config.mtlPath && !MTLLoader) {
      reject(new Error('Missing MTLLoader as fourth argument, or window.THREE.MTLLoader existence'));
      return;
    }
    var p = Promise.resolve();
    if (mtlPath) {
      p = loadMtl(mtlPath, MTLLoader);
    }
    p.then(function (materialCreator) {
      if (materialCreator) {
        materialCreator.preload();
      }
      return loadObj(objPath, materialCreator, OBJLoader);
    }).then(resolve, reject);
  });
};

var model = new three.Matrix4();
var tempPos = new three.Vector3();
var tempQuat = new three.Quaternion();
var tempScale = new three.Vector3();
ARUtils.placeObjectAtHit = function (object, hit) {
  var easing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var applyOrientation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (!hit || !hit.modelMatrix) {
    throw new Error('placeObjectAtHit requires a VRHit object');
  }
  model.fromArray(hit.modelMatrix);
  model.decompose(tempPos, tempQuat, tempScale);
  if (easing === 1) {
    object.position.copy(tempPos);
    if (applyOrientation) {
      object.quaternion.copy(tempQuat);
    }
  } else {
    object.position.lerp(tempPos, easing);
    if (applyOrientation) {
      object.quaternion.slerp(tempQuat, easing);
    }
  }
};
var placeObjectAtHit = ARUtils.placeObjectAtHit;
ARUtils.getRandomPaletteColor = function () {
  return colors[Math.floor(Math.random() * colors.length)];
};
var getRandomPaletteColor = ARUtils.getRandomPaletteColor;
ARUtils.displayUnsupportedMessage = function (customMessage) {
  var element = document.createElement('div');
  element.id = 'webgl-error-message';
  element.style.fontFamily = 'monospace';
  element.style.fontSize = '13px';
  element.style.fontWeight = 'normal';
  element.style.textAlign = 'center';
  element.style.background = '#fff';
  element.style.border = '1px solid black';
  element.style.color = '#000';
  element.style.padding = '1.5em';
  element.style.width = '400px';
  element.style.margin = '5em auto 0';
  element.innerHTML = typeof customMessage === 'string' ? customMessage : UNSUPPORTED_MESSAGE;
  document.body.appendChild(element);
};

var vertexShader = "precision mediump float;precision mediump int;uniform mat4 modelViewMatrix;uniform mat4 modelMatrix;uniform mat4 projectionMatrix;attribute vec3 position;varying vec3 vPosition;void main(){vPosition=(modelMatrix*vec4(position,1.0)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}";

var fragmentShader = "precision highp float;varying vec3 vPosition;\n#define countX 7.0\n#define countY 4.0\n#define gridAlpha 0.75\nuniform float dotRadius;uniform vec3 dotColor;uniform vec3 lineColor;uniform vec3 backgroundColor;uniform float alpha;float Circle(in vec2 p,float r){return length(p)-r;}float Line(in vec2 p,in vec2 a,in vec2 b){vec2 pa=p-a;vec2 ba=b-a;float t=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);vec2 pt=a+t*ba;return length(pt-p);}float Union(float a,float b){return min(a,b);}void main(){vec2 count=vec2(countX,countY);vec2 size=vec2(1.0)/count;vec2 halfSize=size*0.5;vec2 uv=mod(vPosition.xz*1.5,size)-halfSize;float dots=Circle(uv-vec2(halfSize.x,0.0),dotRadius);dots=Union(dots,Circle(uv+vec2(halfSize.x,0.0),dotRadius));dots=Union(dots,Circle(uv+vec2(0.0,halfSize.y),dotRadius));dots=Union(dots,Circle(uv-vec2(0.0,halfSize.y),dotRadius));float lines=Line(uv,vec2(0.0,halfSize.y),-vec2(halfSize.x,0.0));lines=Union(lines,Line(uv,vec2(0.0,-halfSize.y),-vec2(halfSize.x,0.0)));lines=Union(lines,Line(uv,vec2(0.0,-halfSize.y),vec2(halfSize.x,0.0)));lines=Union(lines,Line(uv,vec2(0.0,halfSize.y),vec2(halfSize.x,0.0)));lines=Union(lines,Line(uv,vec2(-halfSize.x,halfSize.y),vec2(halfSize.x,halfSize.y)));lines=Union(lines,Line(uv,vec2(-halfSize.x,-halfSize.y),vec2(halfSize.x,-halfSize.y)));lines=Union(lines,Line(uv,vec2(-halfSize.x,0.0),vec2(halfSize.x,0.0)));lines=clamp(smoothstep(0.0,0.0035,lines),0.0,1.0);dots=clamp(smoothstep(0.0,0.001,dots),0.0,1.0);float result=Union(dots,lines);gl_FragColor=vec4(mix(backgroundColor+mix(dotColor,lineColor,dots),backgroundColor,result),mix(gridAlpha,alpha,result));}";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var DEFAULT_MATERIAL = new three.RawShaderMaterial({
  side: three.DoubleSide,
  transparent: true,
  uniforms: {
    dotColor: {
      value: new three.Color(0xffffff)
    },
    lineColor: {
      value: new three.Color(0x707070)
    },
    backgroundColor: {
      value: new three.Color(0x404040)
    },
    dotRadius: {
      value: 0.006666666667
    },
    alpha: {
      value: 0.4
    }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
});
var ARPlanes = function (_Object3D) {
  inherits(ARPlanes, _Object3D);
  function ARPlanes(vrDisplay) {
    classCallCheck(this, ARPlanes);
    var _this = possibleConstructorReturn(this, (ARPlanes.__proto__ || Object.getPrototypeOf(ARPlanes)).call(this));
    _this.addPlane_ = function (plane) {
      var planeObj = _this.createPlane(plane);
      if (planeObj) {
        _this.add(planeObj);
        _this.planes.set(plane.identifier, planeObj);
      }
    };
    _this.removePlane_ = function (identifier) {
      var existing = _this.planes.get(identifier);
      if (existing) {
        _this.remove(existing);
      }
      _this.planes.delete(identifier);
    };
    _this.onPlaneAdded_ = function (event) {
      event.planes.forEach(function (plane) {
        return _this.addPlane_(plane);
      });
    };
    _this.onPlaneUpdated_ = function (event) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;
      try {
        for (var _iterator = event.planes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var plane = _step.value;
          _this.removePlane_(plane.identifier);
          _this.addPlane_(plane);
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
    };
    _this.onPlaneRemoved_ = function (event) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;
      try {
        for (var _iterator2 = event.planes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var plane = _step2.value;
          _this.removePlane_(plane.identifier);
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
    };
    _this.vrDisplay = vrDisplay;
    _this.planes = new Map();
    _this.materials = new Map();
    return _this;
  }
  createClass(ARPlanes, [{
    key: 'enable',
    value: function enable() {
      this.vrDisplay.getPlanes().forEach(this.addPlane_);
      this.vrDisplay.addEventListener('planesadded', this.onPlaneAdded_);
      this.vrDisplay.addEventListener('planesupdated', this.onPlaneUpdated_);
      this.vrDisplay.addEventListener('planesremoved', this.onPlaneRemoved_);
    }
  }, {
    key: 'disable',
    value: function disable() {
      this.vrDisplay.removeEventListener('planesadded', this.onPlaneAdded_);
      this.vrDisplay.removeEventListener('planesupdated', this.onPlaneUpdated_);
      this.vrDisplay.removeEventListener('planesremoved', this.onPlaneRemoved_);
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;
      try {
        for (var _iterator3 = this.planes.keys()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var identifier = _step3.value;
          this.removePlane_(identifier);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
      this.materials.clear();
    }
  }, {
    key: 'createPlane',
    value: function createPlane(plane) {
      if (plane.vertices.length == 0) {
        return null;
      }
      var geo = new three.Geometry();
      for (var pt = 0; pt < plane.vertices.length / 3; pt++) {
        geo.vertices.push(new three.Vector3(plane.vertices[pt * 3], plane.vertices[pt * 3 + 1], plane.vertices[pt * 3 + 2]));
      }
      for (var face = 0; face < geo.vertices.length - 2; face++) {
        geo.faces.push(new three.Face3(0, face + 1, face + 2));
      }
      var material = void 0;
      if (this.materials.has(plane.identifier)) {
        material = this.materials.get(plane.identifier);
      } else {
        var color = getRandomPaletteColor();
        material = DEFAULT_MATERIAL.clone();
        material.uniforms.backgroundColor.value = color;
        this.materials.set(plane.identifier, material);
      }
      var planeObj = new three.Mesh(geo, material);
      var mm = plane.modelMatrix;
      planeObj.matrixAutoUpdate = false;
      planeObj.matrix.set(mm[0], mm[4], mm[8], mm[12], mm[1], mm[5], mm[9], mm[13], mm[2], mm[6], mm[10], mm[14], mm[3], mm[7], mm[11], mm[15]);
      this.add(planeObj);
      return planeObj;
    }
  }, {
    key: 'size',
    value: function size() {
      return this.planes.size;
    }
  }]);
  return ARPlanes;
}(three.Object3D);

var DEFAULTS = {
  open: true,
  showLastHit: true,
  showPoseStatus: true,
  showPlanes: false
};
var SUCCESS_COLOR = '#00ff00';
var FAILURE_COLOR = '#ff0077';
var PLANES_POLLING_TIMER = 500;
var THROTTLE_SPEED = 500;
var cachedVRDisplayMethods = new Map();
function throttle(fn, timer, scope) {
  var lastFired = void 0;
  var timeout = void 0;
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var current = +new Date();
    var until = void 0;
    if (lastFired) {
      until = lastFired + timer - current;
    }
    if (until == undefined || until < 0) {
      lastFired = current;
      fn.apply(scope, args);
    } else if (until >= 0) {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        lastFired = current;
        fn.apply(scope, args);
      }, until);
    }
  };
}
var ARDebug = function () {
  function ARDebug(vrDisplay, scene, config) {
    classCallCheck(this, ARDebug);
    if (typeof config === 'undefined' && scene && scene.type !== 'Scene') {
      config = scene;
      scene = null;
    }
    this.config = Object.assign({}, DEFAULTS, config);
    this.vrDisplay = vrDisplay;
    this._view = new ARDebugView({ open: this.config.open });
    if (this.config.showLastHit && this.vrDisplay.hitTest) {
      this._view.addRow('hit-test', new ARDebugHitTestRow(vrDisplay));
    }
    if (this.config.showPoseStatus && this.vrDisplay.getFrameData) {
      this._view.addRow('pose-status', new ARDebugPoseRow(vrDisplay));
    }
    if (this.config.showPlanes && this.vrDisplay.getPlanes) {
      if (!scene) {
        console.warn('ARDebug `{ showPlanes: true }` option requires ' + 'passing in a THREE.Scene as the second parameter ' + 'in the constructor.');
      } else {
        this._view.addRow('show-planes', new ARDebugPlanesRow(vrDisplay, scene));
      }
    }
  }
  createClass(ARDebug, [{
    key: 'open',
    value: function open() {
      this._view.open();
    }
  }, {
    key: 'close',
    value: function close() {
      this._view.close();
    }
  }, {
    key: 'getElement',
    value: function getElement() {
      return this._view.getElement();
    }
  }]);
  return ARDebug;
}();
var ARDebugView = function () {
  function ARDebugView() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, ARDebugView);
    this.rows = new Map();
    this.el = document.createElement('div');
    this.el.style.backgroundColor = '#333';
    this.el.style.padding = '5px';
    this.el.style.fontFamily = 'Roboto, Ubuntu, Arial, sans-serif';
    this.el.style.color = 'rgb(165, 165, 165)';
    this.el.style.position = 'absolute';
    this.el.style.right = '20px';
    this.el.style.top = '0px';
    this.el.style.width = '200px';
    this.el.style.fontSize = '12px';
    this.el.style.zIndex = 9999;
    this._rowsEl = document.createElement('div');
    this._rowsEl.style.transitionProperty = 'max-height';
    this._rowsEl.style.transitionDuration = '0.5s';
    this._rowsEl.style.transitionDelay = '0s';
    this._rowsEl.style.transitionTimingFunction = 'ease-out';
    this._rowsEl.style.overflow = 'hidden';
    this._controls = document.createElement('div');
    this._controls.style.fontSize = '13px';
    this._controls.style.fontWeight = 'bold';
    this._controls.style.paddingTop = '5px';
    this._controls.style.textAlign = 'center';
    this._controls.style.cursor = 'pointer';
    this._controls.addEventListener('click', this.toggleControls.bind(this));
    config.open ? this.open() : this.close();
    this.el.appendChild(this._rowsEl);
    this.el.appendChild(this._controls);
  }
  createClass(ARDebugView, [{
    key: 'toggleControls',
    value: function toggleControls() {
      if (this._isOpen) {
        this.close();
      } else {
        this.open();
      }
    }
  }, {
    key: 'open',
    value: function open() {
      this._rowsEl.style.maxHeight = '100px';
      this._isOpen = true;
      this._controls.textContent = 'Close ARDebug';
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;
      try {
        for (var _iterator = this.rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ref = _step.value;
          var _ref2 = slicedToArray(_ref, 2);
          var row = _ref2[1];
          row.enable();
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
  }, {
    key: 'close',
    value: function close() {
      this._rowsEl.style.maxHeight = '0px';
      this._isOpen = false;
      this._controls.textContent = 'Open ARDebug';
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;
      try {
        for (var _iterator2 = this.rows[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _ref3 = _step2.value;
          var _ref4 = slicedToArray(_ref3, 2);
          var row = _ref4[1];
          row.disable();
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
  }, {
    key: 'getElement',
    value: function getElement() {
      return this.el;
    }
  }, {
    key: 'addRow',
    value: function addRow(id, row) {
      this.rows.set(id, row);
      if (this._isOpen) {
        row.enable();
      }
      this._rowsEl.appendChild(row.getElement());
    }
  }]);
  return ARDebugView;
}();
var ARDebugRow = function () {
  function ARDebugRow(title) {
    classCallCheck(this, ARDebugRow);
    this.el = document.createElement('div');
    this.el.style.width = '100%';
    this.el.style.borderTop = '1px solid rgb(54, 54, 54)';
    this.el.style.borderBottom = '1px solid #14171A';
    this.el.style.position = 'relative';
    this.el.style.padding = '3px 0px';
    this.el.style.overflow = 'hidden';
    this._titleEl = document.createElement('span');
    this._titleEl.style.fontWeight = 'bold';
    this._titleEl.textContent = title;
    this._dataEl = document.createElement('span');
    this._dataEl.style.position = 'absolute';
    this._dataEl.style.left = '40px';
    this._dataElText = document.createTextNode('');
    this._dataEl.appendChild(this._dataElText);
    this.el.appendChild(this._titleEl);
    this.el.appendChild(this._dataEl);
    this._throttledWriteToDOM = throttle(this._writeToDOM, THROTTLE_SPEED, this);
  }
  createClass(ARDebugRow, [{
    key: 'enable',
    value: function enable() {
      throw new Error('Implement in child class');
    }
  }, {
    key: 'disable',
    value: function disable() {
      throw new Error('Implement in child class');
    }
  }, {
    key: 'getElement',
    value: function getElement() {
      return this.el;
    }
  }, {
    key: 'update',
    value: function update(value, isSuccess, renderImmediately) {
      if (renderImmediately) {
        this._writeToDOM(value, isSuccess);
      } else {
        this._throttledWriteToDOM(value, isSuccess);
      }
    }
  }, {
    key: '_writeToDOM',
    value: function _writeToDOM(value, isSuccess) {
      this._dataElText.nodeValue = value;
      this._dataEl.style.color = isSuccess ? SUCCESS_COLOR : FAILURE_COLOR;
    }
  }]);
  return ARDebugRow;
}();
var ARDebugHitTestRow = function (_ARDebugRow) {
  inherits(ARDebugHitTestRow, _ARDebugRow);
  function ARDebugHitTestRow(vrDisplay) {
    classCallCheck(this, ARDebugHitTestRow);
    var _this = possibleConstructorReturn(this, (ARDebugHitTestRow.__proto__ || Object.getPrototypeOf(ARDebugHitTestRow)).call(this, 'Hit'));
    _this.vrDisplay = vrDisplay;
    _this._onHitTest = _this._onHitTest.bind(_this);
    _this._nativeHitTest = cachedVRDisplayMethods.get('hitTest') || _this.vrDisplay.hitTest;
    cachedVRDisplayMethods.set('hitTest', _this._nativeHitTest);
    _this._didPreviouslyHit = null;
    return _this;
  }
  createClass(ARDebugHitTestRow, [{
    key: 'enable',
    value: function enable() {
      this.vrDisplay.hitTest = this._onHitTest;
    }
  }, {
    key: 'disable',
    value: function disable() {
      this.vrDisplay.hitTest = this._nativeHitTest;
    }
  }, {
    key: '_hitToString',
    value: function _hitToString(hit) {
      var mm = hit.modelMatrix;
      return mm[12].toFixed(2) + ', ' + mm[13].toFixed(2) + ', ' + mm[14].toFixed(2);
    }
  }, {
    key: '_onHitTest',
    value: function _onHitTest(x, y) {
      var hits = this._nativeHitTest.call(this.vrDisplay, x, y);
      var t = (parseInt(performance.now(), 10) / 1000).toFixed(1);
      var didHit = hits && hits.length;
      var value = (didHit ? this._hitToString(hits[0]) : 'MISS') + ' @ ' + t + 's';
      this.update(value, didHit, didHit !== this._didPreviouslyHit);
      this._didPreviouslyHit = didHit;
      return hits;
    }
  }]);
  return ARDebugHitTestRow;
}(ARDebugRow);
var ARDebugPoseRow = function (_ARDebugRow2) {
  inherits(ARDebugPoseRow, _ARDebugRow2);
  function ARDebugPoseRow(vrDisplay) {
    classCallCheck(this, ARDebugPoseRow);
    var _this2 = possibleConstructorReturn(this, (ARDebugPoseRow.__proto__ || Object.getPrototypeOf(ARDebugPoseRow)).call(this, 'Pose'));
    _this2.vrDisplay = vrDisplay;
    _this2._onGetFrameData = _this2._onGetFrameData.bind(_this2);
    _this2._nativeGetFrameData = cachedVRDisplayMethods.get('getFrameData') || _this2.vrDisplay.getFrameData;
    cachedVRDisplayMethods.set('getFrameData', _this2._nativeGetFrameData);
    _this2.update('Looking for position...', false, true);
    _this2._initialPose = false;
    return _this2;
  }
  createClass(ARDebugPoseRow, [{
    key: 'enable',
    value: function enable() {
      this.vrDisplay.getFrameData = this._onGetFrameData;
    }
  }, {
    key: 'disable',
    value: function disable() {
      this.vrDisplay.getFrameData = this._nativeGetFrameData;
    }
  }, {
    key: '_poseToString',
    value: function _poseToString(pose) {
      return pose[0].toFixed(2) + ', ' + pose[1].toFixed(2) + ', ' + pose[2].toFixed(2);
    }
  }, {
    key: '_onGetFrameData',
    value: function _onGetFrameData(frameData) {
      var results = this._nativeGetFrameData.call(this.vrDisplay, frameData);
      var pose = frameData && frameData.pose && frameData.pose.position;
      var isValidPose = pose && typeof pose[0] === 'number' && typeof pose[1] === 'number' && typeof pose[2] === 'number' && !(pose[0] === 0 && pose[1] === 0 && pose[2] === 0);
      if (!this._initialPose && !isValidPose) {
        return results;
      }
      var renderImmediately = isValidPose !== this._lastPoseValid;
      if (isValidPose) {
        this.update(this._poseToString(pose), true, renderImmediately);
      } else if (!isValidPose && this._lastPoseValid !== false) {
        this.update('Position lost', false, renderImmediately);
      }
      this._lastPoseValid = isValidPose;
      this._initialPose = true;
      return results;
    }
  }]);
  return ARDebugPoseRow;
}(ARDebugRow);
var ARDebugPlanesRow = function (_ARDebugRow3) {
  inherits(ARDebugPlanesRow, _ARDebugRow3);
  function ARDebugPlanesRow(vrDisplay, scene) {
    classCallCheck(this, ARDebugPlanesRow);
    var _this3 = possibleConstructorReturn(this, (ARDebugPlanesRow.__proto__ || Object.getPrototypeOf(ARDebugPlanesRow)).call(this, 'Planes'));
    _this3.vrDisplay = vrDisplay;
    _this3.planes = new ARPlanes(_this3.vrDisplay);
    _this3._onPoll = _this3._onPoll.bind(_this3);
    _this3.update('Looking for planes...', false, true);
    if (scene) {
      scene.add(_this3.planes);
    }
    return _this3;
  }
  createClass(ARDebugPlanesRow, [{
    key: 'enable',
    value: function enable() {
      if (this._timer) {
        this.disable();
      }
      this._timer = setInterval(this._onPoll, PLANES_POLLING_TIMER);
      this.planes.enable();
    }
  }, {
    key: 'disable',
    value: function disable() {
      clearInterval(this._timer);
      this._timer = null;
      this.planes.disable();
    }
  }, {
    key: '_planesToString',
    value: function _planesToString(count) {
      return count + ' plane' + (count === 1 ? '' : 's') + ' found';
    }
  }, {
    key: '_onPoll',
    value: function _onPoll() {
      var planeCount = this.planes.size();
      if (this._lastPlaneCount !== planeCount) {
        this.update(this._planesToString(planeCount), planeCount > 0, true);
      }
      this._lastPlaneCount = planeCount;
    }
  }]);
  return ARDebugPlanesRow;
}(ARDebugRow);

var frameData = void 0;
var ARPerspectiveCamera = function (_PerspectiveCamera) {
  inherits(ARPerspectiveCamera, _PerspectiveCamera);
  function ARPerspectiveCamera(vrDisplay, fov, aspect, near, far) {
    classCallCheck(this, ARPerspectiveCamera);
    var _this = possibleConstructorReturn(this, (ARPerspectiveCamera.__proto__ || Object.getPrototypeOf(ARPerspectiveCamera)).call(this, fov, aspect, near, far));
    _this.isARPerpsectiveCamera = true;
    _this.vrDisplay = vrDisplay;
    _this.updateProjectionMatrix();
    if (!vrDisplay || !vrDisplay.capabilities.hasPassThroughCamera) {
      console.warn('ARPerspectiveCamera does not a VRDisplay with\n                    a pass through camera. Using supplied values and defaults\n                    instead of device camera intrinsics');
    }
    return _this;
  }
  createClass(ARPerspectiveCamera, [{
    key: 'updateProjectionMatrix',
    value: function updateProjectionMatrix() {
      var projMatrix = this.getProjectionMatrix();
      if (!projMatrix) {
        get(ARPerspectiveCamera.prototype.__proto__ || Object.getPrototypeOf(ARPerspectiveCamera.prototype), 'updateProjectionMatrix', this).call(this);
        return;
      }
      this.projectionMatrix.fromArray(projMatrix);
    }
  }, {
    key: 'getProjectionMatrix',
    value: function getProjectionMatrix() {
      if (this.vrDisplay && this.vrDisplay.getFrameData) {
        if (!frameData) {
          frameData = new VRFrameData();
        }
        this.vrDisplay.getFrameData(frameData);
        return frameData.leftProjectionMatrix;
      }
      return null;
    }
  }]);
  return ARPerspectiveCamera;
}(three.PerspectiveCamera);

var ARReticle = function (_Mesh) {
  inherits(ARReticle, _Mesh);
  function ARReticle(vrDisplay) {
    var innerRadius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.02;
    var outerRadius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.05;
    var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0xff0077;
    var easing = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.25;
    classCallCheck(this, ARReticle);
    var geometry = new three.RingGeometry(innerRadius, outerRadius, 36, 64);
    var material = new three.MeshBasicMaterial({ color: color });
    geometry.applyMatrix(new three.Matrix4().makeRotationX(three.Math.degToRad(-90)));
    var _this = possibleConstructorReturn(this, (ARReticle.__proto__ || Object.getPrototypeOf(ARReticle)).call(this, geometry, material));
    _this.visible = false;
    _this.easing = easing;
    _this.applyOrientation = true;
    _this.vrDisplay = vrDisplay;
    _this._planeDir = new three.Vector3();
    return _this;
  }
  createClass(ARReticle, [{
    key: 'update',
    value: function update() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
      if (!this.vrDisplay || !this.vrDisplay.hitTest) {
        return;
      }
      var hit = this.vrDisplay.hitTest(x, y);
      if (hit && hit.length > 0) {
        this.visible = true;
        placeObjectAtHit(this, hit[0], this.applyOrientation, this.easing);
      }
    }
  }]);
  return ARReticle;
}(three.Mesh);

var vertexSource = "attribute vec3 aVertexPosition;attribute vec2 aTextureCoord;varying vec2 vTextureCoord;void main(void){gl_Position=vec4(aVertexPosition,1.0);vTextureCoord=aTextureCoord;}";

var fragmentSource = "\n#extension GL_OES_EGL_image_external : require\nprecision mediump float;varying vec2 vTextureCoord;uniform samplerExternalOES uSampler;void main(void){gl_FragColor=texture2D(uSampler,vTextureCoord);}";

function WGLUPreserveGLState(gl, bindings, callback) {
  if (!bindings) {
    callback(gl);
    return;
  }
  var boundValues = [];
  var activeTexture = null;
  for (var i = 0; i < bindings.length; ++i) {
    var binding = bindings[i];
    switch (binding) {
      case gl.TEXTURE_BINDING_2D:
      case gl.TEXTURE_BINDING_CUBE_MAP:
        var textureUnit = bindings[++i];
        if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31) {
          console.error("TEXTURE_BINDING_2D or TEXTURE_BINDING_CUBE_MAP must be followed by a valid texture unit");
          boundValues.push(null, null);
          break;
        }
        if (!activeTexture) {
          activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
        }
        gl.activeTexture(textureUnit);
        boundValues.push(gl.getParameter(binding), null);
        break;
      case gl.ACTIVE_TEXTURE:
        activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
        boundValues.push(null);
        break;
      default:
        boundValues.push(gl.getParameter(binding));
        break;
    }
  }
  callback(gl);
  for (var i = 0; i < bindings.length; ++i) {
    var binding = bindings[i];
    var boundValue = boundValues[i];
    switch (binding) {
      case gl.ACTIVE_TEXTURE:
        break;
      case gl.ARRAY_BUFFER_BINDING:
        gl.bindBuffer(gl.ARRAY_BUFFER, boundValue);
        break;
      case gl.COLOR_CLEAR_VALUE:
        gl.clearColor(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);
        break;
      case gl.COLOR_WRITEMASK:
        gl.colorMask(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);
        break;
      case gl.CURRENT_PROGRAM:
        gl.useProgram(boundValue);
        break;
      case gl.ELEMENT_ARRAY_BUFFER_BINDING:
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boundValue);
        break;
      case gl.FRAMEBUFFER_BINDING:
        gl.bindFramebuffer(gl.FRAMEBUFFER, boundValue);
        break;
      case gl.RENDERBUFFER_BINDING:
        gl.bindRenderbuffer(gl.RENDERBUFFER, boundValue);
        break;
      case gl.TEXTURE_BINDING_2D:
        var textureUnit = bindings[++i];
        if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31)
          break;
        gl.activeTexture(textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, boundValue);
        break;
      case gl.TEXTURE_BINDING_CUBE_MAP:
        var textureUnit = bindings[++i];
        if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31)
          break;
        gl.activeTexture(textureUnit);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, boundValue);
        break;
      case gl.VIEWPORT:
        gl.viewport(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);
        break;
      case gl.BLEND:
      case gl.CULL_FACE:
      case gl.DEPTH_TEST:
      case gl.SCISSOR_TEST:
      case gl.STENCIL_TEST:
        if (boundValue) {
          gl.enable(binding);
        } else {
          gl.disable(binding);
        }
        break;
      default:
        console.log("No GL restore behavior for 0x" + binding.toString(16));
        break;
    }
    if (activeTexture) {
      gl.activeTexture(activeTexture);
    }
  }
}
var glPreserveState = WGLUPreserveGLState;

function getShader(gl, str, type) {
  var shader = void 0;
  if (type == 'fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (type == 'vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
  gl.shaderSource(shader, str);
  gl.compileShader(shader);
  var result = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!result) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}
function getProgram(gl, vs, fs) {
  var vertexShader = getShader(gl, vs, 'vertex');
  var fragmentShader = getShader(gl, fs, 'fragment');
  if (!fragmentShader) {
    return null;
  }
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  var result = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
  if (!result) {
    alert('Could not initialise arview shaders');
  }
  return shaderProgram;
}
function combineOrientations(screenOrientation, seeThroughCameraOrientation) {
  var seeThroughCameraOrientationIndex = 0;
  switch (seeThroughCameraOrientation) {
    case 90:
      seeThroughCameraOrientationIndex = 1;
      break;
    case 180:
      seeThroughCameraOrientationIndex = 2;
      break;
    case 270:
      seeThroughCameraOrientationIndex = 3;
      break;
    default:
      seeThroughCameraOrientationIndex = 0;
      break;
  }
  var screenOrientationIndex = 0;
  switch (screenOrientation) {
    case 90:
      screenOrientationIndex = 1;
      break;
    case 180:
      screenOrientationIndex = 2;
      break;
    case 270:
      screenOrientationIndex = 3;
      break;
    default:
      screenOrientationIndex = 0;
      break;
  }
  var ret = screenOrientationIndex - seeThroughCameraOrientationIndex;
  if (ret < 0) {
    ret += 4;
  }
  return ret % 4;
}
var ARVideoRenderer = function () {
  function ARVideoRenderer(vrDisplay, gl) {
    classCallCheck(this, ARVideoRenderer);
    this.vrDisplay = vrDisplay;
    this.gl = gl;
    if (this.vrDisplay) {
      this.passThroughCamera = vrDisplay.getPassThroughCamera();
      this.program = getProgram(gl, vertexSource, fragmentSource);
    }
    gl.useProgram(this.program);
    this.vertexPositionAttribute = gl.getAttribLocation(this.program, 'aVertexPosition');
    this.textureCoordAttribute = gl.getAttribLocation(this.program, 'aTextureCoord');
    this.samplerUniform = gl.getUniformLocation(this.program, 'uSampler');
    this.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    var vertices = [-1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 1.0, -1.0, 0.0];
    var f32Vertices = new Float32Array(vertices);
    gl.bufferData(gl.ARRAY_BUFFER, f32Vertices, gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = 12;
    this.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    var textureCoords = null;
    if (this.vrDisplay) {
      var u = this.passThroughCamera.width / this.passThroughCamera.textureWidth;
      var v = this.passThroughCamera.height / this.passThroughCamera.textureHeight;
      textureCoords = [[0.0, 0.0, 0.0, v, u, 0.0, u, v], [u, 0.0, 0.0, 0.0, u, v, 0.0, v], [u, v, u, 0.0, 0.0, v, 0.0, 0.0], [0.0, v, u, v, 0.0, 0.0, u, 0.0]];
    } else {
      textureCoords = [[0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0], [1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0], [1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0], [0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0]];
    }
    this.f32TextureCoords = [];
    for (var i = 0; i < textureCoords.length; i++) {
      this.f32TextureCoords.push(new Float32Array(textureCoords[i]));
    }
    this.combinedOrientation = combineOrientations(screen.orientation.angle, this.passThroughCamera.orientation);
    gl.bufferData(gl.ARRAY_BUFFER, this.f32TextureCoords[this.combinedOrientation], gl.STATIC_DRAW);
    this.textureCoordBuffer.itemSize = 2;
    this.textureCoordBuffer.numItems = 8;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    var indices = [0, 1, 2, 2, 1, 3];
    var ui16Indices = new Uint16Array(indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ui16Indices, gl.STATIC_DRAW);
    this.indexBuffer.itemSize = 1;
    this.indexBuffer.numItems = 6;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    this.texture = gl.createTexture();
    gl.useProgram(null);
    this.projectionMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    this.mvMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    return this;
  }
  createClass(ARVideoRenderer, [{
    key: 'render',
    value: function render() {
      var _this = this;
      var gl = this.gl;
      var bindings = [gl.ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING, gl.CURRENT_PROGRAM];
      glPreserveState(gl, bindings, function () {
        gl.useProgram(_this.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.vertexPositionBuffer);
        gl.enableVertexAttribArray(_this.vertexPositionAttribute);
        gl.vertexAttribPointer(_this.vertexPositionAttribute, _this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.textureCoordBuffer);
        var combinedOrientation = combineOrientations(screen.orientation.angle, _this.passThroughCamera.orientation);
        if (combinedOrientation !== _this.combinedOrientation) {
          _this.combinedOrientation = combinedOrientation;
          gl.bufferData(gl.ARRAY_BUFFER, _this.f32TextureCoords[_this.combinedOrientation], gl.STATIC_DRAW);
        }
        gl.enableVertexAttribArray(_this.textureCoordAttribute);
        gl.vertexAttribPointer(_this.textureCoordAttribute, _this.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_EXTERNAL_OES, _this.texture);
        gl.texImage2D(gl.TEXTURE_EXTERNAL_OES, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, _this.passThroughCamera);
        gl.uniform1i(_this.samplerUniform, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, _this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
      });
    }
  }]);
  return ARVideoRenderer;
}();
var ARView = function () {
  function ARView(vrDisplay, renderer) {
    classCallCheck(this, ARView);
    this.vrDisplay = vrDisplay;
    if (isARKit(this.vrDisplay)) {
      return;
    }
    this.renderer = renderer;
    this.gl = renderer.context;
    this.videoRenderer = new ARVideoRenderer(vrDisplay, this.gl);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }
  createClass(ARView, [{
    key: 'onWindowResize',
    value: function onWindowResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    }
  }, {
    key: 'render',
    value: function render() {
      if (isARKit(this.vrDisplay)) {
        return;
      }
      var gl = this.gl;
      var dpr = window.devicePixelRatio;
      var width = this.width * dpr;
      var height = this.height * dpr;
      if (gl.viewportWidth !== width) {
        gl.viewportWidth = width;
      }
      if (gl.viewportHeight !== height) {
        gl.viewportHeight = height;
      }
      this.gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
      this.videoRenderer.render();
    }
  }]);
  return ARView;
}();

(function () {
  if (window.webarSpeechRecognitionInstance) {
    var addEventHandlingToObject = function addEventHandlingToObject(object) {
      object.listeners = {};
      object.addEventListener = function (eventType, callback) {
        if (!callback) {
          return this;
        }
        var listeners = this.listeners[eventType];
        if (!listeners) {
          this.listeners[eventType] = listeners = [];
        }
        if (listeners.indexOf(callback) < 0) {
          listeners.push(callback);
        }
        return this;
      };
      object.removeEventListener = function (eventType, callback) {
        if (!callback) {
          return this;
        }
        var listeners = this.listeners[eventType];
        if (listeners) {
          var i = listeners.indexOf(callback);
          if (i >= 0) {
            this.listeners[eventType] = listeners.splice(i, 1);
          }
        }
        return this;
      };
      object.callEventListeners = function (eventType, event) {
        if (!event) {
          event = { target: this };
        }
        if (!event.target) {
          event.target = this;
        }
        event.type = eventType;
        var onEventType = 'on' + eventType;
        if (typeof this[onEventType] === 'function') {
          this[onEventType](event);
        }
        var listeners = this.listeners[eventType];
        if (listeners) {
          for (var i = 0; i < listeners.length; i++) {
            var typeofListener = _typeof(listeners[i]);
            if (typeofListener === 'object') {
              listeners[i].handleEvent(event);
            } else if (typeofListener === 'function') {
              listeners[i](event);
            }
          }
        }
        return this;
      };
    };
    addEventHandlingToObject(window.webarSpeechRecognitionInstance);
    window.webkitSpeechRecognition = function () {
      return window.webarSpeechRecognitionInstance;
    };
  }
})();

if (typeof window !== 'undefined' && _typeof(window.THREE) === 'object') {
  window.THREE.ARDebug = ARDebug;
  window.THREE.ARPerspectiveCamera = ARPerspectiveCamera;
  window.THREE.ARReticle = ARReticle;
  window.THREE.ARUtils = ARUtils;
  window.THREE.ARView = ARView;
}

exports.ARDebug = ARDebug;
exports.ARPerspectiveCamera = ARPerspectiveCamera;
exports.ARReticle = ARReticle;
exports.ARUtils = ARUtils;
exports.ARView = ARView;

Object.defineProperty(exports, '__esModule', { value: true });

})));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(35)))

/***/ }),
/* 35 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
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
/* 91 */
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

var _threeAr = __webpack_require__(34);

var _vert = __webpack_require__(92);

var _vert2 = _interopRequireDefault(_vert);

var _frag = __webpack_require__(93);

var _frag2 = _interopRequireDefault(_frag);

var _wagner = __webpack_require__(4);

var _wagner2 = _interopRequireDefault(_wagner);

var _MultiPassBloomPass = __webpack_require__(14);

var _MultiPassBloomPass2 = _interopRequireDefault(_MultiPassBloomPass);

var _ExplodeModifier = __webpack_require__(32);

var _ExplodeModifier2 = _interopRequireDefault(_ExplodeModifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DISPLACEMENT = 0.8;
var SCALE = 1;
var SPREAD = 10;
var TRI_SCALE = 0.5;
var MODEL = '../assets/male_head_obj.obj';

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

      this.renderer.setClearColor(0x111111);

      _threeAr.ARUtils.loadModel({ objPath: MODEL, OBJLoader: window.THREE.OBJLoader }).then(function (group) {
        _this2.model = group;
        console.log(_this2.model);

        var transform = new _three.Matrix4().compose(new _three.Vector3(0.7, -1.3, 0), new _three.Quaternion(), new _three.Vector3(0.05, 0.05, 0.05));
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _this2.model.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var mesh = _step.value;

            mesh.geometry.applyMatrix(transform);
            var geo = new _three.Geometry().fromBufferGeometry(mesh.geometry);
            (0, _ExplodeModifier2.default)(geo);
            mesh.geometry = addOffset(geo);
            mesh.material = _this2.material;
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

        _this2.scene.add(_this2.model);
      });

      this.light = new _three.DirectionalLight();
      this.scene.add(this.light);
      this.light.position.y = 10;
      this.light.position.x = 5;

      this.material = new _three.ShaderMaterial({
        defines: {},
        uniforms: {
          alpha: { value: 0.5 },
          time: { value: 0 },
          displacment: { value: 0 }
        },
        vertexShader: _vert2.default,
        fragmentShader: _frag2.default,
        side: _three.DoubleSide,
        transparent: true
      });
      this.material.blending = _three.AdditiveBlending;

      this.pivot = new _three.Object3D();
      this.pivot.add(this.camera);
      this.scene.add(this.pivot);
      this.camera.position.set(0, 0, 4);
      this.renderer.render(this.scene, this.camera);
      this.composer = new _wagner2.default.Composer(this.renderer);
      this.pass = new _MultiPassBloomPass2.default({
        blurAmount: 5,
        applyZoomBlur: true,
        zoomBlurStrength: 0.9
      });
    }
  }, {
    key: 'update',
    value: function update(t, delta) {
      this.pivot.rotation.y = t * 0.00001;
      this.material.uniforms.time.value = t * 0.001;
    }
  }, {
    key: 'render',
    value: function render() {
      this.composer.reset();
      this.composer.render(this.scene, this.camera);
      this.composer.pass(this.pass);
      this.composer.toScreen();
    }
  }]);

  return Experiment;
}(_ThreeApp3.default);

exports.default = new Experiment();


function addOffset(geometry) {
  var bufferGeometry = new _three.BufferGeometry().fromGeometry(geometry);
  var offset = new Float32Array(geometry.faces.length * 3);
  var midpoint = new Float32Array(geometry.faces.length * 3 * 3);
  var rotatepoint = new Float32Array(geometry.faces.length * 3 * 3);
  var tmpVec = new _three.Vector3();
  for (var i = 0; i < geometry.faces.length; i++) {
    // const d = Math.random();
    var face = geometry.faces[i];
    var verts = [face.a, face.b, face.c].map(function (vIndex) {
      return geometry.vertices[vIndex];
    });
    var tri = new (Function.prototype.bind.apply(_three.Triangle, [null].concat(_toConsumableArray(verts))))();
    tri.midpoint(tmpVec);

    //const d = Math.min(1.0, (minY + 1) / 2);
    var d = i / geometry.faces.length * Math.PI * 2;
    d = i % 2 ? Math.PI * 2 - d : d;
    d = verts.reduce(function (max, v) {
      return Math.max(Math.abs(v.x), max);
    }, -Infinity) * Math.PI * 2;
    offset[3 * i + 0] = d;
    offset[3 * i + 1] = d;
    offset[3 * i + 2] = d;
    for (var j = 0; j < 3; j++) {
      midpoint[9 * i + (j * 3 + 0)] = tmpVec.x;
      midpoint[9 * i + (j * 3 + 1)] = tmpVec.y;
      midpoint[9 * i + (j * 3 + 2)] = tmpVec.z;

      rotatepoint[9 * i + (j * 3 + 0)] = verts[0].x;
      rotatepoint[9 * i + (j * 3 + 1)] = verts[0].y;
      rotatepoint[9 * i + (j * 3 + 2)] = verts[0].z;
    }
  }
  bufferGeometry.addAttribute('offset', new _three.BufferAttribute(offset, 1));
  bufferGeometry.addAttribute('midpoint', new _three.BufferAttribute(midpoint, 3));
  bufferGeometry.addAttribute('rotatepoint', new _three.BufferAttribute(rotatepoint, 3));

  return bufferGeometry;
}

/***/ }),
/* 92 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nuniform float time;\nuniform float displacement;\nuniform float spread;\n\nattribute float offset;\nattribute vec3 midpoint;\nattribute vec3 rotatepoint;\n\nvarying vec2 vUv;\nvarying vec3 vPosition;\nvarying float vPower;\n\nfloat map_1_0(float value, float inMin, float inMax, float outMin, float outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec2 map_1_0(vec2 value, vec2 inMin, vec2 inMax, vec2 outMin, vec2 outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec3 map_1_0(vec3 value, vec3 inMin, vec3 inMax, vec3 outMin, vec3 outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec4 map_1_0(vec4 value, vec4 inMin, vec4 inMax, vec4 outMin, vec4 outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\n\n\n\nconst float PI = 3.1415926;\nconst float MIN_DISTANCE = 0.4;\nmat4 rotationMatrix(vec3 axis, float angle)\n{\n  axis = normalize(axis);\n  float s = sin(angle);\n  float c = cos(angle);\n  float oc = 1.0 - c;\n\n  return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,\n      oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,\n      oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,\n      0.0,                                0.0,                                0.0,                                1.0);\n}\n\nvoid main() {\n  vUv = uv;\n  // Wave fluctuates from -2.5 to 2.5\n  float wave = sin(time * 0.5) * 2.2;\n  \n  float distance = clamp(abs(wave - position.y), 0.0, MIN_DISTANCE);\n  float power = map_1_0(MIN_DISTANCE - distance, 0.0, MIN_DISTANCE, 0.0, 1.0);\n  float rotAmplitude = 5.0 * PI * power;\n  vPower = power;\n\n  vec3 axis = cross(midpoint - rotatepoint, normal);\n  mat4 rotMatrix = rotationMatrix(axis, rotAmplitude);\n\n  // Rotate\n  vec3 p = (rotMatrix * vec4(position - midpoint, 1.0)).xyz;\n  // Translate back\n  p = midpoint + p;\n\n  // Apply scaling of tri\n  p = mix(midpoint, p, 1.0 - clamp(power, 0.1, 0.9));\n  vec3 displaced = p + normal * power * 0.03;//\n  vPosition = displaced;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0 );\n}\n"

/***/ }),
/* 93 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nuniform float time;\nuniform float alpha;\nfloat map_1_0(float value, float inMin, float inMax, float outMin, float outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec2 map_1_0(vec2 value, vec2 inMin, vec2 inMax, vec2 outMin, vec2 outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec3 map_1_0(vec3 value, vec3 inMin, vec3 inMax, vec3 outMin, vec3 outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec4 map_1_0(vec4 value, vec4 inMin, vec4 inMax, vec4 outMin, vec4 outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\n\n\nfloat hue2rgb_2_1(float f1, float f2, float hue) {\n    if (hue < 0.0)\n        hue += 1.0;\n    else if (hue > 1.0)\n        hue -= 1.0;\n    float res;\n    if ((6.0 * hue) < 1.0)\n        res = f1 + (f2 - f1) * 6.0 * hue;\n    else if ((2.0 * hue) < 1.0)\n        res = f2;\n    else if ((3.0 * hue) < 2.0)\n        res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;\n    else\n        res = f1;\n    return res;\n}\n\nvec3 hsl2rgb_2_2(vec3 hsl) {\n    vec3 rgb;\n    \n    if (hsl.y == 0.0) {\n        rgb = vec3(hsl.z); // Luminance\n    } else {\n        float f2;\n        \n        if (hsl.z < 0.5)\n            f2 = hsl.z * (1.0 + hsl.y);\n        else\n            f2 = hsl.z + hsl.y - hsl.y * hsl.z;\n            \n        float f1 = 2.0 * hsl.z - f2;\n        \n        rgb.r = hue2rgb_2_1(f1, f2, hsl.x + (1.0/3.0));\n        rgb.g = hue2rgb_2_1(f1, f2, hsl.x);\n        rgb.b = hue2rgb_2_1(f1, f2, hsl.x - (1.0/3.0));\n    }   \n    return rgb;\n}\n\nvec3 hsl2rgb_2_2(float h, float s, float l) {\n    return hsl2rgb_2_2(vec3(h, s, l));\n}\n\n\nvarying vec3 vPosition;\nvarying float vPower;\n\nvoid main() {\n\n  float h = fract(time * 0.01 + (vPower * 0.5));\n  vec3 hsl = hsl2rgb_2_2(h, 0.8, 0.5);\n  gl_FragColor = vec4(hsl, alpha);\n}\n"

/***/ })
/******/ ]);
});