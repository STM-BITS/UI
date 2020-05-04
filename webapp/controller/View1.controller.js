sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"
], function (Controller, JSONModel, Fragment) {
	"use strict";

	return Controller.extend("todolist.ToDoList.controller.View1", {
		onInit: function () {
			var oModel = new JSONModel(sap.ui.require.toUrl("todolist/ToDoList/model") + "/mockToDoList.json");
			this.getView().setModel(oModel, "ToDoList");
			var oModel_todo = new JSONModel(sap.ui.require.toUrl("todolist/ToDoList/model") + "/mockToDos.json");
			this.getView().setModel(oModel_todo, "ToDos");
		},
		onSwitch: function (oEvent) {
			if (oEvent.getParameters().state === false) {
				var oModel = new sap.ui.model.json.JSONModel();
				var that = this;
				var aData = jQuery.ajax({
					type: "GET",
					contentType: "application/json",
					url: "http://localhost:8080/viewAllTodoList",
					success: function (data, textStatus) {
						oModel.setData(data);
						console.log("Success");
					}
				});
				this.getView().setModel(oModel);
			}
		},
		handleSelectDialogPress: function (oEvent) {
			if (!this._oDialog) {
				Fragment.load({
					name: "todolist.ToDoList.view.dialogue",
					controller: this
				}).then(function (oDialog) {
					this._oDialog = oDialog;
					this._oDialog.open();
				}.bind(this));
			} else {
				this._oDialog.open();
			}
		},
		onListSelection: function (oEvent) {
			var title = this.getView().getModel("ToDoList").getProperty(oEvent.getSource().getBindingContextPath()).todoListName;
			if (!this._oDialogtask) {
				Fragment.load({
					name: "todolist.ToDoList.view.taskDialogue",
					controller: this
				}).then(function (oDialog) {
					this._oDialogtask = oDialog;
					this.getView().addDependent(oDialog);
					this._oDialogtask.setTitle(title);
					this._oDialogtask.open();
				}.bind(this));

			} else {
				this._oDialogtask.setTitle(title);
				this._oDialogtask.open();
			}
		},
		onCancelPress: function (oEvent) {
			this._oDialog.close();
		},
		onCancelPressToDo: function (oEvent) {
			this._oDialogtask.close();
		}

	});
});