(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("three"), require("tween"));
	else if(typeof define === 'function' && define.amd)
		define(["three", "tween"], factory);
	else if(typeof exports === 'object')
		exports["app"] = factory(require("three"), require("tween"));
	else
		root["app"] = factory(root["THREE"], root["TWEEN"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_25__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 114);
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

/***/ 114:
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

var _frag = __webpack_require__(115);

var _frag2 = _interopRequireDefault(_frag);

var _vert = __webpack_require__(116);

var _vert2 = _interopRequireDefault(_vert);

var _BarycentricMaterial = __webpack_require__(26);

var _BarycentricMaterial2 = _interopRequireDefault(_BarycentricMaterial);

var _tween = __webpack_require__(25);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EASING = _tween.Easing.Quartic.InOut;
var CHANGE_RATE = 5000;
var ANIMATION = 4000;
var TEXT = 'thirtydays';
var SIZE = 30;
var ALPHA = 0.7;
var NOISE_MOD = 0.008;
var POS_DAMPEN = 0.4;
var SCALE = 0.02;
var FONT_DEPTH = 5;
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

      this.renderer.setClearColor(0x111111);
      this.loader = new _three.FontLoader();
      this.loader.load(FONT_PATH, function (font) {
        _this2.font = font;
        _this2.textGeometry = [];
        var largestVertexCount = -Infinity;
        for (var i = 0; i < TEXT.length; i++) {
          var letter = TEXT[i];
          var geo = new _three.TextGeometry(letter, {
            font: _this2.font,
            size: 10,
            height: 2,
            curveSegments: 5,
            bevelThickness: 1.5,
            bevelSegments: 1,
            bevelEnabled: true
          });
          largestVertexCount = Math.max(geo.vertices.length, largestVertexCount);
          _this2.textGeometry.push(geo);
        }

        // Debugging
        console.log(_this2.textGeometry.reduce(function (data, geo, i) {
          data[TEXT[i]] = geo.vertices.length;
          return data;
        }, {}));

        _this2.geometry = new _three.Geometry();
        for (var _i = 0; _i < largestVertexCount; _i++) {
          _this2.geometry.vertices.push(new _three.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1));
        }

        for (var _i2 = 0; _i2 < _this2.textGeometry.length; _i2++) {
          var _geo = _this2.textGeometry[_i2];
          var morph = [];
          for (var v = 0; v < _this2.geometry.vertices.length; v++) {
            var vec = void 0;
            if (v >= _geo.vertices.length) {
              var index = Math.floor(Math.random() * _geo.vertices.length);
              vec = _geo.vertices[index];
            } else {
              vec = _geo.vertices[v];
            }
            vec = new _three.Vector3().copy(vec);
            // center the geo
            vec.x -= 4;
            vec.y -= 2.6;
            morph.push(new _three.Vector3().copy(vec));
          }
          _this2.geometry.morphTargets.push({ name: _i2, vertices: morph });
        }

        // Use first letter for initial geo
        for (var _i3 = 0; _i3 < _this2.geometry.morphTargets[0].vertices.length; _i3++) {
          var vert = _this2.geometry.morphTargets[0].vertices[_i3];
          _this2.geometry.vertices[_i3].copy(vert);
        }

        _this2.material = new _three.ShaderMaterial({
          uniforms: {
            size: { value: SIZE },
            alpha: { value: ALPHA },
            time: { value: 0 },
            alphaMap: { value: null },
            dpr: { value: window.devicePixelRatio },
            noiseMod: { value: NOISE_MOD },
            posDampen: { value: POS_DAMPEN }
          },
          vertexShader: _vert2.default,
          fragmentShader: _frag2.default,
          transparent: true,
          depthWrite: false
        });

        _this2.textureLoader = new _three.TextureLoader();
        _this2.textureLoader.load('../assets/particle.jpg', function (texture) {
          _this2.material.uniforms.alphaMap.value = texture;
        });

        _this2.points = new _three.Points(_this2.geometry, _this2.material);
        //this.points.position.set(-0.3, -0.3, 0);
        _this2.scene.add(_this2.points);
      });

      this.pivot = new _three.Object3D();
      this.pivot.add(this.camera);
      this.scene.add(this.pivot);
      this.camera.position.set(0, 0, 20);
      this.renderer.render(this.scene, this.camera);
      this.composer = new _wagner2.default.Composer(this.renderer);
      this.pass = new _MultiPassBloomPass2.default({
        zoomBlurStrength: 0.5,
        applyZoomBlur: true,
        blurAmount: 2
      });
      this._lastChange = -1000;
      this._currentIndex = 0;
    }
  }, {
    key: 'update',
    value: function update(t, delta) {
      var _this3 = this;

      if (!this.material) {
        return;
      }
      (0, _tween.update)();
      this.material.uniforms.time.value = t * 0.001;

      if (t > CHANGE_RATE + this._lastChange) {
        this._lastChange = t;
        var from = this._currentIndex;
        var to = this._currentIndex = (this._currentIndex + 1) % TEXT.length;
        new _tween.Tween({ x: 0 }).to({ x: 1 }, ANIMATION).onUpdate(function (val) {
          var verts = _this3.geometry.vertices;
          var fromVerts = _this3.geometry.morphTargets[from].vertices;
          var toVerts = _this3.geometry.morphTargets[to].vertices;
          for (var i = 0; i < verts.length; i++) {
            verts[i].lerpVectors(fromVerts[i], toVerts[i], val);
          }
          _this3.geometry.verticesNeedUpdate = true;
        }).easing(EASING).start();
      }
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

/***/ 115:
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nuniform float time;\nuniform float alpha;\nuniform sampler2D alphaMap;\n\nvarying vec3 vPosition;\nvarying float vNoise;\nvarying float vHue;\nfloat map_1_0(float value, float inMin, float inMax, float outMin, float outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec2 map_1_0(vec2 value, vec2 inMin, vec2 inMax, vec2 outMin, vec2 outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec3 map_1_0(vec3 value, vec3 inMin, vec3 inMax, vec3 outMin, vec3 outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec4 map_1_0(vec4 value, vec4 inMin, vec4 inMax, vec4 outMin, vec4 outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\n\n\nfloat hue2rgb_2_1(float f1, float f2, float hue) {\n    if (hue < 0.0)\n        hue += 1.0;\n    else if (hue > 1.0)\n        hue -= 1.0;\n    float res;\n    if ((6.0 * hue) < 1.0)\n        res = f1 + (f2 - f1) * 6.0 * hue;\n    else if ((2.0 * hue) < 1.0)\n        res = f2;\n    else if ((3.0 * hue) < 2.0)\n        res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;\n    else\n        res = f1;\n    return res;\n}\n\nvec3 hsl2rgb_2_2(vec3 hsl) {\n    vec3 rgb;\n    \n    if (hsl.y == 0.0) {\n        rgb = vec3(hsl.z); // Luminance\n    } else {\n        float f2;\n        \n        if (hsl.z < 0.5)\n            f2 = hsl.z * (1.0 + hsl.y);\n        else\n            f2 = hsl.z + hsl.y - hsl.y * hsl.z;\n            \n        float f1 = 2.0 * hsl.z - f2;\n        \n        rgb.r = hue2rgb_2_1(f1, f2, hsl.x + (1.0/3.0));\n        rgb.g = hue2rgb_2_1(f1, f2, hsl.x);\n        rgb.b = hue2rgb_2_1(f1, f2, hsl.x - (1.0/3.0));\n    }   \n    return rgb;\n}\n\nvec3 hsl2rgb_2_2(float h, float s, float l) {\n    return hsl2rgb_2_2(vec3(h, s, l));\n}\n\n\n\nvoid main() {\n  float pAlpha = smoothstep(0.1, 0.9, texture2D(alphaMap, gl_PointCoord).r);\n  gl_FragColor = vec4(vec3(0.5), alpha * pAlpha);\n}\n"

/***/ }),

/***/ 116:
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nuniform float time;\nuniform float size;\nuniform float dpr;\nuniform float noiseMod;\nuniform float posDampen;\nuniform float maxDistance;\nvarying vec3 vPosition;\nvarying float vNoise;\nvarying float vHue;\n//\n// GLSL textureless classic 3D noise \"cnoise\",\n// with an RSL-style periodic variant \"pnoise\".\n// Author:  Stefan Gustavson (stefan.gustavson@liu.se)\n// Version: 2011-10-11\n//\n// Many thanks to Ian McEwan of Ashima Arts for the\n// ideas for permutation and gradient selection.\n//\n// Copyright (c) 2011 Stefan Gustavson. All rights reserved.\n// Distributed under the MIT license. See LICENSE file.\n// https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289_1_0(vec3 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289_1_0(vec4 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute_1_1(vec4 x)\n{\n  return mod289_1_0(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt_1_2(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec3 fade_1_3(vec3 t) {\n  return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n\n// Classic Perlin noise\nfloat cnoise_1_4(vec3 P)\n{\n  vec3 Pi0 = floor(P); // Integer part for indexing\n  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1\n  Pi0 = mod289_1_0(Pi0);\n  Pi1 = mod289_1_0(Pi1);\n  vec3 Pf0 = fract(P); // Fractional part for interpolation\n  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n  vec4 iy = vec4(Pi0.yy, Pi1.yy);\n  vec4 iz0 = Pi0.zzzz;\n  vec4 iz1 = Pi1.zzzz;\n\n  vec4 ixy = permute_1_1(permute_1_1(ix) + iy);\n  vec4 ixy0 = permute_1_1(ixy + iz0);\n  vec4 ixy1 = permute_1_1(ixy + iz1);\n\n  vec4 gx0 = ixy0 * (1.0 / 7.0);\n  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n  gx0 = fract(gx0);\n  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n  vec4 sz0 = step(gz0, vec4(0.0));\n  gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n  gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n  vec4 gx1 = ixy1 * (1.0 / 7.0);\n  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n  gx1 = fract(gx1);\n  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n  vec4 sz1 = step(gz1, vec4(0.0));\n  gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n  gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n  vec4 norm0 = taylorInvSqrt_1_2(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n  g000 *= norm0.x;\n  g010 *= norm0.y;\n  g100 *= norm0.z;\n  g110 *= norm0.w;\n  vec4 norm1 = taylorInvSqrt_1_2(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n  g001 *= norm1.x;\n  g011 *= norm1.y;\n  g101 *= norm1.z;\n  g111 *= norm1.w;\n\n  float n000 = dot(g000, Pf0);\n  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n  float n111 = dot(g111, Pf1);\n\n  vec3 fade_xyz = fade_1_3(Pf0);\n  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n  return 2.2 * n_xyz;\n}\n\n\n\nfloat quadraticOut_2_5(float t) {\n  return -t * (t - 2.0);\n}\n\n\n\n\nconst float MIN_POINTSIZE = 1.0;\nconst float MAX_DISTANCE = 5.0;\nconst float IDEAL_DISTANCE = 7.0;\nvoid main() {\n  float t = time + 20.0;\n  vNoise = cnoise_1_4(noiseMod * t * vec3(position.x, position.y, 3.0 * position.z+100.0) * 0.5 + 0.5);\n  vPosition = position + (vec3(-position.x, -position.y, 0.0) * vNoise * posDampen);\n  if (vPosition.z > 0.2) {\n    vPosition.z = 0.0;\n  }\n\n  float cameraDist = distance(vPosition, cameraPosition);\n  float d = length(vPosition);\n  if (d < IDEAL_DISTANCE) {\n    gl_PointSize = size - (3.0 * d);\n  } else {\n    gl_PointSize = size * (1.0 / (d - IDEAL_DISTANCE));\n  }\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);\n}\n"

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

/***/ 25:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_25__;

/***/ }),

/***/ 26:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _three = __webpack_require__(0);

var _barycentricVert = __webpack_require__(27);

var _barycentricVert2 = _interopRequireDefault(_barycentricVert);

var _barycentricFrag = __webpack_require__(28);

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

/***/ 27:
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nattribute vec2 barycentric;\n\nvarying vec2 vBC;\n\nvoid main() {\n  vBC = barycentric;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n"

/***/ }),

/***/ 28:
/***/ (function(module, exports) {

module.exports = "#extension GL_OES_standard_derivatives : enable\n\nprecision highp float;\nprecision highp int;\n#define GLSLIFY 1\n\nuniform float width;\nuniform vec3 color;\nuniform float alpha;\nuniform vec3 wireframeColor;\nuniform float wireframeAlpha;\nvarying vec2 vBC;\n\nfloat gridFactor (vec2 vBC, float w) {\n  vec3 bary = vec3(vBC.x, vBC.y, 1.0 - vBC.x - vBC.y);\n  vec3 d = fwidth(bary);\n  vec3 a3 = smoothstep(d * (w - 0.5), d * (w + 0.5), bary);\n  return min(min(a3.x, a3.y), a3.z);\n}\n\nvoid main() {\n  float factor = gridFactor(vBC, width);\n  vec3 color = mix(wireframeColor, color, factor);\n  float a = mix(wireframeAlpha, alpha, factor);\n  gl_FragColor = vec4(color, a);\n}\n"

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