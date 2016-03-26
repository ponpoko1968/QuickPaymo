app.factory( 'SharedDataService', function() {

    var sharedData = {};
    var selectedProject = {};
    var activeTasks = {};

    sharedData.clients = {};

    sharedData.setClients = function(clients){
        sharedData.clients = clients;
    };

    sharedData.getClients = function(){
        return sharedData.clients;
    };

    sharedData.selectProject = function(project){
        selectedProject = project;
    };

    sharedData.selectedProject = function(){
        return selectedProject;
    };

    sharedData.addToActiveTasks = function(task){
        if(typeof(sharedData.activeTasks) != 'object'){
            sharedData.activeTasks = {};
        }
        sharedData.activeTasks[task.id] = task;
    };

    sharedData.deleteFromActiveTasks = function(task){
        if(typeof(sharedData.activeTasks) != 'object'){
            sharedData.activeTasks = {};
        }
        delete(sharedData.activeTasks[task.id]);
    };

    sharedData.saveActiveTasks = function(){
        localStorage.setItem("activeTasks",JSON.stringify(sharedData.activeTasks));
    };

    sharedData.loadActiveTasks = function(){
        sharedData.activeTasks = JSON.parse(localStorage.getItem("activeTasks"));
        if( sharedData.activeTasks == null ){
            sharedData.activeTasks = {};
        }
    };



    sharedData.activeTasks = activeTasks;

    return sharedData;
});
