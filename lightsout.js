(function () {
  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const messageEl = document.getElementById('message');
  const sizeInput = document.getElementById('size');
  const controlsForm = document.getElementById('controls');
  const resetButton = document.getElementById('reset');

  const nullTemplateCache = new Map();

  let gameData = {
    size: 5,
    startGrid: [],
    currentGrid: [],
    clicks: 0,
    showSolution: false,
  }

  function emptyGrid(n) {
    return Array.from(
      { length: n }, () => Array.from({ length: n }, () => false));
  }

  function duplicateGrid(grid) {
    return grid.map((row) => [...row]);
  }

  function countOn(grid) {
    return grid.reduce(
      (total, row) =>
        total + row.reduce((rowTotal, cell) => rowTotal + (cell ? 1 : 0), 0),
      0,
    );
  }

  function clearGrid(grid) {
    grid.forEach(row => row.fill(false));
  }

  function isSolved(grid) {
    return grid.every((row) => row.every((cell) => cell === false));
  }

  function toggleCell(grid, r, c) {
    [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid.length) {
        grid[nr][nc] = !grid[nr][nc];
      }
    });
  }

  function invertIndices(grid, indices) {
    const inverted = duplicateGrid(grid);
    indices.forEach((idx) => {
      const r = Math.floor(idx / grid.length);
      const c = idx % grid.length;
      inverted[r][c] = !inverted[r][c];
    });
    return inverted;
  }

  function toggleCells(grid, indices) {
    const toggled = duplicateGrid(grid);
    indices.forEach((idx) => {
      const r = Math.floor(idx / grid.length);
      const c = idx % grid.length;
      toggleCell(toggled, r, c);
    });
    return toggled;
  }

  function randomGame(size) {
    game = emptyGrid(size);
    while (isSolved(game)) {
      // Apply several random toggles.
      const randomClicks = Math.ceil(size ** 2 / 2);
      for (let i = 0; i < randomClicks; i += 1) {
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);
        toggleCell(game, r, c);
      }
    }
    gameData.startGrid = duplicateGrid(game);

    gameData.showSolution = false;
    gameData.clicks = 0;
    updateBoard(game);
    messageEl.textContent = '';
    return game
  }

  function getNullTemplates(size) {
    if (nullTemplateCache.has(size)) {
      return nullTemplateCache.get(size);
    }

    const nullTemplates = [];
    for (let i = 1; i < 2 ** size; i += 1) {
      const template = new Set();
      const templateGrid = emptyGrid(size);
      for (let bit = 0; bit < size; bit += 1) {
        if (i & (1 << bit)) {
          template.add(bit);
          toggleCell(templateGrid, 0, bit);
        }
      }

      for (let j = size; j < size * size; j += 1) {
        const r = Math.floor(j / size);
        const c = j % size;
        if (templateGrid[r - 1][c]) {
          template.add(j);
          toggleCell(templateGrid, r, c);
        }
      }
      if (isSolved(templateGrid)) {
        // nullTemplates.push(Array.from(template));
        nullTemplates.push(template);
      }
    }

    nullTemplateCache.set(size, nullTemplates);
    return nullTemplates;
  }

  function solve(grid) {
    let done = false;
    const solver = emptyGrid(grid.length);
    for (let k = 0; k < 2 ** grid.length && !done; k += 1) {
      clearGrid(solver);
      const work = duplicateGrid(grid);

      const template = new Set();
      const templateGrid = emptyGrid(grid.length);
      for (let bit = 0; bit < grid.length; bit += 1) {
        if (k & (1 << bit)) {
          solver[0][bit] = true
          toggleCell(work, 0, bit);
        }
      }

      for (let i = 0; i < grid.length - 1; i += 1) {
        for (let j = 0; j < grid.length; j += 1) {
          if (work[i][j]) {
            toggleCell(work, i + 1, j);
            solver[i + 1][j] = !solver[i + 1][j];
          }
        }
      }
      done = countOn(work) === 0;
    }

    if (!done) {
      messageEl.textContent = 'Unable to solve grid';
      return emptyGrid(grid.length);
    }
    messageEl.textContent = '';

    let bestSolver = solver;
    getNullTemplates(grid.length).forEach((template) => {
      const candidate = invertIndices(solver, template);
      if (countOn(candidate) < countOn(bestSolver)) {
        bestSolver = candidate;
      }
    });
    return bestSolver;
  }

  function handleClick(row, col, shiftkey, grid) {
    if (shiftkey) {
      grid[row][col] = !grid[row][col];
    } else {
      toggleCell(grid, row, col);
    }
    gameData.clicks += 1;
    updateBoard(grid);
    if (isSolved(grid)) {
      messageEl.textContent = `Solved with ${gameData.clicks} click${gameData.clicks === 1 ? '' : 's'}!`;
    } else {
      messageEl.textContent = '';
    }
  }

  function updateBoard(grid) {
    boardEl.innerHTML = '';
    boardEl.style.gridTemplateColumns = `repeat(${gameData.size}, 64px)`;
    statusEl.textContent = `Clicks: ${gameData.clicks}`;

    const solutionGrid = gameData.showSolution ? solve(grid) : null;

    grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `cell ${cell ? 'on' : 'off'}`;
        button.setAttribute('aria-label', `Row ${r + 1} column ${c + 1}, ${cell ? 'on' : 'off'}`);
        button.addEventListener('click',
          (event) => handleClick( r, c, event.shiftKey, gameData.currentGrid));

        if (solutionGrid && solutionGrid[r][c]) {
          const marker = document.createElement('span');
          marker.className = 'solution-mark';
          marker.setAttribute('aria-label', 'Suggested toggle');
          button.appendChild(marker);
        }

        boardEl.appendChild(button);
      });
    });
  }

  function resetBoard() {
    gameData.currentGrid = duplicateGrid(gameData.startGrid);
    gameData.clicks = 0;
    updateBoard(gameData.currentGrid);
    messageEl.textContent = '';
  }

  controlsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newSize = parseInt(sizeInput.value, 10);
    gameData.size = newSize;
    gameData.currentGrid = randomGame(newSize);
  });

  resetButton.addEventListener('click', resetBoard);

  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        gameData.showSolution = !gameData.showSolution;
        if (!gameData.showSolution) {
          messageEl.textContent = '';
        }
        updateBoard(gameData.currentGrid);
    }
  });

  gameData.currentGrid = randomGame(gameData.size);
})();
