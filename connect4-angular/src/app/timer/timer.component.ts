import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  template: `<div class="timer">Game started from {{timer}} sec.</div>`
})
export class TimerComponent implements OnInit {

  @Input()
  started: boolean = false;

  timer: number = 0;

  tick(): void {
    if (this.started) {
        this.timer = this.timer + 1;
    }
  }

  ngOnInit(): void {
    setInterval(
      () => this.tick(),
      1000
    );
  }
}
