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
    using var httpClient = new HttpClient();
    var yakeResponse = await httpClient.PostAsJsonAsync("http://yake-for-text2key.dpehejbsfqaxhqbs.germanywestcentral.azurecontainer.io:5000/yake/", new YakeRequest("de", 1, 30, postBody.title + " " + postBody.description));
    if (!yakeResponse.IsSuccessStatusCode)
    {
        return Results.Problem();
    }
    
    var yakeResult = await yakeResponse.Content.ReadFromJsonAsync<YakeResult[]>();
    return Results.Json(yakeResult!.Where(result => result.score < 0.15).Select(result => new Txt2KeyResult(result.ngram, "de")).ToArray());
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
    string? language = null
);