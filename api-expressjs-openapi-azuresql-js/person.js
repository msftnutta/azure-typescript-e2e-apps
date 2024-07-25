import express from 'express';
import { noPasswordConfig, passwordConfig } from './config.js';
import Database from './database.js';

const router = express.Router();
router.use(express.json());

const config = noPasswordConfig;

// Development only - don't do in production
// console.log(config);

// Create database object
const database = new Database(config);

router.get('/', async (_, res) => {
  try {
    // Return a list of persons
    const persons = await database.readAll();
    console.log(`persons: ${JSON.stringify(persons)}`);
    res.status(200).json(persons);
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // Create a person
    const person = req.body;
    console.log(`person: ${JSON.stringify(person)}`);
    const rowsAffected = await database.create(person);
    res.status(201).json({ rowsAffected });
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Get the person with the specified ID
    const personId = req.params.id;
    console.log(`personId: ${personId}`);
    if (personId) {
      const result = await database.read(personId);
      console.log(`persons: ${JSON.stringify(result)}`);
      res.status(200).json(result);
    } else {
      res.status(404);
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Update the person with the specified ID
    const personId = req.params.id;
    console.log(`personId: ${personId}`);
    const person = req.body;

    if (personId && person) {
      delete person.id;
      console.log(`person: ${JSON.stringify(person)}`);
      const rowsAffected = await database.update(personId, person);
      res.status(200).json({ rowsAffected });
    } else {
      res.status(404);
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Delete the person with the specified ID
    const personId = req.params.id;
    console.log(`personId: ${personId}`);

    if (!personId) {
      res.status(404);
    } else {
      const rowsAffected = await database.delete(personId);
      res.status(204).json({ rowsAffected });
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

export default router;
