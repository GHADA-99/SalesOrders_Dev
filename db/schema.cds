namespace db;

using { 
    managed
 } from '@sap/cds/common';


 entity salesOrders : managed {
     key ID : UUID;
    salesOrderID : String(255);
    title : String(225);
    customer : String(100); 
    material : String(100); //To be one field for now instead o table below
    items : Composition of many materialItems on items.salesOrder = $self;
    // Sales Order contains many items
 }


 entity materialItems :managed {
  
   key  salesOrder : Association  to salesOrders;
   key productID : UUID;
   itemID : String(20);
   productDescription : String(225);
   baseUOM : String(10);
   status : String(10);
   priceAmount : Decimal(10,2);
   existQty : Integer;
   inputQty : Integer
 }