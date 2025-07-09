namespace srv;
using db as db from '../db/schema';

service salesOrderSubmition {

    
    entity salesOrders as projection on db.salesOrders;
    entity materials as projection on db.materialItems;

}