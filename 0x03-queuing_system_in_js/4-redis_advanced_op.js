#!/usr/bin/yarn dev
const redis = require('redis');

const client = redis.createClient();

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

const updateHash = (hashKey, key, value) => {
  client.HSET(hashKey, key, value, redis.print);
};

const printHash = (hashKey) => {
  client.HGETALL(hashKey, (_err, reply) => console.log(reply));
};

function main() {
  const hashGroup = {
    Portland: 50,
    Seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2,
  };
  for (const [key, value] of Object.entries(hashGroup)) {
    updateHash('HolbertonSchools', key, value);
  }
  printHash('HolbertonSchools');
}

client.on('connect', () => {
  console.log('Redis client connected to the server');
  main();
});