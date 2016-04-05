app.controller('ClientsProjectsController',function($scope, $http,SharedDataService){
    $scope.clients = SharedDataService.getClients();
    $scope.goBack = function(){
        app.navi.popPage();
    };

    $scope.gotoTasks = function(project){
        SharedDataService.selectProject(project);
        console.log(project.name);
        app.navi.pushPage('tasks.html', {'animation':'slide'} );
    };

});
