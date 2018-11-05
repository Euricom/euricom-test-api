const { MongoClient } = require('mongodb');

let connection;

const connect = () => {
  if (!process.env.MONGO_CONNECTION_STRING) {
    throw new Error('No connection string set for mongodb');
  }
  return MongoClient.connect(
    process.env.MONGO_CONNECTION_STRING,
    { useNewUrlParser: true },
  );
};

const connectToDb = async () => {
  try {
    if (!connection) {
      connection = (await connect()).db(process.env.connectToDb);
    }
    return connection;
  } catch (ex) {
    console.error(ex);
  }
};

const getConnection = () => connection;

const collection = (name) => connection.collection(name);

const dropDb = () => connection.dropDatabase();

const closeConnection = () => connection.close();
module.exports = { connectToDb, collection, getConnection, dropDb, closeConnection };
