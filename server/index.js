import express from 'express';
import Chain from './blockchain/Chain.js';
import cors from 'cors';

const app = express();
app.use(cors(
    {
        origin: ["http://chain-rxn-project2-jaex.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true
    }
));
app.use(express.json());

let chain = new Chain();

app.get('/', (req, res) => {
    res.send("⛓️ Blockchain home page");
});

app.post('/addTransaction', (req, res) => {
    const { sender, recipient, amount } = req.body;
    if (!sender || !recipient || amount === undefined) {
        return res.status(400).json({ error: "Transaction must include sender, recipient, and amount." });
    }
    const transaction = { sender, recipient, amount };
    chain.addTransaction(transaction);
    res.status(200).json({ message: "Transaction added to the mempool", transaction });
});

app.post('/mine', (req, res) => {
    const minedBlock = chain.minePendingTransactions();
    res.status(200).json({ message: "Block mined and added to chain", block: minedBlock });
});

app.get('/getChain', (req, res) => {
    res.status(200).json(chain.chain);
});

app.get('/getLatestBlock', (req, res) => {
    res.status(200).json(chain.getLatestBlock());
});

app.get('/isValid', (req, res) => {
    const isValid = chain.isValidChain();
    res.status(200).json({ valid: isValid });
});

app.get('/stats', (req, res) => {
    res.status(200).json(chain.getStats());
});

app.get('/block/:hash', (req, res) => {
  const block = chain.chain.find(b => b.hash === req.params.hash);
  return block ? res.json(block) : res.status(404).json({error: 'Block not found'});
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Blockchain API is running on port ${PORT}`);
});