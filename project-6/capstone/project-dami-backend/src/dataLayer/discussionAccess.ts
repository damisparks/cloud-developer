import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'
import { DiscussionItem } from '../models/discussion'

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
}

// Add Dynamo DB ClientX
function createDynamoDBClient(): DocumentClient {
  return new AWS.DynamoDB.DocumentClient()
}
