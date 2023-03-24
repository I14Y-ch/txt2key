package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	openai "github.com/sashabaranov/go-openai"
)

const systemMessage = `You are a smart keyword extractor system.
The user will give you information about a dataset which is part of a large catalogue of datasets.
Given these informations, return a list of simple, general keywords that are relevant to the context of the dataset.
Give exactly 5 keywords per language. The languages are german, english, italian and french. Make sure the keywords are the same across all languages. Use ISO language codes.
The structure of the answer has to match the following JSON:

{
  "keywords": [
    {
      "keyword": "",
      "language": ""
    },
	// ...
  ]
}
`

type RequestBody struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Publisher   string   `json:"publisher"`
	Topics      []string `json:"topics"`
}

type ResponseBody struct {
	Keywords []Keyword `json:"keywords"`
}

type Keyword struct {
	Keyword  string `json:"keyword"`
	Language string `json:"language"`
}

type Message struct {
	Keywords []Keyword `json:"keywords"`
}

func main() {
	apiKey, found := os.LookupEnv("OPENAI_API_KEY")

	if !found {
		log.Fatal("set OPENAI_API_KEY environment variable")
	}

	client := openai.NewClient(apiKey)

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "*",
	}))

	app.Post("/keywords", func(c *fiber.Ctx) error {
		var body RequestBody

		if err := c.BodyParser(&body); err != nil {
			return err
		}

		keywords, err := getKeywords(c.Context(), client, body.Title, body.Description, body.Publisher, strings.Join(body.Topics, ", "))

		if err != nil {
			fmt.Printf("failed to get keywords: %s\n", err.Error())
			return c.SendStatus(http.StatusInternalServerError)
		}

		resBody := ResponseBody{
			Keywords: keywords,
		}

		return c.JSON(resBody)
	})

	log.Fatal(app.Listen(":8080"))
}

func getKeywords(ctx context.Context, client *openai.Client, title, description, publisher, topics string) ([]Keyword, error) {
	promt := fmt.Sprintf("Title: %s\n\nDescription: %s\n\nTopcis: %s\n\nPublisher: %s", title, description, topics, publisher)

	fmt.Println(promt)

	systemMessage := openai.ChatCompletionMessage{
		Role:    openai.ChatMessageRoleSystem,
		Content: systemMessage,
	}

	userMessage := openai.ChatCompletionMessage{
		Role:    openai.ChatMessageRoleUser,
		Content: promt,
	}

	resp, err := client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model:     openai.GPT3Dot5Turbo,
			MaxTokens: 1000,
			Messages: []openai.ChatCompletionMessage{
				systemMessage,
				userMessage,
			},
		},
	)

	if err != nil {
		return nil, err
	}

	fmt.Println(resp.Choices[0].Message.Content)

	var message Message

	if err := json.Unmarshal([]byte(resp.Choices[0].Message.Content), &message); err != nil {
		return nil, err
	}

	return message.Keywords, nil
}

// func getKeywordsCompletion(client *openai.Client, title, description, publisher, topics string) ([]Keyword, error) {
// 	promt := fmt.Sprintf("%s\n\nTitle: %s\n\nDescription: %s\n\nTopcis: %s\n\nPublisher: %s", prompt, title, description, topics, publisher)

// 	fmt.Println(promt)

// 	resp, err := client.CreateCompletion(
// 		context.Background(),
// 		openai.CompletionRequest{
// 			Model:     openai.GPT3TextDavinci003,
// 			Prompt:    promt,
// 			MaxTokens: 1000,
// 		},
// 	)

// 	if err != nil {
// 		return nil, err
// 	}

// 	fmt.Println(resp.Choices[0].Text)

// 	return []Keyword{}, nil
// }
