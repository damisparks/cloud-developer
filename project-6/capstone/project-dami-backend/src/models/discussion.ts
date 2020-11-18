export interface DiscussionItem {
  title: string
  shortDescription: string
  createdAt: string
  discussionId: string
  userId: string
}

/**
 * Fields in a request to create a single DISCUSSION item.
 */
export interface DiscussionRequest {
  title: string
  shortDescription: string
  createdAt: string
}

/**
 * Fields in a request to update a single DISCUSSION item.
 */

export interface UpdateDiscussionItem {
  title: string
  shortDescription: string
}
