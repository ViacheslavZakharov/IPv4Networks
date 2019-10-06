using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Dapper;

namespace IPv4Networks.Services
{
    public static class DBQueryExecuter<T>
    {
        public static IEnumerable<T> ExecuteQuery(string connectionString, string sqlQuery, Object bindedData)
        {
            try
            {
                using (IDbConnection db = new SqlConnection(connectionString))
                {
                    var result = db.Query<T>(sqlQuery, bindedData);
                    return result;
                }
            }
            catch
            {
                return default;
            }
        }
    }
}
