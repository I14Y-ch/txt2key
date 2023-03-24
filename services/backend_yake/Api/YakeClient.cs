using System.Runtime.Serialization;

namespace Api
{
    public class YakeClient
    {
        public YakeClient(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public async Task<IEnumerable<YakeResult>> GetResults (Txt2KeyRequest request)
        {
            var languageForYake = request.language.Split('-').First();
            using var httpClient = new HttpClient();
            var yakeResponse = await httpClient.PostAsJsonAsync(Configuration.GetValue<string>("YakeEndpoint"),
                new YakeRequest(languageForYake, 1, 30, request.title + " " + request.description));

            if (!yakeResponse.IsSuccessStatusCode)
            {
                throw new YakeException ("Yake API returned statuscode: " + yakeResponse.StatusCode);
            }

            return await yakeResponse.Content.ReadFromJsonAsync<YakeResult[]>();
        }
    }

    [Serializable]
    public class YakeException : ApplicationException
    {
        public YakeException()
        {
        }

        public YakeException(string? message) : base(message)
        {
        }

        public YakeException(string? message, Exception? innerException) : base(message, innerException)
        {
        }

        protected YakeException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
