namespace srv;
using db as db from '../db/schema';
using product as prd_API from '../srv/external/product.csn';
using customer as cust_API from '../srv/external/customer.csn';


service salesOrderSubmition {

    
    entity salesOrders as projection on db.salesOrders;
    entity materials as projection on db.materialItems;
    @readonly
   entity c4cMaterials as
        select from prd_API.ProductCollection {
            
            @Common.Label : 'Product ID'
            key ProductID, //Make it as primary key to solve the error of Invalid metadata of the service, So i can create an app
            @Common.Label : 'Product Description' //Changes in service metadata only not in my app
            Description, 
            @Common.Label : 'Status ID'
            Status,
             @Common.Label : 'Status Des'
            StatusText,
             @Common.Label : 'Product Category ID'
            ProductCategoryID,
             @Common.Label : 'Base UOM ID'
            BaseUOM,
            @Common.Label : 'Base UOM Des'
            BaseUOMText,
           
        };
    entity c4cCustomer as select from cust_API.CorporateAccountCollection{
        @Common.Label : 'Customer ID'
        key AccountID,
        @Common.Label : 'Customer Name'
        BusinessPartnerFormattedName,
        @Common.Label : 'Customer Status'
        LifeCycleStatusCodeText,
        @Common.Label : 'BP Type'
         RoleCode,
        @Common.Label : 'BP Type Text'
         RoleCodeText

    }

}