sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller,JSONModel) => {
    "use strict";

    return Controller.extend("soapp.controller.Materials", {
        onInit() {
        },
        // onReadOdata: function () {
        //     const oC4CModel = this.getView().getModel("c4c"); // Named model from manifest
      
        //     if (!oC4CModel) {
        //       console.error("C4C OData model not found.");
        //       return;
        //     }
      
        //     oC4CModel.read("/ProductCollection", {
        //       success: function (oData) {
        //         console.log("Products loaded:", oData.results);
      
        //         // Optional: Bind data to a local model to display in table
        //         const oJSONModel = new JSONModel({ items: oData.results });
        //         this.getView().setModel(oJSONModel, "products");
        //       }.bind(this),
        //       error: function (oError) {
        //         console.error("Error loading products from C4C", oError);
        //         sap.m.MessageToast.show("Failed to load products.");
        //       }
        //     });
        //   },
          NavToHome: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteHome");
          }
    });
});