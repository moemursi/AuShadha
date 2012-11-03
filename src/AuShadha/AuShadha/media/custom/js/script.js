      require([
              "dojo/dom",
              "dojo/_base/xhr",
              "dojo/parser",
              "dojox/grid/DataGrid",
              "dojo/store/JsonRest",
              "dojox/data/JsonRestStore",
              "dojo/data/ObjectStore",
              "dojo/on",
              "dijit/registry",
              "dijit/Dialog",
              "dojo/ready",
              "dojo/_base/array",
              "dojo/dom-construct",
              "dojo/dom-style",
              "dojox/layout/ContentPane", 
              "dojo/behavior",
              "dojo/store/Memory",
              "dojo/dom-geometry",
              "dojo/request",

              "dojo/_base/connect",
              "dojo/on",
              "dijit/TitlePane",
              "dijit/layout/TabContainer", 
              "dijit/layout/BorderContainer",
              "dijit/layout/SplitContainer",
              "dijit/form/Form",
              "dijit/form/Button",
              "dijit/form/TextBox", 		         
              "dijit/form/ValidationTextBox", 
              "dijit/form/Textarea",
              "dijit/form/SimpleTextarea",
              "dijit/form/DateTextBox",
              "dijit/form/TimeTextBox",
              "dijit/form/NumberTextBox",
              "dijit/form/Select",
              "dijit/form/MultiSelect",
              "dijit/form/FilteringSelect",
              "dojox/form/Manager", 
              "dojox/validate/web",
              "dijit/Menu",
              "dijit/Tooltip",
              "dijit/MenuBar",
              "dijit/PopupMenuBarItem",
              "dijit/DropDownMenu",
              "dijit/MenuItem",
              "dojo/data/ItemFileWriteStore",
              "dojox/data/QueryReadStore",
              "dijit/Tree",
              "dojo/store/Observable",

              "dojo/domReady!"
      ], 
      function(dom, xhr, parser      , DataGrid, 
               JsonRest, JsonRestStore, ObjectStore , on, 
               registry, Dialog      , ready, 
               array   , domConstruct, 
               domStyle, ContentPane,
               behaviour, Memory, domGeom, request
               )
        {
        // Define Variables to be used later in the app..

        // STORES;
        var myStore;
//        var phoneStore;
//        var contactStore;
//        var guardianStore;
//        var admissionStore;
//        var visitStore;

       // Define Behaviours for the Application.
       genericFormBehaviour = function(){
        var FormBehaviour = {
             "#id_patient_detail":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "label[for=id_patient_detail]":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "#id_admission_detail":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "label[for=id_admission_detail]":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "#id_visit_detail":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "label[for=id_visit_detail]":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "#id_phy_exam_detail":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "label[for=id_phy_exam_detail]":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
            "#id_consult_nature":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "label[for=id_consult_nature]":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "span[class= helptext]":{
                found:   function(el){ 
                                   domStyle.set(el, 'font-size','8px');
                                   domStyle.set(el, 'color','RoyalBlue');
                                   domStyle.set(el, 'font-style','italic');
                         }
             }
         }
          behaviour.add(FormBehaviour)
          behaviour.apply()
       }

//        var grid,
//            admissionGrid,
//            visitGrid,
var            contactGrid;
//            phoneGrid,
//            guardianGrid;

       // Define Methods for cleaning up after use.
        var doPostDelCleanup;

      //Define Admission Trees
        var admissionTree;
        var admissionTreeStore;
        var admissionTreeModel;

       // Define Global URL variables
        var AdmissionPhyExamAddFormUrl;

       // Define Events:

       // Define Generic PopUpDialog Widgets
        var jsonMessageDialog = new dijit.Dialog({ title   : "Login", 
                                                    style   : "color: black; text-align: center;",
                                                  }, 
                                         "dialogJsonMessage");
        jsonMessageDialog.startup();

        var loginDialog = new dijit.Dialog({ title        : "Login", 
                                         style             : "width: 500px; height:500px; background:white;",
                                         href              : '/AuShadha/login/',
                                         onClose           : function(){ return false;},
                                         doSetUpAndStartUp : function(){
                                                   this.closeButtonNode.style.display ='none';
                                                   this._onKey = function(evt){
                                                                  key = evt.keyCode;
                                                                  if(key == dojo.keys.ESCAPE){
                                                                    dojo.stopEvent(evt)
                                                                  }
                                                                 }
                                                   this.startup();
                                                 }
                                         }, 
                                         "loginDialog");
        loginDialog.doSetUpAndStartUp();
//   {% if not user.is_authenticated %}
        loginDialog.show();
//   {% else %}
        var patientDialog = new dijit.Dialog({ title : "Add Patient", 
                                                style : "width: 500px; height:350px; background:white;"
                                         }, 
                                         "editPatientDialog");
        patientDialog.startup();

/*
    on(window,'scroll',function(e){
        var scrollY = dojo.position(dojo.body()).y
        var divY    = dojo.position(dom.byId('selected_patient_info'));
        if(divY<= scrollY){
          domStyle.set('selected_patient_info',{'position':"fixed"});
        }
        if(divY<= scrollY){
          domStyle.set('selected_patient_info',{'position':"relative"});
        }
    })
*/

        // Define Various Stores
//        var phoneStore    = new JsonRest({target: ""});
//        var contactStore  = new JsonRest({target:""});
//        var guardianStore = new JsonRest({target:""});
//        var admissionStore = new JsonRest({target:""});
//        var visitStore = new JsonRest({target:""});

        complaintsStore = new Memory({data:COMPLAINTS});
        console.log(complaintsStore)

        complaintDurationsStore = new Memory({data:COMPLAINT_DURATIONS});
        console.log(complaintDurationsStore)


        myStore = new JsonRest({target:"/AuShadha/pat/list/", idProperty: 'id'});
        grid    = new DataGrid({
                  store         : dataStore = ObjectStore({objectStore: myStore}),
                  query         : { search_field: 'id', search_for: "*" },
                  clientSort    : true,
                  autoWidth     : true,
                  selectionMode : "single",
                  rowSelector   : "20px",
                  structure     : GRID_STRUCTURES.PATIENT_GRID,
                  noDataMessage: "<span class='dojoxGridNoData'>No Matching Patients</span>"
                  }, 
                "patient_grid"
        ); 

  grid.startup();
  grid.canSort = function(){ return true;};

  grid.onRowClick = function(e) { 
                        /* 
                           Get the Clicked Rows index and the Grid item from that
                           Fetch the Item in the Store so that the patient ID is
                           retrieved. 
                        */
                        var idx    = e.rowIndex,
                            item   = this.getItem(idx),
                            patid  = this.store.getValue(item, "id");
                        var full_name  = this.store.getValue(item, "full_name");
                        var hosp_id  = this.store.getValue(item, "patient_hospital_id");
                        var sex  = this.store.getValue(item, "sex");
                        var age  = this.store.getValue(item, "age");
                        var patient_ticker_content = full_name + "&nbsp;" + sex + "/" + age + "&nbsp" +hosp_id;
                        /* 
                           Clear the current Grid selection
                           Set the new selected Row
                        */
                        grid.selection.clear();
                        grid.selection.setSelected(item, true);

                        /* 
                           Construct the URLs to retreive the info
                           from the Patient ID generated. 
                        */
                        var contactUrl  = "{%url contact_json %}" + 
                                           "?patient_id=" 
                                           + patid,
                            phoneUrl    = "{%url phone_json %}" + 
                                          "?patient_id=" 
                                          + patid,
                            guardianUrl = "{%url guardian_json %}" + 
                                          "?patient_id=" 
                                          + patid,
/*
                            demographicsUrl = "{%url demographics_json %}" + 
                                           "?patient_id=" 
                                           + patid,
*/
                            demographicsUrl = "/AuShadha/pat/demographics/add/" + patid +"/",
                            socialHistoryUrl = "/AuShadha/pat/social_history/add/" + patid +"/",

                            allergiesUrl = "{%url allergies_json %}" + 
                                          "?patient_id=" 
                                          + patid,

                            familyHistoryUrl = "{%url family_history_json %}" + 
                                          "?patient_id=" 
                                          + patid,

                            immunisationUrl = "{%url immunisation_json %}" + 
                                          "?patient_id=" 
                                          + patid,

                            medicationListUrl = "{%url medication_list_json %}" + 
                                          "?patient_id=" 
                                          + patid,


                            admissionUrl = "{%url admission_json %}" + 
                                           "?patient_id=" 
                                           + patid;

                         {% comment %}
                         /*
                         var visitUrl     = "{%url visit_json %}" + 
                                           "?patient_id=" 
                                           + patid;
                         */
                         {% endcomment %}

                      /*
                        Set the patient information bar
                      */
                        if (dom.byId("selected_patient_info")){
                          dom.byId("selected_patient_info").innerHTML = patient_ticker_content;
                          domStyle.set( dom.byId('selected_patient_info'),{'display':"","padding":"0px"});
                        }

                      /* 
                         Set the Stores for Contacts, Phone, Guardian and admission 
                         data. 
                      */
                       var contactStore           = new JsonRest({target:contactUrl});
                       var phoneStore             = new JsonRest({target:phoneUrl});
                       var guardianStore          = new JsonRest({target:guardianUrl});
                       var demographicsStore      = new JsonRest({target:demographicsUrl});
                       var socialHistoryStore     = new JsonRest({target:socialHistoryUrl});
                       var allergiesStore         = new JsonRest({target:allergiesUrl});
                       var familyHistoryStore     = new JsonRest({target:familyHistoryUrl});
                       var immunisationStore      = new JsonRest({target:immunisationUrl});
                       var medicationListStore    = new JsonRest({target:medicationListUrl});
                       var admissionStore         = new JsonRest({target:admissionUrl});
                      {% comment %} 
                        // var visitStore      = new JsonRest({target:visitUrl}); 
                      {% endcomment %}

                      /* 
                        Reinitiate the Bottom Panels so that 
                        the dijits there are wiped and recreated as new rows
                        are clicked in the patient list table.
                      */
                      reInitBottomPanels();

                      /* 
                        Reconfigure the grids again and attach the onRowClick and
                        onRowDblClick methods
                      */

                contactGrid = new DataGrid({
                              store         : dataStore = ObjectStore({
                                                         objectStore: contactStore
                                              }),
                              selectionMode : "single",
                              rowSelector   : "20px",
                              structure     : GRID_STRUCTURES.PATIENT_CONTACT_GRID_STRUCTURE,
                              noDataMessage : "<span class='dojoxGridNoData'>No Contact Information in Store..</span>"
                            }, 
                            "contact_list"
                );

                contactGrid.onRowDblClick = function(e){ 
                //  {% if perms.patient.change_patientcontact or perms.patient.delete_patientcontact %}
                                                  onPatientSubMenuRowClick(e,
                                                                           contactGrid, 
                                                                           "Edit Contact"
                                                                          );
                //  {%endif%}
                                                  return false; 
               };

                var phoneGrid = new DataGrid({
                                store         : dataStore = ObjectStore({
                                                           objectStore: phoneStore
                                                }),
                                selectionMode : "single",
                                rowSelector   : "20px",
                                structure     : GRID_STRUCTURES.PATIENT_PHONE_GRID_STRUCTURE,
                              noDataMessage   : "<span class='dojoxGridNoData'>No Phone Numbers in Store..</span>"
                          }, 
                          "phone_list"
                  );

                  phoneGrid.onRowDblClick = function(e){ 
                  // {% if perms.patient.change_patientphone or perms.patient.delete_patientphone %}
                                            onPatientSubMenuRowClick(e,phoneGrid, "Edit Phone");
                                            return false; 
                  // {% endif %}
                  };

                  var guardianGrid = new DataGrid({
                                          store         : dataStore = ObjectStore({
                                                                   objectStore: guardianStore
                                                          }),
                                          selectionMode : "single",
                                          rowSelector   : "20px",
                                          structure     : GRID_STRUCTURES.PATIENT_GUARDIAN_GRID_STRUCTURE,
                                          noDataMessage : "<span class='dojoxGridNoData'>No Guardian Information in Store..</span>"
                                        }, 
                                      "guardian_list"
                  );

                  guardianGrid.onRowDblClick = function(e){ 
                  // {% if perms.patient.change_patientguardian or perms.patient.delete_patientguardian %}
                                                  onPatientSubMenuRowClick(e,guardianGrid, "Edit Guardian");
                                                  return false; 
                  // {% endif %}
                  };

/*
                  var demographicsGrid = new DataGrid({
                                          store         : dataStore = ObjectStore({
                                                                       objectStore: demographicsStore
                                                          }),
                                          selectionMode : "single",
                                          rowSelector   : "20px",
                                          clientSort    : false,
                                          headerStyle   : ['text-align:center;'],
                                          structure     : GRID_STRUCTURES.PATIENT_DEMOGRAPHICS_GRID_STRUCTURE,
                                          noDataMessage : "<span class='dojoxGridNoData'>No Demographics Information in Store..</span>",
                                      }, 
                                      "demographics_list"
                    );

                    demographicsGrid.onRowDblClick = function(e){
                     //  {% if perms.patient.change_patientdemographicsdata or perms.patient.delete_patientdemographicsdata %}
                                                    onPatientSubMenuRowClick(e,
                                                                             demographicsGrid, 
                                                                             "Edit Demographics"
                                                                            );
                                                    return false; 
                    // {% endif %}
                    };
*/

                 var allergiesGrid = new DataGrid({
                                store         : dataStore = ObjectStore({
                                                           objectStore: allergiesStore
                                                }),
                                selectionMode : "single",
                                rowSelector   : "20px",
                                structure     : GRID_STRUCTURES.PATIENT_ALLERGIES_GRID_STRUCTURE,
                              noDataMessage   : "<span class='dojoxGridNoData'>No Allergies in Store..</span>"
                          }, 
                          "allergy_list"
                  );

                  allergiesGrid.onRowDblClick = function(e){ 
                  // {% if perms.patient.change_patientallergies or perms.patient.delete_patientallergies %}
                                            onPatientSubMenuRowClick(e,allergiesGrid, "Edit Allergy");
                                            return false; 
                  // {% endif %}
                  };


                 var medicationListGrid = new DataGrid({
                                store         : dataStore = ObjectStore({
                                                           objectStore: medicationListStore
                                                }),
                                selectionMode : "single",
                                rowSelector   : "20px",
                                structure     : GRID_STRUCTURES.PATIENT_MEDICATION_LIST_GRID_STRUCTURE,
                              noDataMessage   : "<span class='dojoxGridNoData'>No Medications  Recorded..</span>"
                          }, 
                          "medication_list"
                  );

                  medicationListGrid.onRowDblClick = function(e){ 
                  // {% if perms.patient.change_patientmedicationlist or perms.patient.delete_patientmedicationlist %}
                                            onPatientSubMenuRowClick(e,medicationListGrid, "Edit Medication List");
                                            return false; 
                  // {% endif %}
                  };


                 var familyHistoryGrid = new DataGrid({
                                store         : dataStore = ObjectStore({
                                                           objectStore: familyHistoryStore
                                                }),
                                selectionMode : "single",
                                rowSelector   : "20px",
                                structure     : GRID_STRUCTURES.PATIENT_FAMILY_HISTORY_GRID_STRUCTURE,
                              noDataMessage   : "<span class='dojoxGridNoData'>No Family History Recorded..</span>"
                          }, 
                          "family_history_list"
                  );

                  familyHistoryGrid.onRowDblClick = function(e){ 
                  // {% if perms.patient.change_patientfamilyhistory or perms.patient.delete_patientfamilyhistory %}
                                            onPatientSubMenuRowClick(e,familyHistoryGrid, "Edit Family History");
                                            return false; 
                  // {% endif %}
                  };


                 var immunisationGrid = new DataGrid({
                                store         : dataStore = ObjectStore({
                                                           objectStore: immunisationStore
                                                }),
                                selectionMode : "single",
                                rowSelector   : "20px",
                                structure     : GRID_STRUCTURES.PATIENT_IMMUNIZATION_GRID_STRUCTURE,
                              noDataMessage   : "<span class='dojoxGridNoData'>No Immunisations Recorded..</span>"
                          }, 
                          "immunisation_list"
                  );

                  immunisationGrid.onRowDblClick = function(e){ 
                  // {% if perms.patient.change_patientimmunisation or perms.patient.delete_patientimmunisation %}
                                            onPatientSubMenuRowClick(e,immunisationGrid, "Edit Immunisation");
                                            return false; 
                  // {% endif %}
                  };


                  var admissionGrid = new DataGrid({
                                          store         : dataStore = ObjectStore({
                                                                       objectStore: admissionStore
                                                          }),
                                          selectionMode : "single",
                                          rowSelector   : "20px",
                                          clientSort    : false,
                                          headerStyle   : ['text-align:center;'],
                                          structure     : GRID_STRUCTURES.PATIENT_ADMISSION_GRID_SRUCTURE,
                                          noDataMessage : "<span class='dojoxGridNoData'>No Admission Information in Store..</span>",
                                      }, 
                                      "admission_list"
                    );

                    admissionGrid.onRowDblClick = function(e){
                     //  {% if perms.admission.change_admissiondetail or perms.admission.delete_admissiondetail %}
                                                    onPatientSubMenuRowClick(e,
                                                                             admissionGrid, 
                                                                             "Edit Admission"
                                                                            );
                                                    return false; 
                    // {% endif %}
                    };

                    admissionGrid.onRowClick   = function(e){ 
                      //  {% if perms.admission %}
                                                  var topContentPane = registry.byId('centerTopTabPane');
                                                  var newTabPane     = registry.byId("admissionHomeContentPane");
                                                  console.log(newTabPane)
                                                  var item           = admissionGrid.getItem(e.rowIndex);
                                                  var homeUrl        = admissionGrid.store.getValue(item,'home')
                                                  console.log(homeUrl)
                                                  xhr.get({
                                                       url    : homeUrl,
                                                       load   : function(content){
                                                                  newTabPane.set('content', content)
                                                                  topContentPane.selectChild(newTabPane);
                                                                }
                                                  });
                                                  return false; 
                      //  {% endif %}
                    };


{% comment %}
                    /*
                        var visitGrid = new DataGrid({
                                                  store         : dataStore = ObjectStore({objectStore: visitStore
                                                                  }),
                                                  selectionMode : "single",
                                                  rowSelector   : "20px",
                                                  structure     : GRID_STRUCTURES.PATIENT_VISIT_GRID_STRUCTURE,
                                                  noDataMessage : "<span class='dojoxGridNoData'>No Visit Information in Store..</span>"
                                                  }, 
                                                  "visit_list"
                        );

                        visitGrid.onRowDblClick = function(e){ 
                        //{% if perms.visit.change_visitdetail or perms.visit.delete_visitdetail %}
                                                       onPatientSubMenuRowClick(e,visitGrid, "Edit Visit");
                        //{% endif %}
                                                       return false; 
                        };
                    */
{% endcomment %}

     function onPatientSubMenuRowClick(e, gridToUse, titleToUse){ 
          var idx = e.rowIndex,
              item = gridToUse.getItem(idx);
          var contactid = gridToUse.store.getValue(item, "id");
          var edit      = gridToUse.store.getValue(item, "edit");
          var del       = gridToUse.store.getValue(item, "del");
          gridToUse.selection.clear();
          gridToUse.selection.setSelected(item, true);
          xhr.get({
              url  : edit,
              load : function(html, idx){
              var myDialog = dijit.byId("editPatientDialog");
              if(myDialog == undefined || myDialog == null){
                myDialog = new dijit.Dialog({
                                  title: titleToUse,
                                  content: html,
                                  style: "width: 500px; height:500px;"
                                 }, "editPatientDialog");
                myDialog.startup();
              }
              else{
                myDialog.set('content', html);
                myDialog.set('title', titleToUse); 
              }
              myDialog.show();
              }
          });
        return false; 
     };

     function reInitBottomPanels(){
            var contactTable        = registry.byId("contact_list"),
                phoneTable          = registry.byId("phone_list"),
                guardianTable       = registry.byId("guardian_list"),
                demographicsTable   = registry.byId("demographics_list"),
                demographicsForm    = registry.byId("newDemographicsDataAddOrEditForm"),
                allergyTable        = registry.byId("allergy_list"),
                immunizationTable   = registry.byId("immunisation_list"),
                familyHistoryTable  = registry.byId("family_history_list"),
                socialHistoryTable  = registry.byId("social_history_list"),
                medicationListTable = registry.byId("medication_list"),
                admissionTable      = registry.byId("admission_list"),
                visitTable          = registry.byId("visit_list"),
                patientMediaTable   = registry.byId("patient_media_list");

            if(contactTable){
              contactTable.destroyRecursive();
              console.log("Recreating Contact tab");
              domConstruct.place("<div id='contact_list'></div>",
                                 "patientContactTab", 
                                 'second'
                                 );
              
            }
            if(phoneTable){
              phoneTable.destroyRecursive();
              console.log("Recreating Phone tab");
              domConstruct.place("<div id='phone_list'></div>",
                                 "patientContactTab", 
                                 'third'
                                 );
              
            }
            if(guardianTable){
              guardianTable.destroyRecursive();
              console.log("Recreating Guardian tab");
              domConstruct.place("<div id='guardian_list'></div>",
                                 "patientDemographicsTab", 
                                 'last'
                                 );
              
            }
            if(demographicsTable){
              demographicsTable.destroyRecursive();
              console.log("Recreating demographics tab");
              domConstruct.place("<div id='demographics_list' class='patientContextTabs'></div>",
                                 "patientDemographicsTab", 
                                 'first'
                                 );
              
            }
/*
            if(demographicsForm){
              demographicsForm.destroyRecursive();
              console.log("Recreating demographics form Div");
              domConstruct.place("<div id='demographics_add_or_edit_form' class='patientContextTabs'></div>",
                                 "patientDemographicsTab", 
                                 'second'
                                 );
            }
*/

            if(medicationListTable){
              medicationListTable.destroyRecursive();
              console.log("Recreating Medication List tab");
              domConstruct.place("<div id='medication_list' class='patientContextTabs'></div>",
                                 "patientMedicationListAndAllergiesTab", 
                                 'second'
                                 );
              
            }

            if(allergyTable){
              allergyTable.destroyRecursive();
              console.log("Recreating allergy tab");
              domConstruct.place("<div id='allergy_list' class='patientContextTabs'></div>",
                                 "patientMedicationListAndAllergiesTab", 
                                 'third'
                                 );
              
            }
            if(immunizationTable){
              immunizationTable.destroyRecursive();
              console.log("Recreating immunisation tab");
              domConstruct.place("<div id='immunisation_list' class='patientContextTabs'></div>",
                                 "patientImmunisationTab", 
                                 'second'
                                 );
              
            }
            if(familyHistoryTable){
              familyHistoryTable.destroyRecursive();
              console.log("Recreating Family History tab");
              domConstruct.place("<div id='family_history_list' class='patientContextTabs'></div>",
                                 "patientFamilyHistoryTab", 
                                 'third'
                                 );
              
            }
            if(patientMediaTable){
              patientMediaTable.destroyRecursive();
              console.log("Recreating Patient Media tab");
              domConstruct.place("<div id='patient_media_list' class='patientContextTabs'></div>",
                                 "patientMediaTab", 
                                 'second'
                                 );
              
            }
            if(admissionTable){
              admissionTable.destroyRecursive();
              console.log("Recreating Admission tab");
              domConstruct.place("<div id='admission_list' class='patientContextTabs'></div>",
                                 "patientAdmissionAndVisitsTab", 
                                 'third'
                                 );
              
            }
            if(visitTable){
              visitTable.destroyRecursive();
              console.log("Recreating Visit tab tab");
              domConstruct.place("<div id='visit_list' class='patientContextTabs'></div>",
                                 "patientAdmissionAndVisitsTab", 
                                 'second'
                                 );
            }
            /*
            dojo.forEach(dojo.query(".patientContextTabs"), 
                         function(tabs){ 
                              domStyle.set(tabs,{'height'   : '1000px', 
                                                 "overflow" : "auto"
                                                }
                                          ); 
                         }
            );
            */
     }

    function cleanUpAdmissionPane(){
      var center_top_pane = dijit.byId('centerTopTabPane');
//      var admission_pane  = dijit.findWidgets("admissionHomeContentPane")
      center_top_pane.selectChild(patientHomeContentPane);
      dojo.forEach(admissionHomeContentPane, function(e){e.destroyRecursive(true)})
      admissionHomeContentPane.domNode.innerHTML = 
          "Please select an admission to display details here."
    }

    function cleanUpVisitPane(){
      var center_top_pane = dijit.byId('centerTopTabPane');
//      var visit_pane  = dijit.findWidgets("centerBottomPaneTab3")
      center_top_pane.selectChild(patientHomeContentPane);
      dojo.forEach(visitHomeContentPane, function(e){e.destroyRecursive(true)})
      visitHomeContentPane.domNode.innerHTML = 
           "Please select a visit to display details here."
    }


    doPostDelCleanup = function (){
      //TODO
      /* This should update all the grid when a patient is deleted */
      cleanUpAdmissionPane();
      cleanUpVisitPane();
      reInitBottomPanels();
    }

   /*
    Run Functions to initiate the grids
  */
    contactGrid.startup();
    phoneGrid.startup();
    guardianGrid.startup();
//    demographicsGrid.startup();
    allergiesGrid.startup();
    immunisationGrid.startup();
    familyHistoryGrid.startup();
    medicationListGrid.startup();
    admissionGrid.startup();

// Call the Demographics Form Method:
  dijit.byId("demographics_add_or_edit_form").set('href',demographicsUrl);
  dijit.byId("patientSocialHistoryTab").set('href',socialHistoryUrl);
  
   /*
   request(demographicsUrl,
           {handleAs:'html',method: "GET"}
          ).
   then(
      function(html){
          
          dom.byId("demographics_add_or_edit_form")
          dom.byId('demographics_add_or_edit_form').innerHTML = html;
          parser.parse( dom.byId("demographics_add_or_edit_form"));
      },
      function(html){
          console.log("Error occured while GETTING the Demographics Form...");
      },
      function(evt){ 
          console.log("Demographics Request Completed...")
      }
   );
  */
{% comment %}    
    //visitGrid.startup(); 
{% endcomment %}
    return false; 
 };

    grid.onRowDblClick = function(e){ 
                        //{% if perms.patient.change_patientdetail or perms.patient.delete_patientdetail %}
                          var idx = e.rowIndex,
                              item = this.getItem(idx);
                          var patid = this.store.getValue(item, "id");
                          var edit  = this.store.getValue(item, "edit");
                          var del   = this.store.getValue(item, "del");
                          var visitadd      = this.store.getValue(item, "visitadd");
                          var admissionadd  = this.store.getValue(item, "admissionadd");
                          if( e.cell.field == 'home'){
                              e.cell.loadTab();
                          }
                          else{
                              grid.selection.clear();
                              grid.selection.setSelected(item, true);
                              xhr.get({
                                      url  : edit,
                                      load : function(html, idx){
                                                var myDialog = dijit.byId("editPatientDialog");
                                                if(myDialog == undefined || myDialog == null){
                                                  myDialog = new dijit.Dialog({
                                                                      title: "Edit Patient",
                                                                      content: html,
                                                                      style: "width: 500px; height:500px;"
                                                                      }, 
                                                                      "editPatientDialog"
                                                  );
                                                  myDialog.startup();
                                                }
                                                else{
                                                  myDialog.set('content', html);
                                                  myDialog.set('title', "Edit Patient"); 
                                                }
                                                myDialog.show();
                                      }
                            })
                          }
                      //{% endif %}
                         return false; 
    };

//{% if perms.patient.add_patientdetail %}
    var addPatientButton =  new dijit.form.Button({
                                              label: "New", 
                                              title: "Register a New Patient to the Clinic..",
                                              iconClass:"dijitIconNewTask",
                                              onClick: function(){
                                                                require(["dojo/_base/xhr",
                                                                        "dijit/registry", 
                                                                        "dijit/Dialog"
                                                                ], 
                                                                function(xhr, registry, Dialog){
                                                                      var myDialog = dijit.byId("editPatientDialog");
                                                                      xhr.get({
                                                                              url: "{%url patient_new_add %}",
                                                                              load: function(html){
                                                                                   myDialog.set('content', html);
                                                                                   myDialog.set('title', "Enroll New Patient to the Clinic - {{ user.clinic_name }}");
                                                                                   myDialog.show();
                                                                              }
                                                                      });
                                                                });
                                              }
                                            }, 
                                            "addPatientButton"
    );
//{% endif %}

//{% if perms.patient.add_patientcontact %}
    var addContactButton =  new dijit.form.Button({
                                                  label: "Add Contact",
                                                  iconClass: "dijitIconNewTask",
                                                  onClick: function(){
                                                                require(["dojo/_base/xhr", "dojo/_base/array"],
                                                                function(xhr, array){
                                                                    var gridRow    = grid.selection.getSelected();
                                                                    var id         = grid.store.getValue(gridRow[0], 'id');
                                                                    xhr.get({
                                                                            url: "{%url contact_json %}"+"?patient_id="+ id +"&action=add",
                                                                            load: function(html){
                                                                                          var myDialog = dijit.byId("editPatientDialog");
                                                                                          myDialog.set('content', html);
                                                                                          myDialog.set('title', "Add Postal Address Information");
                                                                                          myDialog.show();
                                                                                  }
                                                                     });
                                                                });
                                                 }
                                              }, 
                                              "addContactButton"
    );
//{% endif %}

//{% if perms.patient.add_patientphone %}
	  var addPhoneButton =  new dijit.form.Button({
                                          label: "Add Phone",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "{%url phone_json %}"+"?patient_id="+ id +"&action=add",
                                                      load: function(html){
                                                                   var myDialog = dijit.byId("editPatientDialog");
                                                                   myDialog.set('content', html);
                                                                   myDialog.set('title', "Add Phone Numbers");
                                                                   myDialog.show();
                                                             }
                                                   });
                                                 })
                                          }
                         }, 
                         "addPhoneButton"
  );
