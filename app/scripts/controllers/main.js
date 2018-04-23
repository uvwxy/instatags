'use strict';

/**
 * @ngdoc function
 * @name bashInstatileApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bashInstatileApp
 */
angular.module('bashInstatileApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.popular = ['sunset', 'dji', 'drone', 'pano', 'panorama', 'mountain', 'tree', 'sea', 'clouds', 'sky', 'skies'];

    $scope.resetAll = function(){
      $scope.tagInput = '';
      $scope.searchTags = [];
      $scope.relatedLimit = 10;

      $scope.selectedTags = {};
      $scope.searchResults = {};

      $scope.copyString = '';
      $scope.tagCount = 0;
    };

    $scope.resetAll();

    $scope.sortTags = function () {
      var list = [];
      for (var i in $scope.selectedTags) {
        for (var j = 0; j < $scope.selectedTags[i].length; j++) {
          list.push($scope.selectedTags[i][j]);
        }
      }
      $scope.copyString = list.sort().join(' ');
    };

    $scope.addSelection = function (searchTag, selectedTag) {
      var list = $scope.selectedTags[searchTag] || [];


      if (list.includes('#' + selectedTag)) {
        list.remove('#' + selectedTag);
      } else {
        list.push('#' + selectedTag);
      }

      $scope.selectedTags[searchTag] = list;


      var count = 0;
      var tagString = '';

      for (var i in $scope.selectedTags) {
        count += $scope.selectedTags[i].length;
        tagString += $scope.selectedTags[i].sort().join(' ') + ' ';
      }
      $scope.tagCount = count;
      $scope.copyString = tagString;
    };

    $scope.addSearchTag = function (searchTag) {

      if (searchTag) {
        $scope.searchTags.unshift(searchTag);
      }

      if (!$scope.searchResults[searchTag]) {
        $http.get('/api/tags/related/' + searchTag).then(function (response) {
          $scope.searchResults[searchTag] = {name: searchTag, related: response.data};
        });
      }
    };

    $scope.searchResults = {};
  });
