using Microsoft.AspNetCore.Mvc;
using CrudDot.Models;
using CrudDot.DTOs;
using Microsoft.EntityFrameworkCore;
using CrudDot.Data;

namespace CrudDot.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutoController : ControllerBase
{
private readonly AppDbContext _context;

public ProdutoController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(_context.Produtos.ToList());
    }

    [HttpPost]
    public IActionResult Create(ProdutoCreateDTO dto)
    {
        var produto = new Produto
        {
        Nome = dto.Nome,
        Preco = dto.Preco
        };

        _context.Produtos.Add(produto);
        _context.SaveChanges();

        return Ok(produto);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var produto = _context.Produtos.FirstOrDefault(p => p.Id == id);

        if (produto == null)
           return NotFound();
        
        return Ok(produto);

    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, ProdutoCreateDTO dto)
    {
        var produto = _context.Produtos.FirstOrDefault(p => p.Id == id);

        if(produto == null)
           return NotFound();
        
        produto.Nome = dto.Nome;
        produto.Preco = dto.Preco;

        _context.SaveChanges();

        return Ok(produto);
    }

    [HttpDelete("{id}")]

    public IActionResult Delete(int id)
    {
        var produto = _context.Produtos.FirstOrDefault(p => p.Id == id);

        if (produto == null)
            return NotFound();
        
        _context.Produtos.Remove(produto);
        _context.SaveChanges();

        return NoContent();
    }
}
