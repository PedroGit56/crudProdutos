namespace CrudDot.Models;

public class Pedido
{

    public int Id { get; set; }
    public int Numero { get; set; }

    public List<Produto> Produtos { get; set; } = new();
}