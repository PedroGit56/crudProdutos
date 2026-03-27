using Microsoft.EntityFrameworkCore;
using CrudDot.Models;

namespace CrudDot.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }

    public DbSet<Produto> Produtos { get; set; }
    public DbSet<Pedido> Pedidos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Pedido>()
            .HasMany(p => p.Produtos)
            .WithMany(p => p.Pedidos)
            .UsingEntity(j => j.ToTable("PedidoProduto"));
    }
}
