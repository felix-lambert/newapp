var app = angular.module('KamikyUploader', []);

app.value('initialSettings', {
	// directive parameters
	informations : {
		tbz:undefined, // thumbzone
		// if tbz = null ==> tbz = null
		// if tbz = undefined ==> tbz = dropzone
		// if tbz = smth (smth must be DOM id) ==> tbz = element(id)
		thumbSize:100, // thumbnails width & height
		thumbMax:null, // number of thumbnails displayed
		displaySize:true, // display size file information on thumb
		progressBar:true, // display or not progress bar when loading
		uploadMode:'click',
		uploadBtnElem:'<button class="btn btn-default">Upload</button>',
		cancelBtnElem:'<button class="btn btn-default">Cancel</button>',
		externalUploadBtn:null, // external button id
		externalCancelBtn:null, // external button id
		background:null, // string or angular element
		optimization:true, // prevent display canvas when file is over 1mb
	},
	// FileManager parameters
	settings : {
		typeMime:['image/jpeg', 'image/png', 'image/gif'],
		url: '/upload',
		uploadMode:'click', // 'automatic' or 'click' or null, if null, upload is no longer handle by plugin
		onFilesDrop:null, // emit event when files are dropped
		onFileRemove:null, // emit event when file is removed
		onUpload:null, // emit event with response data (on success) [& on fail : only if onUploadFail == null]
		onUploadFail:null, // emit event with response data (on fail)
		onProgress:null, // emit progress, dont display progress bar if defined
		limit:100, // limit number of upload
		headers:null,
		request:'multi', // single || multi (one request for all files || one request per file)
	}
});

