using System;
using HealthSharingPortal.API.AccessControl;
using NUnit.Framework;

namespace JanKIS.API.Test.AccessManagement
{
    public class TemporaryPasswordGeneratorTest
    {
        [Test]
        public void ExceptionThrownForNonPositiveLength()
        {
            Assert.That(() => new TemporaryPasswordGenerator().Generate(-1), Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void PasswordOfRequestedLengthIsGenerated()
        {
            const int Length = 5;
            var password = new TemporaryPasswordGenerator().Generate(Length);
            Assert.That(password.Length, Is.EqualTo(Length));
        }
    }
}