using Microsoft.AspNetCore.Mvc;
using CrudDot.Models;
using CrudDot.DTOs;

namespace CrudDot.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutoController : ControllerBase
{
    public static List<Produto> produtos = new List<Produto>();

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(produtos);
    }

    [HttpPost]
    public IActionResult Create(ProdutoCreateDTO dto)
    {
        var produto = new Produto
        {
           Id = produtos.Count + 1,
           Nome = dto.Nome,
           Preco = dto.Preco 
        };

        produtos.Add(produto);
        return Ok(produto);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var produto = produtos.FirstOrDefault(p => p.Id == id);

        if (produto == null)
           return NotFound();
        
        return Ok(produto);

    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, ProdutoCreateDTO dto)
    {
        var produto = produtos.FirstOrDefault(p => p.Id == id);

        if(produto == null)
           return NotFound();
        
        produto.Nome = dto.Nome;
        produto.Preco = dto.Preco;

        return Ok(produto);
    }

    [HttpDelete("{id}")]

    public IActionResult Delete(int id)
    {
        var produto = produtos.FirstOrDefault(p => p.Id == id);

        if (produto == null)
            return NotFound();
        
        produtos.Remove(produto);

        return NoContent();
    }
}
