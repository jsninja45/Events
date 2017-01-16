(function() {
	'use strict';
	angular
	.module('scriptd')
	.directive('toggleClass', function($q){
		return {
			restrict: 'A',
				//Says where you can use the directive in the html
				
    		link : function(scope, elem, attrs) {
      
			    var currentState = true;
			      
			    elem.on('click', function() {
			        
			        if(currentState === true) {
			          // It is on!
			          angular.element(elem).removeClass(attrs.onIcon);
			          angular.element(elem).addClass(attrs.offIcon);
			        } else {
			          // It is off!
			          angular.element(elem).removeClass(attrs.offIcon);
			          angular.element(elem).addClass(attrs.onIcon);
					}

					currentState = !currentState;
				});
			}
		};
	});  
})();

// on-icon="" off-icon="" toggle-class