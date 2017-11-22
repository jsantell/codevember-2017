(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("three"), require("tween"));
	else if(typeof define === 'function' && define.amd)
		define(["three", "tween"], factory);
	else if(typeof exports === 'object')
		exports["app"] = factory(require("three"), require("tween"));
	else
		root["app"] = factory(root["THREE"], root["TWEEN"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_24__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 106);
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

/***/ 106:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(6);

var _three = __webpack_require__(0);

var THREE = _interopRequireWildcard(_three);

var _tween = __webpack_require__(24);

var _threeAr = __webpack_require__(107);

var _ThreeApp2 = __webpack_require__(7);

var _ThreeApp3 = _interopRequireDefault(_ThreeApp2);

var _wagner = __webpack_require__(4);

var _wagner2 = _interopRequireDefault(_wagner);

var _MultiPassBloomPass = __webpack_require__(14);

var _MultiPassBloomPass2 = _interopRequireDefault(_MultiPassBloomPass);

var _VignettePass = __webpack_require__(27);

var _VignettePass2 = _interopRequireDefault(_VignettePass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OBJ_PATH = 'model.obj';
var MTL_PATH = 'materials.mtl';
var EASING_OPEN = _tween.Easing.Quintic.Out;
var EASING_CLOSE = _tween.Easing.Bounce.Out;
var SPEED = 800;
var WAIT = 0;
var MIN_FREQ = 350;
var UPPER_FREQ_RANGE = 10000;
var SONG_URL = 'work.mp3';

var map = function map(value, inMin, inMax, outMin, outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
};

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

      var div = document.createElement('div');
      div.innerText = 'click the party fridge';
      div.style = 'left: 40%; top: 0; text-align: center; font-family: "Roboto", sans-serif; position: absolute; width: 20%; padding: 10px; background-color: rgba(0,0,0,0.2); color: white; margin: 0 auto;';
      document.body.appendChild(div);

      this.onClick = this.onClick.bind(this);
      window.addEventListener('click', this.onClick);

      this.renderer.setClearColor(0x119999);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

      // Lights
      this.dLight = new THREE.SpotLight(0xffffff);
      this.dLight.position.set(14, 20, -5);
      this.dLight.intensity = 0.05;
      this.dLight.castShadow = true;
      this.dLight.target.position.set(0, 0, 0);
      this.light = new THREE.AmbientLight(0xffffff);
      this.light.intensity = 0.6;
      this.scene.add(this.light);
      this.scene.add(this.dLight);
      this.scene.add(this.dLight.target);

      this.pivot = new THREE.Object3D();
      this.pivot.position.set(0, 0, 0);
      this.pivot.add(this.camera);
      this.scene.add(this.pivot);
      this.camera.position.set(0, 5, 20);

      // Floors
      this.floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 500), new THREE.MeshBasicMaterial({ color: 0x226622 }));
      this.floorShadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(50, 50), new THREE.ShadowMaterial({ color: 0x111111, opacity: 0.3 }));
      this.floor.rotation.x = -Math.PI / 2;
      this.floor.position.y = -4;
      this.floorShadow.rotation.x = -Math.PI / 2;
      this.floorShadow.position.y = -3.9;
      this.floorShadow.receiveShadow = true;
      this.scene.add(this.floor);
      this.scene.add(this.floorShadow);

      // Icebox hinges
      this.hinge = new THREE.Object3D();
      this.hingePivot = new THREE.Object3D();
      this.hingePivot.position.set(0, 0.00, -0.1);
      this.hingePivot.add(this.hinge);
      this.hinge.position.set(-0.0, 0, 0.1);
      this.hinge.rotation.y = 0.12;

      // audio
      this.ctx = new (window.webkitAudioContext || window.AudioContext)();
      this.audioEl = document.createElement('audio');
      this.audioEl.src = SONG_URL;
      this.audioEl.loop = true;
      this.audioEl.style = 'display: none;';
      this.audioNode = this.ctx.createMediaElementSource(this.audioEl);
      document.body.appendChild(this.audioEl);
      this.audioEl.play();
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.value = MIN_FREQ;
      this.audioNode.connect(this.filter);
      this.filter.connect(this.ctx.destination);

      // Icebox
      // Model: https://poly.google.com/view/f7q6m6IL8UI
      this.objLoader = new THREE.OBJLoader();
      this.mtlLoader = new THREE.MTLLoader(this.objLoader.manager);
      this.mtlLoader.setTexturePath(MTL_PATH.substr(0, MTL_PATH.lastIndexOf('/') + 1));
      this.mtlLoader.load(MTL_PATH, function (materials) {
        materials.preload();
        _this2.objLoader.setMaterials(materials);
        _this2.objLoader.load(OBJ_PATH, function (model) {
          _this2.model = model;
          // Move all submeshes to the hinge pivot that are the icebox's
          // lid so we can animate it independently
          for (var i = _this2.model.children.length - 1; i >= 0; i--) {
            var geo = _this2.model.children[i];
            geo.castShadow = true;
            geo.receiveShadow = true;

            if (i === 0) {
              // first model is the box geometry
              continue;
            }
            _this2.model.remove(geo);
            _this2.hinge.add(geo);
          }
          _this2.model.add(_this2.hingePivot);
          _this2.model.scale.set(20, 20, 20);
          _this2.scene.add(_this2.model);
        });
      });

      this.composer = new _wagner2.default.Composer(this.renderer);
      this.bloomPass = new _MultiPassBloomPass2.default({
        zoomBlurStrength: 0.01,
        applyZoomBlur: false,
        blurAmount: 1
      });
      this.vignettePass = new _VignettePass2.default(1.1, 1.2);
    }
  }, {
    key: 'update',
    value: function update(t, delta) {
      this.pivot.rotation.y = t * 0.0001;

      (0, _tween.update)();
    }
  }, {
    key: 'render',
    value: function render() {
      this.renderer.clearColor();
      this.composer.reset();
      this.composer.render(this.scene, this.camera);
      this.composer.pass(this.bloomPass);
      this.composer.pass(this.vignettePass);
      this.composer.toScreen();
      this.camera.lookAt(this.pivot.position);
      // this.renderer.render(this.scene, this.camera);
    }
  }, {
    key: 'onClick',
    value: function onClick() {
      if (this.opening || this.closing) {
        return;
      }
      this.open();
    }
  }, {
    key: 'open',
    value: function open() {
      var _this3 = this;

      this.opening = new _tween.Tween(this.hingePivot.rotation).to({ x: Math.PI / 2 }, SPEED).onUpdate(function (val) {
        _this3.hingePivot.rotation.x = val * Math.PI / -2;
        _this3.updateFilter();
      }).easing(EASING_OPEN).onComplete(function () {
        setTimeout(function () {
          _this3.opening = null;
          _this3.close();
        }, WAIT);
      }).start();
    }
  }, {
    key: 'close',
    value: function close() {
      var _this4 = this;

      this.closing = new _tween.Tween(this.hingePivot.rotation).to({ x: 0 }, SPEED).onUpdate(function (val) {
        _this4.hingePivot.rotation.x = (1 - val) * Math.PI / -2;
        _this4.updateFilter();
      }).easing(EASING_CLOSE).onComplete(function () {
        _this4.closing = null;
      }).start();
    }
  }, {
    key: 'updateFilter',
    value: function updateFilter() {
      var rotation = this.hingePivot.rotation.x;
      this.filter.frequency.value = MIN_FREQ + (1 - map(rotation, Math.PI / -2, 0, 0, 1)) * (UPPER_FREQ_RANGE - MIN_FREQ);
    }
  }]);

  return Experiment;
}(_ThreeApp3.default);

