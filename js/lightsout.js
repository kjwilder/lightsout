(function () {
  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const messageEl = document.getElementById('message');
  const sizeInput = document.getElementById('size');
  const controlsForm = document.getElementById('controls');
  const resetButton = document.getElementById('reset');

  let size = 5;
  let grid = [];
  let startingGrid = [];
  let moves = 0;

  const directions = [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  function cloneGrid(source) {
    return source.map((row) => [...row]);
  }

  function createGrid(n) {
    return Array.from({ length: n }, () => Array.from({ length: n }, () => false));
  }

  function toggleCell(r, c, state) {
    directions.forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
        state[nr][nc] = !state[nr][nc];
      }
    });
  }

  function randomizeGrid() {
    // Start with all lights off and apply random valid moves so the puzzle is solvable.
    grid = createGrid(size);
    const randomClicks = Math.max(size * 2, 6);
    for (let i = 0; i < randomClicks; i += 1) {
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      toggleCell(r, c, grid);
    }

    // Avoid handing back a solved board.
    if (isSolved()) {
      randomizeGrid();
      return;
    }

    startingGrid = cloneGrid(grid);
    moves = 0;
    updateStatus();
    updateBoard();
    messageEl.textContent = '';
  }

  function isSolved() {
    return grid.every((row) => row.every((cell) => cell === false));
  }

  function handleClick(row, col) {
    toggleCell(row, col, grid);
    moves += 1;
    updateBoard();
    updateStatus();
    if (isSolved()) {
      messageEl.textContent = `All lights off in ${moves} move${moves === 1 ? '' : 's'}!`;
    } else {
      messageEl.textContent = '';
    }
  }

  function updateBoard() {
    boardEl.innerHTML = '';
    boardEl.style.gridTemplateColumns = `repeat(${size}, 64px)`;

    grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `cell ${cell ? 'on' : 'off'}`;
        button.setAttribute('aria-label', `Row ${r + 1} column ${c + 1}, ${cell ? 'on' : 'off'}`);
        button.addEventListener('click', () => handleClick(r, c));
        boardEl.appendChild(button);
      });
    });
  }

  function updateStatus() {
    statusEl.textContent = `Moves: ${moves}`;
  }

  function resetBoard() {
    grid = cloneGrid(startingGrid);
    moves = 0;
    updateBoard();
    updateStatus();
    messageEl.textContent = '';
  }

  controlsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newSize = parseInt(sizeInput.value, 10);
    if (Number.isNaN(newSize) || newSize < 3 || newSize > 12) {
      messageEl.textContent = 'Please choose a board size between 3 and 12.';
      return;
    }
    size = newSize;
    randomizeGrid();
  });

  resetButton.addEventListener('click', resetBoard);

  // Initialize the first game.
  randomizeGrid();
})();
