import { Component } from '@angular/core';
import { Square } from './square/square.component';

type History = {
  desc: string,
  squares: Square[]
}[];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  history: History = [{
    desc: "Go to start",
    squares: Array<Square>(42).fill(null)
  }];

  winner: number[] = [];
  stepNumber: number = 0;
  redIsNext: boolean = true;
  started: boolean = false;

  get player(): Square {
    return this.redIsNext ? "Red" : "Yellow";
  }

  get squares(): Square[] {
    return this.history[this.stepNumber].squares;
  }

  onMove(i: number): void {
    const history = this.history.slice(0, this.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    squares.splice(i, 1, this.player);

    this.history = history.concat([{
      desc: squares[i] + " in column "
        + (i - Math.floor(i/7)*7 + 1)
        + ", row " + (Math.floor(i/7) + 1),
      squares: squares
    }]);

    this.stepNumber = this.history.length - 1;
    this.redIsNext = !this.redIsNext;
    this.winner = this.calculateWinner(squares);
    this.started = !this.winner.length && this.squares.includes(null);
  }

  jumpTo(step: number) {
    this.stepNumber = step;
    this.redIsNext = (step % 2) === 0;
    this.winner = this.calculateWinner(this.squares);
  }

  calculateWinner(squares: Square[]) {
    for (let i = 0; i < squares.length; i++) {

        let y = Math.floor(i/7);
        let x = i - y*7;

        if (squares[i]) {
            let orizzontal = [i+1, i+2, i+3];
            let vertical = [i+7, i+14, i+21];
            let diagonalTdLtr = [i+7+1, i+14+2, i+21+3];
            let diagonalBuLtr = [i-7+1, i-14+2, i-21+3];

            if (x < 4 && orizzontal.reduce((a, c) => squares[i] === squares[c] && a, true)) return [i, ...orizzontal];
            if (y < 3 && vertical.reduce((a, c) => squares[i] === squares[c] && a, true)) return [i, ...vertical];
            if (x < 4 && y < 3 && diagonalTdLtr.reduce((a, c) => squares[i] === squares[c] && a, true)) return [i, ...diagonalTdLtr];
            if (x < 4 && y > 2 && diagonalBuLtr.reduce((a, c) => squares[i] === squares[c] && a, true)) return [i, ...diagonalBuLtr];
        }
    }
    return [];
  }

}
