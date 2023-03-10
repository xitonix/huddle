package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/xitonix/huddle/twilio"
)

func main() {
	// Env Vars: TWILIO_ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET
	http.HandleFunc("/token", getToken)
	fs := http.FileServer(http.Dir("./public"))
	http.Handle("/", fs)
	fmt.Println("Serving on :3001")
	if err := http.ListenAndServe(":3001", nil); err != nil {
		fmt.Println("")
	}
}

func getToken(w http.ResponseWriter, req *http.Request) {
	var request struct {
		UserIdentity string `json:"user_identity"`
	}
	if err := json.NewDecoder(req.Body).Decode(&request); err != nil {
		logErr(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	token, err := twilio.GenerateToken(request.UserIdentity)
	if err != nil {
		logErr(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if err = json.NewEncoder(w).Encode(struct {
		Token string `json:"token"`
		Room  string `json:"room_name"`
	}{
		Token: token,
		Room:  twilio.RoomName,
	}); err != nil {
		logErr(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	log.Printf("A new token has been generated for %s", request.UserIdentity)
}

func logErr(err error) {
	log.Printf("ERROR: %s", err)
}
