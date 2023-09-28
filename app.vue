<template> 
  <div class="w3-black w3-padding full-height">

    <!-- Header -->
    <div class="w3-panel w3-black w3-center">
      <h1>Wordle</h1>
      <button
        class="w3-button w3-padding-small w3-amber"
        @click="showModal = true"
      >
        How to play?
      </button>
    </div>
    <!-- Header -->

    <!-- Game Board -->
    <div class="board">

      <!-- Word rows -->
      <div
        v-for="(word, i) in words"
        :key="`row-${i}`"
      >
        <div class="word">

          <!-- Word letters -->
          <div
            v-for="(letter, j) in word"
            class="w3-center letter-wrapper"
            :class="colors[i][j]"
          >
            <h3 class="letter w3-text-white">
              <strong>{{ letter }}</strong>
            </h3>
          </div>
          <!-- Word letters -->

        </div>
      </div>
      <!-- Word rows -->

      <!-- How to play modal trigger -->
      
      <!-- How to play modal trigger -->

    </div>
    <!-- Game Board -->

    <!-- Game result -->
    <br><br>
    <div
      v-if="showResult"
      class="result-wrapper"
    >
      <div
        class="w3-panel"
        :class="`w3-${ result ? `green` : `red`}`"
      >
        <h3 class="w3-center">
          You have {{ result ? ' won!' : ' lost' }}
        </h3>
        <p class="w3-center">
          The word is
          <strong>{{ word }}</strong>
        </p>
        <p class="w3-center">
          <button
            class="w3-button w3-black"
            @click="resetGame"
          >
            {{ result ? 'Play ' : 'Try ' }}again
          </button>
        </p>
      </div>
    </div>
    <!-- Game result -->

    <!-- Keyboard -->
    <div
      v-if="!showResult"
      class="keyboard-wrapper w3-hide-large"
    >
      <div
        v-for="(row, i) in virtualKeyboard"
        :key="`key-${i}`"
        class="keyboard-row"
      >
        <button
          v-for="(key, j) in row"
          :key="`key-${j}`"
          class="w3-button w3-padding-small w3-gray"
          @click="addChar(key)"
        >
          {{ key }}
        </button>
      </div>
      <div class="keyboard-row">
        <button
          class="w3-button w3-padding-small w3-gray"
          @click="nextAttempt"
        >
          ENTER
        </button>
        <button
          class="w3-button w3-padding-small w3-gray"
          @click="removeChar"
        >
          BACKSPACE
        </button>
      </div>
    </div>
    <!-- Keyboard -->

    <!-- Footer -->
    <footer class="footer">
      Developed by <a target="_blank" href="https://www.linkedin.com/in/murrugarra/">Eng. Ernesto Murrugarra</a>
    </footer>
    <!-- Footer -->

  </div>

  <!-- How to play modal -->
  <div class="w3-modal" :style="`display: ${ showModal ? `block` : `none`}`">
    <div class="w3-modal-content w3-animate-top w3-card-4 w3-border">
      <header class="w3-container w3-amber w3-center"> 
        <span
          @click="showModal = false"
          class="w3-button w3-display-topright"
        >
          &times;
        </span>
        <h2>Welcome to Wordle</h2>
      </header>
      <div class="w3-container w3-black">
        <p><strong>The goal:</strong></p>
        <p>You have 6 attempts to guess the correct word.</p>
        <br>
        <p><strong>How to play:</strong></p>
        <p>1- Start writting a word.</p>
        <p>2- Press "Enter" when you finish to fill the empty spaces.</p>
        <br>
        <p><strong>Atention!</strong></p>
        <p>* Each letter that is not contained in the word to guess will get a <span class="w3-dark-gray">dark gray</span> background.</p>
        <p>* If the background is <span class="w3-indigo">indigo</span>, it means the letter is in the word but not in that position.</p>
        <p>* If the background is <span class="w3-green">green</span>, it means the letter is in the word and in that position.</p>
        <br>
        <br>
        <p><strong>Good luck!</strong></p>
      </div>
    </div>
  </div>
  <!-- How to play modal -->

</template>
<script lang="ts" setup>
// Types
type WordsArr = string[]
type Board = WordsArr[]

