using Api.TermDatClient;
using Microsoft.AspNetCore.Http.Extensions;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}


app.MapPost("/keywords", async (HttpContext httpContext) =>
{
    var postBody = await httpContext.Request.ReadFromJsonAsync<Txt2KeyRequest>();
    if (postBody == null)
    {
        return Results.BadRequest("Body must not be null");
    }

    var languageForYake = postBody.language.Split('-').First();
    using var httpClient = new HttpClient();
    var yakeResponse = await httpClient.PostAsJsonAsync("http://yake-for-text2key.dpehejbsfqaxhqbs.germanywestcentral.azurecontainer.io:5000/yake/",
        new YakeRequest(languageForYake, 1, 30, postBody.title + " " + postBody.description));

    if (!yakeResponse.IsSuccessStatusCode)
    {
        return Results.Problem("Yake API returned statuscode: " + yakeResponse.StatusCode);
    }

    var yakeResult = await yakeResponse.Content.ReadFromJsonAsync<YakeResult[]>();
    var filteredYakeResult = yakeResult.Where(x => x.score <= 0.15).ToList();

    var termDatClient = new Client("https://api.termdat.bk.admin.ch", httpClient);

    var result = filteredYakeResult!.Select(x => new Txt2KeyResult(x.ngram, languageForYake)).ToList();

    var taskList = filteredYakeResult.Select(x => termDatClient.VSearchAsync(new[] { 1110, 102, 11446, 10426 }, new[] { 1, 2, 24, 3, 4, 22, 5, 6, 7, 8, 23, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 }, null, null, null, null, null, null, null, null, null, null, null, languageForYake, null, languageForYake, x.ngram, ReturnType.Summary, "2"));
    await Task.WhenAll(taskList.ToArray());


    foreach (var item in filteredYakeResult)
    {
        var termDatSearchResponse = await termDatClient.VSearchAsync(new[] { 1110, 102, 11446, 10426 }, new[] { 1, 2, 24, 3, 4, 22, 5, 6, 7, 8, 23, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 }, null, null, null, null, null, null, null, null, null, null, null, languageForYake, null, languageForYake, item.ngram, ReturnType.Summary, "2");
        if(termDatSearchResponse.Result.Count <= 0)
        {
            continue;
        }
        var termDatEntryId = termDatSearchResponse.Result.First().Id;

        var termDatEntryResponseDeEn = await termDatClient.VEntryAsync("de", "en", new[] { termDatEntryId }, "2");
        var termDatEntryResponsFrIt = await termDatClient.VEntryAsync("fr", "it", new[] { termDatEntryId }, "2");
        var languageDetailsArray = termDatEntryResponseDeEn.Result.FirstOrDefault().LanguageDetails.ToArray();
        languageDetailsArray.Concat(termDatEntryResponsFrIt.Result.FirstOrDefault().LanguageDetails.ToArray());

        foreach (var keyword in languageDetailsArray)
        {
            if (keyword.Name != null && keyword.Name.ToLower().Contains(item.ngram.ToLower()))
            {
                var index = Array.IndexOf(languageDetailsArray, keyword);
                result.Add(new Txt2KeyResult(languageDetailsArray[index].Name, languageDetailsArray[index].LanguageIsoCode));
                result.Add(new Txt2KeyResult(languageDetailsArray[index * 2 + 1].Name, languageDetailsArray[index * 2 + 1].LanguageIsoCode));
            }
        }
    }


    return Results.Json(result);
}).WithOpenApi().Accepts<Txt2KeyRequest>("application/json");

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