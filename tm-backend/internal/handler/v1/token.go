package apiv1handler

import (
	"1dv027/wt1/internal/dto"
	"encoding/json"
	"io"
	"net/http"
	"net/url"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/middleware/session"
)

type JwtService interface {
	GetUserDataFromJwt(idToken string) (*dto.UserData, error)
}

// Handler for /token endpoint
type TokenHandler struct {
	jwtService  JwtService
	clientId    string
	redirectUri string
	tokenUrl    string
}

// Constructor method
func NewTokenHandler(jwtService JwtService) *TokenHandler {
	return &TokenHandler{
		jwtService:  jwtService,
		clientId:    os.Getenv("GITLAB_CLIENT_ID"),
		redirectUri: os.Getenv("REDIRECT_URI"),
		tokenUrl:    os.Getenv("TOKEN_URL"),
	}
}

type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	IDToken      string `json:"id_token"`
}

type AuthResponse struct {
	AccessToken string       `json:"access_token"`
	UserData    dto.UserData `json:"user_data"`
}

// Queries the oauth+oid endpoint with provided code and code_verifier for data.
func (t *TokenHandler) Handle(c *fiber.Ctx, store *session.Store) error {
	receivedCode := c.FormValue("code")
	receivedVerifier := c.FormValue("code_verifier")

	formData := url.Values{}
	formData.Set("client_id", t.clientId)
	formData.Set("code", receivedCode)
	formData.Set("grant_type", "authorization_code")
	formData.Set("redirect_uri", t.redirectUri)
	formData.Set("code_verifier", receivedVerifier)

	resp, err := http.PostForm(t.tokenUrl, formData)
	if err != nil {
		log.Infof("Post to gitlab failed: %s", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to request token"})
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		switch resp.StatusCode {
		case 401:
			return fiber.ErrUnauthorized
		case 400:
			return fiber.ErrBadRequest
		case 500:
			return fiber.ErrInternalServerError
		default:
			return fiber.ErrInternalServerError
		}
	}

	var tokenResponse TokenResponse

	body, readErr := io.ReadAll(resp.Body)
	if readErr != nil {
		log.Infof("Failed to read response body: %s", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to read response body"})
	}

	if err := json.Unmarshal(body, &tokenResponse); err != nil {
		log.Infof("Failed to unmarshal body: %s", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to parse token response"})
	}

	userData, err := t.jwtService.GetUserDataFromJwt(tokenResponse.IDToken)
	if err != nil {
		log.Infof("Failed get user data from jwt: %s", err)
		return err
	}

	session, err := store.Get(c)
	if err != nil {
		log.Infof("Failed to get session")
		return err
	}

	session.Set("access_token", tokenResponse.AccessToken)
	session.Set("refresh_token", tokenResponse.RefreshToken)
	session.Set("code_verifier", receivedVerifier)
	session.Save()

	response := AuthResponse{
		AccessToken: tokenResponse.AccessToken,
		UserData:    *userData,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
