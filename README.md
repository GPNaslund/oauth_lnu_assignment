# OAuth + GitLab GraphQL/Rest application

## Architecture
The application is built using the [token mediated backend architecture ](https://www.ietf.org/archive/id/draft-ietf-oauth-browser-based-apps-17.html#name-application-architecture-2).

### TM-Backend
The token mediating backend is built using golang, and can be started through "go run cmd/main.go" from the starting point of the tm-backend folder. The backend both serves the SPA client application and serves OAuth endpoints for the client SPA to consume. The TM-Backend stores access_token, refresh_token and verifier in memory associated with the cookie session created. 
#### API Endpoints
- GET /login --> Expects state + code_challenge query params. On 200 response it provides a json response with an url property containing the oauth url that the client redirects itself to for logging in. Responds 400 when not provided correct params.
- DELETE /logout --> Terminates the provided cookie session and returns 200. Returns 500 on any other issue.
- POST /refresh --> Queries gitlab for a new session cookie using the stored refresh token. Returns 500 on any server issue, 401 if no session is active and if gitlab refuses the refresh token, 400 if gitlab refuses the request, and 200 with a json payload with an access_token property.
- POST /token --> Used after OAuth redirect to get the access_token and user information from oid. Expects code + code_verifier query params. Returns 500 on any server issue, 400 on a bad request, 401 when authorization is not satisfied and 200 with a json object. 
Example json { 
    "access_token": "exampletoken", 
    "user_data": {
        "name": "examplename",
        "preferred_username": "exampleusername",
        "sub": "examplesub",
        "picture": "examplepictureurl"
    }
}
- GET /verify --> Checks if active session is available, if so returns 200 with a json payload containing the access_token. If not returns 401, and 500 for all internal server errors.

### SPA Client
The client is a svelte SPA application, using its internal routing for displaying different pages and communicates with the backend for auth, access token retrieval, refreshing of token and terminating session. It stores the user information and access token locally in memory through svelte store.

