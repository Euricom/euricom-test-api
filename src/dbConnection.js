const { MongoClient } = require('mongodb');

let connection;
const connString = encodeURI(process.env.MONGO_CONNECTION_STRING);
const dbName = process.env.DATABASE_NAME;
// const connString = encodeURI(
//   'mongodb://shop-rw:WO26LAXLrG1oRsbQ@clustertest-shard-00-00-ldjlh.mongodb.net:27017,clustertest-shard-00-01-ldjlh.mongodb.net:27017,clustertest-shard-00-02-ldjlh.mongodb.net:27017/test?ssl=true&replicaSet=ClusterTest-shard-0&authSource=admin&retryWrites=true',
// );
// const dbName = 'shop';

const connect = () => {
  console.log(connString, dbName);
  if (!connString) {
    throw new Error('No connection string set for mongodb');
  }
  return MongoClient.connect(
    connString,
    { useNewUrlParser: true },
  );
};

const connectToDb = async () => {
  try {
    if (!connection) {
      connection = (await connect()).db(dbName);
    }
    return connection;
  } catch (ex) {
    console.error(ex);
    throw new Error(ex);
  }
};

const getConnection = () => connection;

const collection = (name) => connection.collection(name);

const dropDb = () => connection.dropDatabase();

const closeConnection = () => connection.close();
module.exports = { connectToDb, collection, getConnection, dropDb, closeConnection };
