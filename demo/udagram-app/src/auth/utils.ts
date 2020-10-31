import { decode } from 'jsonwebtoken'
import { JwtToken } from '../auth/JwtToken'

/**
 * Parse a JWT Token and return a user. 
 * @param JwtToken JWT token 
 * @returns a user id from the JWT token 
 */

export function getUserId(jwtToken: string):string {
    const decodedJwt = decode(jwtToken) as JwtToken
    return decodedJwt.sub
  }