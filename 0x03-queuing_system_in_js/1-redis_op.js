#!/usr/bin/env node
const redis = require('redis');
const client = redis.createClient();

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

const displaySchoolValue = (schoolName) => {
  client.GET(schoolName, (err, reply) => {
    console.log(reply);
  });
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
