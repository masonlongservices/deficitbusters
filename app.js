var DeficitBusters = angular.module('DeficitBusters', ["ngMaterial", "chart.js"]);

DeficitBusters.controller('MainController', function($scope, $interval) {
    $scope.debtCounter = 19032777056146.24;
    odometer.innerHTML = $scope.debtCounter;
	$scope.budget1 = 20;
	$scope.budget2 = 20;
	$scope.budget3 = 20;
    //$interval(function(){
	//	odometer.innerHTML = $scope.debtCounter;
	//	$scope.debtCounter += 277.78
	//}, 1);

    //$interval(function(){
	//	odometer.innerHTML = $scope.debtCounter;
	//	$scope.debtCounter += 54000.78
	//}, 2000);
    
    

    $scope.budgetItems = [
    {
        name: "Things That Go Boom",
        amount: 20,
    },
    {
        name: "Finding Aliens",
        amount: 20,
    },
    {
        name: "Teaching the Chilrens",
        amount: 20,
    },
    ];

    $scope.$watch("budgetItems",
        function(newValue, oldValue) {
            $scope.pieData = getPieData();
        }
    , true);
    $scope.labels = ["Things That Go Boom", "Finding Aliens", "Teaching the Chilrens"];
    var getPieData = function() {
        return _.map($scope.budgetItems, function(item) {
            return item.amount;
        });
    };
	$scope.pieData = getPieData();
});
