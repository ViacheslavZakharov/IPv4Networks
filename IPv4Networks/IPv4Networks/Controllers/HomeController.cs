using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using IPv4Networks.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using IPv4Networks.Services;

namespace IPv4Networks.Controllers
{
    public class HomeController : Controller
    {
        public readonly ClientRepository repo;//для работы с базой данных

        public HomeController(IConfiguration configuration)
        {
            repo = new ClientRepository(configuration, System.IO.Directory.GetCurrentDirectory());
        }

        public IActionResult Index()
        {
            var listClients = repo.GetClients();
            return View(listClients);
        }

        [HttpPost]
        public Client AddClient(Client client)
        {
            return client != null && //если данные пришли
                   client.Id != null &&
                   client.SubNetwork != null &&
                   ClientChecker.IsValidClientId(repo, client.Id) && //и id является валидным
                   ClientChecker.IsValidIPAddress(client.SubNetwork) ? //и адрес подсети валидный
                        repo.AddClient(client) : //то возвращаем добавленного клиента
                        null; // иначе передаем на клиент null
        }

        [HttpPut]
        public Client EditClient(EditingClient editingClient)
        {
            Client newClient = editingClient.Client;
            Func<Client> updateClient = () =>
                    ClientChecker.IsValidIPAddress(newClient.SubNetwork) ?
                    repo.Update(newClient) : 
                    null; //если адрес не валидный то возвращаем null

            Func<Client> addNewAndDeleteOldClient = () =>
            {
                if (ClientChecker.IsValidClientId(repo, newClient.Id) &&
                ClientChecker.IsValidIPAddress(newClient.SubNetwork))
                {
                    repo.Delete(editingClient.OldClientId);
                    return repo.AddClient(newClient);
                }
                return null;
            };

            return editingClient != null && newClient.Id != null &&
                   newClient.SubNetwork != null ? //если данные пришли
                        editingClient.OldClientId == newClient.Id ? //если id совпадают
                            updateClient() : //то обновляем клиента
                            addNewAndDeleteOldClient() ://если не совпадают,
                                                        //то удаляем старого и добавляем как нового
                   null;//если данные не пришли

        }

        [HttpDelete]
        public Client RemoveClient(Client client)
        {
            return repo.Delete(client.Id) != null ? 
                        client :
                        null;

        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
