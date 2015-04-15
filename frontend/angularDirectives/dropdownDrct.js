angular.module('InTouch')
	.directive('dropdownOnClick', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				if (attrs['displayHoverParent'] !== undefined
					&& attrs['displayHoverParent'] !== null)
				{
					var parent = element.parent();
					parent.on('mouseenter', function(){
						element.css('display', 'block');
					});
					parent.on('mouseleave', function (e){
						element.css('display', '');
						element.next().css('display', 'none');
					});
				}

				element.on('click', function (e){
					if (element.next().css('display') == "block")
						element.next().css('display', 'none');
					else
						element.next().css('display', 'block');
				});
			}
		};
	});
