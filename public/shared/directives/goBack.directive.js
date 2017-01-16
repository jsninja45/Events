(function() {
	'use strict';
	angular
	.module('scriptd')
	.directive('goBack', function(){
		return {
			restrict: 'A',
				
    		link : function(scope, elem, attrs) {
	            elem.click(function(){
	                history.back();
	                scope.$apply();
	            });
			}
		};
	});  
})();