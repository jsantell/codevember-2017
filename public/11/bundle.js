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
/******/ 	return __webpack_require__(__webpack_require__.s = 44);
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
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
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
/* 44 */
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

var _GlitchPass = __webpack_require__(45);

var _GlitchPass2 = _interopRequireDefault(_GlitchPass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ROWS = 5;
var SCALE = 0.3;

var Experiment = function (_ThreeApp) {
  _inherits(Experiment, _ThreeApp);

  function Experiment() {
    _classCallCheck(this, Experiment);

    return _possibleConstructorReturn(this, (Experiment.__proto__ || Object.getPrototypeOf(Experiment)).apply(this, arguments));
  }

  _createClass(Experiment, [{
    key: 'init',
    value: function init() {
      this.renderer.setClearColor(0x222222);
      for (var i = 0; i < ROWS; i++) {
        // x
        for (var j = 0; j < ROWS; j++) {
          // y
          for (var k = 0; k < ROWS; k++) {
            // z
            var cube = new _three.Mesh(new _three.BoxGeometry(), new _three.MeshStandardMaterial());
            cube.position.set(i - Math.floor(ROWS / 2), j - Math.floor(ROWS / 2), k - Math.floor(ROWS / 2));
            //cube.material.color = new Color(i/ROWS,j/ROWS,1.0 - k/ROWS);
            cube.scale.set(SCALE, SCALE, SCALE);
            this.scene.add(cube);
          }
        }
      }

      this.light = new _three.AmbientLight();
      this.scene.add(this.light);
      this.pointLight = new _three.PointLight(0xffffff, 1, 10);
      this.pointLight.position.x = -2;
      this.pointLightPivot = new _three.Object3D();
      this.pointLightPivot.add(this.pointLight);
      this.scene.add(this.pointLightPivot);
      this.pivot = new _three.Object3D();
      this.scene.add(this.pivot);
      this.pivot.add(this.camera);
      this.camera.position.set(0, 0, 5);
      this.composer = new _wagner2.default.Composer(this.renderer);
      this.pass = new _GlitchPass2.default();
    }
  }, {
    key: 'update',
    value: function update(t, delta) {
      this.pivot.rotation.y = t * 0.0001;
      this.pointLightPivot.rotation.z = t * 0.001;
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

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Pass2 = __webpack_require__(1);

var _Pass3 = _interopRequireDefault(_Pass2);

var _glitchVert = __webpack_require__(46);

var _glitchVert2 = _interopRequireDefault(_glitchVert);

var _glitchFrag = __webpack_require__(47);

var _glitchFrag2 = _interopRequireDefault(_glitchFrag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GlitchPass = function (_Pass) {
  _inherits(GlitchPass, _Pass);

  function GlitchPass() {
    _classCallCheck(this, GlitchPass);

    var _this = _possibleConstructorReturn(this, (GlitchPass.__proto__ || Object.getPrototypeOf(GlitchPass)).call(this));

    _this.params = {};
    _this.params.intensity = 1.0;
    _this.params.abberations = 0.01;
    _this.params.chance = 0.05;
    _this.setShader(_glitchVert2.default, _glitchFrag2.default);
    _this.tick = 0;
    return _this;
  }

  _createClass(GlitchPass, [{
    key: 'run',
    value: function run(composer) {
      this.tick++;
      this.shader.uniforms.intensity.value = this.params.intensity;
      this.shader.uniforms.abberations.value = this.params.abberations;
      this.shader.uniforms.chance.value = this.params.chance;
      this.shader.uniforms.random.value = Math.random();
      this.shader.uniforms.rows.value = Math.floor(Math.random() * 100);
      composer.pass(this.shader);
    }
  }]);

  return GlitchPass;
}(_Pass3.default);

exports.default = GlitchPass;

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  //gl_Position = vec4(position, 1.0);\n}\n"

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nuniform float time;\nuniform float random;\nvarying vec2 vUv;\nuniform sampler2D tInput;\nuniform float rows;\nuniform float chance;\nuniform float intensity;\nuniform float abberations;\n\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289_1_0(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289_1_0(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute_1_1(vec4 x) {\n     return mod289_1_0(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt_1_2(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise_1_3(vec3 v)\n  {\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D_1_4 = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n// Other corners\n  vec3 g_1_5 = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g_1_5;\n  vec3 i1 = min( g_1_5.xyz, l.zxy );\n  vec3 i2 = max( g_1_5.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D_1_4.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n// Permutations\n  i = mod289_1_0(i);\n  vec4 p = permute_1_1( permute_1_1( permute_1_1(\n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n// Gradients: 7x7 points over a square, mapped onto an octahedron.\n// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D_1_4.wyz - D_1_4.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1_1_6 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0_1_7 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1_1_6.xy,h.z);\n  vec3 p3 = vec3(a1_1_6.zw,h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt_1_2(vec4(dot(p0_1_7,p0_1_7), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0_1_7 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0_1_7,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n  }\n\n\n\n\nvec3 lerp(vec3 a, vec3 b, float value) {\n  return (a + value * (b - a));\n}\n\n\nvoid main() {\n  vec2 groupCoords = floor(vUv * rows) / rows;\n  float noise = smoothstep(-1.0, 0.3, snoise_1_3(vec3((groupCoords.y / 10.0), 0.5,\n    sin(time * 0.10) / 2.0 + 0.5)));\n  //float noise = snoise3(vec3(groupCoords.x/2.0, random*0.1, sin(time * 0.1)));\n  float lowProb = 1.0 - step(chance, random);\n  float lowProb2 = step(1.0 - chance, random);\n  float lowProb3 = 1.0 - step(chance, abs(random - 0.5));\n  float medProb = step(chance * 2.0, random);\n  float threshold = 1.0 - intensity;\n  float noiseProb = step((threshold + 0.01)* 2.0 , abs(noise));\n  float line = 1.0 - step(threshold + 0.02, abs(groupCoords.y - noise));\n  float column = 1.0 - step(threshold + 0.2, abs(vUv.x - noise));\n  float colorDisplacement = step(threshold+0.1, noise) * noise * 1.0;\n  float abby = abberations + (0.01 * sin(time * 0.1));\n  vec2 displacementCoords = fract(\n    vec2(lowProb3 * 0.1 + vUv.x + (noise* line) - column * 0.01,\n         vUv.y - lowProb * 0.1 + column * abby)\n  );\n  vec4 source = texture2D(tInput, vUv);\n  vec4 displacement = texture2D(tInput, displacementCoords);\n\n  vec4 color = vec4(source);\n\n  color.rgb = lerp(color.rgb,\n    vec3(\n      texture2D(tInput, fract(vUv - clamp(lowProb2*0.1 + (cos(time) / 2.0 +0.5) * random* abby*colorDisplacement, 0.0, 0.2))).r,\n      displacement.g,\n      texture2D(tInput, fract(vUv + clamp((sin(time) / 2.0 +0.5)* vUv.y* abby*colorDisplacement, 0.0, 0.1))).b),\n    colorDisplacement);\n\n  // color.r = clamp((lowProb * 3.0) + color.r, 0.0, 1.0);\n  gl_FragColor = vec4(color);\n}\n"

/***/ })
/******/ ]);
});