using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HealthModels.Interview
{
    public class Questionnaire : IId
    {
        [Required]
        public string Id { get; set; }
        /// <summary>
        /// Two-letter ISO 639-1 code indicating the language of the questionnaire
        /// </summary>
        [Required]
        public Language Language { get; set; }
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        [Required]
        public List<Question> Questions { get; set; }
    }
}
