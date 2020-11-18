import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'
import { DiscussionItem, UpdateDiscussionItem } from '../models/discussion'
import { createLogger } from '../utils/logger'

const logger = createLogger('discussionAccess')
export class DiscussionAccess {
  constructor(
    private readonly discussionTable = process.env.DISCUSSION_TABLE,
    private readonly docClient = createDynamoDBClient()
  ) {}

  /**
   * @returns created discussion item.
   */
  async createDiscussion(discussion: DiscussionItem): Promise<DiscussionItem> {
    await this.docClient
      .put({
        TableName: this.discussionTable,
        Item: discussion,
      })
      .promise()

    return discussion as DiscussionItem
  }

  /**
   * @returns all discussions
   */
  async getDiscussions(): Promise<DiscussionItem[]> {
    const result = await this.docClient
      .scan({
        TableName: this.discussionTable,
      })
      .promise()
    const items = result.Items
    return items as DiscussionItem[]
  }

  // Update a single discussion.
  async updateDiscussion(
    discussionId: string,
    updateDiscussionItem: UpdateDiscussionItem
  ) {
    logger.info(`to update discussionId :  ${discussionId}`)
    await this.docClient
      .update({
        TableName: this.discussionTable,
        Key: {
          discussionId: discussionId,
        },
        UpdateExpression:
          'set #title = :title, #shortDescription = :shortDescription',
        ExpressionAttributeValues: {
          ':title': updateDiscussionItem.title,
          ':shortDescription': updateDiscussionItem.shortDescription,
        },
        ExpressionAttributeNames: {
          '#title': 'title',
          '#shortDescription': 'shortDescription',
        },
      })
      .promise()
  }
}

// Add Dynamo DB Client
function createDynamoDBClient(): DocumentClient {
  return new AWS.DynamoDB.DocumentClient()
}
