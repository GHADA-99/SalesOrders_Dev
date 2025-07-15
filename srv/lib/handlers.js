const cds = require('@sap/cds');

let materialService = null;
let customerService = null;

(async function () {
    // Connect to external C4C OData services
    materialService = await cds.connect.to('product'); //exists in external folder
    customerService = await cds.connect.to('customer'); //exists in external folder
})();

/*** HANDLERS ***/

// Read Materials
async function readMaterials(req) {
    try {
        // Handover to the C4C OData Service to fecth the requested data
        const tx = materialService.tx(req);
        return await tx.run(req.query);
    } catch (err) {
        req.error(err.code, err.message);
    }
}

//Read Customers
async function readCustomers(req) {
    try {
        // Handover to the C4C OData Service to fecth the requested data
        const tx = customerService.tx(req);
        return await tx.run(req.query);
    } catch (err) {
        req.error(err.code, err.message);
    }
}


module.exports = {
    readMaterials,
    readCustomers
}
