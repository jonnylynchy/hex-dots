var alertify = require('alertify.js');

export default class AlottaDotties {
    constructor() {
        this.init();
    }

	init(){
        this.scoreDiv = document.querySelector(".score");
		this.stage = document.querySelector(".stage");
        this.colors = ['yellow', 'red', 'green', 'blue', 'purple'];
        this.dotDivs = [];
		this.dotSize = 25;
		this.dotPadding = 20;
        this.stage.draggable = false;
		this.stage.style.width = (window.innerWidth / 100) * 75 + 'px';
		this.stage.style.height = (window.innerHeight / 100) * 70  + 'px';

        this.totalDots = 0;
        this.score = 0;
		this.mouseIsDown = false;
		this.touchIsDown = false;
        this.targetGroup = [];
        this.lineGroup = [];

		// Touch Events
		this.touchStartX = 0;
		this.touchStartY = 0;

        this.messages = {
			startupMessages: [
				"Would you like to play a game?",
				"Click and drag a hex dot to connect to other hex dots of the same color.",
				"You can chain hex dots together for extra points.",
				"If you connect 4 as a square, all dots of the same color will vanish!",
				"Ready? Go!"
			],
            successMessage: "Nice.",
            errorMessage: "Hey, you can't do that.",
            squareMessage: "Great Job. You cleared a color."
        }

        this.sounds = {
            successSound: 'https://www.freesound.org/data/previews/317/317480_4766646-lq.mp3',
            errorSound: 'https://www.freesound.org/data/previews/344/344687_6211528-lq.mp3',
			squareSound: 'https://www.freesound.org/data/previews/213/213659_862453-lq.mp3'
		}

        this.audio = new Audio();
        this.audio.src = this.sounds.successSound;
        this.audio.load();

		this.addDotsToStage();

        this.canvas = this.createCanvas();
		this.attachEvents();
		// TODO: add mobile check here (or better include mobile module if mobile);
		this.attachMobileEvents();
	}

    createCanvas() {
        const canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');

        canvas.width = this.stage.clientWidth;
        canvas.height = this.stage.clientHeight;
        this.stage.appendChild(canvas);

        return {
            ctx: ctx,
            canvas: canvas
        };
    }

	addDotsToStage(){
		// Grid (Columns * Rows)
		let dotPixels = this.dotSize + this.dotPadding + 10;
		let columns = Math.floor(this.stage.clientWidth/dotPixels);
		let rows = Math.floor(this.stage.clientHeight/dotPixels);

		let position = {top: 0, left: 0};

		while (rows) {
			let colNum = columns;
			while (colNum > 0) {
				this.addDot(position);
				position.left += dotPixels;
				colNum--;
			}

			position.left = 0;
			position.top += dotPixels;
			rows--;
        }

		this.showStartUpMessages();
	}

    updateScore(num) {
        this.score += num;
        this.scoreDiv.innerHTML = this.score;
    }

    setSoundsStop(time) {
        setTimeout(function soundTimeout() {
            this.stopSounds()
        }.bind(this), time);
    }

    stopSounds() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

	playSound(sound, time, stopTime = 500){
		this.audio.src = sound;
		this.audio.load();
        this.audio.currentTime = time;
        this.audio.play();
        this.setSoundsStop(stopTime);
	}

