const config = {
    dbName: process.env.dbName,
    mongoURL: 'mongodb://localhost:27017/'+ process.env.dbName || 'mongodb://localhost:27017/DMarket',
    port: process.env.PORT || 8081,
    delay: process.env.DELAY,
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret'
      }
  };

module.exports =  config;