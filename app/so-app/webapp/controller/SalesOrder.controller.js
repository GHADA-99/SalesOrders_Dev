sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("soapp.controller.SalesOrder", {
        onInit() {
        },
        onNavBackToSoOV: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteHome");
        },
        onSaveOrder: function () {
            const oModel = this.getView().getModel(); // Get default ODataModel as my model odata if json model will be JSONModel
          
            //No direct access ll entity through .create so use bindlist firstly
            var olistBinding = oModel.bindlist("/salesOrders");
            
            const oData = {
              title: this.byId("_IDGenInput").getValue(),
              customer: this.byId("CustomerInput").getValue(),
              
            };
            olistBinding.create(oData).created().then (

              function () {
                sap.m.MessageToast.show("Sales Order saved successfully");
              },
              function (oError) {
                sap.m.MessageToast.show("Error saving Sales Order");
                console.error(oError);
              }
            );
          }
           
    });
});