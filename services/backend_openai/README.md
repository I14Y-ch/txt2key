# txt2key via OpenAI API

## Build

```shell
docker build . -t txt2key --platform linux/amd64
```

## Run
```shell
docker run -e OPENAI_API_KEY="xxx" -p 8080:8080 txt2key
```

## Request

```shell
curl --request POST \
  --url http://txt2key.gagthhcwf2e2feca.switzerlandnorth.azurecontainer.io:8080/keywords \
  --header 'Content-Type: application/json' \
  --data '{
	"title": "Swiss Standard ...",
	"description": "The Swiss Standard Classification ...",
	"publisher": "Federal Statistical Office",
	"topics": [
		"Official statistics",
		"Labour",
	]
}'
```