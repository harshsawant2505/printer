const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = 4000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Printer Backend!');
});

app.post('/print', (req, res) => {
  const { fileUrl } = req.body;

  if (!fileUrl) return res.status(400).json({ error: 'fileUrl is required' });

  
  const command = `curl -L "${fileUrl}" -o temp.pdf && start /min "" temp.pdf`;


  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error('Print error:', stderr);
      return res.status(500).json({ error: stderr });
    }
    console.log('Print success:', stdout);
    res.json({ message: 'Print command sent successfully', output: stdout });
  });
});

app.listen(PORT, () => {
  console.log(`Printer backend running at http://localhost:${PORT}`);
});
