import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty board and X turn', () => {
    expect(component.squares.length).toBe(9);
    expect(component.squares.every((value) => value === null)).toBeTrue();
    expect(component.player).toBe('X');
    expect(component.moveHistory.length).toBe(1);
  });

  it('should alternate turns after valid moves', () => {
    component.makeMove(0);
    expect(component.squares[0]).toBe('X');
    expect(component.player).toBe('O');

    component.makeMove(1);
    expect(component.squares[1]).toBe('O');
    expect(component.player).toBe('X');
  });

  it('should ignore moves on occupied cells', () => {
    component.makeMove(0);
    const moveCount = component.moveHistory.length;

    component.makeMove(0);

    expect(component.squares[0]).toBe('X');
    expect(component.moveHistory.length).toBe(moveCount);
    expect(component.player).toBe('O');
  });

  it('should detect a winner and highlight winning line', () => {
    [0, 3, 1, 4, 2].forEach((move) => component.makeMove(move));

    expect(component.winner).toBe('X');
    expect(component.winningLine).toEqual([0, 1, 2]);
    expect(component.isGameOver).toBeTrue();
    expect(component.scores.X).toBe(1);
  });

  it('should detect a draw and increment draw score', () => {
    [0, 1, 2, 4, 3, 5, 7, 6, 8].forEach((move) => component.makeMove(move));

    expect(component.winner).toBeNull();
    expect(component.isDraw).toBeTrue();
    expect(component.scores.draws).toBe(1);
  });

  it('should support undo and redo', () => {
    component.makeMove(0);
    component.makeMove(1);
    component.makeMove(2);

    component.undo();
    expect(component.moveIndex).toBe(2);
    expect(component.squares[2]).toBeNull();
    expect(component.player).toBe('X');

    component.redo();
    expect(component.moveIndex).toBe(3);
    expect(component.squares[2]).toBe('X');
    expect(component.player).toBe('O');
  });

  it('should keep score when starting a new round', () => {
    [0, 3, 1, 4, 2].forEach((move) => component.makeMove(move));
    expect(component.scores.X).toBe(1);

    component.startNewRound();

    expect(component.scores.X).toBe(1);
    expect(component.winner).toBeNull();
    expect(component.squares.every((value) => value === null)).toBeTrue();
  });
});
