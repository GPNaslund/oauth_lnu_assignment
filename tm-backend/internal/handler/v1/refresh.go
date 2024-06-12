package apiv1handler

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/middleware/session"
)

type RefreshTokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type NewAccessTokenResponse struct {
	AccessToken string `json:"access_token"`
}

// Handler for /refresh endpoint
type RefreshHandler struct {
	clientId    string
	redirectUri string
	tokenUrl    string
}

// Constructor method
func NewRefreshHandler() *RefreshHandler {
	return &RefreshHandler{
		clientId:    os.Getenv("GITLAB_CLIENT_ID"),
		redirectUri: os.Getenv("REDIRECT_URI"),
		tokenUrl:    os.Getenv("TOKEN_URL"),
	}
}

// Queries oauth endpoint for new access_token through stored refresh_token and verifier.
func (r *RefreshHandler) Refresh(c *fiber.Ctx, store *session.Store) error {
	session, err := store.Get(c)
	if err != nil {
		return fiber.ErrInternalServerError
	}

	refreshToken, verifier, err := r.getRefreshTokenAndVerifier(session)
	if err != nil {
		return fiber.ErrInternalServerError
	}

	resp, err := r.makePostRequest(refreshToken, verifier)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
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

	var tokenResponse RefreshTokenResponse

	body, readErr := io.ReadAll(resp.Body)
	if readErr != nil {
		log.Infof("Failed to read response body: %s", readErr)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to read response body"})
	}

	if err := json.Unmarshal(body, &tokenResponse); err != nil {
		log.Infof("Failed to unmarshal body: %s", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to parse token response"})
	}

	session.Set("access_token", tokenResponse.AccessToken)
	session.Set("refresh_token", tokenResponse.RefreshToken)
	session.Save()

	response := NewAccessTokenResponse{
		AccessToken: tokenResponse.AccessToken,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}

// Method for getting and verifying the refresh_token and verifier from the session store.
func (r *RefreshHandler) getRefreshTokenAndVerifier(session *session.Session) (string, string, error) {
	refreshToken := session.Get("refresh_token")
	if refreshToken == nil {
		return "", "", fiber.ErrUnauthorized
	}

	refreshTokenString, ok := refreshToken.(string)
	if !ok {
		log.Infof("Verify: Failed to type cast at to string")
		return "", "", fiber.ErrInternalServerError
	}

	codeVerifier := session.Get("code_verifier")
	if codeVerifier == nil {
		return "", "", fiber.ErrUnauthorized
	}

	codeVerifierString, ok := codeVerifier.(string)
	if !ok {
		log.Infof("Verify: Failed to type cast at to string")
		return "", "", fiber.ErrInternalServerError
	}

	return refreshTokenString, codeVerifierString, nil
}

// Makes the post request to the oauth endpoint.
func (r *RefreshHandler) makePostRequest(refreshToken, verifier string) (*http.Response, error) {
	formData := url.Values{}
	formData.Set("client_id", r.clientId)
	formData.Set("refresh_token", refreshToken)
	formData.Set("grant_type", "refresh_token")
	formData.Set("redirect_uri", r.redirectUri)
	formData.Set("code_verifier", verifier)

	resp, err := http.PostForm(r.tokenUrl, formData)
	if err != nil {
		log.Infof("Post to gitlab failed: %s", err)
		return nil, fmt.Errorf("failed to request token: %w", err)
	}
	return resp, nil
}
