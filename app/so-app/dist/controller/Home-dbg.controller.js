sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
"sap/ui/model/FilterOperator"
], (Controller,Filter,FilterOperator) => {
  "use strict";

  return Controller.extend("soapp.controller.Home", {
      onInit: function() {
        const oTable = this.byId("SoOVTable");
        const oBinding = oTable.getBinding("items");

        if (oBinding) {
          oBinding.refresh(); // Optional: only needed if you're refreshing manually 
        }
      },
      onNavToSoCreation: function () {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteSoCreate");
        },
      onNavToSoUpdate: function () {

          const oTable = this.byId("SoOVTable");
          const oSelectedItem = oTable.getSelectedItem();

          if (!oSelectedItem) {
            sap.m.MessageToast.show("Please select a row to update.");
            return;
          }

          const oContext = oSelectedItem.getBindingContext();
          const sId = "79924b65b3004cd185c9d7e8f309dc59"; // e.g., "/SalesOrders(guid...)" Fixed

          // Optional: Store the selected path in a global model or navigate with parameters
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteSoEdit", {
            orderId: sId
          });
          
        },

        onNavToHome: function () {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteHome");
        },

        onFilter: function () {
          var oTable = this.byId("SoOVTable");
          var oBinding = oTable.getBinding("items");
          //For Multiple Fields
          var sCustomer = this.byId("filterInput").getValue();
          var sMaterial = this.byId("filterInput2").getValue();
          var aFilters = [];
          if(sCustomer)
          {
              //1st property : take entity key for each field
            aFilters.push(new Filter("customer", FilterOperator.Contains, sCustomer));
          }
          if(sMaterial)
          {
            aFilters.push(new Filter("material", FilterOperator.Contains, sMaterial));
          }

           // Apply filters with AND logic
           oBinding.filter(aFilters, "Application");

        }
  });
});