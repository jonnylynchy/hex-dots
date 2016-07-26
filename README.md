# Hex Dots
Game written in Javascript (ES2015), HTML, CSS, Canvas.

This game is inspired by Dots. If you haven't played Dots, Two Dots, or Dots & Co, I highly recommend it. Just search on the App Store or Google Play.

### Description
This is just a fun little experiment with ES6, CSS & Canvas.
No frameworks are currently used. Just vanilla js.
It's a work in progress and there are lots of TODO's.
Feel free to fork and pitch in!

### Documentation
```bash

$ npm install
$ npm start

```

Navigate to http://localhost:8080/dist/index.html

#### How to play
- Click and hold on any dot on the screen.
- Drag to an adjacent dot of the same color.
- You can chain dots together.
- When you release the mouse, same color dots will be removed and your score will increase.
- ... More features to come, see TODO.

[The latest version is up on Heroku]
[The latest version is up on Heroku]: https://hex-dots.herokuapp.com/

`This is completely non-functioning on mobile... I'm working on that.`

### TODO:
- Add: nice webfont
- Add: better messaging
- Add: animated lines
- Add: exception/error handling
- Add: target score
- Add: timer option (game is over when time is up)
- Add: reset button
- Add: game over message
- Adjust: disable the ability to connect dots that are not adjacent
- Refactor: break up configuration, sounds, etc. into modules and import them.
- Ultra-Awesome: Port this into a react app. Rendering via virtual dom would be super fast. (react-canvas)
- Make Mobile friendly.
