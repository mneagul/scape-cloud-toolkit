var clusterList = {};
var clusterIfoUpdated = {};


Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


function modifyNodeState(clusterID, nodeID, running){
    
    if(running == 'true'){
        //Send request to stop the node
        
    }else{
        //Send request to start the node
        
    }
    
    
}

function deleteNode(templateName, clusterName){
    //Send request to delete the node
    
    

}

function deleteCluster(mName){
    //Send request to delete the whole cluster
    $.jsonrpc({
            method : 'delete_cluster',
            params : {name : mName},
            url: '/api/',
        }, {
            success : function(result) {
                $("#alert-wait-cluster-destroyed").remove();
                
                mess = 'Cluster ' + mName + ' has been destroyed.';
                $("#alert-div").append($.tmpl(alertTemplate, {type: "success", strong: successIcon, message: mess, id: "destroyed"}));
                $('#alert-destroyed').on('closed.bs.alert', function () {
                  showClusters();
                });
            },
            error : function(error) {
                console.log('sct-rpc.deleteCluster: ' + error.message);
                 $("#alert-wait-cluster-destroyed").remove();
                $("#alert-div").append($.tmpl(alertTemplate, {type: "danger", strong: errorIcon, message: error.message, id: "destroyed"}));
                
            }

        });
    
    mess = 'Destroying cluster ' + mName + '...';
    $("#alert-div").append($.tmpl(alertTemplate, {type: "success", strong: waitAnimation, message: mess, id: "wait-cluster-destroyed"}));
}



function addNode(mName){
    var data = {};
    $('#addForm' + mName).find('input, textarea, select').each(function(i, field) {
        data[field.name] = field.value;
    });
    
    var type = $("#template option:selected").html();
    
    //Check if all fields are filled in.
    if(!data.type){
        alert('Some fields are not filled in! Fill in name and select type in order to create a node.');
    }else{
        //Send request to create a node
        
        $.jsonrpc({
            method : 'add_cluster_node',
            params: {cluster_name: data.mName,
                     template_name: data.type},
            url: '/api/',
        }, {
            success : function(result) {
                if(result == true){
                    $("#alert-wait-created").remove();
                    
                    mess = "Created a " + data.type + " node in " + data.mName + " cluster.";
                    $("#alert-div").append($.tmpl(alertTemplate, {type: "success", strong: successIcon, message: mess, id: "created"}));
                    $('#alert-created').on('closed.bs.alert', function () {
                      showClusterInfo(data.mName);
                    });
                }else{
                    $("#alert-wait-created").remove();
                    mess = 'Could not add a ' + data.type + ' node to cluster ' + mName + '. Verify server logs.';
                    $("#alert-div").append($.tmpl(alertTemplate, {type: "danger", strong: errorIcon, message: mess, id: "created"}));
                }
            },
            error : function(error) {
                console.log('sct-rpc.addNode: ' + error.message);
                $("#alert-wait-created").remove();
                $("#alert-div").append($.tmpl(alertTemplate, {type: "danger", strong: errorIcon, message: error.message, id: "created"}));
                
            }

        });
        
        $("#addNodeModal").modal('hide');
        mess = "Adding " + data.type + " node to " + data.mName + " cluster...";
        $("#alert-div").append($.tmpl(alertTemplate, {type: "success", strong: waitAnimation, message: mess, id: "wait-created"}));
    }
    
}

function addCluster(){
    var data = {};
    $('#addCluster').find('input').each(function(i, field) {
        data[field.name] = field.value;
    });
    
    if(!data['name']){
        alert('You have not provide a name for the cluster.');
    }else{
        //Send request to create a cluster;

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
                $('#alert-wait-cluster-created').remove();
                
                
                mess = 'Cluster ' + data.name + ' has been instantiated.';
                $("#alert-div").append($.tmpl(alertTemplate, {type: "success", strong: successIcon, message: mess, id: "instantiated"}));
                $('#alert-instantiated').on('closed.bs.alert', function () {
                  showClusters();
                });
            },
            error : function(error) {
                console.log('sct-rpc.addCluster: ' + error.message);
                $('#alert-wait-cluster-created').remove();
                $("#alert-div").append($.tmpl(alertTemplate, {type: "danger", strong: errorIcon, message: error.message, id: "instantiated"}));
            }

        });

        $("#addClusterModal").modal('hide');
        mess = "Creating cluster " + data.name + '...';
        $("#alert-div").append($.tmpl(alertTemplate, {type: "success", strong: waitAnimation, message: mess, id: "wait-cluster-created"}));
    }

    
    
}

function showClusterInfo(name){
    
    $.jsonrpc({
        method : 'get_cluster_info',
        params : {name: name},
        url: '/api/',
    }, {
        success : function(result) {
            var info = '<ul> <li> <a target=_blank href=' + result.global['module-repository'] + '>Module repository </a> </li>' +
                            '<li> <a target=_blank href=' + result.global['puppetdb'] + '>PuppetDB</a></li></ul>' ;
            
            
            clusterList[name].info = info;
            //console.warn(info);
            clusterList[name].templates = result.templates;
            appendClusters(clusterList[name]);
            for(key in clusterList[name].templates){
                appendNode(clusterList[name], key);
            }
            //$('#popover' + name).attr('data-content', info);
            
        },
        error : function(error) {
            console.log('sct-rpc.showClusters: ' + error.message);
        },

    });

}


function showClusters(){
    clusterList = {};
    $("#cluster-list > tr").replaceWith('');
    $("#cluster-list > div").replaceWith('');
    
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
                
//                for(key in clusterList){
//                    appendClusters(clusterList[key]);
//                }
                
            },
            error : function(error) {
                console.log('sct-rpc.showClusters: ' + error.message);
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
                console.log("sct-rpc.getTemplates: " + error.message);
                
            }

        });
}