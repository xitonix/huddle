## How to run the Demo locally

Create a Twilio account and set the following environment variables

- TWILIO_ACCOUNT_SID
- TWILIO_API_KEY_SID
- TWILIO_API_KEY_SECRET

Run the server
```shell
cd hudle
go mod download
go run *.go
```

Open your browser and navigate to http://localhost:3001. To add the second participant, open a new tab and load the same URL.

### Notes

- Audio track is disabled to prevent echo when running the app locally
- The screen sharing track for this demo is only implemented for Chrome 72+
- You can disable/enable different tracks by changing the parameters of the `joinRoom` method in [main.js](./public/main.js) file


### Useful Links

- Twilio [webinar](https://ahoy.twilio.com/devgen_webinar_programmable_video_uplevel_NAMER-1-ty?_ga=2.251373249.618135879.1678331949-326799730.1678057582)
- [Screen sharing](https://www.twilio.com/docs/video/screen-capture-chrome)
- Basic JS [tutorial](https://www.twilio.com/docs/video/tutorials/get-started-with-twilio-video-node-express-frontend)
- A [tutorial](https://www.twilio.com/blog/use-svelte-and-go-build-video-chat-app) on building a live video chat end-to-end, including an access token server in Go.