//{% endif %}

//{%if perms.patient.add_patientguardian %}
    var addGuardianButton =  new dijit.form.Button({
                                          label: "Add",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "{%url guardian_json %}"+"?patient_id="+ id +"&action=add",
                                                      load: function(html){
                                                               var myDialog = dijit.byId("editPatientDialog");
                                                               myDialog.set('content', html);
                                                               myDialog.set('title', "Add Guardian Information ");
                                                               myDialog.show();
                                                            }
                                                   });
                                                 })
                                          }
                         }, "addGuardianButton");
//{% endif %}

//{% if perms.admission.add_admissiondetail %}
	  var addAdmissionButton =  new dijit.form.Button({
                                          label: "Admission",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "{%url admission_json %}"+"?patient_id="+ id +"&action=add",
                                                      load: function(html){
                                                                 var myDialog = dijit.byId("editPatientDialog");
                                                                 myDialog.set('content', html);
                                                                 myDialog.set('title', "Record New Admission to the Clinic - {{ user.clinic_name }}");
                                                                 myDialog.show();
                                                            }
                                                   });
                                                 })
                                          }
                         }, "addAdmissionButton");
//{% endif %}

//{% if perms.visit.add_visitdetail %}
	  var addVisitButton =  new dijit.form.Button({
                                          label: "Visit",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "{%url visit_json %}"+"?patient_id="+ id +"&action=add",
                                                      load: function(html){
                                                                 var myDialog = dijit.byId("editPatientDialog");
                                                                 myDialog.set('content', html);
                                                                 myDialog.set('title', " Record New Out Patient Visit to the Clinic - {{ user.clinic_name }}");
                                                                 myDialog.show();
                                                            }
                                                   });
                                                 })
                                          }
                         }, "addVisitButton");
