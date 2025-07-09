sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("soapp.controller.Home", {
        onInit() {
        },
        onNavToSoCreation: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteSoCreate");
          },
          onNavToSoUpdate: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteSoCreate"); //#Add id 
          },
          onNavToHome: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteHome");
          }
    });
});