using HealthModels.Interview;

namespace HealthModels.Extensions
{
    public static class TranslationsExtensions
    {
        public static void Translate(
            this IHasTranslations item,
            Language language)
        {
            if(language == Language.en)
                return;
            if (item.Translations.ContainsKey(language)) 
                item.Name = item.Translations[language];
        }
    }
}