//{% endif %}

//{% if perms.patient %}
	  var addDemographicsButton =  new dijit.form.Button({
                                          label: "Add Demographics",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "{%url demographics_json %}"+ "?patient_id=" + id +"&action=add",
                                                      load: function(html){
                                                                 var myDialog = dijit.byId("editPatientDialog");
                                                                 myDialog.set('content', html);
                                                                 myDialog.set('title', "Record Demographics Information");
                                                                  myDialog.show();
                                                            }
                                                   });
                                                 })
                                          }
                         }, "addDemographicsButton");
//{% endif %}


//{% if perms.patient %}
	  var addAllergyButton =  new dijit.form.Button({
                                          label: "New Allergy",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id         = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "{% url allergies_json %}"+"?patient_id="+ id +"&action=add",
                                                      load: function(html){
                                                                 var myDialog = dijit.byId("editPatientDialog");
                                                                 myDialog.set('content', html);
                                                                 myDialog.set('title', "Record New Allergy Details");
                                                                 myDialog.show();
                                                            }
                                                   });
                                                 })
                                          }
                         }, "addAllergyButton");
//{% endif %}

//{% if perms.patient %}
	  var addPatientImmunisationButton =  new dijit.form.Button({
                                          label: "Add",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "{%url immunisation_json %}"+"?patient_id="+ id +"&action=add",
                                                      load: function(html){
                                                                 var myDialog = dijit.byId("editPatientDialog");
                                                                 myDialog.set('content', html);
                                                                 myDialog.set('title', "Record New Immunisation Details");
                                                                 myDialog.show();
                                                            }
                                                   });
                                                 })
                                          }
                         }, "addPatientImmunisationButton");
