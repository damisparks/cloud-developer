// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'ok9ijq9hwj'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'damisparks.eu.auth0.com',            // Auth0 domain
  clientId: 'JEsJUxHtpM57NiKlgnhqvFR8YRKW6ItU',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
