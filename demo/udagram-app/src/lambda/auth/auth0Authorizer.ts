import {
    APIGatewayAuthorizerHandler,
    APIGatewayTokenAuthorizerEvent,
    APIGatewayAuthorizerResult
} from 'aws-lambda'
import 'source-map-support/register'
import { verify } from 'jsonwebtoken';
import { JwtToken } from '../../auth/JwtToken'

const auth0Secret = process.env.AUTH_0_SECRET

export const handler: APIGatewayAuthorizerHandler = async (
    event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
    try {
        const decodeToken =  verifyToken(event.authorizationToken)
        console.log('User was authorized')
        return {
            principalId: decodeToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
            },
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
                        Resource: '*',
                    },
                ],
            },
        }
    }
}

function verifyToken(authHeader: string): JwtToken {
    if (!authHeader) {
        throw new Error('No authentication header')
    }
    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid authentication header')
    const split = authHeader.split(' ')
    const token = split[1]
    
    return verify(token, auth0Secret) as JwtToken
}
