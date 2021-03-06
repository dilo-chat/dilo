const { debug } = require('../helpers/log').buildLogger('API/STORAGE');
const AWS = require("aws-sdk");
const {
  AWS_REGION,
  LOCAL_DYNAMODB_ENDPOINT: endpoint,
  TABLE_NAME: TableName,
  TABLE_NAME_MESSAGES: TableNameMessages,
  TABLE_NAME_ROOMS: TableNameRooms,
  TABLE_TTL_HOURS: ttlHours,
  CONNECTION_ID_INDEX: IndexName
} = process.env;

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
  endpoint: endpoint && endpoint.length ? endpoint : undefined,
});

const calculateTtl = () => {
  const msToAdd = 1000 * 60 * 60 * ttlHours;
  const ttl = Date.now() + msToAdd;
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/time-to-live-ttl-how-to.html
  return Math.floor(ttl / 1000);
}

const put = ({ Item, TableName }) => {
  debug('put', { TableName, Item });
  return ddb
    .put({ TableName, Item })
    .promise();
}

exports.delete = Key => {
  debug('delete', Key);
  return ddb
    .delete({ TableName, Key })
    .promise();
}

const queryItems = async query => {
  debug('quering Items', query);
  const { Items } = await ddb.query(query).promise();
  debug('found Items', Items);
  return Items;
}

const findAllByRoomId = roomId => {
  const query = {
    TableName,
    KeyConditionExpression: `roomId = :key`,
    ExpressionAttributeValues: { ":key": roomId },
  };

  return queryItems(query);
}
exports.findAllByRoomId = findAllByRoomId;
exports.connectionIdsByRoomId = async roomId => {
  return (await findAllByRoomId(roomId)).map(({ connectionId }) => connectionId);
}

const findAllByConnectionId = connectionId => {
  const query = {
    TableName,
    IndexName,
    KeyConditionExpression: `connectionId = :key`,
    ExpressionAttributeValues: { ":key": connectionId },
  };

  return queryItems(query);
}
exports.findAllByConnectionId = findAllByConnectionId;
exports.roomIdsByConnectionId = async connectionId => {
  return (await findAllByConnectionId(connectionId)).map(({ roomId }) => roomId)
}

const deleteItems = async items => {
  debug('deleteItems', items);
  if (!items || !items.length) {
    return [];
  }

  const keys = items.map(({ roomId, connectionId }) => ({ roomId, connectionId }));
  const deleteRequests = keys.map(Key => ({ DeleteRequest: { Key } }));

  const params = {
    RequestItems: {
      [TableName]: deleteRequests,
    },
  };

  await ddb.batchWrite(params).promise();
  return keys;
}

exports.deleteAllByRoomId = async roomId => {
  const items = await findAllByRoomId(roomId);
  return deleteItems(items);
}

exports.deleteAllByConnectionId = async connectionId => {
  const items = await findAllByConnectionId(connectionId);
  return deleteItems(items);
}

exports.putMessage = Item => {
  return put({ Item, TableName: TableNameMessages });
}

exports.putConnection = Item => {
  Item.ttl = calculateTtl();
  return put({ Item, TableName });
}

exports.latestMessagesInRoom = roomId => {
  const query = {
    TableName: TableNameMessages,
    KeyConditionExpression: `roomId = :key`,
    ExpressionAttributeValues: { ":key": roomId },
    ScanIndexForward: false, // descending
    Limit: 100
  };

  return queryItems(query);
}

exports.queryRoomSetup = roomId => {
  const query = {
    TableName: TableNameRooms,
    KeyConditionExpression: `roomId = :key`,
    ExpressionAttributeValues: { ":key": roomId }
  };

  return queryItems(query);
}

exports.putRoomSetup = Item => {
  return put({ Item, TableName: TableNameRooms });
}
