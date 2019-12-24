const getRandomInteger = (min: number, max: number): number => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

// N - размеры шахматной доски (NxN)
const getInitChessBoard = (N: number): number[] => {
  const initBoard: number[] = [];
  for (let i=0; i<N; i++) {
    initBoard.push(i);
  }
  return initBoard;
};

// Смена местами 2-х элементов (ферзей) на шахматной доске
const mixArray = (arr: number[]): number[] => {
  const newArr = [ ...arr ];
  let i = 0, j = 0;
  while (i === j) {
    i = getRandomInteger(0, arr.length-1);
    j = getRandomInteger(0, arr.length-1);
  }
  [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  return newArr;
};

// Подсчет энергии (количества ферзей под удар)
const calcEnergy = (board: number[]): number => {
  let res = 0;
  for (let n = 0; n < board.length; n++) {
    let k = n - 1;
    while (k >=0) {
      if (board[k] === (board[n] + (n - k)))
        res += 1;
      if (board[k] === (board[n] - (n - k)))
        res += 1;
      k -= 1;
    }
    k = n + 1;
    while (k < board.length) {
      if (board[k] === (board[n] + (k - n)))
        res += 1;
      if (board[k] === (board[n] - (k - n)))
        res += 1;
      k += 1;
    }
  }
  return res;
};

const getTransitionProbability = (ds: number, T: number) => Math.exp(-ds/T);

interface IAnnealingResult {
  board: number[];
  temperature: number;
  step: number;
}

class AnnealingResult implements IAnnealingResult {
  constructor(
    public board: number[] = [],
    public temperature: number = 0,
    public step: number = 0
  ) {}
}

const annealing = (N: number, Tmax: number, Tmin: number, alpha: number, maxIterations: number): IAnnealingResult => {
  let mainBoard = getInitChessBoard(N);
  let T = Tmax;
  let i = 0;

  if (calcEnergy(mainBoard) === 0) return new AnnealingResult(mainBoard, T, i);

  while (i <= maxIterations && T > Tmin) {
    const mixedBoard = mixArray(mainBoard);
    const mixedBoardEnergy = calcEnergy(mixedBoard);
    if (mixedBoardEnergy === 0)
      return new AnnealingResult(mixedBoard, T*alpha, i + 1);
    const ds = mixedBoardEnergy - calcEnergy(mainBoard);

    if (ds < 0) {
      mainBoard = [...mixedBoard];
    } else {
      const P = getTransitionProbability(ds, T);
      if (P > Math.random()) mainBoard = [...mixedBoard];
    }

    T = T*alpha;
    i++;
  }

  return new AnnealingResult([], T, i);
};

const drawChessBoard = (board: number[]) => {
  const table = document.getElementById('result-table');
  if (table) {
    table.innerHTML = '';
    const tbody = document.createElement('tbody');
    for (let i = 0; i < board.length; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < board.length; j++) {
        const td = document.createElement('td');
        const blackCondition = i % 2 === 0 ? j % 2 !== 0 : j % 2 === 0
        if (blackCondition) td.classList.add('has-background-grey-lighter');
        if (j === board[i]) td.innerHTML = 'X';
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('getResult')?.addEventListener('click', function() {
    const N = +((<HTMLInputElement>document.getElementById('N'))?.value || 8);
    const Tmax = +((<HTMLInputElement>document.getElementById('Tmax'))?.value || 100);
    const Tmin = +((<HTMLInputElement>document.getElementById('Tmin'))?.value || 0.000001);
    const alpha = +((<HTMLInputElement>document.getElementById('alpha'))?.value || 0.95);
    const maxIterations = +((<HTMLInputElement>document.getElementById('maxIterations'))?.value || 10000);
    const result: IAnnealingResult = annealing(N, Tmax, Tmin, alpha, maxIterations);
    const isSolved = result.board.length > 0;

    if (isSolved) drawChessBoard(result.board);

    const resultBox = document.getElementById('result-box');

    if (resultBox) {
      const hideResults = () => {
        resultBox.classList.add('is-hidden');
      }

      const showResults = () => {
        if (!isSolved) resultBox.classList.add('is-danger');
        const title = document.getElementById('result-box-title');
        const step = document.getElementById('result-box-step');
        const temperature = document.getElementById('result-box-temperature');
        if (title) {
          title.innerHTML = isSolved ? 'Решение найдено' : 'Решение не найдено';
        }
        if (step) step.innerHTML = result.step.toString();
        if (temperature) temperature.innerHTML = result.temperature.toFixed(4).toString();
        resultBox.classList.remove('is-hidden');
      };

      resultBox.querySelector('.delete')?.addEventListener('click', () => hideResults());

      showResults();
    }
  });
});
