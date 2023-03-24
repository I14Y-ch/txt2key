using Api;
using CognitiveServices.Translator.Extension;
using Api.TermDatClient;
using Microsoft.AspNetCore.Http.Extensions;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCognitiveServicesTranslator(builder.Configuration);
builder.Services.AddScoped<YakeClient>();
builder.Services.AddScoped<ITranslator, AzureTranslator>();

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}

app.MapPost("/keywords", async (HttpContext httpContext) =>
{
    var configuration = httpContext.RequestServices.GetRequiredService<IConfiguration>();
    var yakeClient = httpContext.RequestServices.GetRequiredService<YakeClient>();
    var translator = httpContext.RequestServices.GetRequiredService<ITranslator>();

    var request = await httpContext.Request.ReadFromJsonAsync<Txt2KeyRequest>();
    if (request == null)
    {
        return Results.BadRequest("Body must not be null");
    }

    IEnumerable<YakeResult> yakeResult;
    try
    {
         yakeResult = await yakeClient.GetResults(request);
    }
    catch (YakeException e)
    {
        return Results.Problem(e.Message);
    }

    var blockList = configuration.GetValue<string>("BlockList")!.Split(',');

    var filteredYakeResult = yakeResult
        .Where(x => x.score <= 0.15)
        .Where(result => result.ngram.Length > 3)
        .Where(result => !blockList.Any(blocked => result.ngram.Contains(blocked, StringComparison.InvariantCultureIgnoreCase)))
        .ToList();

    var termDatClient = new Client("https://api.termdat.bk.admin.ch", new HttpClient());

    var translateTasks = filteredYakeResult
        .Select(result => new Txt2KeyResult(result.ngram, request.language))
        .Select(result => translator.TranslateResult(result));

    var taskResult = await Task.WhenAll(translateTasks);
    var results = taskResult.SelectMany(x => x);

    foreach (var item in filteredYakeResult)
    {
        var termDatSearchResponse = await termDatClient.VSearchAsync(new[] { 1110, 102, 11446, 10426 }, new[] { 1, 2, 24, 3, 4, 22, 5, 6, 7, 8, 23, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 }, null, null, null, null, null, null, null, null, null, null, null,  yakeClient.language, null,  yakeClient.language, item.ngram, ReturnType.Summary, "2");
        if(termDatSearchResponse.Result.Count <= 0)
        {
            continue;
        }
        var termDatEntryId = termDatSearchResponse.Result.First().Id;
    

        var termDatEntryResponseDeEn = await termDatClient.VEntryAsync("de", "en", new[] { termDatEntryId }, "2");
        var termDatEntryResponsFrIt = await termDatClient.VEntryAsync("fr", "it", new[] { termDatEntryId }, "2");
        var languageDetailsArray = termDatEntryResponseDeEn.Result.FirstOrDefault().LanguageDetails.ToArray();
        var fullResponse = languageDetailsArray.Concat(termDatEntryResponsFrIt.Result.FirstOrDefault().LanguageDetails.ToArray())
                            .Where (x => !string.IsNullOrEmpty(x.Name))
                            .GroupBy(x => x.Sequence)
                            .Where(x => x.Any(y => y.Name.Contains(item.ngram, StringComparison.InvariantCultureIgnoreCase)))
                            .SelectMany(x => x.Select(y => new Txt2KeyResult(y.Name, y.LanguageIsoCode)));
        results = results.Concat(fullResponse);
    }


    return Results.Json(results.ToArray());
}).WithOpenApi().Accepts<Txt2KeyRequest>("application/json").Produces<Txt2KeyResult>();


app.MapMethods("/keywords", new[] { "OPTIONS" }, (HttpContext httpContext) => Results.Ok()).ExcludeFromDescription();

app.Run();

public record YakeRequest
(
    string language,
    int max_ngram_size,
    int number_of_keywords,
    string text
);

public record YakeResult
(
    string ngram,
    float score
);

public record Txt2KeyResult
(
    string Keyword,
    string Language
);

public record Txt2KeyRequest
(
    string title,
    string description,
    string[] topics,
    string publisher,
    string language = "de"
);

public record TermDatSearchRequest
(
    int[] collectionIds,
    string inLanguageCode,
    string searchTerm,
    string returnType = "Summary"
);

public record TermDatSearchResponse
(
      int id,
      string url,
      TermDatStatus status,
      TermDatReliability reliability,
      TermDatOffice office,
      TermDatCollection collection,
      TermDatClassification classification,
      TermDatHits[] hits
);

public record TermDatStatus(string code, string text);
public record TermDatReliability(string code, string text);
public record TermDatOffice(int id, string code,  string text);
public record TermDatCollection(int it, string code, string text);
public record TermDatClassification(int it, string code, string text);
public record TermDatHits(string name0);