exports.default = new Experiment();

/***/ }),

/***/ 107:
/***/ (function(module, exports, __webpack_require__) {

/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(0));
	else if(typeof define === 'function' && define.amd)
		define(["three"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("three")) : factory(root["THREE"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayUnsupportedMessage = exports.getRandomPaletteColor = exports.placeObjectAtHit = exports.loadBlocksModel = exports.getARDisplay = exports.isARDisplay = exports.isARKit = exports.isTango = undefined;

var _three = __webpack_require__(0);

var _loaders = __webpack_require__(6);

/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800'].map(function (hex) {
  return new _three.Color(hex);
});

var LEARN_MORE_LINK = 'https://developers.google.com/ar/develop/web/getting-started';
var UNSUPPORTED_MESSAGE = 'This augmented reality experience requires\n  WebARonARCore or WebARonARKit, experimental browsers from Google\n  for Android and iOS. Learn more at the <a href="' + LEARN_MORE_LINK + '">Google Developers site</a>.';

var ARUtils = Object.create(null);

ARUtils.isTango = function (display) {
  return display && display.displayName.toLowerCase().includes('tango');
};
var isTango = exports.isTango = ARUtils.isTango;

ARUtils.isARKit = function (display) {
  return display && display.displayName.toLowerCase().includes('arkit');
};
var isARKit = exports.isARKit = ARUtils.isARKit;

ARUtils.isARDisplay = function (display) {
  return isARKit(display) || isTango(display);
};
var isARDisplay = exports.isARDisplay = ARUtils.isARDisplay;

/**
 * Returns a promise that resolves to either to a VRDisplay with
 * AR capabilities, or null if no valid AR devices found on the platform.
 *
 * @return {Promise<VRDisplay?>}
 */
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
var getARDisplay = exports.getARDisplay = ARUtils.getARDisplay;

/**
 * Takes a path for an OBJ model and optionally a path for an MTL
 * texture and returns a promise resolving to a THREE.Mesh loaded with
 * the appropriate material. Can be used on downloaded models from Blocks.
 *
 * @param {string} objPath
 * @param {string} mtlPath
 * @return {THREE.Mesh}
 */
ARUtils.loadBlocksModel = function (objPath, mtlPath) {
  return new Promise(function (resolve, reject) {
    if (!global.THREE || !global.THREE.OBJLoader || !global.THREE.MTLLoader) {
      reject(new Error('Must include THREE.OBJLoader and THREE.MTLLoader'));
      return;
    }

    var p = Promise.resolve();

    if (mtlPath) {
      p = (0, _loaders.loadMtl)(mtlPath);
    }

    p.then(function (materials) {
      if (materials) {
        materials.preload();
      }
      return (0, _loaders.loadObj)(objPath, materials);
    }).then(function (obj) {
      var model = obj.children[0];
      model.geometry.applyMatrix(new _three.Matrix4().makeRotationY(_three.Math.degToRad(-90)));

      return model;
    }).then(resolve, reject);
  });
};
var loadBlocksModel = exports.loadBlocksModel = ARUtils.loadBlocksModel;

var model = new _three.Matrix4();
var tempPos = new _three.Vector3();
var tempQuat = new _three.Quaternion();
var tempScale = new _three.Vector3();

/**
 * Takes a THREE.Object3D and a VRHit and positions and optionally orients
 * the object according to the transform of the VRHit. Can provide an
 * easing value between 0 and 1 corresponding to the lerp between the
 * object's current position/orientation, and the position/orientation of the
 * hit.
 *
 * @param {THREE.Object3D} object
 * @param {VRHit} hit
 * @param {number} easing
 * @param {boolean} applyOrientation
 */
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
var placeObjectAtHit = exports.placeObjectAtHit = ARUtils.placeObjectAtHit;

/**
 * Returns a random color from the stored palette.
 * @return {THREE.Color}
 */
ARUtils.getRandomPaletteColor = function () {
  return colors[Math.floor(Math.random() * colors.length)];
};
var getRandomPaletteColor = exports.getRandomPaletteColor = ARUtils.getRandomPaletteColor;

/**
 * Injects a DOM element into the current page prompting the user that
 * their browser does not support these AR features.
 */
ARUtils.displayUnsupportedMessage = function () {
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
  element.innerHTML = UNSUPPORTED_MESSAGE;
  document.body.appendChild(element);
};
var displayUnsupportedMessage = exports.displayUnsupportedMessage = ARUtils.displayUnsupportedMessage;

exports.default = ARUtils;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ARView = exports.ARUtils = exports.ARReticle = exports.ARPerspectiveCamera = exports.ARDebug = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                                               * Copyright 2017 Google Inc. All Rights Reserved.
                                                                                                                                                                                                                                                                               * Licensed under the Apache License, Version 2.0 (the 'License');
                                                                                                                                                                                                                                                                               * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                               * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                               * distributed under the License is distributed on an 'AS IS' BASIS,
                                                                                                                                                                                                                                                                               * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                               * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                               * limitations under the License.
                                                                                                                                                                                                                                                                               */

/* eslint no-unused-vars: "off" */


var _ARDebug = __webpack_require__(4);

var _ARDebug2 = _interopRequireDefault(_ARDebug);

var _ARPerspectiveCamera = __webpack_require__(9);

var _ARPerspectiveCamera2 = _interopRequireDefault(_ARPerspectiveCamera);

var _ARReticle = __webpack_require__(10);

var _ARReticle2 = _interopRequireDefault(_ARReticle);

var _ARUtils = __webpack_require__(1);

var _ARUtils2 = _interopRequireDefault(_ARUtils);

var _ARView = __webpack_require__(11);

var _ARView2 = _interopRequireDefault(_ARView);

__webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// If including three.ar.js as a standalone script tag,
// we'll need to expose these objects directly by attaching
// them on the THREE global
if (_typeof(global.THREE) === 'object') {
  global.THREE.ARDebug = _ARDebug2.default;
  global.THREE.ARPerspectiveCamera = _ARPerspectiveCamera2.default;
  global.THREE.ARReticle = _ARReticle2.default;
  global.THREE.ARUtils = _ARUtils2.default;
  global.THREE.ARView = _ARView2.default;
}

exports.ARDebug = _ARDebug2.default;
exports.ARPerspectiveCamera = _ARPerspectiveCamera2.default;
exports.ARReticle = _ARReticle2.default;
exports.ARUtils = _ARUtils2.default;
exports.ARView = _ARView2.default;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright 2017 Google Inc. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under the Apache License, Version 2.0 (the 'License');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * distributed under the License is distributed on an 'AS IS' BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _ARPlanes = __webpack_require__(5);

var _ARPlanes2 = _interopRequireDefault(_ARPlanes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULTS = {
  open: true,
  showLastHit: true,
  showPoseStatus: true,
  showPlanes: false
};

var SUCCESS_COLOR = '#00ff00';
var FAILURE_COLOR = '#ff0077';
var PLANES_POLLING_TIMER = 500;

// A cache to store original native VRDisplay methods
// since WebARonARKit does not provide a VRDisplay.prototype[method],
// and assuming the first time ARDebug proxies a method is the
// 'native' version, this caches the correct method if we proxy a method twice
var cachedVRDisplayMethods = new Map();

/**
 * A throttle function to limit number of DOM writes
 * in the ARDebug view.
 *
 * @param {Function} fn
 * @param {number} timer
 * @param {Object} scope
 *
 * @return {Function}
 */
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
/**
 * Class for creating a mesh that fires raycasts and lerps
 * a 3D object along the surface
 */

var ARDebug = function () {
  /**
   * @param {VRDisplay} vrDisplay
   * @param {THREE.Scene?} scene
   * @param {Object} config
   * @param {boolean} config.open
   * @param {boolean} config.showLastHit
   * @param {boolean} config.showPoseStatus
   * @param {boolean} config.showPlanes
   */
  function ARDebug(vrDisplay, scene, config) {
    _classCallCheck(this, ARDebug);

    // Make `scene` optional
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

  /**
   * Opens the debug panel.
   */


  _createClass(ARDebug, [{
    key: 'open',
    value: function open() {
      this._view.open();
    }

    /**
     * Closes the debug panel.
     */

  }, {
    key: 'close',
    value: function close() {
      this._view.close();
    }

    /**
     * Returns the root DOM element for the panel.
     *
     * @return {HTMLElement}
     */

  }, {
    key: 'getElement',
    value: function getElement() {
      return this._view.getElement();
    }
  }]);

  return ARDebug;
}();

/**
 * An implementation that interfaces with the DOM, used
 * by ARDebug
 */


var ARDebugView = function () {
  /**
   * @param {Object} config
   * @param {boolean} config.open
   */
  function ARDebugView() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ARDebugView);

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

    // Initialize the view as open or closed
    config.open ? this.open() : this.close();

    this.el.appendChild(this._rowsEl);
    this.el.appendChild(this._controls);
  }

  /**
   * Toggles between open and close modes.
   */


  _createClass(ARDebugView, [{
    key: 'toggleControls',
    value: function toggleControls() {
      if (this._isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    /**
     * Opens the debugging panel.
     */

  }, {
    key: 'open',
    value: function open() {
      // Use max-height with large value to transition
      // to/from a non-specific height (like auto/100%)
      // https://stackoverflow.com/a/8331169
      // @TODO investigate a more complete solution with correct timing,
      // via something like http://n12v.com/css-transition-to-from-auto/
      this._rowsEl.style.maxHeight = '100px';
      this._isOpen = true;
      this._controls.textContent = 'Close ARDebug';
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              row = _step$value[1];

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

    /**
     * Closes the debugging panel.
     */

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
          var _step2$value = _slicedToArray(_step2.value, 2),
              row = _step2$value[1];

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

    /**
     * Returns the ARDebugView root element.
     *
     * @return {HTMLElement}
     */

  }, {
    key: 'getElement',
    value: function getElement() {
      return this.el;
    }

    /**
     * Adds a row to the ARDebugView.
     *
     * @param {string} id
     * @param {ARDebugRow} row
     */

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

/**
 * A class that implements features being a row in the ARDebugView.
 */


var ARDebugRow = function () {
  /**
   * @param {string} title
   */
  function ARDebugRow(title) {
    _classCallCheck(this, ARDebugRow);

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

    // Create a text element to update so we can avoid
    // forced reflows when updating
    // https://stackoverflow.com/a/17203046
    this._dataElText = document.createTextNode('');
    this._dataEl.appendChild(this._dataElText);

    this.el.appendChild(this._titleEl);
    this.el.appendChild(this._dataEl);

    this.update = throttle(this.update, 500, this);
  }

  /**
   * Enables the proxying and inspection functionality of
   * this row. Should be implemented by child class.
   */


  _createClass(ARDebugRow, [{
    key: 'enable',
    value: function enable() {
      throw new Error('Implement in child class');
    }

    /**
     * Disables the proxying and inspection functionality of
     * this row. Should be implemented by child class.
     */

  }, {
    key: 'disable',
    value: function disable() {
      throw new Error('Implement in child class');
    }

    /**
     * Returns the ARDebugRow's root element.
     *
     * @return {HTMLElement}
     */

  }, {
    key: 'getElement',
    value: function getElement() {
      return this.el;
    }

    /**
     * Updates the row's value.
     *
     * @param {string} value
     * @param {boolean} isSuccess
     */

  }, {
    key: 'update',
    value: function update(value, isSuccess) {
      this._dataElText.nodeValue = value;
      this._dataEl.style.color = isSuccess ? SUCCESS_COLOR : FAILURE_COLOR;
    }
  }]);

  return ARDebugRow;
}();

/**
 * The ARDebugRow subclass for displaying hit information
 * by wrapping `vrDisplay.hitTest` and displaying the results.
 */


var ARDebugHitTestRow = function (_ARDebugRow) {
  _inherits(ARDebugHitTestRow, _ARDebugRow);

  /**
   * @param {VRDisplay} vrDisplay
   */
  function ARDebugHitTestRow(vrDisplay) {
    _classCallCheck(this, ARDebugHitTestRow);

    var _this = _possibleConstructorReturn(this, (ARDebugHitTestRow.__proto__ || Object.getPrototypeOf(ARDebugHitTestRow)).call(this, 'Hit'));

    _this.vrDisplay = vrDisplay;
    _this._onHitTest = _this._onHitTest.bind(_this);

    // Store the native hit test, or proxy the native `hitTest` call with our own
    _this._nativeHitTest = cachedVRDisplayMethods.get('hitTest') || _this.vrDisplay.hitTest;
    cachedVRDisplayMethods.set('hitTest', _this._nativeHitTest);

    _this._didPreviouslyHit = null;
    return _this;
  }

  /**
   * Enables the tracking of hit test information.
   */


  _createClass(ARDebugHitTestRow, [{
    key: 'enable',
    value: function enable() {
      this.vrDisplay.hitTest = this._onHitTest;
    }

    /**
     * Disables the tracking of hit test information.
     */

  }, {
    key: 'disable',
    value: function disable() {
      this.vrDisplay.hitTest = this._nativeHitTest;
    }

    /**
     * @param {VRHit} hit
     * @return {string}
     */

  }, {
    key: '_hitToString',
    value: function _hitToString(hit) {
      var mm = hit.modelMatrix;
      return mm[12].toFixed(2) + ', ' + mm[13].toFixed(2) + ', ' + mm[14].toFixed(2);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @return {VRHit?}
     */

  }, {
    key: '_onHitTest',
    value: function _onHitTest(x, y) {
      var hits = this._nativeHitTest.call(this.vrDisplay, x, y);

      var t = (parseInt(performance.now(), 10) / 1000).toFixed(1);
      var didHit = hits && hits.length;

      this.update((didHit ? this._hitToString(hits[0]) : 'MISS') + ' @ ' + t + 's', didHit);
      this._didPreviouslyHit = didHit;
      return hits;
    }
  }]);

  return ARDebugHitTestRow;
}(ARDebugRow);

/**
 * The ARDebugRow subclass for displaying pose information
 * by wrapping `vrDisplay.getFrameData` and displaying the results.
 */


var ARDebugPoseRow = function (_ARDebugRow2) {
  _inherits(ARDebugPoseRow, _ARDebugRow2);

  /**
   * @param {VRDisplay} vrDisplay
   */
  function ARDebugPoseRow(vrDisplay) {
    _classCallCheck(this, ARDebugPoseRow);

    var _this2 = _possibleConstructorReturn(this, (ARDebugPoseRow.__proto__ || Object.getPrototypeOf(ARDebugPoseRow)).call(this, 'Pose'));

    _this2.vrDisplay = vrDisplay;
    _this2._onGetFrameData = _this2._onGetFrameData.bind(_this2);

    // Store the native hit test, or proxy the native `hitTest` call with our own
    _this2._nativeGetFrameData = cachedVRDisplayMethods.get('getFrameData') || _this2.vrDisplay.getFrameData;
    cachedVRDisplayMethods.set('getFrameData', _this2._nativeGetFrameData);

    _this2.update('Looking for position...');
    _this2._initialPose = false;
    return _this2;
  }

  /**
   * Enables displaying and pulling getFrameData
   */


  _createClass(ARDebugPoseRow, [{
    key: 'enable',
    value: function enable() {
      this.vrDisplay.getFrameData = this._onGetFrameData;
    }

    /**
     * Disables displaying and pulling getFrameData
     */

  }, {
    key: 'disable',
    value: function disable() {
      this.vrDisplay.getFrameData = this._nativeGetFrameData;
    }

    /**
     * @param {VRPose} pose
     * @return {string}
     */

  }, {
    key: '_poseToString',
    value: function _poseToString(pose) {
      return pose[0].toFixed(2) + ', ' + pose[1].toFixed(2) + ', ' + pose[2].toFixed(2);
    }

    /**
     * Wrapper around getFrameData
     *
     * @param {VRFrameData} frameData
     * @return {boolean}
     */

  }, {
    key: '_onGetFrameData',
    value: function _onGetFrameData(frameData) {
      var results = this._nativeGetFrameData.call(this.vrDisplay, frameData);
      var pose = frameData && frameData.pose && frameData.pose.position;
      // Ensure we have a valid pose; while the pose SHOULD be null when not
      // provided by the VRDisplay, on WebARonARCore, the xyz values of position
      // are all 0 -- mark this as an invalid pose
      var isValidPose = pose && typeof pose[0] === 'number' && typeof pose[1] === 'number' && typeof pose[2] === 'number' && !(pose[0] === 0 && pose[1] === 0 && pose[2] === 0);

      // If we haven't received a pose yet, and still don't have a valid pose
      // leave the message how it is
      if (!this._initialPose && !isValidPose) {
        return results;
      }

      if (isValidPose) {
        this.update(this._poseToString(pose), true);
      } else if (!isValidPose && this._lastPoseValid !== false) {
        this.update('Position lost', false);
      }

      this._lastPoseValid = isValidPose;
      this._initialPose = true;

      return results;
    }
  }]);

  return ARDebugPoseRow;
}(ARDebugRow);

/**
 * The ARDebugRow subclass for displaying planes information
 * by wrapping polling getPlanes, and rendering.
 */


var ARDebugPlanesRow = function (_ARDebugRow3) {
  _inherits(ARDebugPlanesRow, _ARDebugRow3);

  /**
   * @param {VRDisplay} vrDisplay
   * @param {THREE.Scene} scene
   */
  function ARDebugPlanesRow(vrDisplay, scene) {
    _classCallCheck(this, ARDebugPlanesRow);

    var _this3 = _possibleConstructorReturn(this, (ARDebugPlanesRow.__proto__ || Object.getPrototypeOf(ARDebugPlanesRow)).call(this, 'Planes'));

    _this3.vrDisplay = vrDisplay;
    _this3.planes = new _ARPlanes2.default(_this3.vrDisplay);
    _this3._onPoll = _this3._onPoll.bind(_this3);
    _this3.update('Looking for planes...');
    if (scene) {
      scene.add(_this3.planes);
    }
    return _this3;
  }

  /**
   * Enables displaying and pulling getFrameData
   */


  _createClass(ARDebugPlanesRow, [{
    key: 'enable',
    value: function enable() {
      if (this._timer) {
        this.disable();
      }
      this._timer = setInterval(this._onPoll, PLANES_POLLING_TIMER);
    }

    /**
     * Disables displaying and pulling getFrameData
     */

  }, {
    key: 'disable',
    value: function disable() {
      clearInterval(this._timer);
      this._timer = null;
      this.planes.clear();
    }

    /**
     * @param {number} count
     * @return {string}
     */

  }, {
    key: '_planesToString',
    value: function _planesToString(count) {
      return count + ' plane' + (count === 1 ? '' : 's') + ' found';
    }

    /**
     * Polling callback while enabled, used to fetch and orchestrate
     * plane rendering.
     */

  }, {
    key: '_onPoll',
    value: function _onPoll() {
      var planeCount = this.planes.update();
      this.update(this._planesToString(planeCount), planeCount > 0);
    }
  }]);

  return ARDebugPlanesRow;
}(ARDebugRow);

exports.default = ARDebug;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _three = __webpack_require__(0);

var _ARUtils = __webpack_require__(1);

var _arplanes = __webpack_require__(7);

var _arplanes2 = _interopRequireDefault(_arplanes);

var _arplanes3 = __webpack_require__(8);

var _arplanes4 = _interopRequireDefault(_arplanes3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright 2017 Google Inc. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under the Apache License, Version 2.0 (the 'License');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * distributed under the License is distributed on an 'AS IS' BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var DEFAULT_MATERIAL = new _three.RawShaderMaterial({
  side: _three.DoubleSide,
  transparent: true,
  uniforms: {
    dotColor: {
      value: new _three.Color(0xffffff)
    },
    lineColor: {
      value: new _three.Color(0x707070)
    },
    backgroundColor: {
      value: new _three.Color(0x404040)
    },
    dotRadius: {
      value: 0.006666666667
    },
    alpha: {
      value: 0.4
    }
  },
  vertexShader: _arplanes2.default,
  fragmentShader: _arplanes4.default
});

/**
 * The ARDebugRow subclass for displaying planes information
 * by wrapping polling getPlanes, and rendering.
 */

var ARPlanes = function (_Object3D) {
  _inherits(ARPlanes, _Object3D);

  /**
   * @param {VRDisplay} vrDisplay
   */
  function ARPlanes(vrDisplay) {
    _classCallCheck(this, ARPlanes);

    var _this = _possibleConstructorReturn(this, (ARPlanes.__proto__ || Object.getPrototypeOf(ARPlanes)).call(this));

    _this.vrDisplay = vrDisplay;
    _this.planes = [];

    // A mapping of plane IDs to colors, so that we can reuse the same
    // color everytime we update for the same plane rather than randomizing
    // @TODO When we have plane removal events, clear this map so we don't
    // have a leak
    _this.materialMap = new Map();
    return _this;
  }

  /**
   * Clear out the THREE representation mesh from
   * scene.
   */


  _createClass(ARPlanes, [{
    key: 'clear',
    value: function clear() {
      var _this2 = this;

      this.planes.forEach(function (plane) {
        return _this2.remove(plane);
      });
      this.planes.length = 0;
    }

    /**
     * Polling callback while enabled, used to fetch and orchestrate
     * plane rendering. If successful, returns the number of planes found.
     *
     * @return {number?}
     */

  }, {
    key: 'update',
    value: function update() {
      if (!this.vrDisplay || !this.vrDisplay.getPlanes) {
        return;
      }

      // Remove current planes and clear out
      // from scene
      this.clear();

      // Recreate each plane detected
      var planes = this.vrDisplay.getPlanes();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = planes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var anchor = _step.value;

          if (anchor.vertices.length == 0) {
            continue;
          }

          var id = anchor.identifier;
          var planeObj = new _three.Object3D();
          var mm = anchor.modelMatrix;
          planeObj.matrixAutoUpdate = false;
          planeObj.matrix.set(mm[0], mm[4], mm[8], mm[12], mm[1], mm[5], mm[9], mm[13], mm[2], mm[6], mm[10], mm[14], mm[3], mm[7], mm[11], mm[15]);

          this.add(planeObj);
          this.planes.push(planeObj);

          var geo = new _three.Geometry();
          // generate vertices
          for (var pt = 0; pt < anchor.vertices.length / 3; pt++) {
            geo.vertices.push(new _three.Vector3(anchor.vertices[pt * 3], anchor.vertices[pt * 3 + 1], anchor.vertices[pt * 3 + 2]));
          }

          // generate faces
          for (var face = 0; face < geo.vertices.length - 2; face++) {
            // this makes a triangle fan, from the first +Y point around
            geo.faces.push(new _three.Face3(0, face + 1, face + 2));
          }

          var material = void 0;
          if (this.materialMap.has(id)) {
            // If we have a material stored for this plane already, reuse it
            material = this.materialMap.get(id);
          } else {
            // Otherwise, generate a new color, and assign the color to
            // this plane's ID
            var color = (0, _ARUtils.getRandomPaletteColor)();
            material = DEFAULT_MATERIAL.clone();
            material.uniforms.backgroundColor.value = color;
            this.materialMap.set(id, material);
          }

          var plane = new _three.Mesh(geo, material);
          planeObj.add(plane);
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

      return planes.length;
    }
  }]);

  return ARPlanes;
}(_three.Object3D);

exports.default = ARPlanes;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This module contains promisified loaders for internal use for
 * exposed ARUtils.
 */

var noop = function noop() {};

var loadObj = exports.loadObj = function loadObj(objPath, materials) {
  return new Promise(function (resolve, reject) {
    var loader = new global.THREE.OBJLoader();

    if (materials) {
      loader.setMaterials(materials);
    }

    loader.load(objPath, resolve, noop, reject);
  });
};

var loadMtl = exports.loadMtl = function loadMtl(mtlPath) {
  return new Promise(function (resolve, reject) {
    var loader = new global.THREE.MTLLoader();
    var pathChunks = mtlPath.split('/');

    if (pathChunks.length >= 2) {
      loader.setTexturePath(pathChunks[pathChunks.length - 2]);
    }

    loader.load(mtlPath, resolve, noop, reject);
  });
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = "// Copyright 2017 Google Inc. All Rights Reserved.\n// Licensed under the Apache License, Version 2.0 (the 'License');\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n// http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an 'AS IS' BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\nprecision mediump float;\nprecision mediump int;\n#define GLSLIFY 1\n\nuniform mat4 modelViewMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 projectionMatrix;\n\nattribute vec3 position;\n\nvarying vec3 vPosition;\n\nvoid main() {\n  vPosition = (modelMatrix * vec4(position, 1.0)).xyz;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = "// Copyright 2017 Google Inc. All Rights Reserved.\n// Licensed under the Apache License, Version 2.0 (the 'License');\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n// http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an 'AS IS' BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\nprecision highp float;\n#define GLSLIFY 1\n\nvarying vec3 vPosition;\n\n#define countX 7.0\n#define countY 4.0\n#define gridAlpha 0.75\n\nuniform float dotRadius; //ui:0.0,0.01,0.006666666667\nuniform vec3 dotColor; //ui:0.0,1.0,1.0\nuniform vec3 lineColor; //ui:0.0,1.0,0.50\nuniform vec3 backgroundColor; //ui:0.0,1.0,0.25\nuniform float alpha; //ui:0.0,1.0,1.0\n\nfloat Circle( in vec2 p, float r ) {\n  return length( p ) - r;\n}\n\nfloat Line( in vec2 p, in vec2 a, in vec2 b ) {\n  vec2 pa = p - a;\n  vec2 ba = b - a;\n  float t = clamp( dot( pa, ba ) / dot( ba, ba ), 0.0, 1.0);\n  vec2 pt = a + t * ba;\n  return length( pt - p );\n}\n\nfloat Union( float a, float b ) {\n  return min( a, b );\n}\n\nvoid main()\n{\n  vec2 count = vec2( countX, countY );\n  vec2 size = vec2( 1.0 ) / count;\n  vec2 halfSize = size * 0.5;\n  vec2 uv = mod( vPosition.xz * 1.5, size ) - halfSize;\n\n  float dots = Circle( uv - vec2( halfSize.x, 0.0 ), dotRadius );\n  dots = Union( dots, Circle( uv + vec2( halfSize.x, 0.0 ), dotRadius ) );\n  dots = Union( dots, Circle( uv + vec2( 0.0, halfSize.y ), dotRadius ) );\n  dots = Union( dots, Circle( uv - vec2( 0.0, halfSize.y ), dotRadius ) );\n\n  float lines = Line( uv, vec2( 0.0, halfSize.y ), -vec2( halfSize.x, 0.0 ) );\n  lines = Union( lines, Line( uv, vec2( 0.0, -halfSize.y ), -vec2( halfSize.x, 0.0 ) ) );\n  lines = Union( lines, Line( uv, vec2( 0.0, -halfSize.y ), vec2( halfSize.x, 0.0 ) ) );\n  lines = Union( lines, Line( uv, vec2( 0.0, halfSize.y ), vec2( halfSize.x, 0.0 ) ) );\n  lines = Union( lines, Line( uv, vec2( -halfSize.x, halfSize.y ), vec2( halfSize.x, halfSize.y ) ) );\n  lines = Union( lines, Line( uv, vec2( -halfSize.x, -halfSize.y ), vec2( halfSize.x, -halfSize.y ) ) );\n  lines = Union( lines, Line( uv, vec2( -halfSize.x, 0.0 ), vec2( halfSize.x, 0.0 ) ) );\n\n  lines = clamp( smoothstep( 0.0, 0.0035, lines ), 0.0, 1.0 );\n  dots = clamp( smoothstep( 0.0, 0.001, dots ), 0.0, 1.0 );\n\n  float result = Union( dots, lines );\n  gl_FragColor = vec4( mix( backgroundColor + mix( dotColor, lineColor, dots ),\n    backgroundColor, result ), mix( gridAlpha, alpha, result ) );\n}\n";

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _three = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright 2017 Google Inc. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under the Apache License, Version 2.0 (the 'License');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * distributed under the License is distributed on an 'AS IS' BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// Reuse the frame data for getting the projection matrix
var frameData = void 0;

/**
 * Class extending a PerspectiveCamera, attempting
 * to use the projection matrix provided from an AR-enabled
 * VRDisplay. If no AR-enabled VRDisplay found, uses provided
 * parameters.
 */

var ARPerspectiveCamera = function (_PerspectiveCamera) {
  _inherits(ARPerspectiveCamera, _PerspectiveCamera);

  /**
   * @param {VRDisplay} vrDisplay
   * @param {number} fov
   * @param {number} aspect
   * @param {number} near
   * @param {number} far
   */
  function ARPerspectiveCamera(vrDisplay, fov, aspect, near, far) {
    _classCallCheck(this, ARPerspectiveCamera);

    var _this = _possibleConstructorReturn(this, (ARPerspectiveCamera.__proto__ || Object.getPrototypeOf(ARPerspectiveCamera)).call(this, fov, aspect, near, far));

    _this.isARPerpsectiveCamera = true;
    _this.vrDisplay = vrDisplay;
    _this.updateProjectionMatrix();

    if (!vrDisplay || !vrDisplay.capabilities.hasPassThroughCamera) {
      console.warn('ARPerspectiveCamera does not a VRDisplay with\n                    a pass through camera. Using supplied values and defaults\n                    instead of device camera intrinsics');
    }
    return _this;
  }

  /**
   * Updates the underlying `projectionMatrix` property from
   * the AR-enabled VRDisplay, or falls back to
   * THREE.PerspectiveCamera.prototype.updateProjectionMatrix
   */


  _createClass(ARPerspectiveCamera, [{
    key: 'updateProjectionMatrix',
    value: function updateProjectionMatrix() {
      var projMatrix = this.getProjectionMatrix();
      if (!projMatrix) {
        _get(ARPerspectiveCamera.prototype.__proto__ || Object.getPrototypeOf(ARPerspectiveCamera.prototype), 'updateProjectionMatrix', this).call(this);
        return;
      }

      this.projectionMatrix.fromArray(projMatrix);
    }

    /**
     * Gets the projection matrix from AR-enabled VRDisplay
     * if possible.
     * @return {!Float32Array}
     */

  }, {
    key: 'getProjectionMatrix',
    value: function getProjectionMatrix() {
      if (this.vrDisplay && this.vrDisplay.getFrameData) {
        if (!frameData) {
          frameData = new VRFrameData();
        }
        this.vrDisplay.getFrameData(frameData);

        // Can use either left or right projection matrix
        return frameData.leftProjectionMatrix;
      }
      return null;
    }
  }]);

  return ARPerspectiveCamera;
}(_three.PerspectiveCamera);

exports.default = ARPerspectiveCamera;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _three = __webpack_require__(0);

var _ARUtils = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright 2017 Google Inc. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under the Apache License, Version 2.0 (the 'License');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * distributed under the License is distributed on an 'AS IS' BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * Class for creating a mesh that fires raycasts and lerps
 * a 3D object along the surface
 */
var ARReticle = function (_Mesh) {
  _inherits(ARReticle, _Mesh);

  /**
   * @param {VRDisplay} vrDisplay
   * @param {number} innerRadius
   * @param {number} outerRadius
   * @param {number} color
   * @param {number} easing
   */
  function ARReticle(vrDisplay) {
    var innerRadius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.02;
    var outerRadius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.05;
    var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0xff0077;
    var easing = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.25;

    _classCallCheck(this, ARReticle);

    var geometry = new _three.RingGeometry(innerRadius, outerRadius, 36, 64);
    var material = new _three.MeshBasicMaterial({ color: color });

    // Orient the geometry so it's position is flat on a horizontal surface
    geometry.applyMatrix(new _three.Matrix4().makeRotationX(_three.Math.degToRad(-90)));

    var _this = _possibleConstructorReturn(this, (ARReticle.__proto__ || Object.getPrototypeOf(ARReticle)).call(this, geometry, material));

    _this.visible = false;

    _this.easing = easing;
    _this.applyOrientation = true;
    _this.vrDisplay = vrDisplay;
    _this._planeDir = new _three.Vector3();
    return _this;
  }

  /**
   * Attempt to fire a raycast from normalized screen coordinates
   * x and y and lerp the reticle to the position.
   *
   * @param {number} x
   * @param {number} y
   */


  _createClass(ARReticle, [{
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
        (0, _ARUtils.placeObjectAtHit)(this, hit[0], this.applyOrientation, this.easing);
      }
    }
  }]);

  return ARReticle;
}(_three.Mesh);

exports.default = ARReticle;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright 2017 Google Inc. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under the Apache License, Version 2.0 (the 'License');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * distributed under the License is distributed on an 'AS IS' BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _ARUtils = __webpack_require__(1);

var _arview = __webpack_require__(12);

var _arview2 = _interopRequireDefault(_arview);

var _arview3 = __webpack_require__(13);

var _arview4 = _interopRequireDefault(_arview3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Creates and load a shader from a string, type specifies either 'vertex' or 'fragment'
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} str
 * @param {string} type
 * @return {!WebGLShader}
 */
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

/**
 * Creates a shader program from vertex and fragment shader sources
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} vs
 * @param {string} fs
 * @return {!WebGLProgram}
 */
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

/**
 * Calculate the correct orientation depending on the device and the camera
 * orientations.
 *
 * @param {number} screenOrientation
 * @param {number} seeThroughCameraOrientation
 * @return {number}
 */
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

/**
 * Renders the ar camera's video texture
 */

var ARVideoRenderer = function () {
  /**
   * @param {VRDisplay} vrDisplay
   * @param {WebGLRenderingContext} gl
   */
  function ARVideoRenderer(vrDisplay, gl) {
    _classCallCheck(this, ARVideoRenderer);

    this.vrDisplay = vrDisplay;
    this.gl = gl;
    if (this.vrDisplay) {
      this.passThroughCamera = vrDisplay.getPassThroughCamera();
      this.program = getProgram(gl, _arview2.default, _arview4.default);
    }

    gl.useProgram(this.program);

    // Setup a quad
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
    // Precalculate different texture UV coordinates depending on the possible
    // orientations of the device depending if there is a VRDisplay or not
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
    // Store the current combined orientation to check if it has changed
    // during the update calls and use the correct texture coordinates.
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

    // The projection matrix will be based on an identify orthographic camera
    this.projectionMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    this.mvMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    return this;
  }

  /**
   * Renders the quad
   */


  _createClass(ARVideoRenderer, [{
    key: 'render',
    value: function render() {
      var gl = this.gl;
      gl.useProgram(this.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
      gl.enableVertexAttribArray(this.vertexPositionAttribute);
      gl.vertexAttribPointer(this.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);

      // Check the current orientation of the device combined with the
      // orientation of the VRSeeThroughCamera to determine the correct UV
      // coordinates to be used.
      var combinedOrientation = combineOrientations(screen.orientation.angle, this.passThroughCamera.orientation);
      if (combinedOrientation !== this.combinedOrientation) {
        this.combinedOrientation = combinedOrientation;
        gl.bufferData(gl.ARRAY_BUFFER, this.f32TextureCoords[this.combinedOrientation], gl.STATIC_DRAW);
      }
      gl.enableVertexAttribArray(this.textureCoordAttribute);
      gl.vertexAttribPointer(this.textureCoordAttribute, this.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_EXTERNAL_OES, this.texture);
      // Update the content of the texture in every frame.
      gl.texImage2D(gl.TEXTURE_EXTERNAL_OES, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.passThroughCamera);
      gl.uniform1i(this.samplerUniform, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

      gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

      // Disable enabled states to allow other render calls to correctly work
      gl.bindTexture(gl.TEXTURE_EXTERNAL_OES, null);
      gl.disableVertexAttribArray(this.vertexPositionAttribute);
      gl.disableVertexAttribArray(this.textureCoordAttribute);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      gl.useProgram(null);
    }
  }]);

  return ARVideoRenderer;
}();

/**
 * A helper class that takes a VRDisplay with AR capabilities
 * and renders the see through camera to the passed in WebGLRenderer's
 * context.
 */


var ARView = function () {
  /**
   * @param {VRDisplay} vrDisplay
   * @param {THREE.WebGLRenderer} renderer
   */
  function ARView(vrDisplay, renderer) {
    _classCallCheck(this, ARView);

    this.vrDisplay = vrDisplay;
    if ((0, _ARUtils.isARKit)(this.vrDisplay)) {
      return;
    }
    this.renderer = renderer;
    this.gl = renderer.context;

    this.videoRenderer = new ARVideoRenderer(vrDisplay, this.gl);
    this._resetGLState();

    // Cache the width/height so we're not potentially forcing
    // a reflow if there's been a style invalidation
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  /**
   * Updates the stored width/height of window on resize.
   */


  _createClass(ARView, [{
    key: 'onWindowResize',
    value: function onWindowResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    }

    /**
     * Renders the see through camera to the passed in renderer
     */

  }, {
    key: 'render',
    value: function render() {
      if ((0, _ARUtils.isARKit)(this.vrDisplay)) {
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
      this._resetGLState();
    }

    /**
     * Resets the GL state in the THREE.WebGLRenderer.
     */

  }, {
    key: '_resetGLState',
    value: function _resetGLState() {
      if (typeof this.renderer.resetGLState === 'function') {
        // If using three.js <= r86
        this.renderer.resetGLState();
      } else {
        // If using three.js >= r87
        this.renderer.state.reset();
      }
    }
  }]);

  return ARView;
}();

exports.default = ARView;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = "#define GLSLIFY 1\n// Copyright 2017 Google Inc. All Rights Reserved.\n// Licensed under the Apache License, Version 2.0 (the 'License');\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n// http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an 'AS IS' BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n  gl_Position = vec4(aVertexPosition, 1.0);\n  vTextureCoord = aTextureCoord;\n}\n";

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = "// Copyright 2017 Google Inc. All Rights Reserved.\n// Licensed under the Apache License, Version 2.0 (the 'License');\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n// http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an 'AS IS' BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\n#extension GL_OES_EGL_image_external : require\n\nprecision mediump float;\n#define GLSLIFY 1\n\nvarying vec2 vTextureCoord;\n\nuniform samplerExternalOES uSampler;\n\nvoid main(void) {\n  gl_FragColor = texture2D(uSampler, vTextureCoord);\n}\n";

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable */
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
    var originalWebKitSpeechRecognition = window.webkitSpeechRecognition;
    window.webkitSpeechRecognition = function () {
      return window.webarSpeechRecognitionInstance;
    };
  }
})();

/***/ })
/******/ ]);
});

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

/***/ 13:
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

/***/ 14:
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

/***/ 15:
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

/***/ 16:
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\nuniform sampler2D tInput;\nuniform vec2 delta;\nuniform vec2 resolution;\n\nvoid main() {\n\n  vec4 sum = vec4( 0. );\n  vec2 inc = delta / resolution;\n\n  sum += texture2D( tInput, ( vUv - inc * 4. ) ) * 0.051;\n  sum += texture2D( tInput, ( vUv - inc * 3. ) ) * 0.0918;\n  sum += texture2D( tInput, ( vUv - inc * 2. ) ) * 0.12245;\n  sum += texture2D( tInput, ( vUv - inc * 1. ) ) * 0.1531;\n  sum += texture2D( tInput, ( vUv + inc * 0. ) ) * 0.1633;\n  sum += texture2D( tInput, ( vUv + inc * 1. ) ) * 0.1531;\n  sum += texture2D( tInput, ( vUv + inc * 2. ) ) * 0.12245;\n  sum += texture2D( tInput, ( vUv + inc * 3. ) ) * 0.0918;\n  sum += texture2D( tInput, ( vUv + inc * 4. ) ) * 0.051;\n\n  gl_FragColor = sum;\n\n}"

/***/ }),

/***/ 17:
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

/***/ 18:
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\nuniform sampler2D tInput;\nuniform sampler2D tInput2;\nuniform vec2 resolution;\nuniform vec2 resolution2;\nuniform float aspectRatio;\nuniform float aspectRatio2;\nuniform int mode;\nuniform int sizeMode;\nuniform float opacity;\n\nvec2 vUv2;\n\nfloat applyOverlayToChannel( float base, float blend ) {\n\n  return (base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend)));\n\n}\n\nfloat applySoftLightToChannel( float base, float blend ) {\n\n  return ((blend < 0.5) ? (2.0 * base * blend + base * base * (1.0 - 2.0 * blend)) : (sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend)));\n\n}\n\nfloat applyColorBurnToChannel( float base, float blend ) {\n\n  return ((blend == 0.0) ? blend : max((1.0 - ((1.0 - base) / blend)), 0.0));\n\n}\n\nfloat applyColorDodgeToChannel( float base, float blend ) {\n\n  return ((blend == 1.0) ? blend : min(base / (1.0 - blend), 1.0));\n\n}\n\nfloat applyLinearBurnToChannel( float base, float blend ) {\n\n  return max(base + blend - 1., 0.0 );\n\n}\n\nfloat applyLinearDodgeToChannel( float base, float blend ) {\n\n  return min( base + blend, 1. );\n\n}\n\nfloat applyLinearLightToChannel( float base, float blend ) {\n\n  return ( blend < .5 ) ? applyLinearBurnToChannel( base, 2. * blend ) : applyLinearDodgeToChannel( base, 2. * ( blend - .5 ) );\n\n}\n\nvoid main() {\n\n  vUv2 = vUv;\n  \n  if( sizeMode == 1 ) {\n    \n    if( aspectRatio2 > aspectRatio ) {\n      vUv2.x = vUv.x * aspectRatio / aspectRatio2;\n      vUv2.x += .5 * ( 1. - aspectRatio / aspectRatio2 ); \n      vUv2.y = vUv.y;\n    }\n\n    if( aspectRatio2 < aspectRatio ) {\n      vUv2.x = vUv.x;\n      vUv2.y = vUv.y * aspectRatio2 / aspectRatio;\n      vUv2.y += .5 * ( 1. - aspectRatio2 / aspectRatio );\n    }\n\n  }\n\n  vec4 base = texture2D( tInput, vUv );\n  vec4 blend = texture2D( tInput2, vUv2 );\n\n  if( mode == 1 ) { // normal\n\n    gl_FragColor = base;\n    gl_FragColor.a *= opacity;\n    return;\n\n  }\n\n  if( mode == 2 ) { // dissolve\n\n  }\n\n  if( mode == 3 ) { // darken\n\n    gl_FragColor = min( base, blend );\n    return;\n\n  }\n\n  if( mode == 4 ) { // multiply\n\n    gl_FragColor = base * blend;\n    return;\n\n  }\n\n  if( mode == 5 ) { // color burn\n\n    gl_FragColor = vec4(\n      applyColorBurnToChannel( base.r, blend.r ),\n      applyColorBurnToChannel( base.g, blend.g ),\n      applyColorBurnToChannel( base.b, blend.b ),\n      applyColorBurnToChannel( base.a, blend.a )\n    );\n    return;\n\n  }\n\n  if( mode == 6 ) { // linear burn\n\n    gl_FragColor = max(base + blend - 1.0, 0.0);\n    return;\n\n  }\n\n  if( mode == 7 ) { // darker color\n\n  }\n\n  if( mode == 8 ) { // lighten\n\n    gl_FragColor = max( base, blend );\n    return;\n\n  }\n\n  if( mode == 9 ) { // screen\n\n    gl_FragColor = (1.0 - ((1.0 - base) * (1.0 - blend)));\n    gl_FragColor = gl_FragColor * opacity + base * ( 1. - opacity );\n    return;\n\n  }\n\n  if( mode == 10 ) { // color dodge\n\n    gl_FragColor = vec4(\n      applyColorDodgeToChannel( base.r, blend.r ),\n      applyColorDodgeToChannel( base.g, blend.g ),\n      applyColorDodgeToChannel( base.b, blend.b ),\n      applyColorDodgeToChannel( base.a, blend.a )\n    );\n    return;\n\n  }\n\n  if( mode == 11 ) { // linear dodge\n\n    gl_FragColor = min(base + blend, 1.0);\n    return;\n\n  }\n\n  if( mode == 12 ) { // lighter color\n\n  }\n\n  if( mode == 13 ) { // overlay\n\n    gl_FragColor = gl_FragColor = vec4( \n      applyOverlayToChannel( base.r, blend.r ),\n      applyOverlayToChannel( base.g, blend.g ),\n      applyOverlayToChannel( base.b, blend.b ),\n      applyOverlayToChannel( base.a, blend.a )\n    );\n    gl_FragColor = gl_FragColor * opacity + base * ( 1. - opacity );\n  \n    return;\n\n  }\n\n  if( mode == 14 ) { // soft light\n\n    gl_FragColor = vec4( \n      applySoftLightToChannel( base.r, blend.r ),\n      applySoftLightToChannel( base.g, blend.g ),\n      applySoftLightToChannel( base.b, blend.b ),\n      applySoftLightToChannel( base.a, blend.a )\n    );\n    return;\n\n  }\n\n  if( mode == 15 ) { // hard light\n\n    gl_FragColor = vec4( \n      applyOverlayToChannel( base.r, blend.r ),\n      applyOverlayToChannel( base.g, blend.g ),\n      applyOverlayToChannel( base.b, blend.b ),\n      applyOverlayToChannel( base.a, blend.a )\n    );\n    gl_FragColor = gl_FragColor * opacity + base * ( 1. - opacity );\n    return;\n\n  }\n\n  if( mode == 16 ) { // vivid light\n\n  }\n\n  if( mode == 17 ) { // linear light\n\n    gl_FragColor = vec4( \n      applyLinearLightToChannel( base.r, blend.r ),\n      applyLinearLightToChannel( base.g, blend.g ),\n      applyLinearLightToChannel( base.b, blend.b ),\n      applyLinearLightToChannel( base.a, blend.a )\n    );\n    return;\n\n  }\n\n  if( mode == 18 ) { // pin light\n\n  }\n\n  if( mode == 19 ) { // hard mix\n\n  }\n\n  if( mode == 20 ) { // difference\n\n    gl_FragColor = abs( base - blend );\n    gl_FragColor.a = base.a + blend.b;\n    return;\n\n  }\n\n  if( mode == 21 ) { // exclusion\n\n    gl_FragColor = base + blend - 2. * base * blend;\n    \n  }\n\n  if( mode == 22 ) { // substract\n\n  }\n\n  if( mode == 23 ) { // divide\n\n  }\n\n  gl_FragColor = vec4( 1., 0., 1., 1. );\n\n}"

/***/ }),

