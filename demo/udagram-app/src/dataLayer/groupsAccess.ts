import AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Group } from "../models/Group";

export class GroupAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly groupsTable = process.env.GROUPS_TABLE
    ) { }

    /**
     * @returns list of items as Group. 
     */
    async getAllGroups(): Promise<Group[]> {
        console.log('Getting all groups')

        const result = await this.docClient.scan({
            TableName: this.groupsTable
        }).promise()

        const items = result.Items
        return items as Group[]
    }

    /**
     * @returns a group created.
     */
    async createGroup(group: Group): Promise<Group> {
        console.log('Creating a group : ', group.id)

        await this.docClient.put({
            TableName: this.groupsTable,
            Item: group
        }).promise()
        return group
    }
}