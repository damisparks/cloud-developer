import { APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import { onCreateDiscussion } from '../../businessLogic/discussion'
import { DiscussionRequest } from '../../requests/DiscussionRequest'

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  const newDiscussion: DiscussionRequest = JSON.parse(event.body)
  const newItem = await onCreateDiscussion(newDiscussion)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(
      {
        status: 'success',
        newItem: newItem,
      },
      null,
      2
    ),
  }
}