// Reactive props
const list = ref<WordsArr>([]) // To store words list from API
const word = ref<string>('') // Word to guess
const words = ref<Board>([]) // Words game board
const boardIndex = ref<number>(0) // Active index in bidimensional array, to fill one position at a time
const wordIndex = ref<number>(0) // Active index in bidimensional array, to fill one position at a time
const colors = ref<Board>([])
const showResult = ref<boolean>(false) // To show result message
const result = ref<boolean>(false) // To set game result
const showModal = ref<boolean>(false) // To show result message
const virtualKeyboard = ref<string[][]>([
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D','F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
])

// Methods
const getEmptyPositions = (length: number): WordsArr => {
  const arr = []
  for (let j = 0; j < length; j++) arr.push('')
  return arr
}

const resetGame = () => {

  // Reset game values
  words.value = []
  colors.value = []
  word.value = ''
  boardIndex.value = 0
  wordIndex.value = 0
  showResult.value = false
  result.value = false
  
  // Set the word to guess
  word.value = list.value[Math.floor(Math.random() * list.value.length)]
  
  // Fill the rest of the words array with empty positions arrays
  for (let i = 0; i < 6; i++) {
    words.value.push(getEmptyPositions(word.value.length))
    colors.value.push(getEmptyPositions(word.value.length))
  }
}

const addChar = (char: string) => {
  if (wordIndex.value < word.value.length) {
    words.value[boardIndex.value][wordIndex.value] = char.toUpperCase()
    wordIndex.value++
  }
}

const removeChar = () => {

  // Add pressed key to active array
  if (wordIndex.value > 0) wordIndex.value--
  words.value[boardIndex.value][wordIndex.value] = ''
}

const nextAttempt = () => {
  // Check if word has been filled in the row position
  if (wordIndex.value !== word.value.length) return

  // Check if user guessed the word
  if (words.value[boardIndex.value].join('') === word.value) {

    // Fill colors array
    for (let i = 0; i < colors.value[boardIndex.value].length; i++) {
      colors.value[boardIndex.value][i] = 'w3-green'
    }
    result.value = true
    showResult.value = true
    return
  }

  // Check if there are attempts left
  if (boardIndex.value < (words.value.length - 1)) {

    for (let i = 0; i < words.value[boardIndex.value].length; i++) {

      // Check if the letter is in the word to guess
      if (!word.value.includes(words.value[boardIndex.value][i])) {
        colors.value[boardIndex.value][i] = 'w3-dark-gray'
        continue
      }

      // Check if the letter is in the same position in the word to guess
      if (word.value[i] === words.value[boardIndex.value][i]) {
        colors.value[boardIndex.value][i] = 'w3-green'
      } else {
        colors.value[boardIndex.value][i] = 'w3-indigo'
      }
    }
    
    // Increment board index
    boardIndex.value++

    // Reset wird index
    wordIndex.value = 0
  } else {
    result.value = false
    showResult.value = true
    return
  }
}

// Mounted hook
onMounted(async () => {

  // Get list of words from API
  const { data } = await useFetch<WordsArr>('https://challenge.trio.dev/api/v1/wordle-words')

  // Save words list from API
  list.value = data.value!

  // Set game to start
  resetGame()

  // Add event listeners
  window.addEventListener('keyup', ($event) => {

    let char = $event.key // Get the character
    if(
      !/^[A-Za-z]+$/.test(char) ||
      char === 'Tab' ||
      char === 'Shift' ||
      char === 'Alt' ||
      char === 'Meta' ||
      char === 'Control' ||
      char === 'Escape' ||
      char === 'Dead' ||
      char === 'CapsLock'
    ) return
    
    // If pressed key was "Enter"
    if (char === 'Enter') {
      nextAttempt()
      return
    }

    if (char === 'Backspace') {
      removeChar()
      return
    }

    // Add letter key to active array position
    addChar(char)
  })
})
</script>

<style>
body {
  touch-action: none !important;
}

.full-height {
  height: 100vh;
  overflow: auto
}

.board {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 0 auto;
  max-width: 300px;
}

.word {
  display: flex;
  gap: 5px;
}

.letter-wrapper {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  border: solid #5A5A5A 3px !important;
}

.letter {
  margin: 0;
  padding: 0;
}

.result-wrapper {
  display: flex;
  justify-content: center;
}

.result-wrapper > .w3-panel {
  width: 500px;
}

.keyboard-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px
}

.keyboard-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.footer {
  padding: 1em;
  width: 100%;
  color: white;
  text-align: center;
}

@media (min-width: 414px) {
  .footer {
    left: 0;
    bottom: 0;
    position: fixed;
  }
}
</style>