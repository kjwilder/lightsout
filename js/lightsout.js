(function () {
  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const messageEl = document.getElementById('message');
  const sizeInput = document.getElementById('size');
  const controlsForm = document.getElementById('controls');
  const resetButton = document.getElementById('reset');

  const nullTemplateCache = new Map();

  let size = 5;
  let gameGrid = [];
  let startGrid = [];
  let clicks = 0;
  let showSolution = false;

  const directions = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];

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

  function isSolved(grid) {
    return grid.every((row) => row.every((cell) => cell === false));
  }

  function toggleCell(grid, r, c) {
    directions.forEach(([dr, dc]) => {
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
      const randomClicks = size * 2
      for (let i = 0; i < randomClicks; i += 1) {
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);
        toggleCell(game, r, c);
      }
    }

    showSolution = false;
    startGrid = duplicateGrid(game);
    clicks = 0;
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
    console.log(`Computed ${nullTemplates.length} templates of size ${size}`);
    if (nullTemplates.length > 0) {
      console.log(`First template: ${Array.from(nullTemplates[0])}`);
    }
    return nullTemplates;
  }

  function solve(grid) {
    const solver = emptyGrid(grid.length);
    const work = duplicateGrid(grid);

    for (let i = 0; i < grid.length - 1; i += 1) {
      for (let j = 0; j < grid.length; j += 1) {
        if (work[i][j]) {
          toggleCell(work, i + 1, j);
          solver[i + 1][j] = !solver[i + 1][j];
        }
      }
    }

    if (work[grid.length - 1][0]) {
      toggleCell(work, 0, 0);
      toggleCell(work, 0, 1);
      solver[0][0] = !solver[0][0];
      solver[0][1] = !solver[0][1];
    }
    if (work[grid.length - 1][1]) {
      toggleCell(work, 0, 0);
      toggleCell(work, 0, 1);
      toggleCell(work, 0, 2);
      solver[0][0] = !solver[0][0];
      solver[0][1] = !solver[0][1];
      solver[0][2] = !solver[0][2];
    }
    if (work[grid.length - 1][2]) {
      toggleCell(work, 0, 1);
      toggleCell(work, 0, 2);
      solver[0][1] = !solver[0][1];
      solver[0][2] = !solver[0][2];
    }

    for (let i = 0; i < grid.length - 1; i += 1) {
      for (let j = 0; j < grid.length; j += 1) {
        if (work[i][j]) {
          toggleCell(work, i + 1, j);
          solver[i + 1][j] = !solver[i + 1][j];
        }
      }
    }

    if (countOn(work) !== 0) {
      return emptyGrid(grid.length);
    }

    const nullTemplates = getNullTemplates(grid.length);
    let bestSolver = solver;

    nullTemplates.forEach((template) => {
      const candidate = invertIndices(solver, template);
      if (countOn(candidate) < countOn(bestSolver)) {
        bestSolver = candidate;
      }
    });

    return bestSolver;
  }

  function handleClick(row, col, shiftkey) {
    if (shiftkey) {
      gameGrid[row][col] = !gameGrid[row][col];
    } else {
      toggleCell(gameGrid, row, col);
    }
    clicks += 1;
    updateBoard(gameGrid);
    if (isSolved(gameGrid)) {
      messageEl.textContent = `Solved with ${clicks} click${clicks === 1 ? '' : 's'}!`;
    } else {
      messageEl.textContent = '';
    }
  }

  function updateBoard(grid) {
    boardEl.innerHTML = '';
    boardEl.style.gridTemplateColumns = `repeat(${size}, 64px)`;
    statusEl.textContent = `Clicks: ${clicks}`;

    const solutionGrid = showSolution ? solve(grid) : null;

    grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `cell ${cell ? 'on' : 'off'}`;
        button.setAttribute('aria-label', `Row ${r + 1} column ${c + 1}, ${cell ? 'on' : 'off'}`);
        button.addEventListener('click', (event) => handleClick(r, c, event.shiftKey));

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
    gameGrid = duplicateGrid(startGrid);
    clicks = 0;
    updateBoard(gameGrid);
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
    gameGrid = randomGame(size);
  });

  resetButton.addEventListener('click', resetBoard);

  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        showSolution = !showSolution;
        updateBoard(gameGrid);
    }
  });

  gameGrid = randomGame(size);
})();
