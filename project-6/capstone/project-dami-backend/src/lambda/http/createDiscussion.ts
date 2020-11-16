import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import { onCreateDiscussion } from '../../businessLogic/discussion'
import { DiscussionRequest } from '../../requests/DiscussionRequest'
import { createLogger } from '../../utils/logger'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context
) => {
  const logger = createLogger('create-discussion')
  const newDiscussion: DiscussionRequest = JSON.parse(event.body)
  const item = await onCreateDiscussion(newDiscussion)

  logger.info('DISCUSSION : ', item)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      item,
    }),
  }
}
