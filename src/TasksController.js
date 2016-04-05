app.controller('TasksController',function($scope, $http,$rootScope,SharedDataService){
    $scope.project = SharedDataService.selectedProject();
    $scope.selectedTasks = {};
    $scope.goBack = function(){
        app.navi.popPage();
    };

    $scope.selectTask = function(task){
        alert( "tasks=" + task.name );
    };

    $scope.onChange = function(){
        console.log($scope.selectedTasks);
        for(var taskId in $scope.selectedTasks ){
            console.log(taskId);
            if( $scope.selectedTasks[taskId] == true ){
                SharedDataService.addToActiveTasks($scope.taskIdMap[taskId]);
            }else{
                SharedDataService.deleteFromActiveTasks($scope.taskIdMap[taskId]);
            }
            $rootScope.$broadcast('taskListChanged',taskId);
        }
        SharedDataService.saveActiveTasks();
        console.log(SharedDataService.activeTasks);
    };

    console.log('project_id='+$scope.project.id);
    $http({
        method:'GET',
        url: 'https://app.paymoapp.com/api/tasklists?where=project_id='+$scope.project.id+'&include=tasks',
        headers:{ 'X-session': app.session.id}
    })
        .success(function(data,status,headers,config){
            console.log(data['tasklists']);
            $scope.tasklists = data['tasklists'];
            $scope.taskIdMap = {};
            for( var i = 0 ; i < $scope.tasklists.length; i++  ){
                var tasklist = $scope.tasklists[i];
                console.log(tasklist);
                for( var j = 0; j <  tasklist.tasks.length; j++ ){
                    var task = tasklist.tasks[j];
                    if( task.complete == false ){ // 未完のタスクのみ登録
                        console.log(task);
                        $scope.taskIdMap[task.id] = task;
                        if( SharedDataService.activeTasks[task.id]){
                            $scope.selectedTasks[task.id] = true;
                        }
                    }
                }
            }
            console.log( $scope.taskIdMap);
        })
        .error(function(data,status, headers,config){
            alert('fail = '+status);
        });



});
