import 'source-map-support/register'
import { APIGatewayAuthorizerHandler, APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda'
import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `
-----BEGIN CERTIFICATE-----
MIIDCTCCAfGgAwIBAgIJDe1qpSM4HIXEMA0GCSqGSIb3DQEBCwUAMCIxIDAeBgNV
BAMTF2RhbWlzcGFya3MuZXUuYXV0aDAuY29tMB4XDTIwMTAzMTE2MzYxM1oXDTM0
MDcxMDE2MzYxM1owIjEgMB4GA1UEAxMXZGFtaXNwYXJrcy5ldS5hdXRoMC5jb20w
ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDA2K34h28NApxmjlOzOW9x
7MdzObA0/ZgMK4Xs/wIMrGS77BoBRsk7RrfYcnyWuDoAjoXftkpVXswaFdMT8utQ
B+PC5R8744Zn8cKwYiJHs6TyOf3KPcHAMu7X1bTCiu8Zm39+FB68sLZyZ/l1h7oV
0Untc95KcADUHdLuQg9UnzrXxW2LZv5DL+m0ZHtin8L+ZS9nU326shTY4C8iVVWT
8KyVHMvuJFlAlKvX0+A4pNmzU7w/PcH6zcwB3M6ITtJQMZg8DDODNj48JEXvixLJ
3AR1M4xatVogty6tdQaUUNKfSTQILUcfCq/yLJ27GJzFK+EFeW2OcPFIXBuw1PIJ
AgMBAAGjQjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFKjASd4zQXrmyhSC
kX3ukf+Y9VI6MA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEAHbjE
dSzzK7Q+TYHuurruzDKkOiPM5C6Y4My4/IT05AvOXRPReSS/7E1L8rWdFGIsUO5d
HlThX+P1MYx+0m9F3ME556MqxRcpqnG7X0fpDbnvoNh2tPlPh+mjTVjUHzCsCEWl
FwE5zX/TPd3DpcA+pe09hwPCMmElrPEQTXcUxNcICwSKRd279CKHj5M2CKcxGBpy
IMOZ6xVOYXqdURYIgouKlKFi1HOPIBwoZIBViI6ocmHdktV6c1PbRhxIlff+yvKZ
PHn63yRA6rFaVRpwCJ+rmU1pk0j30I7ES4ACFEUI6yNjIiqltH+SlaRaxUTI+xfG
GSLxYouZaLFH0xIYmg==
-----END CERTIFICATE-----
`

export const handler: APIGatewayAuthorizerHandler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
    try {
        const jwtToken = await verifyToken(event.authorizationToken)
        console.log('User was authorized', jwtToken)

        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        }
    } catch (e) {
        console.log('User was not authorized', e.message)

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }
}

async function verifyToken(authHeader: string): Promise<JwtToken> {
    if (!authHeader)
        throw new Error('No authentication header')

    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid authentication header')

    const split = authHeader.split(' ')
    const token = split[1]

    return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}