//{% endif %}

//{% if perms.patient %}
	  var addPatientFamilyHistoryButton =  new dijit.form.Button({
                                          label: "Add",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "{%url family_history_json %}"+"?patient_id="+ id +"&action=add",
                                                      load: function(html){
                                                                 var myDialog = dijit.byId("editPatientDialog");
                                                                 myDialog.set('content', html);
                                                                 myDialog.set('title', "Record New Family History Details");
                                                                 myDialog.show();
                                                            }
                                                   });
                                                 })
                                          }
                         }, "addPatientFamilyHistoryButton");


//{% endif %}

//{% if perms.patient %}
	  var addPatientMedicationListButton =  new dijit.form.Button({
                                          label: "Add Medication",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "{%url medication_list_json%}"+"?patient_id="+ id +"&action=add",
                                                      load: function(html){
                                                                 var myDialog = dijit.byId("editPatientDialog");
                                                                 myDialog.set('content', html);
                                                                 myDialog.set('title', "Record Medication Details");
                                                                 myDialog.show();
                                                            }
                                                   });
                                                 })
                                          }
                         }, "addPatientMedicationListButton");
//{% endif %}


//{% if perms.patient %}
	  var addPatientMediaButton =  new dijit.form.Button({
                                          label: "Add",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "/AuShadha/"+"?patient_id="+ id +"&action=add",
                                                      load: function(html){
                                                                 var myDialog = dijit.byId("editPatientDialog");
                                                                 myDialog.set('content', html);
                                                                 myDialog.set('title', "Add Patient Media");
                                                                 myDialog.show();
                                                            }
                                                   });
                                                 })
                                          }
                         }, "addPatientMediaButton");
