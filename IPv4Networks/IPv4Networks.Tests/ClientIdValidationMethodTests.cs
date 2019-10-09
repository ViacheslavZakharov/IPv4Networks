using IPv4Networks.Models;
using IPv4Networks.Services;
using Microsoft.Extensions.Configuration;
using NUnit.Framework;
using System;
using System.Text;

namespace IPv4Networks.Tests
{
    public class ClientIdValidationMethodTests
    {
        private readonly ClientRepository repo;
        public ClientIdValidationMethodTests()
        {
            IConfiguration configuration = GetterConfiguration.GetConfiguration();
            var currentDirOfTestedProject = GetterConfiguration.GetCurrentDirOfTestedProject();
            repo = new ClientRepository(configuration, currentDirOfTestedProject);
        }

        [SetUp]
        public void Setup()
        {
            
        }

        [Test]
        public void EmptyClientId()
        {
            Assert.That(ClientChecker.IsValidClientId(repo, ""), Is.EqualTo(false));
        }

        [Test]
        public void VeryBigClientId()
        {
            string englishAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            string randomBigId = MakeRandomString(englishAlphabet, 256);
            Assert.That(ClientChecker.IsValidClientId(repo,randomBigId), Is.EqualTo(false));
        }

        [TestCase(200, true)]
        [TestCase(1, true)]
        [TestCase(50, true)]
        public void CorrectClientIdEnglish(int lenghtClientId, bool expectedResult)
        {
            string engAlphabetWithPunctuation = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ,.;!-";
            string randomBigId = MakeRandomString(engAlphabetWithPunctuation, lenghtClientId);
            Assert.That(ClientChecker.IsValidClientId(repo,randomBigId), Is.EqualTo(expectedResult));
        }

        [TestCase(200, true)]
        [TestCase(1, true)]
        [TestCase(50, true)]
        public void CorrectClientIdRussian(int lenghtClientId, bool expectedResult)
        {
            string rusAlphabetWithPunctuation =
                "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя ,.;!-";
            string randomBigId = MakeRandomString(rusAlphabetWithPunctuation, lenghtClientId);
            Assert.That(ClientChecker.IsValidClientId(repo,randomBigId), Is.EqualTo(expectedResult));
        }

        [Test]
        public void AddingNotUniqueId()
        {
            //добавим клиента в базу данных, затем получим его по id
            //и попробуем добавить другого пользователя с таким же id
            Client addedClient = new Client { Id = "newId2", SubNetwork = "222.222.222.222/20" };
            repo.AddClient(addedClient);
            Client client = repo.GetClientById(addedClient.Id);
            try
            {
                Assert.That(ClientChecker.IsValidClientId(repo, client.Id), Is.EqualTo(false));
            }
            finally
            {
                repo.Delete(client.Id);
            }
        }

        public string MakeRandomString(string alphabet, int lenghtString)
        {
            Random rnd = new Random();
            StringBuilder stringBuilder = new StringBuilder();
            for(int i = 0; i < lenghtString; i++)
            {
                var positionInAlphabet = rnd.Next(0,alphabet.Length - 1);
                stringBuilder.Append(alphabet[positionInAlphabet]);
            }
            return stringBuilder.ToString();
        }
    }
}
