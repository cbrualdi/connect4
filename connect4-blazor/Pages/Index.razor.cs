using System;
using System.Collections.Generic;
using System.Linq;
using Connect4.Blazor.Models;

namespace Connect4.Blazor.Pages
{
    public partial class Index
    {     
        public List<HistoryMove> History = new()
        {
            new HistoryMove() {
                Description = "Go to start",
                Squares = Enumerable.Repeat<Player?>(null, 42).ToList()
            }
        };

        public List<int?> Winners = Enumerable.Repeat<int?>(null, 4).ToList();
        public int StepNumber = 0;
        public bool RedIsNext = true;
        public bool Started = false;

        private Player Player => RedIsNext ? Player.Red : Player.Yellow;
        private string PlayerName => Enum.GetName(typeof(Player), Player);

        private List<Player?> Squares => History[StepNumber].Squares;

        private string Status =>
            !Winners.Contains(null)
                ? $"{Squares[Winners[0].Value]} wins!"
                : !Squares.Contains(null)
                    ? "Game ended in a draw"
                    : $"Next move: {PlayerName}";

        private void MoveHandler(int i)
        {
            var _history = History.GetRange(0, StepNumber + 1);
            var _squares = new List<Player?>(_history.Last().Squares)
            {
                [i] = Player
            };

            _history.Add(new HistoryMove() {
                Description = $"{_squares[i]} in column " +
                    $"{i - Math.Floor(i / 7M) * 7 + 1}, " +
                    $"row {Math.Floor(i / 7M) + 1}",
                Squares = _squares
            });
            History = new(_history);

            StepNumber = History.Count - 1;
            RedIsNext = !RedIsNext;
            Winners = CalculateWinner(_squares);
            Started = Winners.Contains(null) && Squares.Contains(null);
        }

        private void JumpHandler(int step)
        {
            StepNumber = step;
            RedIsNext = (step % 2) == 0;
            Winners = CalculateWinner(Squares);
        }

        private static List<int?> CalculateWinner(List<Player?> squares)
        {
            for (int i = 0; i < squares.Count; i++)
            {
                var y = Math.Floor(i / 7M);
                var x = i - y * 7;

                if (squares[i] is not null)
                {
                    var orizzontal = new List<int?> { i + 1, i + 2, i + 3 };
                    var vertical = new List<int?> { i + 7, i + 14, i + 21 };
                    var diagonalTdLtr = new List<int?> { i + 7 + 1, i + 14 + 2, i + 21 + 3 };
                    var diagonalBuLtr = new List<int?> { i - 7 + 1, i - 14 + 2, i - 21 + 3 };

                    if (x < 4 && orizzontal.Aggregate(true, (a, c) => squares[i] == squares[c.Value] && a)) return orizzontal.Prepend(i).ToList();
                    if (y < 3 && vertical.Aggregate(true, (a, c) => squares[i] == squares[c.Value] && a)) return vertical.Prepend(i).ToList();
                    if (x < 4 && y < 3 && diagonalTdLtr.Aggregate(true, (a, c) => squares[i] == squares[c.Value] && a)) return diagonalTdLtr.Prepend(i).ToList();
                    if (x < 4 && y > 2 && diagonalBuLtr.Aggregate(true, (a, c) => squares[i] == squares[c.Value] && a)) return diagonalBuLtr.Prepend(i).ToList();
                }
            }

            return new List<int?>() { null, null, null, null };
        }
    }
}