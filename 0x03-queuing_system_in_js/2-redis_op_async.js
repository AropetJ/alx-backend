#!/usr/bin/env node
const { promisify } = require('util');
const redis = require('redis');

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);

client.on('connect', (err, reply) => {
  if(err) {
    console.log('Redis client not connected to the server: ', err);
  } else {
    console.log('Redis client connected to the server');
  }
});

const setNewSchool = (schoolName, value) => {
  client.SET(schoolName, value, redis.print);
};

const displaySchoolValue = async (schoolName) => {
  try {
    const reply = await getAsync(schoolName);
    console.log(reply);
  } catch (error) {
    console.error(error);
  }
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
