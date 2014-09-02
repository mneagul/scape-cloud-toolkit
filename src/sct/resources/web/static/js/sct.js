var table = $("#manager-list");

function display(name){
    var tr = document.getElementsByClassName('hide' + name);
    var img = document.getElementById('img' + name);
    for (var i = 0; i < tr.length; i++) { // tr is the list of row to hide/show
        if (tr[i].style.display == 'none'){
            tr[i].style.display = '';
            img.src = "/static/img/chevronRight.png";
        }
        else{
            tr[i].style.display = 'none';
            img.src = "/static/img/chevron.png";
        }
    }
}


/*
 *Function to append the managers to the table
 */
function appendManagers(elem){
    var img = Object.size(elem.templates) > 0 ? '/static/img/chevron.png ' : '"" ';
    var row = $.tmpl(tableTemplate.th, {options: 'onClick="display(\'' + elem.name + '\')"', header: '<img src=' + img + ' id="img' + elem.name + '">'});
        //'<tr><th onClick="display(' + elem.id + ')">';
    //row += '<img src=' + img + ' id="img' + elem.id + '"></th>'; //add carret for dropdown
    row +=  $.tmpl(tableTemplate.td, {cell: elem.id});//   '<td>' + elem.id + '</td>'; //add manager id
    row +=  $.tmpl(tableTemplate.td, {cell: elem.name});// row + '<td>' + elem.name + '</td>'; //add manager name
    row += $.tmpl(tableTemplate.td, {cell: 'Manager'});
    // Add action buttons
    var actionButtons = '';
    actionButtons += $.tmpl(buttonTemplate.modal, {class: 'success', name: elem.name, message: 'Add Machine', action: 'add'});
    actionButtons += $.tmpl(buttonTemplate.modal, {class: 'danger', name: elem.name, message: 'Destroy', action: 'del'});
    actionButtons += $.tmpl(buttonTemplate.popover, {class: 'info', name: elem.name, place: 'right', message: 'Info', content: elem.info});
    row += $.tmpl(tableTemplate.td, {cell: actionButtons});
    row = $.tmpl(tableTemplate.tr, {row: row});
    table.append(row);

    //machines = query via RPC
    
    
    for(tmpl in elem.templates){
        
        /*
        console.log(elem.templates);
        
        var message = 'Start';
        if(machines[i].running == "true"){
            message = 'Stop';
        }

        //Create buttons           
        var run = $.tmpl(buttonTemplate.func, {class: (message == 'Stop' ? 'warning' : 'success'), func: 'modifyMachineState', params: (elem.id + ',' + machines[i].id + ',' + machines[i].running), message: message});
        */
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

        

        //Information about the machine
        var machineRow =  $.tmpl(tableTemplate.td, {cell: ''});
        machineRow +=  $.tmpl(tableTemplate.td, {cell: ''});
        machineRow +=  $.tmpl(tableTemplate.td, {cell: ''});
        machineRow +=  $.tmpl(tableTemplate.td, {cell: tmpl});
        machineRow +=  $.tmpl(tableTemplate.td, {cell: destroy + info, options: 'align="right"'});
        machineRow = $.tmpl(tableTemplate.mtr, {row: machineRow, name: elem.name});




        table.append(machineRow);
        table.append($.tmpl(machineDelDiv, {machineName: tmpl, managerName: elem.name}));
        $("[data-toggle=popover]").popover({html:true})

    }   

    var options = '';
    //types = get types
    nodeTemplates.forEach(function (element) {
        options += '<option>' + element +  '</option>';
    });

    table.append($.tmpl(managerDelDiv, {id: elem.id, name: elem.name}));
    table.append($.tmpl(machineAddDIV, {id: elem.id, name: elem.name, options: options}));

    



}



$(document).ready(function () {    
    getTemplates();
    showClusters();
                  
});