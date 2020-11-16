import * as uuid from 'uuid'
import { DiscussionAccess } from '../dataLayer/discussionAccess'
import { DiscussionRequest } from '../requests/DiscussionRequest'
import { DiscussionItem } from '../lambda/models/DiscussionItem'

const discussionAccess = new DiscussionAccess()

// Create Discussion
export async function onCreateDiscussion(
  newDiscussionItem: DiscussionRequest
): Promise<DiscussionItem> {
  const itemId = uuid.v4()

  return discussionAccess.createDiscussion({
    discussionId: itemId,
    createdAt: new Date().toISOString(),
    title: newDiscussionItem.title,
    shortDescription: newDiscussionItem.shortDescription,
  })
}
