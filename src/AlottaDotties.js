export default class AlottaDotties {
    constructor() {
        this.init();
    }

	init(){
		this.messageDiv = document.querySelector(".message");
        this.scoreDiv = document.querySelector(".score");
        this.colors = ['yellow', 'red', 'green', 'blue', 'purple'];
        this.dotDivs = [];
		this.dotSize = 25;
		this.dotPadding = 20;
        this.stage = document.querySelector(".stage");
        this.stage.draggable = false;
		this.stage.style.width = window.innerWidth / 2 + 'px';
		this.stage.style.height = (window.innerHeight / 100) * 80  + 'px';

        this.totalDots = 0;
        this.score = 0;
		this.mouseIsDown = false;
        this.targetGroup = [];
        this.lineGroup = [];

        this.messages = {
            successMessage: "Aww yayuh boyee!",
            errorMessage: "Hey, you can't do that silly!",
            squareMessage: "Great Job!"
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
	}

    updateScore(num) {
        this.score += num;
        this.scoreDiv.innerHTML = this.score;
    }

    setSoundsStop(time) {
        setTimeout(function() {
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

    attachEvents() {
        this.stage.addEventListener('mouseup', function(e) {
            if (this.targetGroup.length > 1 && this.mouseIsDown && this.areDotsTheSame(this.targetGroup)) {
                let msg = this.messages.successMessage,
                    num = this.targetGroup.length;

                let isSquare = this.doDotsFormSquare(this.targetGroup),
                    squareColor = this.targetGroup[0].className.substring(4);

                // Update Score
                this.updateScore(num);

                // Remove connected dots
                this.targetGroup.forEach(function(removeMe) {
                    this.removeDot(removeMe);
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
			function(e) {
				let y = e.target.offsetTop + this.dotSize/2,
					x = e.target.offsetLeft + this.dotSize/2,
					computedStyle = getComputedStyle(e.target, null),
					color = computedStyle.backgroundColor;

				this.mouseIsDown = true;
				this.targetGroup.push(e.target);
				e.preventDefault();
				this.startDrawLine(x, y, color);

			}.bind(this),
			false);
		dot.addEventListener('mouseenter',
			function(e) {
				if (this.mouseIsDown) {
					let y = e.target.offsetTop + this.dotSize/2,
						x = e.target.offsetLeft + this.dotSize/2;

					if (!this.targetGroup.includes(e.target)) {
						this.targetGroup.push(e.target);
					}

					this.completeLine(x, y);
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
		this.addAnimation('zoomInDown', dot);
	}

	timedEvent(dot, funcName) {

	}

	addAnimation(animation, dot) {
		dot.className += ' ' + animation + ' animated';
		setTimeout(function(){
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
        let dotsOfColor = document.querySelectorAll('.' + color);

        // Update Score and remove dots
        this.updateScore(dotsOfColor.length);

        dotsOfColor.forEach(function(dot) {
            this.removeDot(dot);
        }.bind(this));

    }

    areDotsTheSame(dots) {
        let dotColors = dots.reduce(function(dotClasses, dot) {
            dotClasses.push(dot.className.substring(4));
            return dotClasses;
        }, []);

        return !!dotColors.reduce(function(a, b) {
            return (a === b) ? a : NaN;
        });
    }

    doDotsFormSquare(dots) {
        if (dots.length !== 4)
            return false;

        let vectorArray = dots.map(function(dot) {
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
