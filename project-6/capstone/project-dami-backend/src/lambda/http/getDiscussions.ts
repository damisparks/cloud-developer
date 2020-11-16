import { APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import { onGetAllDiscussions } from '../../businessLogic/discussion'

import { createLogger } from '../../utils/logger'

export const handler: APIGatewayProxyHandler = async (_context) => {
  const logger = createLogger('all-discussions')

  const items = await onGetAllDiscussions()

  logger.info('DISCUSSIONS : ', items)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      items,
    }),
  }
}
