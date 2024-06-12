package apiv1handler

import (
	"net/url"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)

// Handler for /login endpoint
type LoginHandler struct {
	clientId            string
	redirectUri         string
	scope               string
	codeChallengeMethod string
	authUrl             string
}

// Constructor method
func NewLoginHandler() *LoginHandler {
	return &LoginHandler{
		clientId:            os.Getenv("GITLAB_CLIENT_ID"),
		redirectUri:         os.Getenv("REDIRECT_URI"),
		scope:               os.Getenv("SCOPE"),
		codeChallengeMethod: os.Getenv("CODE_CHALLENGE_METHOD"),
		authUrl:             os.Getenv("AUTH_URL"),
	}
}

// Provides the Oauth URL with provided state and code_challenge from url params.
func (l *LoginHandler) Login(c *fiber.Ctx, store *session.Store) error {
	stateparam := c.Query("state")
	challengeparam := c.Query("code_challenge")

	if stateparam == "" || challengeparam == "" {
		return fiber.ErrBadRequest
	}

	params := url.Values{}
	params.Add("client_id", l.clientId)
	params.Add("redirect_uri", l.redirectUri)
	params.Add("response_type", "code")
	params.Add("state", stateparam)
	params.Add("scope", l.scope)
	params.Add("code_challenge", challengeparam)
	params.Add("code_challenge_method", l.codeChallengeMethod)

	oauthURL := l.authUrl + params.Encode()

	return c.JSON(fiber.Map{"url": oauthURL})
}
