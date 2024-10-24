<script setup>
import { ref } from 'vue'

const manaul = ref([
  {
    title: `Mode Switch`,
    description: `To activate the computer mode, toggle the switch named "Computer". This will allow the player to switch playing between the computer and the human player. If it's turned off, players 1 and 2 will play against each other.`,
  },
  {
    title: `Select Level`,
    description: `This setting is only available for the computer mode. By default, the difficulty level is set to "Hard", but it can be changed from "Noob" to "Easy", "Medium", and "Hard".`,
  },
  {
    title: `Starting a Game`,
    description: `Each player will have their own symbol, with Player 1 being X and Player 2 being O. Player 1 will start the game.`,
  },
  {
    title: `Gameplay`,
    description: `Players have to place their symbol on an empty space by clicking on that space. Players will take turns playing until one manages to form a vertical, horizontal, or diagonal line with their symbols. The winner will be the player who manages to do so, and a new round can be started by clicking the "Next Round" button.`,
  },
  {
    title: `Scoring`,
    description: `The winning player receives 1 point, and the losing player gets no points. If the game ends in a draw, no one gets any points. If a player wins 3 rounds in a row against their opponent, they will earn an extra point.`,
  },
  {
    title: `Resetting the Game`,
    description: `To restart the game, players can click the "Refresh" icon located next to the game name. This will reset the game, including the game rounds and scores.`,
  },
])
</script>

<template>
  <div class="manaul-container">
    <h1>How to play Tic Tac Toe</h1>
    <div v-for="item in manaul" :key="item.title">
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.manaul-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
h2 {
  color: hsla(160, 100%, 37%, 1);
}
</style>