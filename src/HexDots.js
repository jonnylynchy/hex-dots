var alertify = require('alertify.js');
import Messages from './components/Messages';
import Sounds from './components/SoundUrls';

export default class HexDots {
    constructor() {
        this.init();
    }

	init(){
        this.scoreDiv = document.querySelector(".score");
		this.stage = document.querySelector(".stage");
		this.audioControl = document.querySelector(".hexbot-volume");
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
		this.touchTextAdjustmentY = -2;
		this.touchTextAdjustmentX = 2;

        this.audio = new Audio();
        this.audio.src = Sounds.successSound;
        this.audio.load();

		this.robotVoiceAudio = new Audio();
		this.robotVoiceAudio.src = Sounds.robotVoice;
		this.robotVoiceAudio.load();

		this.addDotsToStage();

        this.canvas = this.createCanvas();
		this.attachEvents();
		// TODO: add mobile check here (or better include mobile module if mobile);
		this.attachMobileEvents();
	}

	// Initial Dots
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

	// Canvas
    createCanvas() {
        const canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.stage.appendChild(canvas);

        return {
            ctx: ctx,
            canvas: canvas
        };
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

    clearLines(x = 0, y = 0, width = this.canvas.canvas.width, height = this.canvas.canvas.height) {
        this.canvas.ctx.clearRect(x, y, width, height);
    }

	// Score
    updateScore(num) {
        this.score += num;
        this.scoreDiv.innerHTML = this.score;
    }

	// Audio / Sounds
	silenceAllSounds() {
		this.audio.volume = 0;
		this.robotVoiceAudio.volume = 0;
	}

	raiseAllSounds() {
		this.audio.volume = 1;
		this.robotVoiceAudio.volume = 1;
	}

    setSoundsStop(time, audioInstance) {
        setTimeout(() => {
            this.stopSounds(audioInstance);
        }, time);
    }

    stopSounds(audioInstance) {
        this[audioInstance].pause();
        this[audioInstance].currentTime = 0;
    }

	playSound(sound, audioInstance, time, stopTime = 500, playRate = 1){
		this[audioInstance].src = sound;
		this[audioInstance].load();
        this[audioInstance].currentTime = time;
		this[audioInstance].playbackRate = playRate
        this[audioInstance].play();
        this.setSoundsStop(stopTime, audioInstance);
	}

	// Messages
	showMessage(message, delay){
		alertify.logPosition("top left");
		alertify.delay(delay);
		alertify.log(message);
		let hbSoundIndex = Math.ceil(Math.random() * (Sounds.hexbotNormal.length) - 1)
		this.playSound(Sounds.hexbotNormal[hbSoundIndex], 'robotVoiceAudio', 0, 2500, 1);
	}

	showSuccessMessage(message){
		alertify.logPosition("top left");
		alertify.success(message);
		this.playSound(Sounds.hexbotSuccess_1, 'robotVoiceAudio', 0, 2500, 1);
	}

	showErrorMessage(message){
		alertify.logPosition("top right");
		alertify.error(message);
		this.playSound(Sounds.hexbotError_1, 'robotVoiceAudio', 0, 3000, 1);
	}

	showStartUpMessages(){
		let messages = Messages.startupMessages,
			messageDelay = 3500,
			showDelay = 0;

		alertify.logPosition("top left");
		messages.forEach((message) => {
			setTimeout(
				() => {
					this.showMessage(message, messageDelay);
				},
				showDelay
			);
			showDelay += messageDelay;
		});
	}

	// Mobile Events
	attachMobileEvents() {

		this.stage.addEventListener('touchmove',
			e => {
				let currentX = (e.changedTouches[0].clientX - this.stage.offsetLeft);
				let currentY = (e.changedTouches[0].clientY - this.stage.offsetTop);

				if(this.touchIsDown){
					this.clearLines();
					this.startDrawLine(this.touchStartX, this.touchStartY, this.currentDotColor);
					this.completeLine(currentX, currentY);
				}
				e.preventDefault();
			},
		false);
	}

	addMobileEventsToDot(dot){
		// Mobile Test
		dot.addEventListener('touchenter',
			e => {
				console.log('mobile touch enter');
				e.preventDefault();
			},
		false);

		dot.addEventListener('touchstart',
			e => {
				console.log('mobile touch start-------------');
				console.log('ClientX and Y: ', e.touches[0].clientX, e.touches[0].clientY);
				console.log('targetTop: ', e.target.offsetTop + this.dotSize/2);
				console.log('targetLeft: ', e.target.offsetLeft + this.dotSize/2);

				let	computedStyle = getComputedStyle(e.target, null);

				this.currentDotColor = computedStyle.color;
				this.touchStartY = (e.target.offsetTop + this.dotSize/2) + this.touchTextAdjustmentY;
				this.touchStartX = (e.target.offsetLeft + this.dotSize/2) + this.touchTextAdjustmentX;
				this.touchIsDown = true;
				this.targetGroup.push(e.target);

				e.preventDefault();
			},
		false);

		dot.addEventListener('touchend',
			e => {
				console.log('mobile touch end');
				console.log('--------------------')
				console.log(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
				this.touchIsDown = false;
				e.preventDefault();
			},
		false);
	}

	// Events
    attachEvents() {
		// Audio control
		this.audioControl.addEventListener('click', e => {
			let volumeIsUp = e.target.className.indexOf('up');
			let volumeClasses = e.target.className.split(' ').filter(
				classname => {
					return classname !== 'fa-volume-up' && classname !== 'fa-volume-down';
				}
			);
			if(volumeIsUp > -1){
				volumeClasses.push('fa-volume-down');
				e.target.className = volumeClasses.join(' ');
				this.silenceAllSounds();
			} else {
				volumeClasses.push('fa-volume-up');
				e.target.className = volumeClasses.join(' ');
				this.raiseAllSounds();
			}
		});

		// Stage Mouseup / logic to determin if chained dots was success
        this.stage.addEventListener('mouseup', e => {
            if (this.targetGroup.length > 1 && this.mouseIsDown && this.areDotsTheSame(this.targetGroup)) {
                let msg = Messages.successMessage,
                    num = this.targetGroup.length;

                let isSquare = this.doDotsFormSquare(this.targetGroup),
                    squareColor = this.targetGroup[0].className.substring(4);

                // Update Score
                this.updateScore(num);

                // Remove connected dots
                this.targetGroup.forEach((removeMe) => {
                    this.removeDot(removeMe);
                });

                // Show messasge, if square, remove all of color
                if (!isSquare) {
					let success = msg + ' You got ' + num + ' hex dots!'
					this.showSuccessMessage(success);
					this.playSound(Sounds.successSound, 'audio', 1);
                } else {
					this.showSuccessMessage(Messages.squareMessage);
					this.playSound(Sounds.squareSound, 'audio', 0, 1500);
					this.removeDotsOfColor(squareColor);
                }

            } else {
				this.showErrorMessage(Messages.errorMessage);
                this.playSound(Sounds.errorSound, 'audio', 0);
            }
            this.clearLines();
            this.targetGroup = [];
            this.mouseIsDown = false;
        });
    }

	// DOM Management
	addDot(position){
		let dot = document.createElement('div'),
			colorIdx = Math.ceil(Math.random() * (this.colors.length) - 1),
			color = this.colors[colorIdx];

		dot.className = 'dot ' + color;
		dot.draggable = false;
		dot.style.left = position.left + 'px';
		dot.style.top = position.top + 'px';
		this.stage.appendChild(dot);
		this.dotDivs.push(dot);
		this.addDotEvents(dot);
		this.addMobileEventsToDot(dot);
		this.addAnimation('zoomInDown', dot);
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
			e => {
				let y = e.target.offsetTop + this.dotSize/2,
					x = e.target.offsetLeft + this.dotSize/2,
					computedStyle = getComputedStyle(e.target, null),
					color = computedStyle.color,
					textAdjustment = 5.5;

				this.mouseIsDown = true;
				this.targetGroup.push(e.target);
				e.preventDefault();
				this.startDrawLine(x + textAdjustment, y-1, color);

			},
			false);
		dot.addEventListener('mouseenter',
			e => {
				if (this.mouseIsDown) {
					let y = e.target.offsetTop + this.dotSize/2,
						x = e.target.offsetLeft + this.dotSize/2,
						lastDot = this.targetGroup[this.targetGroup.length-1],
						fullDot = Math.floor(this.dotSize + this.dotPadding),
						lastDotRealY = parseInt(lastDot.style.top, 10) + this.dotSize/2,
						lastDotRealX = parseInt(lastDot.style.left, 10) + this.dotSize/2,
						paddingAdjustment = 20,
						textAdjustment = 5.5;

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
			},
		false);
	}

	removeDotsOfColor(color) {
        let dotsOfColor = Array.from(document.querySelectorAll('.' + color));

        // Update Score and remove dots
        this.updateScore(dotsOfColor.length);

        dotsOfColor.forEach((dot) => {
            this.removeDot(dot);
        });

    }

    areDotsTheSame(dots) {
        let dotColors = dots.reduce((dotClasses, dot) => {
            dotClasses.push(dot.className.substring(4));
            return dotClasses;
        }, []);

		// Reduce equal colors
        return !!dotColors.reduce((a, b) => {
            return (a === b) ? a : NaN;
        });
    }

    doDotsFormSquare(dots) {
        if (dots.length !== 4)
            return false;

        let vectorArray = dots.map(dot => {
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

	// Animations
	addAnimation(animation, dot) {
		dot.className += ' ' + animation + ' animated';
		setTimeout(() => {
			this.removeAnimation(animation, dot);
		}, 1000);
	}

	removeAnimation(animation, dot){
		let dotClasses = dot.className.split(' ').filter(
			classname => {
				return classname !== animation && classname !== 'animated';
			}
		);

		dot.className = dotClasses.join(" ");
	}

    // Math Utils
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
