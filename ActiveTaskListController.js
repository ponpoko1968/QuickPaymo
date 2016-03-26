function TimeGetTimeString(time){

	var milli_sec = time % 1000;
    time = (time - milli_sec) / 1000;
    var sec = time % 60;
    time = (time - sec) / 60;
    var min = time % 60;
    var hou = (time - min) / 60;

    // 文字列として連結
    return (hou > 0 ? hou : "")  + (hou > 0 ? ":" :"") +
	((min < 10) ? "0" : "") + min + ":" +
	((sec < 10) ? "0" : "") + sec ;
};

app.controller('ActiveTaskListController',['$scope', '$http', '$q', '$interval','SharedDataService', function($scope, $http, $q,$interval, SharedDataService){
    $scope.signOut = function(){
        ons.notification.confirm({
            title:"確認",
            message:"ログアウトしますか?",
            buttonLabels:['いいえ','はい'],
            cancellable:true,
            callback: function(index){
                if( index == 1 ){
                    app.navi.popPage();
                }
            }
            });
    };



    $scope.activeTasks = {};
    var taskIsActive = false;
    var startTime;
    var timer;
    $scope.gotoProjects = function(){
        $http({
            method:'GET',
            url: 'https://app.paymoapp.com/api/clients?include=projects',
            headers:{ 'X-session': app.session.id}
        })
            .success(function(data,status,headers,config){
                //app.navi.pushPage('taskList.html',{'animation':'lift'});
                //app.session = data.sessions[0];
                SharedDataService.setClients(data.clients);
                app.navi.pushPage('clientsProjects.html',{'animation':'lift'});
                console.log(SharedDataService.getClients());
            })
            .error(function(data,status, headers,config){
                $scope.showSpinner = false;
                alert('fail = '+status);
            });
    };

    // タスク一覧画面でアクティブなタスクが追加、削除された場合
    $scope.$on('taskListChanged', function(e, task) {
        refreshTasks();
        console.log(task);
    });

    $scope.clicked = function(currentTask){

        taskIsActive = taskIsActive ? false : true;
        console.log(taskIsActive);
        if( taskIsActive ){     // スタート
            startTime = new Date();
            startTimer();
            for( var i in  $scope.activeTasks ){
                var task = $scope.activeTasks[i];
                if( task.id == currentTask.id){
                    task.status = 'active';
                }else{
                    task.status = 'disable';
                }
            }
        }else{                  // ストップ
            var endTime = new Date();
            console.log( endTime - startTime);
            $interval.cancel(timer);
            postNewEntry(currentTask,startTime,endTime);
            $scope.ellapsed = '';
            for( var j in $scope.activeTasks ){
                var taskx = $scope.activeTasks[j];
                taskx.status = 'ready';
            }
        }
    };

    var postNewEntry = function(task, startTime, endTime){
        var content = {'task_id': task.id,
                       'start_time': startTime,
                       'end_time': endTime,
                       'description' : "" };

        var http = $http({method:'POST',
                          url:'https://app.paymoapp.com/api/entries',
                          headers:{ 'X-session': app.session.id},
                          data: content
                         })
                .success(function(data,status,headers,config){
                    console.log(data);
                })
                .error(function(data,status,headers,config){
                });

    };

    $scope.removeTask = function(task){
        SharedDataService.deleteFromActiveTasks(task);
        SharedDataService.saveActiveTasks();
        for( var i in $scope.activeTasks ){
            if( i == task.id ){
                delete($scope.activeTasks[i]);
                break;
            }
        }
    };

    $scope.completeTask = function(task){
        var content = { 'complete': true };
        var http = $http({method:'POST',
                          url:'https://app.paymoapp.com/api/tasks/'+task.id,
                          headers:{ 'X-session': app.session.id},
                          data: content
                         })
                .success(function(data,status,headers,config){
                    console.log(data);
                    $scope.removeTask(task);
                })
                .error(function(data,status,headers,config){
                });

    };



    var startTimer = function(){
        $scope.ellapsed = '00:00';
        timer = $interval( function(){
            var now = new Date();
            var ellapsed = now - startTime;
            $scope.ellapsed = TimeGetTimeString(ellapsed);
        },1000);
    };

    SharedDataService.loadActiveTasks();
    console.log(SharedDataService.activeTasks);
    var https = [];
    var refreshTasks = function(){
        for( var i in SharedDataService.activeTasks ){
            var task = SharedDataService.activeTasks[i];
            var http = $http({METHOD:'GET',
                              url:'https://app.paymoapp.com/api/tasks/'+ task.id +'?include=project',
                              headers:{ 'X-session': app.session.id}
                             })
                    .success(function(data,status,headers,config){
                        console.log(data.tasks[0]);
                        task.status = 'ready';
                        data.tasks[0].status = 'ready';
                        $scope.activeTasks[data.tasks[0].id] = data.tasks[0];
                    })
                    .error(function(data,status,headers,config){
                    });
        };
    };
    refreshTasks();
}]);
