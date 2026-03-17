'use strict';
const path = require('path');

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');
  console.log('=== DATABASE.JS LOADED ===');
  console.log('client value:', JSON.stringify(client));
  console.log('DATABASE_URL set:', !!env('DATABASE_URL'));

  if (client === 'postgres') {
    const config = {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: env('DATABASE_URL'),
          ssl: { rejectUnauthorized: false },
        },
        pool: { min: 0, max: 2 },
      },
    };
    console.log('Returning postgres config:', JSON.stringify(Object.keys(config)));
    return config;
  }

  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };
};
