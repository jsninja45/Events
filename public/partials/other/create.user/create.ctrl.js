(function(){
    // "use strict";
    angular
        .module("scriptd")
        .controller("CreateCtrl", createCtrl);
        function createCtrl($location, UserService, MainService, $scope, $sce){
            var vm = this;

            //Values
            vm.user = {
                fullName: '',
                email: '',
                avatarImg: '//scriptduploads.s3.amazonaws.com/1424274913115.png'
            }

            //Show Hide
            vm.uploadImg = true;
            vm.needMoreName = false;
            vm.needLessName = false;

            //Functions
            vm.register = register; 


            ///////////////////////////////////////////////

            function register(user){
                var userName = user.displayName.trim();
                var nameLength = userName.split(' ').length;
                user.firstName = userName.split(' ').slice(0, -1).join(' ');
                user.lastName = userName.split(' ').slice(-1).join(' ');

                $scope.$broadcast('show-errors-check-validity');

                if (!$scope.createUser.$valid) {
                    return; 
                } else if (nameLength < 2){
                    vm.needMoreName = true;
                    vm.needLessName = false;
                    return;
                } else if (nameLength > 2){
                    vm.needLessName = true;
                    vm.needMoreName = false;
                    return;
                } else if ($scope.createUser.$valid) {
                    return UserService.register(user)
                        .then(function(data){
                            console.log(data);
                            $location.path('/main/modal/signup-thank')
                        })
                }
            }

            function getPrevUser(){
                var prevUser = MainService.getCurrentUser();
                console.log(prevUser);
                if(prevUser !== undefined){
                    if(prevUser.fullName !== undefined){
                        vm.user.fullName = prevUser.fullName;
                    }
                    if(prevUser.email !== undefined){
                        vm.user.email = prevUser.email;
                    }
                }
            }
            getPrevUser();

            $scope.uploadFile = function(files) {
                var fd = new FormData();
                //Take the first selected file
                fd.append("file", files[0]);
                vm.uploadImg = false;

                UserService.uploadPhoto(fd)
                    .then(function(data){
                        vm.user.avatarImg = data.replace(/['"]+/g, '');
                        vm.uploadImg = true;
                    })
            };
        }
})();
