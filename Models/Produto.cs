using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrudDot.Models;

public class Produto
{
    public int Id { get; set; }

    [MaxLength(100)]
    public string Nome { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Preco { get; set; }
}