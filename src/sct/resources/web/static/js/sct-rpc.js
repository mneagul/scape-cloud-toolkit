
function modifyMachineState(managerID, machineID, running){
    
    if(running == 'true'){
        //Send request to stop the machine
        
        console.log('Sent request to stop machine ' + machineID + ' managed by ' + managerID);
    }else{
        //Send request to start the machine
        
        console.log('Sent request to start machine ' + machineID + ' managed by ' + managerID);
    }
    
    
}

function deleteMachine(managerID, machineID){
    //Send request to delete the machine
    
    
    console.log('Sent request to delete machine ' + machineID + ' managed by ' + managerID);

}

function deleteManager(managerID){
    //Send request to delete the whole cluster
    
    
    console.log('Send request to delete cluster managed by ' + managerID);
}



function addMachine(){
    var data = {};
    $('#addForm').find('input, textarea, select').each(function(i, field) {
        data[field.name] = field.value;
    });
    //Check if all fields are filled in.
    if(!data['name'] || !data['type']){
        alert('Some fields are not filled in! Fill in name and select type in order to create a machine.');
    }else{
        //Send request to create a machine
        
        $("#addMachineModal").modal('hide');
    }
    
}

function addManager(){
    var data = {};
    $('#addManager').find('input').each(function(i, field) {
        data[field.name] = field.value;
    });
    
    if(!data['name']){
        alert('You haven\'t provide a name for the manager.');
    }else{
        //Send request to create a manager;
        $("#addManagerModal").modal('hide');
    }
    
}