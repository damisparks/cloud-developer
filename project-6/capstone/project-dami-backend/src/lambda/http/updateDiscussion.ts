import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import { onUpdateDiscussion } from '../../businessLogic/discussion'
import { UpdateDiscussionItem } from '../../models/discussion'
import { createLogger } from '../../utils/logger'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context
) => {
  const discussionId = event.pathParameters.discussionId
  const toBeUpdatedDiscussion: UpdateDiscussionItem = JSON.parse(event.body)
  const logger = createLogger('update-discussion')

  logger.info('DISCUSSION UPDATE : ', discussionId)

  await onUpdateDiscussion(discussionId, toBeUpdatedDiscussion)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      success: 'updated',
    }),
  }
}
