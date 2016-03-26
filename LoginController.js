app.controller('LoginController',function($scope, $http){
    var keytar = require('keytar');

    var email = localStorage.setItem("userName",$scope.email);
    if( email != null){
        $scope.email = email;
    }else{
        $scope.email = '';
    }
    if( ((email != null ? email.length : void 0) > 0)){
        var pass = keytar.getPassword('QuickPaymo', $scope.email);
        if( pass != null ){
            $scope.pass = pass;
        }else{
            $scope.pass = '';
        }
    }

    $scope.showSpinner = false;
    $scope.onClick = function(){
        console.log('trying..'+ $scope.email+':'+$scope.pass);
        console.log('trying..'+ btoa($scope.email+':'+$scope.pass));
        $scope.showSpinner = true;
        $http({
            method:'POST',
            url: 'https://app.paymoapp.com/api/sessions',
            headers:{ 'Authorization': 'Basic ' + btoa($scope.email+':'+$scope.pass)}
        })
            .success(function(data,status,headers,config){
                //alert('success = '+status);
                var keytar = require('keytar');

                if( keytar.getPassword('QuickPaymo', $scope.email) == null ){
                    keytar.replacePassword('QuickPaymo', $scope.email, $scope.pass);
                }else{
                    keytar.addPassword('QuickPaymo', $scope.email, $scope.pass);
                }
                localStorage.setItem("userName",$scope.email);
                $scope.showSpinner = false;
                app.navi.pushPage('activeTaskList.html',{'animation':'lift'});
                app.session = data.sessions[0];
                console.log(app.session);
            })
            .error(function(data,status, headers,config){
                $scope.showSpinner = false;
                alert('fail = '+status);
            });
    };
});
