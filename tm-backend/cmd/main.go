package main

import (
	"1dv027/wt1/internal/config"
	"1dv027/wt1/internal/router"
	"log"
	"path/filepath"

	"github.com/joho/godotenv"
)

// Main method for starting the application.
func main() {
	envPath, err := filepath.Abs(".env")
	if err != nil {
		log.Fatalf("Error getting absolute path to env")
	}
	err = godotenv.Load(envPath)
	if err != nil {
		log.Fatalf("Error loading .env file: %s", err)
	}

	container := config.SetupContainer()
	router := router.NewRouter(container)
	router.Start()
}
