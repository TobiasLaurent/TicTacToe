import { Component, OnInit } from '@angular/core';

type Player = 'X' | 'O';
type SquareValue = Player | null;

interface WinnerResult {
  player: Player;
  line: number[];
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  readonly boardSize = 3;
  squares: SquareValue[] = [];
  moveHistory: SquareValue[][] = [];
  moveIndex = 0;
  xIsNext = true;
  winner: Player | null = null;
  winningLine: number[] = [];
  isDraw = false;
  scores = {
    X: 0,
    O: 0,
    draws: 0
  };

  ngOnInit(): void {
    this.startNewRound();
  }

  get player(): Player {
    return this.xIsNext ? 'X' : 'O';
  }

  get statusMessage(): string {
    if (this.winner) {
      return `Winner: ${this.winner}`;
    }
    if (this.isDraw) {
      return 'Round ended in a draw';
    }
    return `Next player: ${this.player}`;
  }

  get isGameOver(): boolean {
    return this.winner !== null || this.isDraw;
  }

  get canUndo(): boolean {
    return this.moveIndex > 0;
  }

  get canRedo(): boolean {
    return this.moveIndex < this.moveHistory.length - 1;
  }

  startNewRound(): void {
    const emptyBoard = this.createEmptyBoard();
    this.squares = [...emptyBoard];
    this.moveHistory = [emptyBoard];
    this.moveIndex = 0;
    this.xIsNext = true;
    this.winner = null;
    this.winningLine = [];
    this.isDraw = false;
  }

  resetScoreboard(): void {
    this.scores = {
      X: 0,
      O: 0,
      draws: 0
    };
    this.startNewRound();
  }

  makeMove(index: number): void {
    if (this.isGameOver || this.squares[index] !== null) {
      return;
    }

    const nextSquares = [...this.squares];
    nextSquares[index] = this.player;

    this.moveHistory = this.moveHistory.slice(0, this.moveIndex + 1);
    this.moveHistory.push(nextSquares);
    this.moveIndex += 1;
    this.squares = nextSquares;

    this.updateGameOutcome();

    if (!this.isGameOver) {
      this.xIsNext = !this.xIsNext;
    }
  }

  jumpTo(move: number): void {
    if (move < 0 || move >= this.moveHistory.length) {
      return;
    }

    this.moveIndex = move;
    this.squares = [...this.moveHistory[move]];
    this.xIsNext = move % 2 === 0;
    this.updateGameOutcome(false);
  }

  undo(): void {
    if (this.canUndo) {
      this.jumpTo(this.moveIndex - 1);
    }
  }

  redo(): void {
    if (this.canRedo) {
      this.jumpTo(this.moveIndex + 1);
    }
  }

  isWinningCell(index: number): boolean {
    return this.winningLine.includes(index);
  }

  getCellLabel(index: number): string {
    const value = this.squares[index];
    return value ? `Cell ${index + 1}, ${value}` : `Cell ${index + 1}, empty`;
  }

  trackByMove(index: number): number {
    return index;
  }

  private createEmptyBoard(): SquareValue[] {
    return Array(this.boardSize * this.boardSize).fill(null);
  }

  private updateGameOutcome(updateScore = true): void {
    const winnerResult = this.calculateWinner(this.squares);
    this.winner = winnerResult ? winnerResult.player : null;
    this.winningLine = winnerResult ? winnerResult.line : [];
    this.isDraw = !winnerResult && this.moveIndex === this.boardSize * this.boardSize;

    if (!updateScore) {
      return;
    }

    if (winnerResult) {
      this.scores[winnerResult.player] += 1;
    } else if (this.isDraw) {
      this.scores.draws += 1;
    }
  }

  private calculateWinner(board: SquareValue[]): WinnerResult | null {
    const lines: number[][] = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return {
          player: board[a] as Player,
          line: [a, b, c]
        };
      }
    }

    return null;
  }
}
