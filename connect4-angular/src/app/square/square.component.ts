import { Component, Input } from '@angular/core';

export type Square = "Red" | "Yellow" | null;

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent {

  @Input() value!: Square;
  @Input() winner!: boolean;

  get color() {
    return this.value
    ? (this.value === 'Red'
      ? "red"
      : "yellow")
    : "white";
  }

}
