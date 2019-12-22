const getRandomInteger = (min: number, max: number): number => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const getInitChessBoard = (N: number = 8): number[] => {
  const initBoard: number[] = [];
  for (let i=0; i<N; i++) {
    initBoard.push(i);
  }
  return initBoard;
};

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

const annealChessBoard = (Tmax = 100, alpha = 0.9) => {};