/***/ 19:
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

/***/ 2:
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n}"

/***/ }),

/***/ 20:
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nuniform sampler2D tInput;\nuniform vec2 center;\nuniform float strength;\nuniform vec2 resolution;\nvarying vec2 vUv;\n\nfloat random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}\n\nvoid main(){\n  vec4 color=vec4(0.0);\n  float total=0.0;\n  vec2 toCenter=center-vUv*resolution;\n  float offset=random(vec3(12.9898,78.233,151.7182),0.0);\n  for(float t=0.0;t<=40.0;t++){\n    float percent=(t+offset)/40.0;\n    float weight=4.0*(percent-percent*percent);\n    vec4 sample=texture2D(tInput,vUv+toCenter*percent*strength/resolution);\n    sample.rgb*=sample.a;\n    color+=sample*weight;\n    total+=weight;\n  }\n  gl_FragColor=color/total;\n  gl_FragColor.rgb/=gl_FragColor.a+0.00001;\n}"

/***/ }),

/***/ 21:
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

/***/ 22:
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nuniform float brightness;\nuniform float contrast;\nuniform sampler2D tInput;\n\nvarying vec2 vUv;\n\nvoid main() {\n\n  vec3 color = texture2D(tInput, vUv).rgb;\n  vec3 colorContrasted = (color) * contrast;\n  vec3 bright = colorContrasted + vec3(brightness,brightness,brightness);\n  gl_FragColor.rgb = bright;\n  gl_FragColor.a = 1.;\n\n}"

/***/ }),

/***/ 24:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_24__;

/***/ }),

/***/ 27:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Pass = __webpack_require__(1);
var vertex = __webpack_require__(2);
var fragment = __webpack_require__(28);

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

/***/ 28:
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