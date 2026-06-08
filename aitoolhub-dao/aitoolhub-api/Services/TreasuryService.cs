using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AIToolHub.API.Data;
using AIToolHub.API.Models;

namespace AIToolHub.API.Services
{
    public class TreasuryService : ITreasuryService
    {
        private readonly AppDbContext _db;
        public TreasuryService(AppDbContext db) => _db = db;

        public async Task<IEnumerable<TreasuryTransaction>> GetTransactionsAsync()
            => await _db.TreasuryTransactions.OrderByDescending(t => t.CreatedAt).ToListAsync();

        public async Task<decimal> GetTotalBalanceAsync()
        {
            var txns = await _db.TreasuryTransactions.Where(t => t.Status == TxStatus.Confirmed).ToListAsync();
            return txns.Sum(t => t.Type == TxType.Inflow ? t.Amount : -t.Amount);
        }

        public async Task<TreasuryTransaction> AddTransactionAsync(TxType type, string description, decimal amount, int? proposalId = null)
        {
            var tx = new TreasuryTransaction
            {
                Type = type, Description = description, Amount = amount,
                ProposalId = proposalId, Status = TxStatus.Pending,
                TxHash = "0x" + Guid.NewGuid().ToString("N")
            };
            _db.TreasuryTransactions.Add(tx);
            await _db.SaveChangesAsync();
            return tx;
        }
    }
}
