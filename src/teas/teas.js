import angular from 'angular';
import { MODULE_NAME } from '../config'

const module = angular.module(MODULE_NAME)
    .controller('TeasCtrl', function ($scope, Restangular) {
        var ORDER_BY_ASC = 'sort-by-order';
        var ORDER_BY_DESC = 'sort-by-order-alt';
        var TABLE_REP = 'th';
        var LIST_REP = 'th-list';
        var teas = Restangular.all('teas');

        teas.getList().then((teas) => {
            this.teas = teas;
            this.teasTypes = this.teas.map(a => a.tea_type);
            this.teasTypes.unshift('<choose a tea type>');
        });

        $scope.teasSearch = { text: '', type: '' };
        $scope.teasOrder = { sortField: '', reverse: false, glyphIcon: ORDER_BY_ASC };
        $scope.orderBy = function(sort) {
            $scope.teasOrder.sortField = sort;
            if(sort === 'price'){
                $scope.teasOrder.reverse = !$scope.teasOrder.reverse;
                $scope.teasOrder.glyphIcon = $scope.teasOrder.glyphIcon === ORDER_BY_ASC ? ORDER_BY_DESC : ORDER_BY_ASC;
            }
        };

        $scope.renderOption = TABLE_REP;
        $scope.showAsList = false;
        $scope.togglePresentation = function() {
            if($scope.renderOption === TABLE_REP){
                $scope.renderOption = LIST_REP;
            }else{
                $scope.renderOption = TABLE_REP;
            }
            $scope.showAsList = !$scope.showAsList;
        };
    })

module.config(function ($routeProvider) {
    $routeProvider.when('/teas', {
        template: require('./teas.html'),
        controller: 'TeasCtrl',
        controllerAs: 'teas'
    })
})

module.filter('teasFilter', function () {
    return function (input, filterObject) {
        if (filterObject == undefined) { return input; }

        var searchByFreeText = filterObject.text.toLowerCase();
        var searchByType = filterObject.type.toLowerCase();
        var filteredTeas = [];
        if (input != undefined) {
            for (var teaIndex = 0; teaIndex < input.length; teaIndex++) {
                var tea = createTeaFromInput(input[teaIndex]);
                if((tea.type.includes(searchByType) || searchByType === "<choose a tea type>") &&
                    (searchByFreeText === '' || tea.name.includes(searchByFreeText) || tea.description.includes(searchByFreeText))) {
                    filteredTeas.push(input[teaIndex]);
                }
            }
        }
        return filteredTeas;

        function createTeaFromInput(input){
            var teaName = input.name != undefined ? input.name.toString().toLowerCase() : '';
            var teaDescription = input.description != undefined ? input.description.toString().toLowerCase() : '';
            var teaType = input.tea_type != undefined ? input.tea_type.toString().toLowerCase() : '';
            return { name: teaName, description: teaDescription, type: teaType };
        }
    };
});