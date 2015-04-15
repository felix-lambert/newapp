angular.module('InTouch')
.controller('PictureAngCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$localStorage', 'ImageFct',
	function ($scope, $rootScope, $timeout, $http, $localStorage, ImageFct) {
		$scope.images = [];
		$scope.reqError = null;
		$scope.reqSuccess = null;
		console.log('--------------UPLOAD PICTURES----------------------');

		var userToken = $rootScope.currentUser.token;
		$http.defaults.headers.common['auth-token'] = userToken;

		var options = {
			thumbSize:80,
			thumbMax:30,
			url: '/api/upload/img',
			onUpload: 'filesUploaded',
			onUploadFail: 'failUpload',
			onFilesDrop: 'onFilesDrop',
			onFileRemove: 'onFileRemove',
			background:"Glissez et déposez ou cliquez",
			headers : {
				'auth-token' : userToken,
			}
		}
		$scope.dropfile = {
			options:options,
		};

		$scope.$on('filesUploaded', function (e, data){
			var files = data.response;
			for (var i = 0; i < files.length; i++)
				$scope.images.push(files[i]);
		});

		$scope.defineProfile = function(image)
		{
			$http({
				url:"/api/user/profile-image",
				method:"POST",
				data:{id:image._id},
			}).success(function (data){
				console.log(data.image);
				$rootScope.currentUser.profileImage = data.image;
				$localStorage.currentUser = $rootScope.currentUser;
				console.log($rootScope.currentUser);
				$scope.reqSuccess = data.message;
				$timeout(function() {
					$scope.reqSuccess = null;
				}, 3000);
			}).error(function (data){
				$scope.reqError = data.message;
				$timeout(function() {
					$scope.reqError = null;
				}, 3000);
			})
		}

		$scope.remove = function(image) {
			var id = image._id;
			console.log(image);
			ImageFct.remove({id:id}, function (data){
				$scope.images.forEach(function (item, key){
					if (item._id == id)
						$scope.images.splice(key, 1);
				});
			});
		};

		$scope.init = function()
		{
			ImageFct.query(function (data){
				$scope.images = data;
			});
		};
		
	}]);
