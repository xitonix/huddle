package twilio

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/twilio/twilio-go/client/jwt"
)

const RoomName = "huddle"

func GenerateToken(identity string) (string, error) {
	accountSid, err := loadEnv("TWILIO_ACCOUNT_SID")
	if err != nil {
		return "", err
	}
	apiKeySid, err := loadEnv("TWILIO_API_KEY_SID")
	if err != nil {
		return "", err
	}
	apiKeySecret, err := loadEnv("TWILIO_API_KEY_SECRET")
	if err != nil {
		return "", err
	}
	videoGrant := &jwt.VideoGrant{
		Room: RoomName,
	}
	params := jwt.AccessTokenParams{
		AccountSid:    accountSid,
		SigningKeySid: apiKeySid,
		Secret:        apiKeySecret,
		Identity:      identity,
		ValidUntil:    float64(time.Now().Add(5 * time.Hour).Unix()),
		Grants:        []jwt.BaseGrant{videoGrant},
	}

	jwtToken := jwt.CreateAccessToken(params)
	token, err := jwtToken.ToJwt()
	if err != nil {
		return "", err
	}

	return token, nil
}

func loadEnv(key string) (string, error) {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return "", fmt.Errorf("Environment variable %s is required", key)
	}
	return value, nil
}
