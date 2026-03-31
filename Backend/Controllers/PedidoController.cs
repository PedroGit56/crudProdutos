using Microsoft.AspNetCore.Mvc;
using CrudDot.Models;
using CrudDot.DTOs;
using System.Linq;
using CrudDot.Data;
using Microsoft.EntityFrameworkCore;

namespace CrudDot.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PedidoController : ControllerBase
{

      private readonly AppDbContext _context;

      public PedidoController(AppDbContext context)
    {
        _context = context;
    }
   

    [HttpPost]
    public IActionResult Create(PedidoCreateDTO dto)
    {
        var produtosSelecionados = _context.Produtos
            .Where(p => dto.ProdutosIds.Contains(p.Id))
            .ToList();

        if (produtosSelecionados.Count > 5)
            return BadRequest("Máximo 5 produtos");

        var total = produtosSelecionados.Sum(p => p.Preco);

        if (total > 1000)
            return BadRequest("Máximo R$ 1000");

        var pedido = new Pedido
        {
            Numero = dto.Numero,
            Produtos = produtosSelecionados
        };

        _context.Pedidos.Add(pedido);
        _context.SaveChanges();

        return Ok(pedido);
    }

    [HttpGet]

    public IActionResult Get()
    {
        return Ok(_context.Pedidos.
        Include(p => p.Produtos).
        ToList());
    }

   [HttpGet("{id}")]
   public IActionResult GetById(int id)
    {
        var pedido = _context.Pedidos.
        Include(p => p.Produtos).
        FirstOrDefault(p => p.Id == id);

        if (pedido == null)
           return NotFound();

        return Ok(pedido);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var pedido = _context.Pedidos.FirstOrDefault(p => p.Id == id);

        if (pedido == null)
           return NotFound();
        pedido.Produtos.Clear();
        _context.Pedidos.Remove(pedido);
        _context.SaveChanges();

        return NoContent();
    }

    [HttpGet("buscar")]
    public IActionResult BuscarPorNumero(int numero)
    {
        var resultado = _context.Pedidos                        
            .Where(p => p.Numero == numero)
            .ToList();

        return Ok(resultado);
    }

    [HttpGet("buscar-por-valor")]
    public IActionResult BuscarPorValor(decimal valor)
    {
        var resultado = _context.Pedidos
            .Where(p => p.Produtos.Sum(prod => prod.Preco) >= valor)
            .ToList();

            return Ok(resultado);
    }

     [HttpPut("{id}")]
public async Task<IActionResult> AtualizarPedido(int id, [FromBody] PedidoCreateDTO dto)
{
    var pedido = await _context.Pedidos
        .Include(p => p.Produtos)
        .FirstOrDefaultAsync(p => p.Id == id);

    if (pedido == null)
        return NotFound();

    pedido.Numero = dto.Numero;

    pedido.Produtos.Clear();

    if (dto.ProdutosIds != null && dto.ProdutosIds.Any())
    {
        var produtos = await _context.Produtos
            .Where(p => dto.ProdutosIds.Contains(p.Id))
            .ToListAsync();

        foreach (var produto in produtos)
        {
            pedido.Produtos.Add(produto);
        }
    }

    await _context.SaveChangesAsync();

    return Ok(pedido);
}


    }
