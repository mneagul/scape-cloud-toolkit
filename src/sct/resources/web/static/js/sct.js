var table = $("#cluster-list");
var nodePlace = function (name){
    return $("#cluster" + name + ':last');
}

function togglePopover(){
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
    for (var i = 0; i < tr.length; i++) { // tr is the list of row to hide/s
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
 *Function to append the clusters to the table
 */
function appendClusters(elem){
    var row = $.tmpl(tableTemplate.td, {options: 'onClick="display(\'' + elem.name + '\')"', cell: '<i id="span' + elem.name + '"></i>'});
        //'<tr><th onClick="display(' + elem.id + ')">';
    //row += '<img src=' + img + ' id="img' + elem.id + '"></th>'; //add carret for dropdown
    row +=  $.tmpl(tableTemplate.td, {cell: elem.id, options: 'onClick="display(\'' + elem.name + '\')"'});//   '<td>' + elem.id + '</td>'; //add cluster id
    row +=  $.tmpl(tableTemplate.td, {cell: elem.name, options: 'onClick="display(\'' + elem.name + '\')"'});// row + '<td>' + elem.name + '</td>'; //add cluster name
    row += $.tmpl(tableTemplate.td, {cell: 'Cluster', options: 'onClick="display(\'' + elem.name + '\')"'});
    // Add action buttons
    var actionButtons = '';
    actionButtons += $.tmpl(buttonTemplate.modal, {class: 'success', name: elem.name, message: 'Add Node', action: 'add'});
    actionButtons += $.tmpl(buttonTemplate.modal, {class: 'danger', name: elem.name, message: 'Destroy', action: 'del'});
    console.info(elem.info);
    actionButtons += $.tmpl(buttonTemplate.popover, {class: 'info', name: elem.name, place: 'right', message: 'Info', content: elem.info});
    row += $.tmpl(tableTemplate.td, {cell: actionButtons, options: 'align="right"'});
    row = $.tmpl(tableTemplate.tr, {row: row, options:  'id="cluster' + elem.name + '"'});
    table.append(row);

    var options = '';
    nodeTemplates.forEach(function (element) {
        options += '<option>' + element +  '</option>';
    });

    table.append($.tmpl(clusterDelDiv, {id: elem.id, name: elem.name}));
    table.append($.tmpl(nodeAddDIV, {id: elem.id, name: elem.name, options: options}));

    togglePopover();

}


function appendNode(elem, tmpl){
    var node_info = '<ul>';
    node_info += '<li>Count: ' + elem.templates[tmpl].count + '</li>';
    node_info += '<li>Nodes:';
    node_info += '<ol>';

    for(var i = 0; i < elem.templates[tmpl].nodes.length; i++){
        
        for(p in elem.templates[tmpl].nodes[i].ports){
            node_info += '<li><a href=http://' + elem.templates[tmpl].nodes[i].ip;
            node_info += ':' + p + '>' + elem.templates[tmpl].nodes[i].ports[p] + '</a>';
            serviceStatus = elem.templates[tmpl].nodes[i]['service-status'][p];
            if(serviceStatus == true){
                node_info += " UP ";
            }else {
                node_info += " DOWN ";
            }

            node_info += '</li>';
        }
        // node_info += '</li>';
    }
    node_info += '</ol></li></ul>';

    service = elem.templates[tmpl].nodes.status;
    var status;
    if(service == true)
        status = $.tmpl(buttonTemplate.modal, {class: 'success', name: elem.name + '' + tmpl, message: 'UP', });
    else{
        status = $.tmpl(buttonTemplate.modal, {class: 'danger', name: elem.name + '' + tmpl, message: 'DOWN', });
    }
    var info = $.tmpl(buttonTemplate.popover, {class: 'info', name: elem.name + '' + tmpl, place: 'right', message: 'Info', content: node_info});
    
    hddCount = '';
    for(var i = 0; i < elem.templates[tmpl].count; i++){
        hddCount += '<span class="glyphicon glyphicon-hdd"></span> ';
    }

    //Information about the node
    var nodeRow =  $.tmpl(tableTemplate.td, {cell: ''});
    nodeRow +=  $.tmpl(tableTemplate.td, {cell: ''});
    nodeRow +=  $.tmpl(tableTemplate.td, {cell: hddCount});
    nodeRow +=  $.tmpl(tableTemplate.td, {cell: tmpl});
    nodeRow +=  $.tmpl(tableTemplate.td, {cell: status + info, options: 'align="right"'});
    nodeRow = $.tmpl(tableTemplate.mtr, {row: nodeRow, name: elem.name, id: tmpl});



    nodePlace(elem.name).after(nodeRow);
    $('#span' + elem.name).attr('class', 'glyphicon glyphicon-chevron-down');
    table.append($.tmpl(nodeDelDiv, {nodeName: tmpl, clusterName: elem.name}));
    
    togglePopover();
}


$(document).ready(function () {    
    getTemplates();
    showClusters();
    
});