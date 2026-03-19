namespace CrudDot.DTOs;

public class PedidoCreateDTO
{

    public int Numero { get; set; }

    public List<int> ProdutosIds { get; set; } = new();
}