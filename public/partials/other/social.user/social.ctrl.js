(function(){
    // "use strict";
    angular
        .module("scriptd")
        .controller("SocialCtrl", socialCtrl);
        function socialCtrl($location, UserService, MainService, $scope){
            var vm = this;

            //Values
            vm.user = {
                avatarImg: '//scriptduploads.s3.amazonaws.com/1424274913115.png'
            };

            //Show Hide
            vm.uploadImg = true;
            vm.needMoreName = false;
            vm.needLessName = false;

            //Functions
            vm.getSocialUser = getSocialUser;
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
                    return UserService.socialRegister(user)
                        .then(function(data){
                            $location.path('/main/modal/signup-thank')
                        })
                }
            }

            function getSocialUser(){
                UserService.requireLogin()
                    .then(function(data){
                        vm.user = data;
                    })
            }
            getSocialUser();

            $scope.uploadFile = function(files) {
                var fd = new FormData();
                //Take the first selected file
                fd.append("file", files[0]);
                vm.uploadImg = false;

                UserService.uploadPhoto(fd)
                    .then(function(data){
                        console.log(data);
                        vm.user.avatarImg = data.replace(/['"]+/g, '');
                        vm.uploadImg = true;
                    })
            };



        }

})();
