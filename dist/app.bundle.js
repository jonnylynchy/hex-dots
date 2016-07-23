/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _AlottaDotties = __webpack_require__(1);

	var _AlottaDotties2 = _interopRequireDefault(_AlottaDotties);

	__webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var game = new _AlottaDotties2.default();
	game.attachEvents();

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
		Author: Jon Lynch (http://www.thejonlynch.com)
		Original Created Date: 	7/22/2016

		Description:
		This is just a fun little experiment with ES6, CSS & Canvas.
		No frameworks are currently used. Just vanilla js.
		It's a work in progress and I realize there's a lot of crap in the JS below.
		Feel free to fork and pitch in!

		Inspired by dots! (ios and android game)

		TODO:
		- Add: nice webfont
		- Add: better messaging
		- Add: animated lines
		- Add: exception/error handling
		- Add: target score, keep adding dots until score is reached
		- Add: timer option (game is over when time is up)
		- Add: reset button
		- Add: game over message
		- Adjust: dots on page to be evenly distributed filling entire stage
		- Adjust: disable the ability to connect dots that are not adjacent
		- Refactor: break up configuration, sounds, etc. into modules and import them.
		- Refactor: attaching events (serparate into method calls)
		- Ultra-Awesome: Port this into a react app. Rendering via virtual dom would be super fast.
	*/
	var AlottaDotties = function () {
	    function AlottaDotties() {
	        _classCallCheck(this, AlottaDotties);

	        this.messageDiv = document.querySelector(".message");
	        this.scoreDiv = document.querySelector(".score");
	        this.colors = ['yellow', 'red', 'green', 'blue', 'purple'];
	        this.dotDivs = [];
	        this.stage = document.querySelector(".stage");
	        this.stage.draggable = false;
	        this.dots = Math.floor(this.stage.clientWidth * this.stage.clientHeight / (60 * 60) * 2);
	        this.totalDots = 0;
	        this.score = 0;
	        this.mouseIsDown = false;
	        this.targetGroup = [];
	        this.lineGroup = [];

	        this.messages = {
	            successMessage: "Aww yayuh boyee!",
	            errorMessage: "Hey, you can't do that silly!",
	            squareMessage: "Great Job!"
	        };
	        this.sounds = {
	            successSound: 'https://www.freesound.org/data/previews/317/317480_4766646-lq.mp3',
	            errorSound: 'https://www.freesound.org/data/previews/344/344687_6211528-lq.mp3',
	            squareSound: 'https://www.freesound.org/data/previews/213/213659_862453-lq.mp3'
	        };

	        this.audio = new Audio();
	        this.audio.src = this.sounds.successSound;
	        this.audio.load();

	        while (this.dots) {
	            var dot = document.createElement('div');
	            var colorIdx = Math.ceil(Math.random() * this.colors.length - 1);
	            var color = this.colors[colorIdx];
	            dot.className = 'dot ' + color;
	            dot.draggable = false;
	            this.stage.appendChild(dot);
	            this.dotDivs.push(dot);
	            this.dots--;
	        }

	        this.canvas = this.createCanvas();
	    }

	    _createClass(AlottaDotties, [{
	        key: "createCanvas",
	        value: function createCanvas() {
	            var canvas = document.createElement('canvas'),
	                ctx = canvas.getContext('2d');

	            canvas.width = this.stage.clientWidth;
	            canvas.height = this.stage.clientHeight;
	            this.stage.appendChild(canvas);

	            return {
	                ctx: ctx,
	                canvas: canvas
	            };
	        }
	    }, {
	        key: "updateScore",
	        value: function updateScore(num) {
	            this.score += num;
	            this.scoreDiv.innerHTML = this.score;
	        }
	    }, {
	        key: "setSoundsStop",
	        value: function setSoundsStop(time) {
	            setTimeout(function () {
	                this.stopSounds();
	            }.bind(this), time);
	        }
	    }, {
	        key: "stopSounds",
	        value: function stopSounds() {
	            this.audio.pause();
	            this.audio.currentTime = 0;
	        }
	    }, {
	        key: "playSound",
	        value: function playSound(sound, time) {
	            var stopTime = arguments.length <= 2 || arguments[2] === undefined ? 500 : arguments[2];

	            this.audio.src = sound;
	            this.audio.load();
	            this.audio.currentTime = time;
	            this.audio.play();
	            this.setSoundsStop(stopTime);
	        }
	    }, {
	        key: "startDrawLine",
	        value: function startDrawLine(x, y, color) {
	            this.canvas.ctx.beginPath();
	            this.canvas.ctx.moveTo(x, y);
	            this.canvas.ctx.lineWidth = 4;
	            this.canvas.ctx.strokeStyle = color;
	        }
	    }, {
	        key: "completeLine",
	        value: function completeLine(x, y) {
	            this.canvas.ctx.lineTo(x, y);
	            this.canvas.ctx.stroke();
	        }
	    }, {
	        key: "clearLines",
	        value: function clearLines() {
	            this.canvas.ctx.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
	        }
	    }, {
	        key: "attachEvents",
	        value: function attachEvents() {
	            this.stage.addEventListener('mouseup', function (e) {
	                if (this.targetGroup.length > 1 && this.mouseIsDown && this.areDotsTheSame(this.targetGroup)) {
	                    var msg = this.messages.successMessage,
	                        num = this.targetGroup.length;

	                    var isSquare = this.doDotsFormSquare(this.targetGroup),
	                        squareColor = this.targetGroup[0].className.substring(4);

	                    // Update Score
	                    this.updateScore(num);

	                    // Remove connected dots
	                    this.targetGroup.forEach(function (removeMe) {
	                        this.stage.removeChild(removeMe);
	                    }.bind(this));

	                    // Show messasge, if square, remove all of color
	                    if (!isSquare) {
	                        this.messageDiv.innerHTML = msg + ' You got ' + num + ' dotties!';
	                        this.playSound(this.sounds.successSound, 1);
	                    } else {
	                        this.messageDiv.innerHTML = this.messages.squareMessage;
	                        this.playSound(this.sounds.squareSound, 0, 1500);
	                        this.removeColor(squareColor);
	                    }
	                } else {
	                    this.messageDiv.innerHTML = this.messages.errorMessage;
	                    this.playSound(this.sounds.errorSound, 0);
	                }
	                this.clearLines();
	                this.targetGroup = [];
	                this.mouseIsDown = false;
	            }.bind(this));

	            this.dotDivs.forEach(function (dot) {
	                dot.addEventListener('mousedown', function (e) {
	                    var y = e.target.offsetTop + 10,
	                        x = e.target.offsetLeft + 10,
	                        computedStyle = getComputedStyle(e.target, null),
	                        color = computedStyle.backgroundColor;

	                    this.mouseIsDown = true;
	                    this.targetGroup.push(e.target);
	                    e.preventDefault();
	                    this.startDrawLine(x, y, color);
	                }.bind(this), false);
	                dot.addEventListener('mouseenter', function (e) {
	                    if (this.mouseIsDown) {
	                        var y = e.target.offsetTop + 10,
	                            x = e.target.offsetLeft + 10;

	                        if (!this.targetGroup.includes(e.target)) {
	                            this.targetGroup.push(e.target);
	                        }

	                        this.completeLine(x, y);
	                    }
	                    e.preventDefault();
	                }.bind(this), false);
	            }.bind(this));
	        }
	    }, {
	        key: "removeColor",
	        value: function removeColor(color) {
	            var dotsOfColor = document.querySelectorAll('.' + color);

	            // Update Score and remove dots
	            this.updateScore(dotsOfColor.length);

	            dotsOfColor.forEach(function (dot) {
	                this.stage.removeChild(dot);
	            }.bind(this));
	        }
	    }, {
	        key: "areDotsTheSame",
	        value: function areDotsTheSame(dots) {
	            var dotColors = dots.reduce(function (dotClasses, dot) {
	                dotClasses.push(dot.className.substring(4));
	                return dotClasses;
	            }, []);

	            return !!dotColors.reduce(function (a, b) {
	                return a === b ? a : NaN;
	            });
	        }
	    }, {
	        key: "doDotsFormSquare",
	        value: function doDotsFormSquare(dots) {
	            if (dots.length !== 4) return false;

	            var vectorArray = dots.map(function (dot) {
	                return {
	                    top: dot.offsetTop,
	                    left: dot.offsetLeft
	                };
	            });

	            var a = vectorArray[0],
	                b = vectorArray[1],
	                c = vectorArray[2],
	                d = vectorArray[3];

	            return this.isRectangleAnyOrder(a, b, c, d);
	        }

	        // tests if angle abc is a right angle

	    }, {
	        key: "isOrthogonal",
	        value: function isOrthogonal(a, b, c) {
	            return (b.left - a.left) * (b.left - c.left) + (b.top - a.top) * (b.top - c.top) === 0;
	        }
	    }, {
	        key: "isRectangle",
	        value: function isRectangle(a, b, c, d) {
	            return this.isOrthogonal(a, b, c) && this.isOrthogonal(b, c, d) && this.isOrthogonal(c, d, a);
	        }
	    }, {
	        key: "isRectangleAnyOrder",
	        value: function isRectangleAnyOrder(a, b, c, d) {
	            return this.isRectangle(a, b, c, d) || this.isRectangle(b, c, a, d) || this.isRectangle(c, a, b, d);
	        }
	    }]);

	    return AlottaDotties;
	}();

	exports.default = AlottaDotties;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./main.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./main.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "html, body {\n  height: 100%;\n  font-family: arial, verdana, sans-serif;\n  padding: 0;\n  margin: 0; }\n\nheader {\n  background: #333;\n  color: #e5e5e5; }\n\n.message {\n  padding: 25px;\n  text-align: center;\n  font-size: 25px; }\n\n.score {\n  float: left;\n  background: #fff;\n  color: #333;\n  padding: 25px;\n  font-size: 25px; }\n\n.stage {\n  width: 50%;\n  min-height: 80%;\n  background: #fff;\n  margin: 20px auto;\n  position: relative; }\n\n.dot {\n  width: 20px;\n  height: 20px;\n  -moz-border-radius: 50%;\n  -webkit-border-radius: 50%;\n  border-radius: 50%;\n  margin: 10px;\n  display: inline-block;\n  background: #e5e5e5;\n  z-index: 1;\n  position: relative; }\n  .dot:active {\n    transform: scale(1.2, 1.2); }\n  .dot:hover {\n    animation: pulsate 1s ease-out;\n    animation-iteration-count: infinite; }\n  .dot.marked {\n    border: 1px solid #888; }\n\ncanvas {\n  position: absolute;\n  z-index: 0;\n  background: #fff;\n  top: 0;\n  left: 0; }\n\n.yellow {\n  background: #ffcf63; }\n\n.red {\n  background: #ec4c5d; }\n\n.green {\n  background: #7ac29c; }\n\n.blue {\n  background: #6f8cc1; }\n\n.purple {\n  background: #a7537d; }\n\n@keyframes pulsate {\n  0% {\n    opacity: 0.3; }\n  50% {\n    opacity: 1.0; }\n  100% {\n    opacity: 0.3; } }\n", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);