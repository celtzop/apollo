import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  const { userId } = req.query;

  const params = {
    TableName: 'AllowedUsers',
    Key: {
      id: { S: userId },
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetItemCommand(params));
    console.log('Retrieved Item:', Item); // Log the retrieved item

    if (!Item) {
      console.log('User not found in the database for ID:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    // Send back the user data
    res.status(200).json(Item);
  } catch (error) {
    console.error('Error fetching from DynamoDB:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
