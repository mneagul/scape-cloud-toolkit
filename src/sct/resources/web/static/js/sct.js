function display(id){
    var tr = document.getElementsByClassName('hide' + id);
    var img = document.getElementById('img' + id);
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

$(document).ready(function () {
    
    
    var table = $("#manager-list");
    
    
    
    
    
    /*
     *Function to append the managers to the table
     */
    function appendManagers(elem){
        var img = elem.instances > 0 ? '/static/img/chevron.png ' : '"" ';
        var row = $.tmpl(tableTemplate.th, {options: 'onClick="display(' + elem.id + ')"', header: '<img src=' + img + ' id="img' + elem.id + '">'});
            //'<tr><th onClick="display(' + elem.id + ')">';
        //row += '<img src=' + img + ' id="img' + elem.id + '"></th>'; //add carret for dropdown
        row +=  $.tmpl(tableTemplate.td, {cell: elem.id});//   '<td>' + elem.id + '</td>'; //add manager id
        row +=  $.tmpl(tableTemplate.td, {cell: elem.name});// row + '<td>' + elem.name + '</td>'; //add manager name
        row += $.tmpl(tableTemplate.td, {cell: 'Manager'});
        // Add action buttons
        var actionButtons = '';
        actionButtons += $.tmpl(buttonTemplate.modal, {class: 'success', id: elem.id, message: 'Add Machine', action: 'add'});
		actionButtons += $.tmpl(buttonTemplate.modal, {class: 'danger', id: elem.id, message: 'Destroy', action: 'del'});
        actionButtons += $.tmpl(buttonTemplate.popover, {class: 'info', id: elem.id, place: 'right', message: 'Info', content: elem.info});
        row += $.tmpl(tableTemplate.td, {cell: actionButtons});
        row = $.tmpl(tableTemplate.tr, {row: row});
        table.append(row);
        
        //machines = query via RPC
        for(var i = 0; i < elem.instances; i++){
            var message = 'Start';
            if(machines[i].running == "true"){
                message = 'Stop';
            }
            
            //Create buttons           
            var run = $.tmpl(buttonTemplate.func, {class: (message == 'Stop' ? 'warning' : 'success'), func: 'modifyMachineState', params: (elem.id + ',' + machines[i].id + ',' + machines[i].running), message: message});
            var destroy = $.tmpl(buttonTemplate.modal, {class: 'danger', id: 'M'+elem.id+'T'+machines[i].id, message: 'Destroy', action: 'del'});
            var info = $.tmpl(buttonTemplate.popover, {class: 'info', id: elem.id + '' + machines[i].id, place: 'right', message: 'Info', content: machines[i].info});
            
            console.log('Instances ' + elem.instances);
            console.log( 'Popover id=' + elem.id + '' + machines[i].id);
            
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
        types.forEach(function (element) {
            options += '<option>' + element +  '</option>';
        });
        
        table.append($.tmpl(managerDelDiv, {id: elem.id, name: elem.name}));
        table.append($.tmpl(machineAddDIV, {id: elem.id, name: elem.name, options: options}));
        
        $(function () {
            $("#popover" + elem.id).popover({trigger:'hover'});
        });
        
        
        
    }
    
    
    managers.forEach(appendManagers);
                  
});