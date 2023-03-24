namespace Api;

public interface ITranslator
{
    Task<IEnumerable<Txt2KeyResult>> TranslateResult(Txt2KeyResult result);
}
