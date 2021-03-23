using System;
using JanKIS.API.AccessManagement;
using NUnit.Framework;

namespace JanKIS.API.Test.AccessManagement
{
    public class TemporaryPasswordGeneratorTest
    {
        [Test]
        public void ExceptionThrownForNonPositiveLength()
        {
            Assert.That(() => TemporaryPasswordGenerator.Generate(-1), Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void PasswordOfRequestedLengthIsGenerated()
        {
            const int Length = 5;
            var password = TemporaryPasswordGenerator.Generate(Length);
            Assert.That(password.Length, Is.EqualTo(Length));
        }
    }
}