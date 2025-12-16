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
  let showSolution = false;

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
    showSolution = false;
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

  function countOn(board) {
    return board.reduce(
      (total, row) => total + row.reduce((rowTotal, cell) => rowTotal + (cell ? 1 : 0), 0),
      0,
    );
  }

  function applyToggleSet(baseSolver, indices) {
    const next = cloneGrid(baseSolver);
    indices.forEach((idx) => {
      const r = Math.floor(idx / 5);
      const c = idx % 5;
      next[r][c] = !next[r][c];
    });
    return next;
  }

  function solve5x5(state) {
    if (size !== 5) return null;

    const solver = createGrid(5);
    const work = cloneGrid(state);

    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 5; j += 1) {
        if (work[i][j]) {
          toggleCell(i + 1, j, work);
          solver[i + 1][j] = !solver[i + 1][j];
        }
      }
    }

    if (work[4][0]) {
      toggleCell(0, 0, work);
      toggleCell(0, 1, work);
      solver[0][0] = !solver[0][0];
      solver[0][1] = !solver[0][1];
    }
    if (work[4][1]) {
      toggleCell(0, 0, work);
      toggleCell(0, 1, work);
      toggleCell(0, 2, work);
      solver[0][0] = !solver[0][0];
      solver[0][1] = !solver[0][1];
      solver[0][2] = !solver[0][2];
    }
    if (work[4][2]) {
      toggleCell(0, 1, work);
      toggleCell(0, 2, work);
      solver[0][1] = !solver[0][1];
      solver[0][2] = !solver[0][2];
    }

    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 5; j += 1) {
        if (work[i][j]) {
          toggleCell(i + 1, j, work);
          solver[i + 1][j] = !solver[i + 1][j];
        }
      }
    }

    if (countOn(work) !== 0) {
      return solver;
    }

    const t1 = [0, 2, 4, 5, 7, 9, 15, 17, 19, 20, 22, 24];
    const t2 = [0, 1, 3, 4, 10, 11, 13, 14, 20, 21, 23, 24];
    const t3 = [
      1, 2, 3, 5, 7, 9, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23,
    ];

    let bestSolver = solver;

    [t1, t2, t3].forEach((set) => {
      const candidate = applyToggleSet(solver, set);
      if (countOn(candidate) < countOn(bestSolver)) {
        bestSolver = candidate;
      }
    });

    return bestSolver;
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

    const solutionGrid = showSolution && size === 5 ? solve5x5(grid) : null;

    grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `cell ${cell ? 'on' : 'off'}`;
        button.setAttribute('aria-label', `Row ${r + 1} column ${c + 1}, ${cell ? 'on' : 'off'}`);
        button.addEventListener('click', () => handleClick(r, c));

        if (solutionGrid && solutionGrid[r][c]) {
          const marker = document.createElement('span');
          marker.className = 'solution-mark';
          marker.setAttribute('aria-label', 'Suggested move');
          button.appendChild(marker);
        }

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

  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      if (size === 5) {
        event.preventDefault();
        showSolution = !showSolution;
        updateBoard();
      } else {
        showSolution = false;
        messageEl.textContent = 'Solver is available only for 5x5 boards.';
      }
    }
  });

  randomizeGrid();
})();

