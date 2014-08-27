/*Templates*/

var tableTemplate = {
    tr : '<tr>#{row}</tr>',
    mtr: '<tr style="display:none" class="hide#{id}">#{row}</tr>',
    th : '<th #{options}>#{header}</th>',
    td : '<td #{options}>#{cell}</td>'
}

var buttonTemplate = {
    modal : '<button type="button" class="btn btn-#{class}" data-toggle="modal" data-target=".bs-#{action}-modal-sm#{id}">#{message}</button> ',
    popover : '<button type="button" id="popover#{id}" class="btn btn-#{class}" data-container="body" data-toggle="popover" data-placement="#{place}" data-content="#{content}">#{message}</button> ',
    func : '<button type="button" class="btn btn-#{class}"  onClick="#{func}(#{params})">#{message}</button> '
}

var machineDelDiv = '<div class = "modal fade bs-del-modal-smM#{mID}T#{tID}">' + 
                            '<div class = "modal-dialog">' + 
                                        '<div class = "modal-content">' + 
                                            '<div class = "modal-header">' + 
                                                '<button type = "button" class = "close" data-dismiss = "modal" aria-hidden = "true">&times;' + 
                                                '</button>' + 
                                                '<h4 class = "modal-title">Warning</h4>' + 
                                             '</div>' + 
                                             '<div class = "modal-body">' +
                                                'Destroy machine <b>#{machineName}</b> managed by <b>#{managerName}</b>?' +
                                             '</div>' +
                                             '<div class="modal-footer">' + 
                                                '<button type="button" class="btn btn-danger" data-dismiss="modal" onClick="deleteMachine(#{mID},#{tID})" ng-model="success">Destroy</button>' +
                                                '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                                             '</div>' +
                                        '</div>' + //modal content
                            '</div>' + //modal dialog
                        '</div>'; //end of modal

var managerDelDiv = '<div class = "modal fade bs-del-modal-sm#{id}">' + 
                        '<div class = "modal-dialog">' + 
                            '<div class = "modal-content">' + 
                                '<div class = "modal-header">' + 
                                    '<button type = "button" class = "close" data-dismiss = "modal" aria-hidden = "true">&times; </button>' + 
                                        '<h4 class = "modal-title">Warning</h4>' + 
                                '</div>' + 
                                '<div class = "modal-body">' +
                                    'Destroy manager <b>#{name}</b>?' +
                                '</div>' +
                                '<div class="modal-footer">' + 
                                    '<button type="button" class="btn btn-danger"  data-dismiss="modal" onClick="deleteManager(#{id})" ng-model="success">Destroy</button>' +
                                    '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                                '</div>' +
                            '</div>' + //modal content
                        '</div>' + //modal dialog
                    '</div>'; 

var machineAddDIV = '<div id="addMachineModal" class="modal fade bs-add-modal-sm#{id}">' + 
                                '<div class="modal-dialog">' + 
                                    '<div class="modal-content">' +
                                        '<div class="modal-header">' +
                                            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                                            '<h4 class="modal-title">Create new machine managed by#{name}?</h4>' + 
                                        '</div>' + //modal header
                                        '<div class="modal-body">' + 
                                            '<form id="addForm" role="form" action="javascript:addMachine()">' +
                                                '<input type="hidden" name="mID" value="#{id}"></input>' +
                                                '<div class="form-group">' +
                                                    '<label for="name">Name</label>' +
                                                    '<input type="name" id="name" class="form-control" name="name">' +
                                                '</div>' +
                                                '<label for="type">Server Type</label>' +
                                                '<select multiple type="type" class="form-control" name="type">' +
                                                    '#{options}' +
                                                '</select></br>' +
                                                '<div class = "form-group">' +
                                                    '<label for = "info">Information</label>' +
                                                    '<input type = "text" id = "info" class = "form-control" name = "info">' +
                                                '</div>' +
                                                '<button type="submit"  class="btn btn-default">Submit</button>' +
                                            '</form>' +
                                        '</div>' +
                                        '<div class = "modal-footer">' +
                                            '<button type = "button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                                        '</div>' +
                                    '</div><!--/.modal-content -->' +
                                '</div><!--/.modal-dialog -->' +
                            '</div><!--/.modal -->';


/*
**Hard-coded JSON representing machines for manager 1
*/
var machines= [
  {
    "running": "false",
    "created": "24/07/2014 10:20:59",
    "updated": null,
    "managerID": 1,
    "info": "as",
    "name": "lkajsd",
    "id": 0,
    "type": "hadoop-server"
  },
  {
    "running": "false",
    "created": "24/07/2014 10:21:17",
    "updated": null,
    "managerID": 1,
    "info": "Blah",
    "name": "Worker 1 ",
    "id": 1,
    "type": "hadoop-worker"
  },
  {
    "running": "false",
    "created": "24/07/2014 10:21:29",
    "updated": null,
    "managerID": 1,
    "info": "Blah 2",
    "name": "Worker 2 ",
    "id": 2,
    "type": "hadoop-worker"
  }
];
var types = ["hadoop-server", "hadoop-worker", "taverna-server"];


/**
Hard coding a JSON to test this 
*/
var managers = [
  {
    "instances": 3,
    "created": "07/09/2014 12:48:30",
    "updated": null,
    "info": "Some information",
    "name": "Manager 1",
    "id": 1
  },
  {
    "instances": 0,
    "created": "07/24/2014 10:22:06",
    "updated": null,
    "info": "Info",
    "name": "Manager 2",
    "id": 2
  }
];