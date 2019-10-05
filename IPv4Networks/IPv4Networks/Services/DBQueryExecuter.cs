using IPv4Networks.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;

namespace IPv4Networks.Services
{
    public static class DBQueryExecuter<T>
    {
        //public string ConnectionString { get; private set; }

        //public DBExecuter(IConfiguration configuration)
        //{
        //    ConnectionString = configuration.GetSection("ConnectionStrings")["DefaultConnection"];
        //}
        //type Element { get; set; }

        public static IEnumerable<T> ExecuteQuery(string connectionString, string sqlQuery, Object bindedData)
        {
            try
            {
                using (IDbConnection db = new SqlConnection(connectionString))
                {
                    return db.Query<T>(sqlQuery, bindedData);
                }
            }
            catch
            {
                return default;
            }
        }
    }
}