//{% endif %}



// {% endif %} 

  genericFormBehaviour();

  var patientIdStore = new JsonRest({
            target     : "{%url patient_id_autocompleter %}",
            idProperty : 'patient_id'
        });

    var patientHospitalIdStore = new JsonRest({
            target     : "{%url patient_hospital_id_autocompleter  %}",
            idProperty : 'patient_id'
        });

    var patientNameStore = new JsonRest({
            target     : "{%url patient_name_autocompleter %}",
            idProperty : 'patient_id'
        });


    var patientHospitalIdSelect = new dijit.form.FilteringSelect({
        label        : "Search Patient ID: ",
        name         : "patientHospitalIdAutoCompleter",
        store        : patientHospitalIdStore,
        autoComplete : false,
        required     : true,
        placeHolder  : "Search Patient ID.",
        hasDownArrow : true,
        style        : "width: 175px; margin-left: 20px;",
        searchAttr   : "patient_hospital_id",
        labelAttr    : "name",
        onChange     : function(patient_hospital_id){
                        console.log("You chose " + this.item.patient_hospital_id)
                        console.log("You chose Patient: " + this.item.patient_name)
                        if(this.item == false){
                          dojo.attr( dojo.byId("patientSearchFormSubmitBtn"),
                                     'disabled',
                                     'disabled'
                          )
                        }
                        if(this.item){
                          dojo.attr( dojo.byId("patientSearchFormSubmitBtn"),'disabled','')
                          console.log(patientHospitalIdStore)
                          console.log(this.item.patient_hospital_id)
                          var queryItem = patientHospitalIdStore.
                                               query({"patient_hospital_id": 
                                                       this.item.patient_hospital_id}
                                               )
                          var get_name    = this.item.patient_name+""
                          var patNameItem = patientNameStore.
                                               query({"patient_name" : this.item.patient_name ,
                                                      "patient_id"   : this.item.patient_id 
                                               });
                          dijit.byId("patientNameSelection").
                                set('displayedValue', this.item.patient_name);
                          var patient_id = this.item.patient_id;
                          var searchedPatientId = myStore.query({'patient_id': patient_id});
                          grid.filter({id: patient_id }, true);
                          console.log(searchedPatientId);
//                            alert(searchedPatientId.results )
//                            var myStorePatient = grid.store.fetchItemByIdentity({"patient_id":patient_id})
//                            console.log(myStorePatient)
                        }
                      }
    },
   "patientHospitalIdSelection"
   );

  patientHospitalIdSelect.startup();


  var patientNameSelect = new dijit.form.FilteringSelect({
      label        : "Search Patient Name ",
      name         : "patientNameAutoCompleter",
      store        : patientNameStore,
      autoComplete : false,
      required     : true,
      placeHolder  : "Search Patient Name",
      hasDownArrow : true,
      labelAttr    : "patient_name",
      style        : "width: 175px; margin-left: 20px;",
      searchAttr   : "patient_name",
      onChange     : function(patient_name){
//                            alert("You chose " + this.item.patient_hospital_id)
                      if(this.item){
//                              alert(this.item.patient_id)
                        var queryItem = patientHospitalIdStore.
                                         query({ 'patient_hospital_id':
                                                 this.item.patient_hospital_id
                                         });

                        dijit.byId("patientHospitalIdSelection").
                         set('displayedValue', this.item.patient_hospital_id);
/*
                        dijit.byId("patientIdSelection").
                         set('displayedValue', queryItem.patient_hospital_id);
*/
                      }
                    }
  },
  "patientNameSelection"
  );
  
  patientNameSelect.startup();