app.directive('dropfile', ['initialSettings', '$timeout', 'FileManager', 'fileReader', 'canvas',
	function (initialSettings, $timeout, FileManager, fileReader, canvas) {
	return {
		restrict : 'A',
		link: function ($scope, element, attrs)
		{
			function FileDirective()
			{
				var self = this;
				var options = $scope.$eval(attrs.options);
				if (options.hasOwnProperty('tbz'))
					options.tbz = angular.element(document.getElementById(options.tbz));
				//console.log(options);
				var settings = angular.copy(initialSettings.settings);
				var informations = angular.copy(initialSettings.informations);
				
				angular.extend(this, informations, {
					btnCtn:null,
					progressElem:null,
					$scope:$scope,
				});
				for (var key in options)
				{
					if (this.hasOwnProperty(key))
						this[key] = options[key];
					if (settings.hasOwnProperty(key))
						settings[key] = options[key];
				}
				
				this.FileManager = new FileManager(this, settings);
				if (attrs.uploader)
					$scope[attrs.uploader] = this.FileManager;

				this.onDrag = this.FileManager._onDrag;
				this.onLeave = function(e) {
					self.FileManager._onLeave(e);
					self._removeClass('hover');
				};
				this.onDrop = function(e) {
					self._addClass('dropped');
					self._removeClass('hover');
					self._hideBg();
					self.FileManager._onDrop(e);
				}
				this.onEnter = function(e) {
					if (!self._hasClass('dropped'))
						self._addClass('hover');
				};
				this._preventAndStop = this.FileManager._preventAndStop;
				this.init();
			}

			FileDirective.prototype._cancelEvent = function() {
				this.FileManager._clear();
				this._hideBtn();
				this._showBg();
				this._removeClass('dropped');
				if (this.progressElem)
				{
					this.progressElem.css('width', 0);
					this.progressElem.css('display', 'none');
				}

				if (!this.tbz)
					return ;
				var children = this.tbz.children();
				for (var i = 0; l = children.length, i < l; i++)
				{
					if (angular.element(children[i]).hasClass('thb-box'))
						children[i].remove();
				}
					
			}

			FileDirective.prototype.init = function() {
				var self = this;
				self.initInput();
				self.initDropzone();
				self.initProgress();
				self.initBtn();
				self.initBg();
			}

			FileDirective.prototype.initDropzone = function() {
				var self = this;
				this.dropzone = angular.element('<div class="dropzone"></div>');
				element.append(this.dropzone);
				this.dropzone.bind('dragover', self.onDrag);
				this.dropzone.bind('dragleave', self.onLeave);
				this.dropzone.bind('drop', self.onDrop);
				this.dropzone.bind('dragenter', self.onEnter);
				this.dropzone.on('click', function (e){
					document.getElementById('input-file').click();
				});
				if (self.tbz === null)
					return;
				else if (self.tbz === undefined)
					this.tbz = this.dropzone;
			}

			FileDirective.prototype.initBg = function() {
				if (!this.background || (this.background && typeof this.background == "object" && text.css))
					return ;
				this.background = angular.element('<span class="background_text">'+this.background+'</span>');
				this.dropzone.append(this.background);
			}

			FileDirective.prototype.initBtn = function() {
				var self = this;
				if (this.uploadMode == 'automatic')
					return ;

				if (!this.externalUploadBtn || !this.externalCancelBtn)
				{
					this.btnCtn = angular.element('<div class="btn-ctn"></div>');
					this.btnCtn.css('display', 'none');
					element.append(this.btnCtn);
				}

				if (!this.externalUploadBtn)
				{
					var uploadBtn = angular.element(this.uploadBtnElem);
					this.btnCtn.append(uploadBtn);
				}
				else
					var uploadBtn = angular.element(document.getElementById(this.externalUploadBtn));
				if (!this.externalCancelBtn)
				{
					var cancelBtn = angular.element(this.cancelBtnElem);
					this.btnCtn.append(cancelBtn);
				}
				else
					var cancelBtn = angular.element(document.getElementById(this.externalCancelBtn));

				uploadBtn.on('click', function (e){
					self._preventAndStop(e);
					self.FileManager._uploadFiles();
				});
				cancelBtn.on('click', function (e){
					self._preventAndStop(e);
					self._cancelEvent();
				});
			};

			FileDirective.prototype.initProgress = function() {
				if (this.onProgress || !this.progressBar)
					return ;
				var progressBar = angular.element('<div class="dropfile-progress-bar"></div>');
				this.progressElem = angular.element('<div style="display:none" class="progress"></div>');
				progressBar.append(this.progressElem);
				element.append(progressBar);
			}

			FileDirective.prototype.initInput = function() {
				var self = this;
				var input = angular.element('<input id="input-file" style="display:none;" type="file" multiple="multiple"/>');
				input.on('change', function (e){
					self.onDrop(e)
				});
				element.append(input);
			}

			FileDirective.prototype._hasClass = function(string){
				return this.dropzone.hasClass(string);
			}

			FileDirective.prototype._addClass = function(string){
				this.dropzone.addClass(string);
			}

			FileDirective.prototype._removeClass = function(string){
				this.dropzone.removeClass(string);
			}

			FileDirective.prototype._showBg = function() {
				if (this.background && this.background.css
					&& this.tbz && this.tbz == this.dropzone)
					this.background.css('display', 'block');
			}

			FileDirective.prototype._hideBg = function() {
				if (this.background && this.background.css
					&& this.tbz && this.tbz == this.dropzone)
					this.background.css('display', 'none');
			}

			FileDirective.prototype._showBtn = function() {
				if (this.btnCtn)
					this.btnCtn.css('display', 'block');
			}

			FileDirective.prototype._hideBtn = function() {
				if (this.btnCtn)
					this.btnCtn.css('display', 'none');
			}

			FileDirective.prototype._makeThbox = function (file, index, position) {
				var self = this;
				if (!this.tbz)
					return ;
				if (this.thumbMax && position > this.thumbMax)
					var thbox = angular.element('<div id="thb-box-'+index+'" style="display:none;" class="thb-box thb-box-hidden"></div>');
				else
					var thbox = angular.element('<div id="thb-box-'+index+'" class="thb-box"></div>');
				var img = angular.element('<img src="" alt="'+file.name+'"></img>');
				thbox.append(img);

				/*var progressE = angular.element('<span class="progress"></span>')
				thbox.append(progressE);*/

				if (this.displaySize == true)
				{
					var info = angular.element('<div class="info"></div>');
					info.text(this.getInfoSize(file.size));
					thbox.append(info);
				}
				this.tbz.append(thbox);
				thbox.on('click', function(e){
					self.eraseThb(this, index);
					self._preventAndStop(e);
				});
				if (this.optimization == true && file.size > 1000000)
					return ;

				fileReader.readAsDataUrl(file, $scope).then(function (result)
				{
					canvas.make(result, self.thumbSize).then(function (src){
						img.attr('src',src);
					});
				});
			}

			FileDirective.prototype.getInfoSize = function(size){
				var info = ['Kb', 'Mb'];
				var i = 0;

				function _getDecimal(size) {return (Math.round(size * 100) / 100) + " ";};
				while (i < 2)
				{
					size = size / 1000;
					if (size < 1000)
						return _getDecimal(size)+info[i];
					i++;
				}
				return Math.round(size)+'.'+_getDecimal(size)+info[1];
			}

			FileDirective.prototype.eraseThb = function(element, index){
				this.FileManager._removeFile(index);
				element.remove();
				var hiddenThbox = document.getElementsByClassName('thb-box-hidden');
				if (hiddenThbox.length == 0)
					return ;
				var hiddenElem = angular.element(hiddenThbox[0])
				hiddenElem.css('display', '');
				hiddenElem.attr('class', 'thb-box');
			}

			FileDirective.prototype._updateProgressFile = function(prct, index)
			{
				var thbox = null;
				thbox = angular.element(document.getElementById('thb-box-'+index));
				var children = thbox.children();
				angular.element(children[1]).text(prct+'%');

			}

			FileDirective.prototype._updateProgress = function(prct)
			{
				if (!this.progressElem)
					return ;
				this.progressElem.css('width', prct+'%');
				this.progressElem.css('display', 'block');
			}
			var self = new FileDirective();
		}
	};
}]);

