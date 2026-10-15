require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
})

const Pokemon = mongoose.model('Pokemon', {
    name : String,
    type : String,
    level : Number,
    nature : String
});

app.post('/api/pokemon', async (req, res) => {
    const pokemon = new Pokemon (req.body);
    await pokemon.save();
    res.status(201).send(pokemon);
})

app.get('/api/pokemon', async (req,res) => {
    const list = await Pokemon.find();
    res.send(list);
})

//Delete request
app.delete('/api/pokemon/:id', async (req, res) => {
    try {
        const deleted = await Pokemon.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).send({ message: 'Pokemon not found' });
        res.status(204).send();
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

//Update request 
app.put('/api/pokemon/:id', async(req, res) => {
  const updatePokemon = await Pokemon.findByIdAndUpdate(req.params.id, req.body, {new: true});
  res.send(updatePokemon);
})

//API is running on port 5000 -> http://localhost:5000