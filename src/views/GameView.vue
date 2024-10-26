<script setup>
import { ref, reactive, computed, watch } from 'vue'

const squares = ref([
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
])
const utils = reactive({
  player: 'X',
  level: 'hard',
  isComputer: true,
  playerXPoints: 0,
  playerOPoints: 0,
  consecutiveWins: {
    X: 0,
    O: 0,
  },
  round: 1,
  winBoxes: [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ],
  conditionThatMatched: '',
})
const usedBoxes = computed(
  () => squares.value.flat().filter(x => x !== '').length
)
const gameStart = computed(() => usedBoxes.value > 0 || utils.round > 1)
const gameEnd = computed(() => Boolean(winner.value))

const winConditions = [
  // Vertically- rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Horizontally- columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Corner
  [0, 4, 8],
  [2, 4, 6],
]

const bonusEvent = reactive({
  show: false,
  player: null,
  classObj: 'hide-bonus',
})

const findWinner = square => {
  for (const conditions of winConditions) {
    const [a, b, c] = conditions
    if (square[a] && square[a] === square[b] && square[a] === square[c]) {
      utils.conditionThatMatched = [a, b, c]
      return square[a]
    }
  }
  return ''
}

const updateWinBoxes = winBoxesFlat => {
  utils.conditionThatMatched.forEach(c => {
    winBoxesFlat[c] = 'win'
  })
  utils.conditionThatMatched = ''
  utils.winBoxes = array1dTo2d(winBoxesFlat)
}

const updatePlayerPoints = winner => {
  if (winner) {
    if (winner === 'X') {
      utils.playerXPoints += 1
      utils.consecutiveWins.X += 1
      utils.consecutiveWins.O = 0
      if (utils.consecutiveWins.X === 3) {
        utils.playerXPoints += 1
        utils.consecutiveWins.X = 0
        bonusPoint('X')
      }
    } else if (winner === 'O') {
      utils.playerOPoints += 1
      utils.consecutiveWins.O += 1
      utils.consecutiveWins.X = 0
      if (utils.consecutiveWins.O === 3) {
        utils.playerOPoints += 1
        utils.consecutiveWins.O = 0
        bonusPoint('O')
      }
    }
  }
}

const bonusPoint = player => {
  bonusEvent.show = true
  bonusEvent.player = player
  bonusEvent.classObj = 'show-bonus'

  setTimeout(() => {
    bonusEvent.show = false
    bonusEvent.player = null
    bonusEvent.classObj = 'hide-bonus'
  }, 3000)
}

const winner = computed(() => {
  const win = findWinner(squares.value.flat())
  if (!win && usedBoxes.value === 9) {
    return 'draw'
  }
  if (win === 'X' || win === 'O') {
    updateWinBoxes(utils.winBoxes.flat())
  }

  return win
})

// Watcher for winner to update player points
watch(winner, (newWinner, oldWinner) => {
  if (newWinner && newWinner !== oldWinner) {
    updatePlayerPoints(newWinner)
  }
})

const next = () => {
  if (winner.value) {
    utils.player = 'X'
    squares.value = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]
    utils.winBoxes = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]
    utils.round += 1
  } else {
    alert("Can't go to next round until finish current round.")
  }
}

const move = (x, y) => {
  if (!bonusEvent.show) {
    if (squares.value[x][y] === '' && !gameEnd.value) {
      squares.value[x][y] = utils.player
      playerSwap()
      if (utils.isComputer && !winner.value) executeComputer()
    }
  }
}
const executeComputer = () => {
  if (utils.player === 'O' && usedBoxes.value < 9) {
    const newSquares = computerChoice(squares.value.flat())
    squares.value = newSquares
  }
}

const computerChoice = square => {
  let choice
  choice = smartChoice(square, utils.level)

  if (choice === null) {
    do {
      choice = Math.floor(Math.random() * 9)
    } while (square[choice] !== '')
  }
  square[choice] = utils.player
  playerSwap()
  return array1dTo2d(square)
}

const array1dTo2d = array => {
  const newArray = []
  while (array.length) newArray.push(array.splice(0, 3))
  return newArray
}