app.factory('FileManager', ['Emitter', 'fileUploader', '$timeout', '$q',
	function (Emitter, fileUploader, $timeout, $q){
	function FileManager(parent, settings) {
		var self = this;
		angular.extend(this, settings, {
			parent:parent,
			currentFiles: [],
			globalPrct : 0,
			index:0,
		});

		this._onDrop = function (event){self.onDrop(event);};
		this._onDrag = function (event){self.onDrag(event);};
		this._onLeave = function (event){self.onLeave(event);};
		this.emit = new Emitter(self, self.parent.$scope);
	}

	FileManager.prototype._getTransfer = function(event) {
		// event.originalEvent.dataTransfer
		return event.dataTransfer || event.originalTarget || event.target;
	}

	FileManager.prototype._preventAndStop = function(event) {
		event.preventDefault();
		event.stopPropagation();
	}

	FileManager.prototype.onDrag = function(event) {
		var transfer = this._getTransfer(event);
		transfer.dropEffect = 'copy'; // fix redirect image dropped
		this._preventAndStop(event);
	}

	FileManager.prototype.onLeave = function(event) {
		this._preventAndStop(event)
	}

	FileManager.prototype.onDrop = function(event)
	{
		this._preventAndStop(event);
		var transfer = this._getTransfer(event);
		if (!transfer)
			return;
		var self = this;
		this.parent._showBtn();
		if (event.type == 'change' || event.type == 'drop')
			var files = transfer.files;
		this.emit._onFilesDrop(files);
		var limit = (this.limit - this.currentFiles.length) < files.length ? (this.limit - this.currentFiles.length) : files.length;
		for (var i = 0; i < limit; i++)
		{
			if (this.typeMime.indexOf(files[i].type) != -1)
			{
				this.currentFiles.push(files[i]);
				this.currentFiles[this.currentFiles.length - 1].index = self.index;
				this.parent._makeThbox(files[i], self.index, this.currentFiles.length);
				self.index++;
			}
		}
		if (this.uploadMode == "automatic")
			this._uploadFiles();
	}

	FileManager.prototype._uploadFiles = function() {
		var self = this;
		self.index = 0;
		self.globalPrct = 0;
		var processHandler = function (data){
			//self.globalPrct += data.prct;
			if (self.request == "multi")
			{
				self.parent._updateProgressFile(data.prct, data.files[0].index);
				//total = self.currentFiles.length;
			}
			else if (self.request == "single")
				self.emit._onProgress(data.prct);
		};
		if (!this.url || this.url.length == 0 || !this.currentFiles || this.uploadMode == null)
			return ;

		if (self.request == "single")
		{
			fileUploader.post(self.currentFiles, processHandler)
			.to(self.url, self.headers)
			.then(function (success){
				self.emit._onUpload(success);
				$timeout(function(){
					self.parent._cancelEvent();
				}, 3000);
			}, function (error){
				self.emit._onUploadFail(error);
				$timeout(function(){
					self.parent._cancelEvent();
				}, 3000);
			});
		}
			
		else if (self.request == "multi") {
			for (var i = 0; l = this.currentFiles.length,  i < l; i++)
			{
				fileUploader.post(self.currentFiles[i], processHandler)
				.to(self.url, self.headers)
				.then(function (success){
					self.emit._onUpload(success);
					$timeout(function(){
						self.parent._cancelEvent();
					}, 3000);
				}, function (error){
					self.emit._onUploadFail(error);
					$timeout(function(){
						self.parent._cancelEvent();
					}, 3000);
				});
			}
		}
	}

	FileManager.prototype._clear = function() {
		this.currentFiles = [];
		this.index = 0;
	}

	FileManager.prototype._removeFile = function(index) {
		for (var i = 0; l = this.currentFiles.length, i < l; i++)
		{
			if (this.currentFiles[i].index == index)
			{
				this.emit._onFileRemove(this.currentFiles[i]);
				this.currentFiles.splice(i, 1);
			}
		}
		if (this.currentFiles.length == 0)
		{
			this.parent._hideBtn();
			this.parent._showBg();
			this.parent._removeClass('dropped');
			this.index = 0;
		}
	}
	return FileManager;
}]);

