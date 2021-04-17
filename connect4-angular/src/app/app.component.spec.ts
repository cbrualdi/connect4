import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { BoardComponent } from './board/board.component';
import { SquareComponent } from './square/square.component';

describe('Connect 4', () => {

  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent, TimerComponent, BoardComponent, SquareComponent
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have the timer starts`, () => {
    // Arrange
    const moveInto = 42;

    // Act
    app.onMove(moveInto);

    // Assert
    expect(app.started).toBe(true);
  });

  it(`should calculate the player victory`, () => {
    // Arrange
    const movesToRedWin = [41, 34, 40, 33, 39, 32, 38];
    const redWin = [38, 39, 40, 41];

    // Act
    movesToRedWin.forEach(move => app.onMove(move));

    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    // Assert
    expect(app.winner).toEqual(redWin); // Winner is detected
    expect(compiled.querySelector('h3').textContent).toBe('Red wins!'); // Message is shown
    expect(compiled.querySelectorAll('.square')[38].textContent).toContain('✓'); // Winner square is marked
    expect(compiled.querySelectorAll('.square')[39].textContent).toContain('✓'); // Winner square is marked
    expect(compiled.querySelectorAll('.square')[40].textContent).toContain('✓'); // Winner square is marked
    expect(compiled.querySelectorAll('.square')[41].textContent).toContain('✓'); // Winner square is marked
    expect(app.started).toBe(false); // Timer is stopped
  });

  it(`should calculate the players draw`, () => {
    // Arrange
    const movesToDraw = [
      ...Array(6).fill(41).map((e, i) => e - i*7),
      ...Array(5).fill(40).map((e, i) => e - i*7),
      ...Array(6).fill(39).map((e, i) => e - i*7),
      ...Array(5).fill(38).map((e, i) => e - i*7),
      ...Array(6).fill(37).map((e, i) => e - i*7),
      ...Array(5).fill(36).map((e, i) => e - i*7),
      ...Array(6).fill(35).map((e, i) => e - i*7),
      1, 3, 5
    ];

    // Act
    movesToDraw.forEach(move => app.onMove(move)); // Moves until draw

    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    // Assert
    expect(app.winner.length).toBe(0); // Nobody wins
    expect(compiled.querySelector('h3').textContent).toBe('Game ended in a draw'); // Message is shown
    expect(app.started).toBe(false); // Timer is stopped
  });

  it(`should jump history correctly`, () => {
    // Arrange
    const numberOfMoves = 20;
    const jumpTo = 9;
    const moves = Array(numberOfMoves).fill(41).map((e, i) => e - i);

    // Act
    moves.forEach(move => app.onMove(move)); // Do "numberOfMoves" moves
    app.jumpTo(jumpTo); // And then jump to "jumpTo" move (where jumpTo < numberOfMoves)

    const compiled = fixture.nativeElement;
    fixture.detectChanges();

    // Assert
    expect(compiled.querySelector('h3').textContent).toBe('Next move: Yellow'); // Next turn changes from Red to Yellow
    expect(app.history[jumpTo].squares.filter(s => s !== null).length).toBe(jumpTo); // There are the correct number of "square" on the board
    expect(app.history.length).toBe(numberOfMoves + 1); // History remains unchanged

    // Act
    app.onMove(35); // Do a move

    // Assert
    expect(app.history.length).toBe(jumpTo + 2); // History are rewritten starting from "jumpTo" turn
  });

});
