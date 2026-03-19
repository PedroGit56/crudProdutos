using System.ComponentModel.DataAnnotations;

namespace CrudDot.Models;

public class Produto
{
    public int Id { get; set; }

    [MaxLength(100)]
    public string Nome { get; set; }
    public decimal Preco { get; set; }
}