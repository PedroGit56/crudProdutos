using Microsoft.AspNetCore.Mvc;
using CrudDot.Models;
using CrudDot.DTOs;
using System.Linq;

namespace CrudDot.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PedidoController : ControllerBase
{
    public static List<Pedido> pedidos = new List<Pedido>();

    public static List<Produto> produtos = ProdutoController.produtos;

    [HttpPost]
    public IActionResult Create(PedidoCreateDTO dto)
    {
        var produtosSelecionados = produtos
            .Where(p => dto.ProdutosIds.Contains(p.Id))
            .ToList();

        if (produtosSelecionados.Count > 5)
            return BadRequest("Máximo 5 produtos");

        var total = produtosSelecionados.Sum(p => p.Preco);

        if (total > 1000)
            return BadRequest("Máximo R$ 1000");

        var pedido = new Pedido
        {
            Id = pedidos.Count + 1,
            Numero = dto.Numero,
            Produtos = produtosSelecionados
        };

        pedidos.Add(pedido);

        return Ok(pedido);
    }
}
