using Microsoft.EntityFrameworkCore;
using AIToolHub.API.Models;

namespace AIToolHub.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Proposal> Proposals => Set<Proposal>();
        public DbSet<Vote> Votes => Set<Vote>();
        public DbSet<AiTool> AiTools => Set<AiTool>();
        public DbSet<ToolUsageLog> ToolUsageLogs => Set<ToolUsageLog>();
        public DbSet<TreasuryTransaction> TreasuryTransactions => Set<TreasuryTransaction>();
        public DbSet<Token> Tokens => Set<Token>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Vote>()
                .HasIndex(v => new { v.ProposalId, v.UserId })
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.WalletAddress)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<AiTool>()
                .HasIndex(t => t.Slug)
                .IsUnique();

            modelBuilder.Entity<Proposal>()
                .Property(p => p.BudgetRequest)
                .HasPrecision(18, 2);

            modelBuilder.Entity<TreasuryTransaction>()
                .Property(t => t.Amount)
                .HasPrecision(18, 2);
        }
    }
}
