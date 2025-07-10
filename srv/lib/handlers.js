const cds = require('@sap/cds');

let materialService = null;


(async function () {
    // Connect to external C4C OData services
    materialService = await cds.connect.to('product'); //exists in external folder
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



module.exports = {
    readMaterials
}