app.factory('Emitter', function(){

	function Emitter(parent, $scope)
	{
		this.parent = parent;
		this.$scope = $scope;
	}

	Emitter.prototype._onFilesDrop = function(files){
		var onFilesDrop = this.parent.onFilesDrop;
		if (onFilesDrop)
			return this.$scope.$emit(onFilesDrop, files);
	}

	Emitter.prototype._onFileRemove = function(file){
		var onFileRemove = this.parent.onFileRemove;
		if (onFileRemove)
			return this.$scope.$emit(onFileRemove, file);
	}

	Emitter.prototype._onUpload = function (data)
	{
		var onUpload = this.parent.onUpload;
		if (onUpload)
			return this.$scope.$emit(onUpload, data);
	}

	Emitter.prototype._onUploadFail = function (data)
	{
		var onUploadFail = this.parent.onUploadFail || this.parent.onUpload;
		if (onUploadFail)
			return this.$scope.$emit(onUploadFail, data);
	}

	Emitter.prototype._onProgress = function (prct)
	{
		var onProgress = this.parent.onProgress;
		if (onProgress)
			this.$scope.emit(onProgress, prct);
		this.parent.parent._updateProgress(prct);
	}
	return Emitter;
});

app.factory('fileReader', ["$q", function ($q) {

    var onLoad = function(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };
    
    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };
    
    var onProgress = function(reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress",
            {
                total: event.total,
                loaded: event.loaded
            });
        };
    };
    
    var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };
    
    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();
        
        var reader = getReader(deferred, scope);        
        reader.readAsDataURL(file);
        
        return deferred.promise;
    };
    
    return {
        readAsDataUrl: readAsDataURL 
    };

}]);

app.factory('canvas', ["$q", function ($q) {

    var make = function(src, cwidth)
    {
        var deferred = $q.defer();
        var canvas = document.createElement("canvas");
        canvas.width = cwidth || 100;
        canvas.height = cwidth || 100;
        var context = canvas.getContext("2d");
        var imageObj = new Image();
        imageObj.src = src;
        imageObj.onload = function()
        {
            var width = imageObj.width;
            var height = imageObj.height;
            var render = 0;
            var offsetWidth = 0;
            var offsetHeight = 0;
            if (width >= height)
            {
                render = height;
                offsetWidth = (width - render) / 2;
            }
            else
            {
                render = width;
                offsetHeight = (height - render) / 2;
            }
            context.drawImage(imageObj, offsetWidth, offsetHeight, render, render, 0, 0, cwidth, cwidth);
            var srcimg = canvas.toDataURL("image/png");
            deferred.resolve(srcimg);
        };
        return deferred.promise;
    }

    return {
        make: make
    }
}]);

app.factory('fileUploader', ['$rootScope', '$q', function($rootScope, $q) {
    var svc = {
        post: function(files, progressCb) {
 
            return {
                to: function(uploadUrl, headers)
                {
                    var deferred = $q.defer()
                    if (!files || files.length == 0) {
                    	$rootScope.$apply (function() {
                            deferred.reject("No files to upload");
                        });
                        return deferred.promise;
                    }
                    if (files && (files instanceof Array) == false)
                    	files = [files];
                    	
                    var xhr = new XMLHttpRequest();
                    xhr.upload.onprogress = function(e) {
                            var percentCompleted;
                            if (e.lengthComputable) {
                                percentCompleted = Math.round(e.loaded / e.total * 100);
                                if (progressCb) {
                                    progressCb({prct:percentCompleted, files:files});
                                } else if (deferred.notify) {
                                    deferred.notify({prct:percentCompleted, files:files});
                                }
                            }
                    };
 
                    xhr.onload = function(e) {
                        $rootScope.$apply (function() {
                            var response = $rootScope.$eval(xhr.response) || xhr.responseText || null;
                            var result = {
                                dropped: files,
                                response: response,
                                status:xhr.status
                            };
                            if (xhr.status >= 200 && xhr.status < 300)
                                deferred.resolve(result);
                            else if (xhr.status >= 500 && xhr.status < 600)
                                deferred.reject(result);
                        })
                    };
 
                    xhr.upload.onerror = function(e) {
                        var msg = "An unknown error occurred posting to '" + uploadUrl + "'";
                        $rootScope.$apply (function() {
                            deferred.reject(msg);
                        });
                    }

                    xhr.parseHeaders = function(){
                    	if (!headers || !(headers instanceof Object))
                    		return;
                    	for (var key in headers)
                    		xhr.setRequestHeader(key, headers[key]);
                    }
 
                    var formData = new FormData();
                    for (var i = 0; i < files.length; i++) {
                        formData.append(files[i].name, files[i]);
                    }
                    xhr.open("POST", uploadUrl, true);
                    xhr.parseHeaders();
                    xhr.send(formData);
                    return deferred.promise;               
                }
            };
        }
    };
 
    return svc;
}]);