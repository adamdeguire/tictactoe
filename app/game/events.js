'use strict'
const ui = require('./ui')
const nav = require('../nav/ui')
const api = require('./api')
const logic = require('./logic')
const markers = ['X', 'O']
let turnCount = 0

const onNewGame = (event) => {
  api.newGame()
  turnCount = 0
  logic.clearBoard()
  nav.transitionText('#playAgain', 'Restart')
  $('.menuBtn').hide(400)
  setTimeout(() => $('.showOnNewGame').show(600), 400)
  for (let i = 0; i < 9; i++) {
    $(`#${i}`).css('background-image', '')
    $(`#${i}`).removeClass('marked animateMarked')
  }
  nav.transitionHTML('#message', `Turn ${turnCount + 1}: ${markers[turnCount % 2].bold()}`)
}

const onPlaceMarker = (event) => {
  const space = $(event.target).attr('id')
  if (!$(`#${space}`).hasClass('marked')) {
    const marker = markers[(turnCount) % 2]
    turnCount++

    $(`#${space}`).css('background-image', `url(./public/images/${marker}.png)`)
    $(`#${space}`).addClass('marked animateMarked')

    logic.placeMarker(space, marker)

    if (logic.gameWon(marker) || turnCount >= 9) {
      ui.onGameOver(marker)
      api.updateGame(parseInt(space), marker.toLowerCase(), true)
      for (let i = 0; i < 9; i++) {
        $(`#${i}`).addClass('marked')
      }
    } else {
      api.updateGame(parseInt(space), marker.toLowerCase(), false)
      nav.transitionHTML('#message', `Turn ${turnCount + 1}: ${markers[(turnCount) % 2].bold()}`)
    }
  } else {
    $(`#${space}`).addClass('invalid')
    setTimeout(() => $(`#${space}`).removeClass('invalid animateMarked'), 500)
  }
}

module.exports = {
  onNewGame,
  onPlaceMarker
}
