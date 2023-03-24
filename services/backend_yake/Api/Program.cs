using Api;
using CognitiveServices.Translator.Extension;

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

    var translateTasks = yakeResult!
        .Where(result => result.score < 0.15)
        .Select(result => new Txt2KeyResult(result.ngram, request.language))
        .Select(result => translator.TranslateResult(result));

    var results = await Task.WhenAll(translateTasks);

    return Results.Json(results.SelectMany (result => result).ToArray ());
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