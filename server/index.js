const express = require("express");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/api/employees", (req, res) => {
  const jsonFilePath = path.join(__dirname, '../data/employees.json');
  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).json({ message: "Error reading employee data." });
      return;
    }
    
    try {
      const employees = JSON.parse(data);
      res.json(employees);
    } catch (err) {
      console.error("Error parsing JSON:", err);
      res.status(500).json({ message: "Error parsing employee data." });
    }
  });
});


app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
