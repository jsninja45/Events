(function(){
    "use strict";
    angular
        .module("scriptd")
        .controller("EditCtrl", editCtrl);
        function editCtrl($location, UserService, $state, $scope){
            var vm = this;

            //Values
            vm.currentUser = {};

            //Show Hide
            vm.uploadImg = true;
            vm.needMoreName = false;
            vm.needLessName = false;

            //Functions
            vm.requireLogin = requireLogin;
            vm.submitEdits = submitEdits;
            vm.changePassword = changePassword;


            ///////////////////////////////////////////////

            function changePassword() {
                $state.go('editUserPage.modal.resetPassword');
            }

            function requireLogin() {
                UserService.requireLogin()
                    .then(function(data){
                        if(data !== null && typeof data === 'object'){
                            vm.currentUser = data;
                            vm.currentUser.dob = vm.currentUser.dob.slice(0, 10);
                            console.log(vm.currentUser)
                        } else {}
                    });
            }
            requireLogin(); 


            function submitEdits(user){
                var userName = user.displayName.trim();
                var nameLength = userName.split(' ').length;
                user.firstName = userName.split(' ').slice(0, -1).join(' ');
                user.lastName = userName.split(' ').slice(-1).join(' ');

                $scope.$broadcast('show-errors-check-validity');

                if (!$scope.editUser.$valid) {
                    return; 
                } else if (nameLength < 2){
                    vm.needMoreName = true;
                    vm.needLessName = false;
                    return;
                } else if (nameLength > 2){
                    vm.needLessName = true;
                    vm.needMoreName = false;
                    return;
                } else if ($scope.editUser.$valid) {
                    UserService.editUser(user, vm.currentUser._id)
                        .then(function(data){
                            $location.path("/main/profile/" + vm.currentUser._id);
                        })
                }
            }


            $scope.uploadFile = function(files) {
                var fd = new FormData();
                //Take the first selected file
                fd.append("file", files[0]);
                vm.uploadImg = false;

                UserService.uploadPhoto(fd)
                    .then(function(data){
                        vm.currentUser.avatarImg = data.replace(/['"]+/g, '');
                        vm.uploadImg = true;
                    })
            };



        }

})();
