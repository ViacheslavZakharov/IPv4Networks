using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace IPv4Networks.Tests
{
    public static class GetterConfiguration
    {
        public static IConfiguration GetConfiguration()
        {
            IConfiguration configuration;
            var dir = Directory.GetCurrentDirectory();
            DirectoryInfo dirInfo = new DirectoryInfo(dir);
            //для того, чтобы использовать файл настроек из основного проекта
            dir = dirInfo.Parent //переходим из netcoreapp2.1 в Debug
                         .Parent //переходим в bin
                         .Parent //переходим в IPv4Networks.Tests
                         .Parent //переходим в основную папку IPv4Networks
                         .ToString();
            dir += "\\IPv4Networks"; //переходим в папку тестируемого проекта
            var builder = new ConfigurationBuilder()
            //.SetBasePath(Directory.GetCurrentDirectory())
            .SetBasePath(dir)
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            configuration = builder.Build();
            return configuration;
        }
    }
}
