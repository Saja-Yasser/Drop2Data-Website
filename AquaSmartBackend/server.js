const express = require('express');
const cors = require('cors');
const xlsx = require('xlsx');

const app = express();
app.use(cors());
app.use(express.json());

// قراءة ملف Excel
const workbook = xlsx.readFile('./data/AquaSmart_Prototype_Data.xlsx');

// Sheets
const suggestionsSheet = workbook.Sheets['Suggestions'];
const monitoringSheet = workbook.Sheets['Monitoring Data'];

// تحويل لـ JSON
const suggestionsData = xlsx.utils.sheet_to_json(suggestionsSheet);
const monitoringData = xlsx.utils.sheet_to_json(monitoringSheet);

// API: Suggestions
app.get('/api/suggestions', (req, res) => {
  res.json(suggestionsData);
});

// API: Monitoring
app.get('/api/monitoring', (req, res) => {
  res.json(monitoringData);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
