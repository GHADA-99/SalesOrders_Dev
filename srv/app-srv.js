const cds = require('@sap/cds');
const fs = require('fs');
const path = require('path');
const {
  readMaterials
} = require('./lib/handlers');

module.exports = cds.service.impl(async function () {

 
    /*** SERVICE ENTITIES ***/
    const {
      c4cMaterials
    } = this.entities;

    /*** HANDLERS REGISTRATION ***/
    // ON events
    this.on('READ', c4cMaterials, readMaterials);
    
  this.on('getCSVData', async () => {
    const filePath = path.join(__dirname, 'Materials.csv');
    const data = fs.readFileSync(filePath, 'utf8');

    // Split CSV into rows
    const lines = data.split('\n');
    const headers = lines[0].split(',');

    // Convert rows into JSON
    const result = lines.slice(1).filter(Boolean).map(line => {
      const values = line.split(',');
      const entry = {};
      headers.forEach((header, i) => {
        entry[header] = values[i];
      });
      return entry;
    });

    return result;
  });

});
