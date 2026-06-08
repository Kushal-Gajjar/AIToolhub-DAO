using System.Collections.Generic;
using System.Threading.Tasks;
using AIToolHub.API.Models;

namespace AIToolHub.API.Services
{
    public interface ITreasuryService
    {
        Task<IEnumerable<TreasuryTransaction>> GetTransactionsAsync();
        Task<decimal> GetTotalBalanceAsync();
        Task<TreasuryTransaction> AddTransactionAsync(TxType type, string description, decimal amount, int? proposalId = null);
    }
}