const smartChoice = (square, level) => {
  let returnPosition
  if (level === 'hard') {
    // computer win possibilities then user win possibilites
    returnPosition = findWinChances(square, 'O')
    if (returnPosition == null) returnPosition = findWinChances(square, 'X')
  } else if (level === 'medium') {
    // user win possibilites
    returnPosition = findWinChances(square, 'X')
  } else if (level === 'easy') {
    // computer win possibilities
    returnPosition = findWinChances(square, 'O')
  } else if (level === 'noob') {
    // random
    returnPosition = null
  }
  return returnPosition
}

const findWinChances = (square, player) => {
  for (let conditions of winConditions) {
    const [a, b, c] = conditions
    if (square[a] === '' && square[b] === player && square[c] === player)
      return a
    else if (square[b] === '' && square[a] === player && square[c] === player)
      return b
    else if (square[c] === '' && square[a] === player && square[b] === player)
      return c
  }
  return null
}

const playerSwap = () => {
  utils.player = utils.player === 'X' ? 'O' : 'X'
}

const restart = () => {
  if (confirm('Do you really want to restart the game?')) {
    utils.player = 'X'
    utils.playerXPoints = 0
    utils.playerOPoints = 0
    utils.round = 1
    squares.value = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]
    utils.winBoxes = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]
    utils.consecutiveWins.X = 0
    utils.consecutiveWins.O = 0
  }
}

const mapLevel = level => {
  switch (level) {
    case 'noob':
      return 'Noob'
    case 'easy':
      return 'Easy'
    case 'medium':
      return 'Medium'
    case 'hard':
      return 'Hard'
    default:
      return 'Hard'
  }
}
const calScore = score => {
  if (score < 505) return score
  else {
    try {
      return Math.floor(score / 505)
    } catch {
      return score
    }
  }
}
</script>

