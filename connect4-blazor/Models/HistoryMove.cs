using System.Collections.Generic;

namespace Connect4.Blazor.Models
{
    public class HistoryMove
    {
        public string Description { get; set; }
        public List<Player?> Squares { get; set; }
    }
}
