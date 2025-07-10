sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (Controller) => {
  "use strict";

  return Controller.extend("soapp.controller.SalesOrder", {
      onInit: function() {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("RouteSoCreate").attachPatternMatched(this._onCreateMatched, this);
        oRouter.getRoute("RouteSoUpdate").attachPatternMatched(this._onUpdateMatched, this);
      },

      //Assign Flag based on mode
      _onCreateMatched: function () {
        this._bEditMode = false;
      
        // Clear form inputs
        this.byId("_IDGenInput").setValue("");
        this.byId("MaterialInput").setValue("");
        this.byId("CustomerInput").setValue("");
      },
      _onUpdateMatched: function (oEvent) {
        this._bEditMode = true;
        var sOrderId = oEvent.getParameter("arguments").orderId;
      
        var oModel = this.getView().getModel();
        var sPath = "/salesOrders(" + sOrderId + ")"; // OData path
      
        oModel.read(sPath, {
          success: function (oData) {
            this.byId("_IDGenInput").setValue(oData.title);        // Adjust field mappings
            this.byId("MaterialInput").setValue(oData.material);
            this.byId("CustomerInput").setValue(oData.customer);
            this._sOrderId = sOrderId; // Store for save
          }.bind(this),
          error: function () {
            MessageToast.show("Failed to load sales order.");
          }
        });
      },


      onNavBackToSoOV: function () {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteHomee");
      },
      onSaveOrder: function () {
          const oModel = this.getView().getModel(); // Get default ODataModel as my model odata if json model will be JSONModel
          var oPayload = {
            title: this.byId("_IDGenInput").getValue(),
            material: this.byId("MaterialInput").getValue(),
            customer: this.byId("CustomerInput").getValue()
          };
          //Firstly, Check which mode Create or Edit
          if (this._bEditMode) {
            // Update existing order
            var sPath = "/salesOrders(" + this._sOrderId + ")";
            oModel.update(sPath, oPayload, {
              success: function () {
                MessageToast.show("Sales order updated.");
              },
              error: function () {
                MessageToast.show("Failed to update.");
              }
            });
          } else {
            //For Create
          //No direct access ll entity through .create so use bindlist firstly
          var olistBinding = oModel.bindList("/salesOrders");
          
          const oData = {
            title: this.byId("_IDGenInput").getValue(),
            customer: this.byId("CustomerInput").getValue(),
            material : this.byId("MaterialInput").getValue(),
            
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
      },
      onValueHelpRequestMaterial (oEvent){
        if (!this._oValueHelpDialog) {
                this._oValueHelpDialog = new sap.m.Dialog({
                    title: "Select Material",
                    content: [
                      new sap.m.Table({
                          id: this.createId("materialsTable"),
                          mode: "SingleSelectMaster",
                          growing: true,
                          growingThreshold: 50,
                          columns: [
                              new sap.m.Column({ header: new sap.m.Label({ text: "Material Number" }) }),
                              new sap.m.Column({ header: new sap.m.Label({ text: "Material Description" }) }),
                              new sap.m.Column({ header: new sap.m.Label({ text: "Status" }) }),
                          ],
                          items: {
                              path: "/c4cMaterials",
                              parameters: {
                                  $count: true
                              },
                              template: new sap.m.ColumnListItem({
                                  type: "Active",
                                  cells: [
                                      new sap.m.Text({ text: "{ProductID}" }),
                                      new sap.m.Text({ text: "{Description}" }),
                                      new sap.m.Text({ text: "{StatusText}" })
                                  ]
                              }),
                              events: {
                                  dataReceived: (oEvent) => {
                                      const oBinding = oEvent.getSource();
                                      const oTable = this.byId("materialsTable");
                                      const aItems = oTable.getItems();
                                      const oContext = oEvent.getParameter("data");
                                      console.log("Total items received:", aItems.length);
                                      console.log("Total count from server:", oContext?.__count || "N/A");
                                      if (aItems.length === 0) {
                                          sap.m.MessageBox.warning("No Materials found.");
                                      }
                                  }
                              }
                          }
                      })
                  ],
                  beginButton: new sap.m.Button({
                    text: "Confirm",
                    press: (oEvent) => {
                        const oTable = this.byId("materialsTable");
                        const oSelectedItem = oTable.getSelectedItem();
                        if (oSelectedItem) {
                            const materialId = oSelectedItem.getCells()[0].getText();
                            this.byId("MaterialInput").setValue(materialId);
                            this.getView().getModel("c4c").setProperty("/ProductID", materialId);
                            this.updateSimulateButtonState();
                            this._oValueHelpDialog.close();
                        }
                    }
                   }),
                   endButton: new sap.m.Button({
                    text: "Cancel",
                    press: () => {
                        this._oValueHelpDialog.close();
                    }
                })
                });
                var oODataModel = this.getOwnerComponent().getModel();
                this._oValueHelpDialog.setModel(oODataModel);
                this.getView().addDependent(this._oValueHelpDialog);
              }
              this._oValueHelpDialog.open();
      }








  });
});