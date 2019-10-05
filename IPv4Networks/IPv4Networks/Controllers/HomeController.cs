using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using IPv4Networks.Models;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using IPv4Networks.Services;

namespace IPv4Networks.Controllers
{
    public class HomeController : Controller
    {
        public readonly ClientRepository repo;

        public HomeController(IConfiguration configuration)
        {
            repo = new ClientRepository(configuration);
        }

        public IActionResult Index()
        {
            var listClients = repo.GetClients();
            return View(listClients);
        }

        [HttpPost]
        public Client AddClient(Client client)
        {
            //if(client != null && ClientChecker.IsValidClientId(repo, client.Id) &&
            //    ClientChecker.IsValidIPAddress(client.SubNetwork))
            //{
            //    repo.AddClient(client);
            //}
            //else
            //{
            //    return null;
            //}
            //return client;
            return client != null &&
                   client.Id != null &&
                   client.SubNetwork != null &&
                   ClientChecker.IsValidClientId(repo, client.Id) &&
                   ClientChecker.IsValidIPAddress(client.SubNetwork) ?
                        repo.AddClient(client) :
                        null;
        }

        [HttpPut]
        public Client EditClient(EditingClient editingClient)
        {
            Client newClient = editingClient.client;
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
