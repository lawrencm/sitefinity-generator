﻿/* ------------------------------------------------------------------------------
<auto-generated>
    This file was generated by Sitefinity CLI v1.0.0.4
</auto-generated>
------------------------------------------------------------------------------ */

angular.module('designer').requires.push('sfSelectors');

angular.module('designer')
    .controller('SimpleCtrl', ['$scope', 'propertyService', function ($scope, propertyService) {
        $scope.feedback.showLoadingIndicator = true;

        // Get widget properies and load them in the controller's scope

        $scope.$watch(
            'selectedItem',
            function (newVal, oldVal) {
                if (!!newVal && newVal !== oldVal) {
                    $scope.properties.SelectedItem.PropertyValue = JSON.stringify(newVal);
                }
            },
            true
        );

        $scope.$watch(
            'selectedId',
            function (newVal, oldVal) {
                if (!!newVal && newVal !== oldVal) {
                    $scope.properties.SelectedId.PropertyValue = newVal;
                }
            },
            true
        );


        propertyService.get()
            .then(function (data) {
                console.log(data);

                if (data) {
                    $scope.properties = propertyService.toAssociativeArray(data.Items);

                    if (data) {
                        $scope.properties = propertyService.toAssociativeArray(data.Items);
                        var serializedSelectedItem = $scope.properties.SelectedItem.PropertyValue;
                        if (serializedSelectedItem != "")
                            $scope.selectedItem = JSON.parse(serializedSelectedItem);

                        var serializedSelectedId = $scope.properties.SelectedId.PropertyValue;
                        if (serializedSelectedId != "")
                            $scope.selectedId = serializedSelectedId;
                    }
                }
            }, function (data) {
                $scope.feedback.showError = true;
                if (data) {
                    $scope.feedback.errorMessage = data.Detail;
                }
            })
            .finally(function () {
                $scope.feedback.showLoadingIndicator = false;
            });
    }]);