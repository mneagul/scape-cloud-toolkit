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
    var row = $.tmpl(tableTemplate.th, {options: 'onClick="display(' + elem.name + ')"', header: '<img src=' + img + ' id="img' + elem.name + '">'});
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
    
    $("[data-toggle=popover]").popover({html:true})
    
    
    for(tmpl in elem.templates){//Continue from here
        
        /*
        console.log(elem.templates);
        
        var message = 'Start';
        if(machines[i].running == "true"){
            message = 'Stop';
        }

        //Create buttons           
        var run = $.tmpl(buttonTemplate.func, {class: (message == 'Stop' ? 'warning' : 'success'), func: 'modifyMachineState', params: (elem.id + ',' + machines[i].id + ',' + machines[i].running), message: message});
        */
        var node_info = '';
        node_info += '<li>Count: ' + elem.templates[tmpl].count + '</li>';
        node_info += '<li>Nodes:';
        node_info += '<ol>';
        
        for(var i = 0; i < elem.templates[tmpl].nodes.length; i++){
            node_info += '<li>' + i + '</li>';
        }
        
        var destroy = $.tmpl(buttonTemplate.modal, {class: 'danger', name: tmpl, message: 'Destroy', action: 'del'});
        var info = $.tmpl(buttonTemplate.popover, {class: 'info', name: elem.name + '' + machines[i].name, place: 'right', message: 'Info', content: machines[i].info});

        

        //Information about the machine
        var machineRow =  $.tmpl(tableTemplate.td, {cell: ''});
        machineRow +=  $.tmpl(tableTemplate.td, {cell: machines[i].id});
        machineRow +=  $.tmpl(tableTemplate.td, {cell: machines[i].name});
        machineRow +=  $.tmpl(tableTemplate.td, {cell: machines[i].type});
        machineRow +=  $.tmpl(tableTemplate.td, {cell: run + destroy + info, options: 'align="right"'});
        machineRow = $.tmpl(tableTemplate.mtr, {row: machineRow, id: elem.id});




        table.append(machineRow);
        table.append($.tmpl(machineDelDiv, {mID: elem.id, tID: machines[i].id, machineName: machines[i].id, managerName: elem.name}));

    } //end of inner for loop
    for(var i = 0; i < elem.instances; i++){
        var popover = $('#popover' + elem.id + '' + machines[i].id);
        if(! popover){
            console.log('This error is weird');
        }else{
            popover.popover({trigger:'hover'});
        }
    }   

    var options = '';
    //types = get types
    nodeTemplates.forEach(function (element) {
        options += '<option>' + element +  '</option>';
    });

    table.append($.tmpl(managerDelDiv, {id: elem.id, name: elem.name}));
    table.append($.tmpl(machineAddDIV, {id: elem.id, name: elem.name, options: options}));

    $(function () {
        $("#popover" + elem.name).popover({trigger:'hover'});
    });



}

$(document).ready(function () {    
    getTemplates();
    showClusters();
                  
});