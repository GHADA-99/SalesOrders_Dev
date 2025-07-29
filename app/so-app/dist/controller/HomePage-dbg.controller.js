sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("soapp.controller.HomePage", {
        onInit() {
        },
        onNavBackToCustOV: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteCustomerOVPage");
          },
          onNavBackToMaterialOV: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteMaterialOVPage");
          },
          onNavBackToSalesOtOV: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteHomee");
          }
    });
});