using System;
using System.Collections.Generic;
using System.Linq;
using HealthModels.Interview;
using Newtonsoft.Json.Linq;

namespace JanKIS.API.Workflow
{
    public class QuestionaireToSchemaConverter
    {
        public JObject Convert(Questionnaire questionnaire)
        {
            var schema = new JObject
            {
                { "type", "object" }, 
                { "title", questionnaire.Title }, 
                { "description", questionnaire.Description }
            };
            var properties = new JObject();
            var required = new List<string>();
            for (var questionIndex = 0; questionIndex < questionnaire.Questions.Count; questionIndex++)
            {
                var question = questionnaire.Questions[questionIndex];
                var propertyDefinition = new JObject();
                var type = Translate(question.ResponseType);
                propertyDefinition.Add("type", type);
                propertyDefinition.Add("title", question.Title);
                propertyDefinition.Add("description", question.Text);
                if(type == "string")
                {
                    var format = GetFormat(question.ResponseType);
                    if(format != null)
                        propertyDefinition.Add("format", format);
                }
                if (question.ResponseType == QuestionResponseType.MultipleChoice)
                {
                    var itemsDefinition = new JObject
                    {
                        { "type", "string" }, 
                        { "enum", new JArray(question.Options) },
                        { "minItems", 1 },
                        { "uniqueItems", true }
                    };
                    propertyDefinition.Add("items", itemsDefinition);
                }
                if(question.ResponseType == QuestionResponseType.SingleChoice)
                {
                    propertyDefinition.Add("enum", new JArray(question.Options));
                }

                var questionName = $"Q{questionIndex+1}";
                var property = new JProperty(questionName, propertyDefinition);
                properties.Add(property);
                if(question.IsRequired)
                    required.Add(questionName);
            }

            schema.Add("properties", properties);
            if(required.Any())
                schema.Add("required", new JArray(required));
            return schema;
        }

        private string GetFormat(QuestionResponseType responseType)
        {
            switch (responseType)
            {
                case QuestionResponseType.FreeText:
                case QuestionResponseType.SingleChoice:
                    return null;
                case QuestionResponseType.MultipleChoice:
                case QuestionResponseType.Number:
                case QuestionResponseType.TrueFalse:
                    throw new ArgumentException($"Format is not supported for question response type '{responseType}'");
                case QuestionResponseType.Date:
                    return "date";
                case QuestionResponseType.Time:
                    return "time";
                case QuestionResponseType.DateTime:
                    return "date-time";
                default:
                    throw new ArgumentOutOfRangeException(nameof(responseType), responseType, null);
            }
        }

        private string Translate(QuestionResponseType responseType)
        {
            switch (responseType)
            {
                case QuestionResponseType.FreeText:
                case QuestionResponseType.SingleChoice:
                case QuestionResponseType.Date:
                case QuestionResponseType.Time:
                case QuestionResponseType.DateTime:
                    return "string";
                case QuestionResponseType.MultipleChoice:
                    return "array";
                case QuestionResponseType.Number:
                    return "number";
                case QuestionResponseType.TrueFalse:
                    return "boolean";
                default:
                    throw new ArgumentOutOfRangeException(nameof(responseType), responseType, null);
            }
        }
    }
}