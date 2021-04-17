import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Square } from '../square/square.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {

  @Input()
  squares!: Square[];

  @Input()
  winner!: number[];

  @Output()
  move = new EventEmitter<number>();

  calculateFallCell(squares: Square[], selected: number) {
    for (let i = selected; i < squares.length; i += 7) {
        if (i+7 < squares.length) {
            if (squares[i+7]) {
                return i;
            }
        } else {
            return i;
        }
    }
    return -1;
  }

  makeMove(i: number): void {
    if (!this.squares[i] && !this.winner?.length) {
      this.move.emit(this.calculateFallCell(this.squares, i));
    }
  }

  n_rows = Array(6);
  n_cols = Array(7);
}
