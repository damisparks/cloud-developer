import * as uuid from 'uuid'
import { DiscussionAccess } from '../dataLayer/discussionAccess'
import {
  DiscussionItem,
  DiscussionRequest,
  UpdateDiscussionItem,
} from '../models/discussion'

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

// Get all discussions.
export async function onGetAllDiscussions(): Promise<DiscussionItem[]> {
  return await discussionAccess.getDiscussions()
}

// Update discussion by id.
export async function onUpdateDiscussion(
  discussionId: string,
  toBeUpdatedDiscussion: UpdateDiscussionItem
) {
  return await discussionAccess.updateDiscussion(
    discussionId,
    toBeUpdatedDiscussion
  )
}
