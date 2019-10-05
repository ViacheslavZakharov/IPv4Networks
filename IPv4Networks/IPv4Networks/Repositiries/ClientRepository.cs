using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
//using System.Configuration;
using Dapper;
using IPv4Networks.Services;
using Microsoft.Extensions.Configuration;

namespace IPv4Networks.Models
{
    public class ClientRepository
    {
        private readonly string connectionString;
        public ClientRepository(IConfiguration configuration/*IConfiguration configuration*/)
        {
            connectionString = configuration.GetSection("ConnectionStrings")["DefaultConnection"];
        }
        // private string connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
        //private static IConfiguration configuration;
        //private readonly string connectionString = configuration.GetSection("ConnectionStrings")["DefaultConnection"];/*"Server=(localdb)\\mssqllocaldb;Database=clientnetwork;Trusted_Connection=True;MultipleActiveResultSets=true";Startup.Configuration.GetSection("AppConfiguration")["UserName"]*/
        public List<Client> GetClients()
        {
            //string sqlQuery
            var clients = DBQueryExecuter<Client>.ExecuteQuery(connectionString, "SELECT * FROM Clients", new { });
           return clients?.ToList();
            //List<Client> clients = new List<Client>();
            //try
            //{
            //    using (IDbConnection db = new SqlConnection(connectionString))
            //    {
            //        clients = db.Query<Client>("SELECT * FROM Clients").ToList();
            //    }
            //}
            //catch
            //{
            //    return null;
            //}
            //return clients;
        }

        public Client GetClientById(string id)
        {
            var sqlQuery = "SELECT * FROM Clients WHERE Id = @id";
            return DBQueryExecuter<Client>.ExecuteQuery(connectionString, sqlQuery, new { id }).FirstOrDefault();
            //Client client = null;
            //try
            //{
            //    using (IDbConnection db = new SqlConnection(connectionString))
            //    {
            //        client = db.Query<Client>("SELECT * FROM Clients WHERE Id = @id", new { id }).FirstOrDefault();
            //    }
            //}
            //catch
            //{
            //    return null;
            //}
            //return client;
        }

        public Client AddClient(Client client)
        {
            var sqlQuery = "INSERT INTO Clients (Id, SubNetwork) VALUES(@Id, @SubNetwork);SELECT * FROM Clients WHERE Id = @id";
            var addedClient = DBQueryExecuter<Client>.ExecuteQuery(connectionString,
                                            sqlQuery, new { client.Id, client.SubNetwork })
                                            .FirstOrDefault();
            // return client;
            return addedClient;
            //try
            //{
            //    using (IDbConnection db = new SqlConnection(connectionString))
            //    {
            //        var sqlQuery = "INSERT INTO Clients (Id, SubNetwork) VALUES(@Id, @SubNetwork);";
            //        //db.Query<string>(sqlQuery, client).FirstOrDefault();
            //        db.Query<string>(sqlQuery, new { client.Id, client.SubNetwork }).FirstOrDefault();
            //    }
            //}
            //catch
            //{
            //    return null;
            //}
            //return client;
        }

        public Client Update(Client client)
        {
            const string sqlQuery = "UPDATE Clients SET Id = @Id, SubNetwork = @SubNetwork " +
                                    "WHERE Id = @Id; " +
                                    "SELECT * FROM Clients WHERE Id = @id";
            Client updatedClient = DBQueryExecuter<Client>.ExecuteQuery(connectionString,
                                                      sqlQuery,
                                                      new { client.Id, client.SubNetwork })
                                                      .FirstOrDefault();
            return updatedClient;
            //try
            //{
            //    using (IDbConnection db = new SqlConnection(connectionString))
            //    {
            //        var sqlQuery = "UPDATE Clients SET Id = @Id, SubNetwork = @SubNetwork WHERE Id = @Id";
            //        //db.Execute(sqlQuery, client);
            //        //db.Query<string>(sqlQuery, client).FirstOrDefault();
            //        db.Query<string>(sqlQuery, new { client.Id, client.SubNetwork }).FirstOrDefault();
            //    }
            //}
            //catch
            //{
            //    return null;
            //}
            //return client;
        }

        public string Delete(string clientId)
        {
            const string sqlQuery = "DELETE FROM Clients WHERE Id = @Id;"+
                "SELECT * FROM Clients WHERE Id = @id";
            Client deletedClient = DBQueryExecuter<Client>.ExecuteQuery(connectionString,
                                                                   sqlQuery,
                                                                   new { Id = clientId })
                                                                   .FirstOrDefault();
            return deletedClient == null ? clientId : null;
            // using (IDbConnection db = new SqlConnection(connectionString))
            // {
            //     var sqlQuery = "DELETE FROM Clients WHERE Id = @Id";
            //     //db.Execute(sqlQuery, new { clientId });
            //     //db.Execute(sqlQuery, new { Id = clientId });
            //     db.Query<string>(sqlQuery, new { Id = clientId }).FirstOrDefault();
            // }
            // return clientId;
            //// return Id;
        }
    }
}
