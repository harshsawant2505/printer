const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 4000;

app.use(express.json());


const sumatraPath = `"${__dirname}\\SumatraPDF.exe"`; // Example: "C:\\Program Files\\SumatraPDF\\SumatraPDF.exe"
const printerName = `"HP Smart Tank 580-590 series"`; // with quotes
app.get('/', (req, res) => {
  res.send('Welcome to the Printer Backend!');
});

app.post('/print', (req, res) => {
  const { fileUrl } = req.body;
  if (!fileUrl) return res.status(400).json({ error: 'fileUrl is required' });

  const fileName = 'temp.pdf';
  const filePath = path.join(__dirname, fileName);

  // Delete previous file if exists
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Download and print
    const command = `curl -L "${fileUrl}" -o "${filePath}" && ${sumatraPath} -print-to-default -silent -exit-when-done "${filePath}"`;
  // const command = `curl -L "${fileUrl}" -o "${filePath}" && ${sumatraPath} -print-to ${printerName} -silent -exit-when-done "${filePath}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error('Print error:', stderr);
      return res.status(500).json({ error: stderr.toString() });
    }

    console.log('Print success:', stdout);
    res.json({ message: 'Print command sent successfully', output: stdout });
  });
});

app.listen(PORT, () => {
  console.log(`Printer backend running at http://localhost:${PORT}`);
});
