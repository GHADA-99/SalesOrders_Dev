sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (Controller) => {
  "use strict";

  return Controller.extend("soapp.controller.SalesOrder", {
      onInit: function() {
        const oLineModel = new sap.ui.model.json.JSONModel({
          rows: [] // Start with empty array
        });
        this.getView().setModel(oLineModel, "materials");
      },

      onNavBackToSoOV: function () {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteHomee");
      },
      onSaveOrder: function () {
       
        //Check on Mandatories
        const otitle = this.byId("_IDGenInput");
        const title = otitle.getValue().trim();
        const ocustomer = this.byId("CustomerInput");
        const customer = ocustomer.getValue().trim();
        const omaterial = this.byId("MaterialInput");
        const material = omaterial.getValue().trim();
        let isError = false;

        if(!title)
        {
          otitle.setValueState("Error");
          otitle.setValueStateText("Title is required");
          isError = true
        }
        if(!customer)
        {
          ocustomer.setValueState("Error");
          ocustomer.setValueStateText("Customer is required");
          isError = true
        }
        if(!material)
        {
          omaterial.setValueState("Error");
          omaterial.setValueStateText("Material is required");
          isError = true
        }

        if(isError)
        {
          sap.m.MessageToast.show("Please fill in all required fields.");
          return; 
        }

        //Generate ID For Sales Order
        const soID = crypto.randomUUID();
        this.byId("_IDGenInput3").setValue(soID);

        //Read Only @ Save
        this.byId("_IDGenInput").setEditable(false); 
        this.byId("CustomerInput").setEditable(false); 
        this.byId("MaterialInput").setEditable(false); 
        this.byId("_IDGenInput4").setEditable(false);

        //Visiablitiy @ Save
        this.byId("_IDGenButton5").setVisible(false);

        //Assign Model
          const oModel = this.getView().getModel(); // Get default ODataModel as my model odata if json model will be JSONModel
          //No direct access ll entity through .create so use bindlist firstly
          var olistBinding = oModel.bindList("/salesOrders");
          const oData = {
            title: this.byId("_IDGenInput").getValue(),
            customer: this.byId("CustomerInput").getValue(),
            material : this.byId("MaterialInput").getValue(),
            salesOrderID : this.byId("_IDGenInput3").getValue()
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
                            const materialDes = oSelectedItem.getCells()[1].getText(); 
                            this.byId("MaterialInput").setValue(materialId);
                            this.byId("_IDGenInput2").setValue(materialDes);
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
      },
      onValueHelpRequestCust (oEvent){
        if(!this._oValueHelpCustDialog)
        {
            this._oValueHelpCustDialog = new sap.m.Dialog ({
              title : "Select Customer",
              content :[
                new sap.m.Table({
                  id: this.createId("customersTable"),
                  mode: "SingleSelectMaster",
                  growing: true,
                  growingThreshold: 50,
                  columns: [
                      new sap.m.Column({ header: new sap.m.Label({ text: "Customer ID" }) }),
                      new sap.m.Column({ header: new sap.m.Label({ text: "Customer Name" }) }),
                      new sap.m.Column({ header: new sap.m.Label({ text: "Customer Status" }) }),
                      new sap.m.Column({ header: new sap.m.Label({ text: "Type" }) }),
                  ],
                  items: {
                    path: "/c4cCustomer",
                    parameters: {
                        $count: true
                    },
                    template: new sap.m.ColumnListItem({
                        type: "Active",
                        cells: [
                            new sap.m.Text({ text: "{AccountID}" }),
                            new sap.m.Text({ text: "{BusinessPartnerFormattedName}" }),
                            new sap.m.Text({ text: "{LifeCycleStatusCodeText}" }),
                            new sap.m.Text({ text: "RoleCodeText"})
                        ]
                    }),
                    events: {
                        dataReceived: (oEvent) => {
                            const oBinding = oEvent.getSource();
                            const oTable = this.byId("customersTable");
                            const aItems = oTable.getItems();
                            const oContext = oEvent.getParameter("data");
                            console.log("Total items received:", aItems.length);
                            console.log("Total count from server:", oContext?.__count || "N/A");
                            if (aItems.length === 0) {
                                sap.m.MessageBox.warning("No Customers found.");
                            }
                        }
                    }
                }
                })
              ],
              beginButton: new sap.m.Button({
                text: "Submit",
                press: (oEvent) => {
                    const oTable = this.byId("customersTable");
                    const oSelectedItem = oTable.getSelectedItem();
                    if (oSelectedItem) {
                        const customerID = oSelectedItem.getCells()[0].getText();
                        const customerName = oSelectedItem.getCells()[1].getText();
                        this.byId("CustomerInput").setValue(customerID);
                        this.byId("_IDGenInput1").setValue(customerName);
                        this.getView().getModel("c4c").setProperty("/AccountID", customerID);
                        this.updateSimulateButtonState();
                        this._oValueHelpCustDialog.close();
                    }
                }
               }),
               endButton: new sap.m.Button({
                text: "Cancel",
                press: () => {
                    this._oValueHelpCustDialog.close();
                }
            })
            });
            var oODataModel = this.getOwnerComponent().getModel();
            this._oValueHelpCustDialog.setModel(oODataModel);
            this.getView().addDependent(this._oValueHelpCustDialog);
        }
        this._oValueHelpCustDialog.open();
      },
      onSetMaterial: function(){

        // //For saving in service entity
        // const oModel = this.getView().getModel(); // Get default ODataModel as my model odata if json model will be JSONModel
        // const olistItemsBinding = oModel.bindList("/materials");

        //Create New Line In Table
        const oTable =  this.byId("_IDGenTable1");
        const oBinding = oTable.getBinding("items");

        const itemCounts = oBinding.getLength();
        const materialID = this.byId("MaterialInput").getValue();
        const materialDes = this.byId("_IDGenInput2").getValue();
        const materialStatus = "Active"; //Default 

        const oData = {
          itemID : itemCounts + 1,
          productID: materialID,
          productDescription: materialDes,
          status : materialStatus
        };
        oBinding.create(oData).created().then(() => {
          sap.m.MessageToast.show("Row created successfully");
          this.byId("MaterialInput").setValue("");
        }).catch((err) => {
          sap.m.MessageToast.show("Failed to create row");
          console.error(err);
        });

        // olistItemsBinding.create(oData).created().then(() => {
        //   sap.m.MessageToast.show("Item created successfully");
        // }).catch((err) => {
        //   sap.m.MessageToast.show("Failed to create items in sales order");
        //   console.error(err);
        // });
      }
  });
});