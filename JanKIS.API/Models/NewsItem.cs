using System;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class NewsItem : IId
    {
        public string Id { get; }
        public DateTime PublishTimestamp { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public string Content { get; set; }
    }
}
