using CognitiveServices.Translator;
using CognitiveServices.Translator.Translate;

namespace Api;

public class AzureTranslator : ITranslator
{
    public AzureTranslator(ITranslateClient translateClient)
    {
        TranslateClient = translateClient;
    }

    public ITranslateClient TranslateClient { get; }

    public async Task<IEnumerable<Txt2KeyResult>> TranslateResult(Txt2KeyResult result)
    {
        var languages = new[] { "de", "fr", "it", "en" };
        var missingLanguages = languages.Where(language => language != result.Language.Split('-').First()).ToArray();

        var translateResult = await TranslateClient.TranslateAsync
        (
            new RequestContent { Text = result.Keyword },
            new RequestParameter { From = result.Language, To = missingLanguages }
        );

        return translateResult
            .SelectMany (response => response.Translations)
            .Select (translation => new Txt2KeyResult(translation.Text, translation.To))
            .Append (result);
    }
}
