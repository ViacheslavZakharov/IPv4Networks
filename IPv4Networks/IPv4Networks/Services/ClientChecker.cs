using IPv4Networks.Models;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;

namespace IPv4Networks.Services
{
    public static class ClientChecker
    {
        public static bool IsValidIPAddress(string ipAddress)
        {
            string regExp = @"^\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/([0-9]|[1-2][\d]|3[0-2])\b$";
            if (!Regex.IsMatch(ipAddress, regExp))
                return false;
            return IPAddress.TryParse(ipAddress.Split("/")[0], out IPAddress dummy);
        }

        public static bool IsValidClientId(ClientRepository repo, string clientId)
        {
            return clientId.Length > 0 && clientId.Length <= 255 &&
                    repo.GetClients()
                    .FirstOrDefault(client => client.Id == clientId) == null;
        }
    }
}
