import * as uuid from 'uuid'
import { DiscussionAccess } from '../dataLayer/discussionAccess'
import { DiscussionItem, DiscussionRequest } from '../models/discussion'

const discussionAccess = new DiscussionAccess()

// Create Discussion
export async function onCreateDiscussion(
  newDiscussionItem: DiscussionRequest
): Promise<DiscussionItem> {
  const itemId = uuid.v4()

  return await discussionAccess.createDiscussion({
    userId: 'fakeuserid',
    discussionId: itemId,
    createdAt: new Date().toISOString(),
    title: newDiscussionItem.title,
    shortDescription: newDiscussionItem.shortDescription,
  })
}
