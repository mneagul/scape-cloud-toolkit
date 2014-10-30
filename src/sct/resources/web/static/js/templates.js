/*Templates*/

var tableTemplate = {
    tr : '<tr #{options}>#{row}</tr>',
    mtr: '<tr style="display: none" class="cluster#{name}Child" id=c-#{id}>#{row}</tr>',
    th : '<th #{options}>#{header}</th>',
    td : '<td #{options}>#{cell}</td>'
}

var alertTemplate = '<div class="alert alert-#{type} fade in" id=alert-#{id}>' +
                        '<a href="#" class="close" data-dismiss="alert">&times;</a>' + 
                        '<p><strong>#{strong}</strong> #{message}</p>' +
                    '</div>';

var waitAnimation = '<span class="glyphicon glyphicon-time glyphicon-refresh-animate"></span>';
var successIcon = '<span class="glyphicon glyphicon-ok"></span>';
var errorIcon = '<span class="glyphicon glyphicon-remove-circle"></span>';


var buttonTemplate = {
    modal : ' <button type="button" class="btn btn-#{class}" data-toggle="modal" data-target=".bs-#{action}-modal-sm#{name}">#{message}</button>',
    popover : ' <button type="button" id="popover#{name}" class="btn btn-#{class}" data-container="body" data-toggle="popover" data-placement="#{place}" data-content="#{content}">#{message}</button> ',
    func : ' <button type="button" class="btn btn-#{class}"  onClick="#{func}(#{params})">#{message}</button>'
}

var nodeDelDiv = '<div class = "modal fade bs-del-modal-sm#{clusterName}#{nodeName}">' + 
                            '<div class = "modal-dialog">' + 
                                        '<div class = "modal-content">' + 
                                            '<div class = "modal-header">' + 
                                                '<button type = "button" class = "close" data-dismiss = "modal" aria-hidden = "true">&times;' + 
                                                '</button>' + 
                                                '<h4 class = "modal-title">Warning</h4>' + 
                                             '</div>' + 
                                             '<div class = "modal-body">' +
                                                'Destroy node <b>#{nodeName}</b> managed by <b>#{clusterName}</b>?' +
                                             '</div>' +
                                             '<div class="modal-footer">' + 
                                                '<button type="button" class="btn btn-danger" data-dismiss="modal" onClick="deleteNode(#{nodeName},#{clusterName})" ng-model="success">Destroy</button>' +
                                                '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                                             '</div>' +
                                        '</div>' + //modal content
                            '</div>' + //modal dialog
                        '</div>'; //end of modal

var clusterDelDiv = '<div class = "modal fade bs-del-modal-sm#{name}">' + 
                        '<div class = "modal-dialog">' + 
                            '<div class = "modal-content">' + 
                                '<div class = "modal-header">' + 
                                    '<button type = "button" class = "close" data-dismiss = "modal" aria-hidden = "true">&times; </button>' + 
                                        '<h4 class = "modal-title">Warning</h4>' + 
                                '</div>' + 
                                '<div class = "modal-body">' +
                                    'Destroy cluster <b>#{name}</b>?' +
                                '</div>' +
                                '<div class="modal-footer">' + 
                                    '<button type="button" class="btn btn-danger"  data-dismiss="modal" onClick="deleteCluster(\'#{name}\')" ng-model="success">Destroy</button>' +
                                    '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                                '</div>' +
                            '</div>' + //modal content
                        '</div>' + //modal dialog
                    '</div>'; 

var nodeAddDIV = '<div id="addNodeModal" class="modal fade bs-add-modal-sm#{name}">' + 
                                '<div class="modal-dialog">' + 
                                    '<div class="modal-content">' +
                                        '<div class="modal-header">' +
                                            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                                            '<h4 class="modal-title">Add a node in cluster #{name}</h4>' + 
                                        '</div>' + //modal header
                                        '<div class="modal-body">' + 
                                            '<form id="addForm#{name}" role="form" action="javascript:addNode(\'#{name}\')">' +
                                                '<input type="hidden" name="mName" value="#{name}"></input>' +
                                                
                                                '<label for="type">Select template</label>' +
                                                '<select type="type" class="form-control" name="type" id="template">' +
                                                    '#{options}' +
                                                '</select></br>' +
                                                '<button type="submit"  class="btn btn-default">Submit</button>' +
                                            '</form>' +
                                        '</div>' +
                                        '<div class = "modal-footer">' +
                                            '<button type = "button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                                        '</div>' +
                                    '</div><!--/.modal-content -->' +
                                '</div><!--/.modal-dialog -->' +
                            '</div><!--/.modal -->';



var nodeTemplates = [];
