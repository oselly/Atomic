using AtomicDB.AtomicDB;
using DelegateDecompiler;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace AtomicDB.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddAtomicDBContextFactory(this IServiceCollection services, string connectionString)
        {
            services.AddDbContextFactory<AtomicDBContext>(options =>
                options.UseSqlServer(connectionString, o => o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)).AddDelegateDecompiler());
            return services;
        }
    }

    public static class DelegateDecompilerDbContextOptionsBuilderExtensions
    {
        public static DbContextOptionsBuilder AddDelegateDecompiler(this DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.AddInterceptors(new DelegateDecompilerQueryPreprocessor());
    }

    public class DelegateDecompilerQueryPreprocessor : IQueryExpressionInterceptor
    {
        Expression IQueryExpressionInterceptor.QueryCompilationStarting(Expression queryExpression, QueryExpressionEventData eventData)
            => DecompileExpressionVisitor.Decompile(queryExpression);
    }
}
