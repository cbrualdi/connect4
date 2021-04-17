import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
 
function Square(props) {
    const color = props.value 
        ? (props.value === 'Red' 
            ? "red" 
            : "yellow") 
        : "white";

    return (
        <button 
            className={'square ' + color}  
            onClick={props.onClick}>
            {props.winner && "✓"}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]} 
                winner={this.props.winners?.includes(i)}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
  
    render() {
        return (
            <div className="game-board">
                {Array(6).fill().map((e, i) => {
                    return (
                        <div className="board-row" key={i}>
                            {Array(7).fill().map((ee, ii) => {
                                return (
                                    <React.Fragment key={i*7 + ii}>
                                        {this.renderSquare(i*7 + ii)}
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
      );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                desc: "Go to start",
                squares: Array(42).fill(null)
            }],
            stepNumber: 0,
            redIsNext: true,
            started: false
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (this.calculateWinner(squares) || squares[i]) {
            return;
        }

        const freeCell = this.calculateFallCell(squares, i);
        squares[freeCell] = this.state.redIsNext ? 'Red' : 'Yellow';

        this.setState({
            history: history.concat([{
                desc: squares[freeCell] + " in column " 
                    + (freeCell - Math.floor(freeCell/7)*7 + 1) 
                    + ", row " + (Math.floor(freeCell/7) + 1),
                squares: squares
            }]),
            stepNumber: history.length,
            redIsNext: !this.state.redIsNext,
            started: true
        });

        if (this.calculateWinner(squares) || !squares.includes(null)) {
            this.setState({
                started: false
            })
        }
    }

    jumpTo(step) {
        this.setState({
          stepNumber: step,
          redIsNext: (step % 2) === 0,
        });
    }

    calculateFallCell(squares, selected) {
        for (let i = selected; i < squares.length; i += 7) {
            if (i+7 < squares.length) {
                if (squares[i+7]) {
                    return i;
                }
            } else {
                return i;
            }
        }
    }
    
    calculateWinner(squares) {
        for (let i = 0; i < squares.length; i++) {
    
            let y = Math.floor(i/7);
            let x = i - y*7;
    
            if (squares[i]) {
                let orizzontal = [i+1, i+2, i+3];
                let vertical = [i+7, i+14, i+21];
                let diagonalTdLtr = [i+7+1, i+14+2, i+21+3];
                let diagonalBuLtr = [i-7+1, i-14+2, i-21+3];
    
                if (x < 4 && orizzontal.reduce((a, c) => squares[i] === squares[c] && a, true)) return [i].concat(orizzontal);
                if (y < 3 && vertical.reduce((a, c) => squares[i] === squares[c] && a, true)) return [i].concat(vertical);
                if (x < 4 && y < 3 && diagonalTdLtr.reduce((a, c) => squares[i] === squares[c] && a, true)) return [i].concat(diagonalTdLtr);
                if (x < 4 && y > 2 && diagonalBuLtr.reduce((a, c) => squares[i] === squares[c] && a, true)) return [i].concat(diagonalBuLtr); 
            }
        }
        return null;
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares);
        
        const moves = history.map((step, move) => {
            const desc = move ?
              'Go to move #' + move  + ' (' + step.desc + ')' :
              step.desc;
            return (
              <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
              </li>
            );
          });
        
        let status;
        if (winner) {
            status = <b>{current.squares[winner[0]]} wins!</b>;
        } 
        else if (!current.squares.includes(null)) {
            status = "Game ended in a draw";
        } else {
            status = "Next move: " + (this.state.redIsNext ? 'Red' : 'Yellow');
        }

        return (
            <>
            <h1>Connect 4</h1>
            <h3>{status}</h3>
            <div className="game">
            <div>
                <Board 
                    squares={current.squares}
                    winners={winner}
                    onClick={(i) => this.handleClick(i)}
                />
                <Timer started={this.state.started} />
            </div>
            <div className="game-info">
                {moves.length > 1 && 
                    (<div><b>History:</b></div>)}
                <ul>{moves.slice(0, moves.length - 1)}</ul>
            </div>
            </div>
            </>
        );
    }
}
  
class Timer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {timer: 0};
    }
  
    componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    }
  
    componentWillUnmount() {
      clearInterval(this.timerID);
    }
  
    tick() {
        if (this.props.started) {
            this.setState((state) => ({timer: state.timer + 1}));
        }
    }
  
    render() {
        return (
            <div className="timer">Game started from {this.state.timer} sec.</div>
        );
        
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
