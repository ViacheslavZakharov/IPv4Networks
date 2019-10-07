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

            var builder = new ConfigurationBuilder()
            .SetBasePath(GetCurrentDirOfTestedProject())
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            configuration = builder.Build();
            return configuration;
        }

        public static string GetCurrentDirOfTestedProject()
        {
            var currentDirOfTestedProject = Directory.GetCurrentDirectory();
            DirectoryInfo dirInfo = new DirectoryInfo(currentDirOfTestedProject);
            //для того, чтобы использовать файл настроек из основного проекта
            currentDirOfTestedProject = dirInfo.Parent //переходим из netcoreapp2.1 в Debug
                         .Parent //переходим в bin
                         .Parent //переходим в IPv4Networks.Tests
                         .Parent //переходим в основную папку IPv4Networks
                         .ToString();
           return currentDirOfTestedProject += "\\IPv4Networks"; //переходим в папку тестируемого проекта
        }
    }
}
