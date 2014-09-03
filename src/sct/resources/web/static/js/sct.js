var table = $("#manager-list");
var nodePlace = function (name){
    return $("#cluster" + name + ':last');
}

function tooglePopover(){
    $("[data-toggle=popover]").popover({ trigger: "manual" , html: true})
    .on("mouseenter", function () {
        var _this = this;
        $(this).popover("show");
        $(".popover").on("mouseleave", function () {
            $(_this).popover('hide');
        });
    }).on("mouseleave", function () {
        var _this = this;
        setTimeout(function () {
            if (!$(".popover:hover").length) {
                $(_this).popover("hide");
            }
        }, 100);
    });

}


function display(name){
    var tr = $('.cluster' + name + 'Child');
    var span = document.getElementById('span' + name);
    for (var i = 0; i < tr.length; i++) { // tr is the list of row to hide/show
        console.log(tr[i]);
        if (tr[i].style.display == 'none'){
            tr[i].style.display = '';
            $('#span' + name).attr('class', 'glyphicon glyphicon-list-alt');
        }
        else{
            tr[i].style.display = "none";
            $('#span' + name).attr('class', 'glyphicon glyphicon-chevron-down');
        }
    }
}




/*



/*
 *Function to append the managers to the table
 */
function appendManagers(elem){
    console.log('CAlled');
    var row = $.tmpl(tableTemplate.td, {options: 'onClick="display(\'' + elem.name + '\')"', cell: '<i id="span' + elem.name + '"></i>'});
        //'<tr><th onClick="display(' + elem.id + ')">';
    //row += '<img src=' + img + ' id="img' + elem.id + '"></th>'; //add carret for dropdown
    row +=  $.tmpl(tableTemplate.td, {cell: elem.id, options: 'onClick="display(\'' + elem.name + '\')"'});//   '<td>' + elem.id + '</td>'; //add manager id
    row +=  $.tmpl(tableTemplate.td, {cell: elem.name, options: 'onClick="display(\'' + elem.name + '\')"'});// row + '<td>' + elem.name + '</td>'; //add manager name
    row += $.tmpl(tableTemplate.td, {cell: 'Manager', options: 'onClick="display(\'' + elem.name + '\')"'});
    // Add action buttons
    var actionButtons = '';
    actionButtons += $.tmpl(buttonTemplate.modal, {class: 'success', name: elem.name, message: 'Add Machine', action: 'add'});
    actionButtons += $.tmpl(buttonTemplate.modal, {class: 'danger', name: elem.name, message: 'Destroy', action: 'del'});
    actionButtons += $.tmpl(buttonTemplate.popover, {class: 'info', name: elem.name, place: 'right', message: 'Info', content: elem.info});
    row += $.tmpl(tableTemplate.td, {cell: actionButtons});
    row = $.tmpl(tableTemplate.tr, {row: row, options:  'id="cluster' + elem.name + '"'});
    table.append(row);

    var options = '';
    nodeTemplates.forEach(function (element) {
        options += '<option>' + element +  '</option>';
    });

    table.append($.tmpl(managerDelDiv, {id: elem.id, name: elem.name}));
    table.append($.tmpl(machineAddDIV, {id: elem.id, name: elem.name, options: options}));



}


function appendNode(elem, tmpl){
    var node_info = '<ul>';
    node_info += '<li>Count: ' + elem.templates[tmpl].count + '</li>';
    node_info += '<li>Nodes:';
    node_info += '<ol>';

    for(var i = 0; i < elem.templates[tmpl].nodes.length; i++){
        node_info += '<li>';
        node_info += '<ul>';
        node_info += '<li>IP: ' + elem.templates[tmpl].nodes[i].ip + '</li>';
        for(p in elem.templates[tmpl].nodes[i].ports){
            node_info += '<li>' + p + ': ' + elem.templates[tmpl].nodes[i].ports[p] + '</li>';
        }
        node_info += '</ul></li>';
    }
    node_info += '</ol></li></ul>';

    var destroy = $.tmpl(buttonTemplate.modal, {class: 'danger', name: elem.name + '' + tmpl, message: 'Destroy', action: 'del'});
    var info = $.tmpl(buttonTemplate.popover, {class: 'info', name: elem.name + '' + tmpl, place: 'right', message: 'Info', content: node_info});
    
    hddCount = '';
    for(var i = 0; i < elem.templates[tmpl].count; i++){
        hddCount += '<span class="glyphicon glyphicon-hdd"></span> ';
    }

    //Information about the machine
    var machineRow =  $.tmpl(tableTemplate.td, {cell: ''});
    machineRow +=  $.tmpl(tableTemplate.td, {cell: ''});
    machineRow +=  $.tmpl(tableTemplate.td, {cell: hddCount});
    machineRow +=  $.tmpl(tableTemplate.td, {cell: tmpl});
    machineRow +=  $.tmpl(tableTemplate.td, {cell: destroy + info, options: 'align="right"'});
    machineRow = $.tmpl(tableTemplate.mtr, {row: machineRow, name: elem.name, id: tmpl});



    nodePlace(elem.name).after(machineRow);
    $('#span' + elem.name).attr('class', 'glyphicon glyphicon-chevron-down');
    table.append($.tmpl(machineDelDiv, {machineName: tmpl, managerName: elem.name}));
    
    tooglePopover();
}


$(document).ready(function () {    
    getTemplates();
    showClusters();
    
});