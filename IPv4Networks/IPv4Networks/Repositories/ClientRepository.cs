using System.Collections.Generic;
using System.IO;
using System.Linq;
using IPv4Networks.Services;
using Microsoft.Extensions.Configuration;

namespace IPv4Networks.Models
{
    public class ClientRepository
    {
        private readonly string connectionString;
        public ClientRepository(IConfiguration configuration, string currentProjectDirectory)
        {
            var defaultConnectionString = configuration.GetConnectionString("DefaultConnection");
            connectionString = defaultConnectionString.Contains("%PROJECTROOTFOLDER%") ?
                               defaultConnectionString.Replace(
                                     "%PROJECTROOTFOLDER%", currentProjectDirectory/*Directory.GetCurrentDirectory()*/) :
                               defaultConnectionString;
        }

        public List<Client> GetClients()
        {
           var clients = DBQueryExecuter<Client>.ExecuteQuery(connectionString, "SELECT * FROM Clients", new { });
           return clients?.ToList();
        }

        public Client GetClientById(string id)
        {
            var sqlQuery = "SELECT * FROM Clients WHERE Id = @id";
            var client = DBQueryExecuter<Client>.ExecuteQuery(connectionString, sqlQuery, new { id });
            return client?.FirstOrDefault(); ;
        }

        public Client AddClient(Client client)
        {
            var sqlQuery = "INSERT INTO Clients (Id, SubNetwork) VALUES(@Id, @SubNetwork);SELECT * FROM Clients WHERE Id = @id";
            var addedClient = DBQueryExecuter<Client>.ExecuteQuery(connectionString,
                                            sqlQuery, new { client.Id, client.SubNetwork });
                                            
            return addedClient?.FirstOrDefault();
        }

        public Client Update(Client client)
        {
            const string sqlQuery = "UPDATE Clients SET Id = @Id, SubNetwork = @SubNetwork " +
                                    "WHERE Id = @Id; " +
                                    "SELECT * FROM Clients WHERE Id = @id";
            var updatedClient = DBQueryExecuter<Client>.ExecuteQuery(connectionString,
                                                      sqlQuery,
                                                      new { client.Id, client.SubNetwork });
            return updatedClient?.FirstOrDefault();
        }

        public string Delete(string clientId)
        {
            const string sqlQuery = "DELETE FROM Clients WHERE Id = @Id;"+
                "SELECT * FROM Clients WHERE Id = @id";
            var deletedClient = DBQueryExecuter<Client>.ExecuteQuery(connectionString,
                                                                   sqlQuery,
                                                                   new { Id = clientId });
            return deletedClient?.FirstOrDefault() == null ? clientId : null;
        }
    }
}
