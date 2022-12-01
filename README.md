# Spotify Express Server
This is a simple Spotify Express Server with inbuilt client authentication and some little ui additions.

## How to use
To use simply:
1. Install all necessary packages.
2. Change contents of env to the values on your spotify developer dashboard for your specific app. The one's provided are only for example and are no longer valid.
3. Run `npm run serve`. 
4. Navigate to 127.0.0.1:1337 and login.

### NOTE
When setting up your Spotify app you MUST include the redirect uri `http://localhost:1337/auth`. If this is not used then this application will **not** work.

## Bugs
There is a known bug with vibrant.js where monochromatic images throw an error because of the lack of all three color channels. Currently there has been no workaround implemented but has been planned. This bug should not significantly effect user experience. If any bugs are discovered that **significantly impact user experience** please submit an issue as this repository may not be actively maintained.

## Feature Request
I cannot guarantee that requested features will be added but they are always welcome. Please submit them in the issues tab with the tag "feature request". Please also include the feature in the name of the issue.