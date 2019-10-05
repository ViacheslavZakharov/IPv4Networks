using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IPv4Networks.Services;
//using NUnit.Framework;

namespace IPv4Networks.Tests
{
   // [TestFixture]
    public class ClientCheckerTests
    {
      //  [Test]
        public void EmptyIPAddress()
        {
           // Assert.That(ClientChecker.IsValidIPAddress(""), Is.EqualTo(false));
        }

       // [Test]
        public void SympleStringButNotIPAddress()
        {
        //    Assert.That(ClientChecker.IsValidIPAddress("abc"), Is.EqualTo(false));
        }

       // [Test]
        public void CorrectIPAddress()
        {
       //     Assert.That(ClientChecker.IsValidIPAddress("123.123.123.123/24"), Is.EqualTo(true));
        }
    }
}