    startDrawLine(x, y, color) {
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x, y);
        this.canvas.ctx.lineWidth = 4;
        this.canvas.ctx.strokeStyle = color;
    }

    completeLine(x, y) {
        this.canvas.ctx.lineTo(x, y);
        this.canvas.ctx.stroke();
    }

    clearLines() {
        this.canvas.ctx.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
    }

	showMessage(message, delay){
		alertify.logPosition("top left");
		alertify.delay(delay);
		alertify.log(message);
	}

	showSuccessMessage(message){
		alertify.logPosition("top left");
		alertify.success(message);
	}

	showErrorMessage(message){
		alertify.logPosition("top right");
		alertify.error(message);
	}

	showStartUpMessages(){
		let messages = this.messages.startupMessages,
			messageDelay = 3500,
			showDelay = 0;

		alertify.logPosition("top left");
		messages.forEach(function(message){
			setTimeout(
				function showStartUpMessage(){
					this.showMessage(message, messageDelay);
				}.bind(this),
				showDelay
			);
			showDelay += messageDelay;
		}.bind(this));
	}

	attachMobileEvents() {

		this.stage.addEventListener('touchmove',
			function dotTouchMove(e) {
				//console.log('mobile touch move');
				let currentX = e.changedTouches[0].clientX;
				let currentY = e.changedTouches[0].clientY;
				// deltaX = e.changedTouches[0].clientX - clientX;
				// deltaY = e.changedTouches[0].clientY - clientY;
				//console.log(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
				if(this.touchIsDown){
					this.clearLines();
					this.startDrawLine(this.touchStartX, this.touchStartY, this.currentDotColor);
					this.completeLine(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
				}
				e.preventDefault();
			}.bind(this),
		false);
	}
	addDotMobileEvents(dot){
		// Mobile Test
		dot.addEventListener('touchenter',
			function dotTouchEnter(e) {
				console.log('mobile touch enter');
				e.preventDefault();
			}.bind(this),
		false);

		dot.addEventListener('touchstart',
			function dotTouchStart(e) {
				console.log('mobile touch start-------------');
				console.log(e.touches[0].clientX, e.touches[0].clientY);
				let	computedStyle = getComputedStyle(e.target, null);

				this.currentDotColor = computedStyle.color;
				this.currentY = e.touches[0].clientY;
				this.currentX = e.touches[0].clientX;
				this.touchIsDown = true;
				this.targetGroup.push(e.target);

				e.preventDefault();
			}.bind(this),
		false);

		dot.addEventListener('touchend',
			function dotTouchEnd(e) {
				console.log('mobile touch end');
				console.log('--------------------')
				console.log(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
				this.touchIsDown = false;
				e.preventDefault();
			}.bind(this),
		false);

		// dot.addEventListener('mouseover',
		// 	function dotTouchEnd(e) {
		// 		console.log('mobile mouse over');
		// 		e.preventDefault();
		// 	}.bind(this),
		// false);
		//
		// dot.addEventListener('mouseout',
		// 	function dotTouchEnd(e) {
		// 		console.log('mobile mouse out');
		// 		e.preventDefault();
		// 	}.bind(this),
		// false);
		// end mobile test
	}

    attachEvents() {
        this.stage.addEventListener('mouseup', function stageMouseUp(e) {
            if (this.targetGroup.length > 1 && this.mouseIsDown && this.areDotsTheSame(this.targetGroup)) {
                let msg = this.messages.successMessage,
                    num = this.targetGroup.length;

                let isSquare = this.doDotsFormSquare(this.targetGroup),
                    squareColor = this.targetGroup[0].className.substring(4);

                // Update Score
                this.updateScore(num);

                // Remove connected dots
                this.targetGroup.forEach(function removeConnectedDots(removeMe) {
                    this.removeDot(removeMe);
                }.bind(this));

                // Show messasge, if square, remove all of color
                if (!isSquare) {
					let success = msg + ' You got ' + num + ' hex dots!'
					this.showSuccessMessage(success);
					this.playSound(this.sounds.successSound, 1);
                } else {
					this.showSuccessMessage(this.messages.squareMessage);
					this.playSound(this.sounds.squareSound, 0, 1500);
					this.removeColor(squareColor);
                }

            } else {
				this.showErrorMessage(this.messages.errorMessage);
                this.playSound(this.sounds.errorSound, 0);
            }
            this.clearLines();
            this.targetGroup = [];
            this.mouseIsDown = false;
        }.bind(this));
    }

	removeDot(dot) {
		let position = {
				top: parseInt(dot.style.top, 10),
				left: parseInt(dot.style.left, 10)
			},
			dotIndex = this.dotDivs.indexOf(dot);


		this.stage.removeChild(dot);
		this.dotDivs.splice(dotIndex, 1);

		this.addDot(position);
	}

	addDotEvents(dot){
		dot.addEventListener('mousedown',
			function dotMouseDown(e) {
				let y = e.target.offsetTop + this.dotSize/2,
					x = e.target.offsetLeft + this.dotSize/2,
					computedStyle = getComputedStyle(e.target, null),
					color = computedStyle.color,
					textAdjustment = 4;

				this.mouseIsDown = true;
				this.targetGroup.push(e.target);
				e.preventDefault();
				this.startDrawLine(x + textAdjustment, y-1, color);

			}.bind(this),
			false);
		dot.addEventListener('mouseenter',
			function dotMouseEnter(e) {
				if (this.mouseIsDown) {
					let y = e.target.offsetTop + this.dotSize/2,
						x = e.target.offsetLeft + this.dotSize/2,
						lastDot = this.targetGroup[this.targetGroup.length-1],
						fullDot = Math.floor(this.dotSize + this.dotPadding),
						lastDotRealY = parseInt(lastDot.style.top, 10) + this.dotSize/2,
						lastDotRealX = parseInt(lastDot.style.left, 10) + this.dotSize/2,
						paddingAdjustment = 20,
						textAdjustment = 4;

					// if the previous dot is more than a dotsize away,
					// don't connect this dot
					if((y > lastDotRealY + (fullDot + paddingAdjustment)) || (y < lastDotRealY - (fullDot + paddingAdjustment))){
						return false;
					} else if((x > lastDotRealX + (fullDot + paddingAdjustment)) || (x < lastDotRealX - (fullDot + paddingAdjustment))){
						return false;
					} else {
						if(!this.targetGroup.includes(e.target))
							this.targetGroup.push(e.target);

						this.completeLine(x + textAdjustment, y-1);
					}
				}
				e.preventDefault();
			}.bind(this),
			false);
	}

	addDot(position){
		let dot = document.createElement('div');
		let colorIdx = Math.ceil(Math.random() * (this.colors.length) - 1);
		let color = this.colors[colorIdx];
		dot.className = 'dot ' + color;
		dot.draggable = false;
		dot.style.left = position.left + 'px';
		dot.style.top = position.top + 'px';
		this.stage.appendChild(dot);
		this.dotDivs.push(dot);
		this.addDotEvents(dot);
		this.addDotMobileEvents(dot);
		this.addAnimation('zoomInDown', dot);
	}

	timedEvent(dot, funcName) {

	}

	addAnimation(animation, dot) {
		dot.className += ' ' + animation + ' animated';
		setTimeout(function animationTimeout(){
			this.removeAnimation(animation, dot);
		}.bind(this), 1000);
	}

	removeAnimation(animation, dot){
		let dotClasses = dot.className.split(' ').filter(
			function(classname){
				return classname !== animation && classname !== 'animated';
			}
		);

		dot.className = dotClasses.join(" ");
	}

    removeColor(color) {
        let dotsOfColor = Array.from(document.querySelectorAll('.' + color));

        // Update Score and remove dots
        this.updateScore(dotsOfColor.length);

        dotsOfColor.forEach(function removeDots(dot) {
            this.removeDot(dot);
        }.bind(this));

    }

    areDotsTheSame(dots) {
        let dotColors = dots.reduce(function reduceDotColors(dotClasses, dot) {
            dotClasses.push(dot.className.substring(4));
            return dotClasses;
        }, []);

        return !!dotColors.reduce(function reduceEqualColors(a, b) {
            return (a === b) ? a : NaN;
        });
    }

    doDotsFormSquare(dots) {
        if (dots.length !== 4)
            return false;

        let vectorArray = dots.map(function mapDotPositions(dot) {
            return {
                top: dot.offsetTop,
                left: dot.offsetLeft
            };
        });

        let a = vectorArray[0],
            b = vectorArray[1],
            c = vectorArray[2],
            d = vectorArray[3];

        return this.isRectangleAnyOrder(a, b, c, d);
    }

    // tests if angle abc is a right angle
    isOrthogonal(a, b, c) {
        return (b.left - a.left) * (b.left - c.left) + (b.top - a.top) * (b.top - c.top) === 0;
    }

    isRectangle(a, b, c, d) {
        return this.isOrthogonal(a, b, c) && this.isOrthogonal(b, c, d) && this.isOrthogonal(c, d, a);
    }

    isRectangleAnyOrder(a, b, c, d) {
        return this.isRectangle(a, b, c, d) || this.isRectangle(b, c, a, d) || this.isRectangle(c, a, b, d);
    }

}