// Setting Focus on Page Load;;
//    dijit.byId('filterPatGridTextBox').focus();

});




/* GENERIC CRUD FUNCTION FOR FORM SUBMISSION - ADDING, EDITING, DELETING */



/*
Raise an Invalid Form Submission Dialog and return false
*/
function raiseInvalidFormSubmission(){
  require(["dijit/registry"], function(registry){
           registry.byId("invalidFormSubmissionErrorDialog").show();
           return false;
         });
  return false;
}

/*
Raise an Permission Denied Dialog and return false
*/
function raisePermissionDenied(){
  require(["dijit/registry"], function(registry){
           registry.byId("permissionDeniedErrorDialog").show();
           return false;
         });
  return false;
}




/*
  A generic function to do an adding of all Items and update the div / grid accordingly
  to call it with the URL , the Form's dojo-id and the grid to update and add the row to
  We are assuming that the server returns a JSON with json.addData so that the row can be 
  updated. 
*/
function addItem(url,form_id,grid_id){
  require(["dojo/dom",
           "dojo/request/xhr", 
           "dijit/registry"  , 
           "dojo/json"       ,
           "dojo/dom-form"   , 
           "dijit/Dialog"
  ], 
  function(dom, xhr, registry, JSON, domForm, Dialog){
    var editDialog  = registry.byId("editPatientDialog");
    var errorDialog = registry.byId("dialogJsonMessage");
    xhr(url,{
         handleAs: "text",
         method  : "POST",
         data    : domForm.toObject(form_id)
    }).then(
       function(json){ 
          var jsondata = JSON.parse(json)
          console.log(jsondata);
          if(jsondata.success == true){
            dom.byId(form_id).reset();
            var data = jsondata.addData;
            dijit.byId(grid_id).store.newItem(data);
            if(ADD_MORE_ITEMS == false){
              editDialog.hide();
            }
            else{
              registry.byId(form_id).focus();
            }
          }
       }, 
       function(json){ 
            var jsondata = JSON.parse(json);
            errorDialog.set("title", "ERROR");
            errorDialog.set("content", jsondata.error_message);
            errorDialog.show();
       },
       function(evt){console.log("Adding Data Finished Successfully...")}
    );
  });
}



