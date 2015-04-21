(function() {

  /////////////////////////////////////////////////////////////////
  // CONFIG ///////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  var moduleName = 'angular-paginate';
  var DEFAULT_ID = '__default';

  /////////////////////////////////////////////////////////////////
  // MODULE ///////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  var module;
  try {
    module = angular.module(moduleName);
  } catch (err) {
    module = angular.module(moduleName, []);
  }

  module.directive('dirPaginate', ['$compile', '$parse', '$timeout',
    'paginationService', function($compile, $parse, $timeout,
      paginationService) {

      return {
          terminal: true,
          multiElement: true,
          priority: 5000,
          compile: function dirPaginationCompileFn(tElement, tAttrs) {

            var expression = tAttrs.dirPaginate;
            var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

            var filterPattern = /\|\s*itemsPerPage\s*:[^|]*/;
            if (match[2].match(filterPattern) === null) {
              throw 'pagination directive: the \'itemsPerPage\' filter must be set.';
            }
            var itemsPerPageFilterRemoved = match[2].replace(filterPattern, '');
            var collectionGetter = $parse(itemsPerPageFilterRemoved);

            var rawId = tAttrs.paginationId || DEFAULT_ID;
            paginationService.registerInstance(rawId);

            return function dirPaginationLinkFn(scope, element, attrs) {
              var paginationId = $parse(attrs.paginationId)(scope) ||
              attrs.paginationId || DEFAULT_ID;
              paginationService.registerInstance(paginationId);

              var repeatExpression;
              var idDefinedInFilter = !!expression.match(/(\|\s*itemsPerPage\s*:[^|]*:[^|]*)/);
              if (paginationId !== DEFAULT_ID && !idDefinedInFilter) {
                repeatExpression = expression.replace(/(\|\s*itemsPerPage\s*:[^|]*)/, "$1 : '" + paginationId + "'");
              } else {
                repeatExpression = expression;
              }

              if (element[0].hasAttribute('dir-paginate-start') ||
                element[0].hasAttribute('data-dir-paginate-start')) {
                attrs.$set('ngRepeatStart', repeatExpression);
                element.eq(element.length - 1).attr('ng-repeat-end', true);
              } else {
                attrs.$set('ngRepeat', repeatExpression);
              }

              var compiled = $compile(element, false, 5000);

              var currentPageGetter;
              if (attrs.currentPage) {
                currentPageGetter = $parse(attrs.currentPage);
              } else {
                var defaultCurrentPage = paginationId + '__currentPage';
                scope[defaultCurrentPage] = 1;
                currentPageGetter = $parse(defaultCurrentPage);
              }
              paginationService
              .setCurrentPageParser(paginationId, currentPageGetter, scope);

              if (typeof attrs.totalItems !== 'undefined') {
                paginationService.setAsyncModeTrue(paginationId);
                scope.$watch(function() {
                  return $parse(attrs.totalItems)(scope);
                }, function(result) {
                  if (0 <= result) {
                    paginationService.setCollectionLength(paginationId, result);
                  }
                });
              } else {
                scope.$watchCollection(function() {
                  return collectionGetter(scope);
                }, function(collection) {
                  if (collection) {
                    paginationService.
                    setCollectionLength(paginationId, collection.length);
                  }
                });
              }
              compiled(scope);
            };
          }
      };
    }]);

  module.directive('dirPaginationControls', ['paginationService',
    'paginationTemplate', function(paginationService, paginationTemplate) {

      var numberRegex = /^\d+$/;

      /////////////////////////////////////////////////////////////////
      // GENERATE AN ARRAY OF PAGE NUMBERS ////////////////////////////
      /////////////////////////////////////////////////////////////////
      function generatePagesArray(currentPage, collectionLength, rowsPerPage, paginationRange) {
        var pages = [];
        var totalPages = Math.ceil(collectionLength / rowsPerPage);
        var halfWay = Math.ceil(paginationRange / 2);
        var position;

        if (currentPage <= halfWay) {
          position = 'start';
        } else if (totalPages - halfWay < currentPage) {
          position = 'end';
        } else {
          position = 'middle';
        }

        var ellipsesNeeded = paginationRange < totalPages;
        var i = 1;
        while (i <= totalPages && i <= paginationRange) {
          var pageNumber = calculatePageNumber(i, currentPage,
            paginationRange, totalPages);

          var openingEllipsesNeeded = (i === 2 && (position === 'middle' ||
            position === 'end'));
          var closingEllipsesNeeded = (i === paginationRange - 1 &&
            (position === 'middle' || position === 'start'));
          if (ellipsesNeeded && (openingEllipsesNeeded ||
            closingEllipsesNeeded)) {
            pages.push('...');
          } else {
            pages.push(pageNumber);
          }
          i++;
        }
        return pages;
      }

      /////////////////////////////////////////////////////////////////
      // FIGURE OUT WHAT PAGE NUMBER CORRESPONDS TO THAT POSITION /////
      /////////////////////////////////////////////////////////////////
      function calculatePageNumber(i, currentPage, paginationRange, totalPages) {
        var halfWay = Math.ceil(paginationRange / 2);
        if (i === paginationRange) {
          return totalPages;
        } else if (i === 1) {
          return i;
        } else if (paginationRange < totalPages) {
          if (totalPages - halfWay < currentPage) {
            return totalPages - paginationRange + i;
          } else if (halfWay < currentPage) {
            return currentPage - halfWay + i;
          } else {
            return i;
          }
        } else {
          return i;
        }
      }

      return {
          restrict: 'AE',
          templateUrl: function(elem, attrs) {
            return attrs.templateUrl || paginationTemplate.getPath();
          },
          scope: {
              maxSize: '=?',
              onPageChange: '&?',
              paginationId: '=?'
          },
          link: function dirPaginationControlsLinkFn(scope, element, attrs) {

            var rawId = attrs.paginationId || DEFAULT_ID;
            var paginationId = scope.paginationId ||
            attrs.paginationId || DEFAULT_ID;

            if (!paginationService.isRegistered(paginationId) && !paginationService.isRegistered(rawId)) {
              var idMessage = (paginationId !== DEFAULT_ID) ?
              ' (id: ' + paginationId + ') ' :
              ' ';
              throw 'pagination directive: the pagination controls' +
              idMessage +
              'cannot be used without the corresponding pagination directive.';
            }

            if (!scope.maxSize) {
              scope.maxSize = 9;
            }
            scope.directionLinks = angular.isDefined(attrs.directionLinks) ?
            scope.$parent.$eval(attrs.directionLinks) :
            true;
            scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ?
            scope.$parent.$eval(attrs.boundaryLinks) :
            false;

            var paginationRange = Math.max(scope.maxSize, 5);
            scope.pages = [];
            scope.pagination = {
                last: 1,
                current: 1
            };
            scope.range = {
                lower: 1,
                upper: 1,
                total: 1
            };

            scope.$watch(function() {
              return (paginationService.getCollectionLength(paginationId) + 1) *
              paginationService.getItemsPerPage(paginationId);
            }, function(length) {
              if (0 < length) {
                generatePagination();
              }
            });

            scope.$watch(function() {
              return (paginationService.getItemsPerPage(paginationId));
            }, function(current, previous) {
              if (current != previous) {
                goToPage(scope.pagination.current);
              }
            });

            scope.$watch(function() {
              return paginationService.getCurrentPage(paginationId);
            }, function(currentPage, previousPage) {
              if (currentPage != previousPage) {
                goToPage(currentPage);
              }
            });

            scope.setCurrent = function(num) {
              if (isValidPageNumber(num)) {
                paginationService.setCurrentPage(paginationId, num);
              }
            };

            function goToPage(num) {
              if (isValidPageNumber(num)) {
                scope.pages = generatePagesArray(
                  num,
                  paginationService.getCollectionLength(paginationId),
                  paginationService.getItemsPerPage(paginationId),
                  paginationRange
                );
                scope.pagination.current = num;
                updateRangeValues();

                if (scope.onPageChange) {
                  scope.onPageChange({
                      newPageNumber: num
                  });
                }
              }
            }

            function generatePagination() {
              var page = parseInt(paginationService
                .getCurrentPage(paginationId)) || 1;

              scope.pages = generatePagesArray(
                page,
                paginationService.getCollectionLength(paginationId),
                paginationService.getItemsPerPage(paginationId),
                paginationRange
              );
              scope.pagination.current = page;
              scope.pagination.last = scope.pages[scope.pages.length - 1];
              if (scope.pagination.last < scope.pagination.current) {
                scope.setCurrent(scope.pagination.last);
              } else {
                updateRangeValues();
              }
            }

            function updateRangeValues() {
              var currentPage = paginationService.getCurrentPage(paginationId);
              var itemsPerPage = paginationService
              .getItemsPerPage(paginationId);
              var totalItems = paginationService
              .getCollectionLength(paginationId);

              scope.range.lower = (currentPage - 1) * itemsPerPage + 1;
              scope.range.upper = Math.min(currentPage *
                itemsPerPage, totalItems);
              scope.range.total = totalItems;
            }

            function isValidPageNumber(num) {
              return (numberRegex.test(num) && (0 < num && num <= scope.pagination.last));
            }
          }
      };
    }]);

  module.filter('itemsPerPage', ['paginationService',
    function(paginationService) {

      return function(collection, itemsPerPage, paginationId) {
        if (typeof(paginationId) === 'undefined') {
          paginationId = DEFAULT_ID;
        }
        if (!paginationService.isRegistered(paginationId)) {
          throw 'pagination directive: the itemsPerPage id argument (id: ' +
            paginationId + ') does not match a registered pagination-id.';
        }
        var end;
        var start;
        if (collection instanceof Array) {
          itemsPerPage = parseInt(itemsPerPage) || 9999999999;
          if (paginationService.isAsyncMode(paginationId)) {
            start = 0;
          } else {
            start = (paginationService.getCurrentPage(paginationId) - 1) *
            itemsPerPage;
          }
          end = start + itemsPerPage;
          paginationService.setItemsPerPage(paginationId, itemsPerPage);

          return collection.slice(start, end);
        } else {
          return collection;
        }
      };
    }]);

  module.service('paginationService', function() {

    var instances = {};
    var lastRegisteredInstance;

    this.registerInstance = function(instanceId) {
      if (typeof instances[instanceId] === 'undefined') {
        instances[instanceId] = {
            asyncMode: false
        };
        lastRegisteredInstance = instanceId;
      }
    };

    this.isRegistered = function(instanceId) {
      return (typeof instances[instanceId] !== 'undefined');
    };

    this.getLastInstanceId = function() {
      return lastRegisteredInstance;
    };

    this.setCurrentPageParser = function(instanceId, val, scope) {
      instances[instanceId].currentPageParser = val;
      instances[instanceId].context = scope;
    };
    this.setCurrentPage = function(instanceId, val) {
      instances[instanceId]
      .currentPageParser.assign(instances[instanceId].context, val);
    };
    this.getCurrentPage = function(instanceId) {
      var parser = instances[instanceId].currentPageParser;
      return parser ? parser(instances[instanceId].context) : 1;
    };

    this.setItemsPerPage = function(instanceId, val) {
      instances[instanceId].itemsPerPage = val;
    };
    this.getItemsPerPage = function(instanceId) {
      return instances[instanceId].itemsPerPage;
    };

    this.setCollectionLength = function(instanceId, val) {
      instances[instanceId].collectionLength = val;
    };
    this.getCollectionLength = function(instanceId) {
      return instances[instanceId].collectionLength;
    };

    this.setAsyncModeTrue = function(instanceId) {
      instances[instanceId].asyncMode = true;
    };

    this.isAsyncMode = function(instanceId) {
      return instances[instanceId].asyncMode;
    };
  });

  module.provider('paginationTemplate', function() {

    var templatePath = './views/templates/dirPaginationTemplate.html';

    this.setPath = function(path) {
      templatePath = path;
    };

    this.$get = function() {
      return {
          getPath: function() {
            return templatePath;
          }
      };
    };
  });
})();