<template>
  <div class="game-container">
    <div class="game-title">
      <h1>Tic Tac Toe</h1>
      <img
        src="@/assets/images/refresh.svg"
        alt="refresh"
        class="refresh-icon"
        @click="restart"
      />
    </div>
    <h2>{{ `Level: ${mapLevel(utils.level)}, Round : ${utils.round}` }}</h2>
    <div class="board">
      <div v-for="(row, x) in squares" :key="x" class="row">
        <div
          v-for="(square, y) in row"
          :key="y"
          class="col square"
          @click="move(x, y)"
        >
          {{ square }}
        </div>
      </div>
      <div
        v-if="bonusEvent.show"
        class="alert-bonus-wrapper"
        :class="bonusEvent.classObj"
      >
        {{ `Player ${bonusEvent.player} Get Bonus Point 🎉🎉🎉` }}
      </div>
    </div>
    <div class="player-detail">
      <div class="player-setting">
        <div class="switch-mode">
          <input
            class="toggle"
            :style="{ cursor: gameStart ? 'not-allowed' : 'pointer' }"
            type="checkbox"
            v-model="utils.isComputer"
            :disabled="gameStart"
          />
          <label class="switch-box-label" for="switch_mode"> Computer </label>
        </div>
        <span>Player Move : "{{ utils.player }}"</span>
      </div>
      <div v-if="!gameStart">
        <select
          name="level"
          v-model="utils.level"
          id="level"
          class="select-box"
          :disabled="usedBoxes > 0 || gameStart"
        >
          <option value="hard" default>Choose Level (Default Hard)</option>
          <option value="noob">Noob</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <h3 v-if="winner == 'draw'" class="draw">Its A Draw!</h3>
      <h3 v-if="winner != 'draw' && winner">
        <span v-if="!utils.isComputer" class="great">
          <strong v-if="winner != 'draw'">🎉 Player {{ winner }} wins! </strong>
        </span>
        <span class="winner" v-else>
          🎉
          <strong v-if="winner == 'X'">You</strong>
          <strong v-else>Computer</strong>
          Wins!
        </span>
      </h3>
      <button class="next-round-btn" @click="next">Next Round</button>
      <div class="score-wrapper">
        <div class="player-x">
          <div class="score-player-x">
            <img src="@/assets/images/user.svg" alt="user" class="user-icon" />
            <span>
              {{ utils.isComputer ? '  You:' : 'Player X:' }}
            </span>
            <strong>{{ calScore(utils.playerXPoints) }}</strong>
          </div>
        </div>
        <div class="player-o">
          <div class="score-player-o">
            <img
              v-if="utils.isComputer"
              src="@/assets/images/virus.svg"
              alt="virus"
              class="virus-icon"
            />
            <img
              v-else
              src="@/assets/images/user.svg"
              alt="user"
              class="user-icon"
            />
            <span>
              {{ utils.isComputer ? 'Computer:' : 'Player O:' }}
            </span>
            <strong>{{ calScore(utils.playerOPoints) }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.game-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.refresh-icon {
  cursor: pointer;
  width: 24px;
  height: 24px;
}
.alert-bonus-wrapper {
  position: absolute;
  color: hsla(160, 100%, 37%, 1);
  background-color: #ebfaeb;
  padding: 4px 16px;
  border-radius: 50px;
  font-weight: 500;
  font-size: 18px;
  top: 50%;
  bottom: 50%;
  place-self: center;
  rotate: 30degree;
  transform: rotate(8deg);
}
.show-bonus {
  opacity: 1;
  transition: 'all 1s ease';
}
.hide-bonus {
  opacity: 0;
  transition: 'none';
}
.board {
  position: relative;
  width: 300px;
  height: 300px;

  display: grid;
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
}
.row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  background-color: transparent;
}
.col {
  display: flex;

  background-color: #fefefe;
}
.square {
  color: hsla(160, 100%, 37%, 1);
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}
.player-detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}
.player-setting {
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
  width: 100%;
  margin: 16px 0;
  max-width: 300px;
}
.select-box {
  height: 40px;
  padding: 4px 8px;
}
.winner,
.great,
.draw {
  font-size: 32px;
}
.great {
  color: hsla(160, 100%, 37%, 1);
}
.winner {
  color: hsla(160, 100%, 37%, 1);
}
.elect-box {
  height: 36px;
  padding: 4px 8px;
}
.next-round-btn {
  padding: 0.5rem;

  background-color: #ffffff;
  border: 1px solid hsla(160, 100%, 37%, 1);
  color: hsla(160, 100%, 37%, 1);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 16px;
}
.next-round-btn:hover {
  color: #ffffff;
  background-color: hsla(160, 100%, 37%, 1);
}
.score-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
  border: 2px solid hsla(160, 100%, 37%, 1);
  border-radius: 6px;
  margin-top: 16px;
}
.player-x,
.player-o {
  display: flex;
  align-items: center;
  gap: 4px;
}

.score-player-x,
.score-player-o {
  display: flex;
  align-items: center;
  gap: 4px;
}

.virus-icon,
.user-icon {
  width: 24px;
  height: 24px;
}
.switch-mode {
  display: flex;
  gap: 3px;
  align-items: center;
}
.switch-box-label {
  color: #4cd964;
}

.toggle {
  appearance: none;
  position: relative;
  display: inline-block;
  box-sizing: content-box;
  width: 4.1em;
  height: 1.5em;
  padding: 0.2em;
  border: none;
  cursor: pointer;
  border-radius: 1.5em;
  overflow: hidden;
  background-color: #707070;
  transition: background ease 0.3s;
}

.toggle:before {
  content: 'on off';
  display: block;
  position: absolute;
  z-index: 2;
  width: 1.5em;
  height: 1.5em;
  font-family: system-ui;
  font-size: 1em;
  line-height: 1.5em;
  font-weight: 500;
  text-transform: uppercase;
  text-indent: -2em;
  word-spacing: 2.55em;
  text-shadow: -1px -1px #ccc;
  white-space: nowrap;
  background: #fff;
  color: #fff;
  border-radius: 1.5em;
  transition: transform cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;
}

.toggle:checked {
  background-color: #4cd964;
}

.toggle:checked:before {
  transform: translateX(2.5em);
}
</style>