/*
  A generic function to do an update of all Items and update the div / grid accordingly
  to call it with the URL , the Form's dojo-id and the grid to update and re-render
*/
function editItem(url,form_id,grid_id){
  require(["dojo/request/xhr", 
           "dijit/registry"  , 
           "dojo/json"       ,
           "dojo/dom-form"   , 
           "dijit/Dialog"
  ], 
  function(xhr,registry,JSON, domForm, Dialog){
    var editDialog  = registry.byId("editPatientDialog");
    var errorDialog = registry.byId("dialogJsonMessage");
    xhr(url,{
         handleAs: "text",
         method  : "POST",
         data    : domForm.toObject(form_id)
    }).
    then(
       function(json){ 
          var jsondata = JSON.parse(json)
          console.log(jsondata);
          if(jsondata.success == true){
            registry.byId(grid_id).render();
            editDialog.hide();
          }
          else{
            errorDialog.set("title", "ERROR");
            errorDialog.set("content", jsondata.error_message);
            errorDialog.show();
          }
       }, 
       function(json){ 
            var jsondata = JSON.parse(json);
            errorDialog.set("title", "ERROR");
            errorDialog.set("content", jsondata.error_message);
            errorDialog.show();
       },
       function(evt){
            console.log("Update Actions Finished Successfully...")
       }
    );
  });
}

/*
 Generic Delete Function 
 Gets the URL to call and the Grid to update as the arguments. 
*/

function delItem(url,grid_id){
  require(["dojo/dom", 
		         "dojo/request/xhr",
		         "dojo/json",
		         "dijit/registry",
		         "dijit/Dialog"
	],
  function(dom, xhr, JSON, registry, Dialog){
    xhr(url,{method: "GET", handleAs:"text" }).
    then(
      function(json){
        var jsondata = JSON.parse(json)
        if (jsondata.success == true){
          registry.byId("editPatientDialog").hide();
          registry.byId(grid_id).render();
          registry.byId(grid_id).selection.clear();
        }
        else{
         var errorDialog = registry.byId('dialogJsonMessage');
         errorDialog.set('title', "ERROR!");
         errorDialog.set('content', jsondata.error_message);
         errorDialog.show();
        }
      }, 
      function(json){  
        console.log("ERROR in Server.. Please retry.");
      },
      function(evt){
        console.log("Deleting Item Complete")
      }
    );
  });
}
