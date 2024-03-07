#!/usr/bin/env node
const kue = require('kue');

const queue = kue.createQueue({name: 'push_notification_code'});

const job = queue.create('push_notification_code', {
  phoneNumber: '+256 750140235',
  message: 'Ik ben een appel',
});

job
  .on('enqueue', () => {
    console.log('Notification job created:', job.id);
  })
  .on('complete', () => {
    console.log('Notification job completed');
  })
  .on('failed attempt', () => {
    console.log('Notification job failed');
  });
job.save();
