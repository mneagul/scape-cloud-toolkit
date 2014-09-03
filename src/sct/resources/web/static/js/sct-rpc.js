


Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var clusterList = {};

function modifyMachineState(managerID, machineID, running){
    
    if(running == 'true'){
        //Send request to stop the machine
        
        console.log('Sent request to stop machine ' + machineID + ' managed by ' + managerID);
    }else{
        //Send request to start the machine
        
        console.log('Sent request to start machine ' + machineID + ' managed by ' + managerID);
    }
    
    
}

function deleteMachine(templateName, clusterName){
    //Send request to delete the machine
    
    
    console.log('Sent request to delete machine ' + templateName + ' managed by ' + clusterName);

}

function deleteCluster(mName){
    //Send request to delete the whole cluster
    $.jsonrpc({
            method : 'delete_cluster',
            params : {name : mName},
            url: '/api/',
        }, {
            success : function(result) {
                mess = 'Cluster ' + mName + ' has been destroyed.';
                $("#alert-div").append($.tmpl(alertTemplate, {type: "success", strong: 'Success: ', message: mess, id: "destroyed"}));
                $('#alert-destroyed').on('closed.bs.alert', function () {
                  showClusters();
                });
            },
            error : function(error) {
                $("#alert-div").append($.tmpl(alertTemplate, {type: "error", strong: 'Error: ', message: error.message, id: "destroyed"}));
                
            }

        });
    
    console.log('Sent request to delete cluster managed by ' + name);
}



function addMachine(){
    var data = {};
    $('#addForm').find('input, textarea, select').each(function(i, field) {
        data[field.name] = field.value;
    });
    
    var type = $("#template option:selected").html();
    
    //Check if all fields are filled in.
    if(!data.type){
        alert('Some fields are not filled in! Fill in name and select type in order to create a machine.');
    }else{
        //Send request to create a machine
        
        $.jsonrpc({
            method : 'add_cluster_node',
            params: {cluster_name: data.mName,
                     template_name: data.type},
            url: '/api/',
        }, {
            success : function(result) {
                if(result == true){
                    mess = "Created a machine with " + data.type + " template inside " + data.mName + " cluster.";
                    $("#alert-div").append($.tmpl(alertTemplate, {type: "success", strong: 'Success: ', message: mess, id: "created"}));
                    $('#alert-created').on('closed.bs.alert', function () {
                      showClusterInfo(data.mName);
                    });
                }else{
                    mess = 'A problem occured. Verify server logs.';
                    $("#alert-div").append($.tmpl(alertTemplate, {type: "error", strong: 'Error: ', message: mess, id: "created"}));
                }
            },
            error : function(error) {
                $("#alert-div").append($.tmpl(alertTemplate, {type: "error", strong: 'Error: ', message: error.message, id: "created"}));
                
            }

        });
        
        $("#addMachineModal").modal('hide');
        mess = '<span class="spinner active"><i class="icon-spin icon-refresh"></i></span>';
        mess += "Sent request to add a " + data.type + " template inside " + data.mName + " cluster.";
        $("#alert-div").append($.tmpl(alertTemplate, {type: "success", strong: 'Success: ', message: mess, id: "created"}));
    }
    
}

function addManager(){
    var data = {};
    $('#addManager').find('input').each(function(i, field) {
        data[field.name] = field.value;
    });
    
    if(!data['name']){
        alert('You have not provide a name for the manager.');
    }else{
        //Send request to create a manager;

        $.jsonrpc({
            method : 'create_cluster',
            params: {name: data.name,
                     image: null,
                     size: null,
                     security_group: null, 
                     module_repository_url: null,
                     module_repository_branch: null,
                     module_repository_tag: null},
            url: '/api/',
        }, {
            success : function(result) {
                
                mess = 'Cluster ' + data.name + ' has been instantiated.';
                $("#alert-div").append($.tmpl(alertTemplate, {type: "success", strong: 'Success: ', message: mess, id: "instantiated"}));
                $('#alert-instantiated').on('closed.bs.alert', function () {
                  showClusters();
                });
            },
            error : function(error) {
                $("#alert-div").append($.tmpl(alertTemplate, {type: "error", strong: 'Error: ', message: error.message, id: "instantiated"}));
            }

        });

        $("#addManagerModal").modal('hide');
    }

    
    
}

function showClusters(){
    clusterList = {};
    $("#manager-list > tr").replaceWith('');
    $("#manager-list > div").replaceWith('');
    
    $.jsonrpc({
            method : 'get_clusters',
            url: '/api/',
        }, {
            success : function(result) {
                var id = 1;
                result.forEach(function(elem) {
                    cluster = {};
                    cluster.id = id;
                    cluster.name = elem;
                    
                    clusterList[cluster.name] = cluster;
                    id += 1;
                    showClusterInfo(cluster.name);
                    
                });               
                
                for(key in clusterList){
                    appendManagers(clusterList[key]);
                }
                
            },
            error : function(error) {
                alert("An error occured: " + error.message);
                console.log(error.message);
            }

        });
}

function showClusterInfo(name){
    console.log('Called show!');
    $.jsonrpc({
        method : 'get_cluster_info',
        params : {name: name},
        url: '/api/',
    }, {
        success : function(result) {
            var info = '<ul> <li> <a href=' + result.global['module-repository'] + '>Module repository </a> </li>' +
                            '<li> <a href=' + result.global.puppetdb + '>PuppetDB</a></li></ul>' ;
            $('#popover' + name).attr('data-content', info);
            
            clusterList[name].info = info;
            clusterList[name].templates = result.templates;
            for(key in clusterList[name].templates){
                appendNode(clusterList[name], key);
            }
            
        },
        error : function(error) {
            alert("An error occured: " + error.message);
        }

    });

}

function getTemplates(){
    $.jsonrpc({
            method : 'get_node_templates',
            url: '/api/',
        }, {
            success : function(result) {
                nodeTemplates = [];
                result.forEach(function(elem) {
                    nodeTemplates.push(elem);
                });
            },
            error : function(error) {
                alert("An error occured: " + error.message);
                
            }

        });
}