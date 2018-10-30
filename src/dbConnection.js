const { MongoClient } = require('mongodb');

let connection;

const connect = async () => {
  if (!process.env.MONGO_CONNECTION_STRING) {
    throw new Error('No connection string set for mongodb');
  }
  return await MongoClient.connect(
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
    console.log(ex);
  }
};

const getConnection = () => {
  return connection;
};

const collection = (name) => {
  return connection.collection(name);
};

const dropDb = async () => {
  return await connection.dropDatabase();
};
module.exports = { connectToDb, collection, getConnection, dropDb };
