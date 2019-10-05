using IPv4Networks.Services;
using NUnit.Framework;
using System.Text.RegularExpressions;

namespace IPv4Networks.Tests
{
    public class TestIPv4Networks
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void EmptyIPAddress()
        {
             Assert.That(ClientChecker.IsValidIPAddress(""), Is.EqualTo(false));
        }

        [Test]
        public void SpaceIPAddress()
        {
            Assert.That(ClientChecker.IsValidIPAddress(" "), Is.EqualTo(false));
        }

        [Test]
        public void IPAddressWithSpaceAfter()
        {
            Assert.That(ClientChecker.IsValidIPAddress("123.123.123.123/24 "), Is.EqualTo(false));
        }

        [TestCase("sdsd 1.1.1.1/20", false)]
        [TestCase("123.123.123.123/24 asfaf", false)]
        [TestCase("adfsd 123.123.123.123/24 asfaf", false)]
        public void IPAddressWithOtherInformation(string ipAddress, bool expectedResult)
        {
            Assert.That(ClientChecker.IsValidIPAddress(ipAddress), Is.EqualTo(expectedResult));
        }

        [Test]
        public void IPAddressWithSpaceBefore()
        {
            Assert.That(ClientChecker.IsValidIPAddress(" 123.123.123.123/24"), Is.EqualTo(false));
        }

        [Test]
        public void IPAddressWithSpaceInMiddle()
        {
            Assert.That(ClientChecker.IsValidIPAddress("123. 123.123.123/24"), Is.EqualTo(false));
        }

        [Test]
        public void IPAddressWithComma()
        {
            Assert.That(ClientChecker.IsValidIPAddress("123,123,123,123/24"), Is.EqualTo(false));
        }

        [Test]
        public void IPAddressWithOutSubnetMask()
        {
            Assert.That(ClientChecker.IsValidIPAddress("123.123.123.123"), Is.EqualTo(false));
        }

        [Test]
        public void SympleStringButNotIPAddress()
        {
                Assert.That(ClientChecker.IsValidIPAddress("abc"), Is.EqualTo(false));
        }

        [TestCase("1.1.1.1/20",true)]
        [TestCase("123.123.123.123/24", true)]
        [TestCase("1.0.1.0/5", true)]
        [TestCase("255.255.255.0/5", true)]
        [TestCase("255.0.0.0/32", true)]
        [TestCase("255.255.255.255/0", true)]
        [TestCase("0.0.0.0/32", true)]
        public void CorrectIPAddress(string ipAddress, bool expectedResult)
        {
           Assert.That(ClientChecker.IsValidIPAddress(ipAddress), Is.EqualTo(expectedResult));
        }

        [TestCase("1231.1231.1231.1231/24", false)]
        [TestCase("256.0.1.0/5", false)]
        [TestCase("1.255.255.256/5", false)]
        [TestCase("3.0.0.0/35", false)]
        public void NotCorrectIPAddress(string ipAddress, bool expectedResult)
        {
            Assert.That(ClientChecker.IsValidIPAddress(ipAddress), Is.EqualTo(expectedResult));
        }
    }
}