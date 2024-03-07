#!/usr/bin/env node
import express from 'express';
import { promisify } from 'util';
import { createQueue } from 'kue';
import { createClient } from 'redis';

const app = express();
const client = createClient({ name: 'reserve_seat' });
const queue = createQueue();
const INITIAL_SEATS_COUNT = 50;
let reservationEnabled = false;
const PORT = 1245;

/**
 * Modifies the number of available seats.
 * @param {number} number - The new number of seats.
 */
const reserveSeat = async (number) => {
  return promisify(client.SET).bind(client)('available_seats', number);
};

/**
 * Retrieves the number of available seats.
 * @returns {Promise<String>}
 */
const getCurrentAvailableSeats = async () => {
  return promisify(client.GET).bind(client)('available_seats');
};

app.get('/available_seats', (_, res) => {
  getCurrentAvailableSeats()
    .then((numberOfAvailableSeats) => {
      res.json({ numberOfAvailableSeats });
    })
    .catch((error) => {
      console.error('Error retrieving available seats:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get('/reserve_seat', (_req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservations are currently blocked' });
    return;
  }
  try {
    const job = queue.create('reserve_seat');

    job.on('failed', (err) => {
      console.error('Seat reservation job', job.id, 'failed:', err);
    });

    job.on('complete', () => {
      console.log('Seat reservation job', job.id, 'completed');
    });

    job.save();
    res.json({ status: 'Reservation in process' });
  } catch (error) {
    console.error('Error processing reservation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/process', (_req, res) => {
  res.json({ status: 'Queue processing' });
  queue.process('reserve_seat', async (job, done) => {
    try {
      const availableSeats = await getCurrentAvailableSeats();
      reservationEnabled = availableSeats > 1 ? reservationEnabled : false;

      if (availableSeats >= 1) {
        await reserveSeat(availableSeats - 1);
        done();
      } else {
        done(new Error('Not enough seats available'));
      }
    } catch (error) {
      console.error('Error processing reservation:', error);
      done(new Error('Internal Server Error'));
    }
  });
});

const resetAvailableSeats = async (initialSeatsCount) => {
  try {
    await promisify(client.SET).bind(client)('available_seats', Number.parseInt(initialSeatsCount));
  } catch (error) {
    console.error('Error resetting available seats:', error);
    throw new Error('Internal Server Error');
  }
};

app.listen(PORT, async () => {
  try {
    await resetAvailableSeats(process.env.INITIAL_SEATS_COUNT || INITIAL_SEATS_COUNT);
    reservationEnabled = true;
    console.log(`API available on localhost port ${PORT}`);
  } catch (error) {
    console.error('Error starting API server:', error);
  }
});

export default app;
