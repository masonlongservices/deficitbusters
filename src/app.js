var DeficitBusters = angular.module('DeficitBusters', ["ngMaterial", "chart.js"])
	.config(['ChartJsProvider', function (ChartJsProvider) {
		// Configure all charts
		ChartJsProvider.setOptions({
		  colours: ['#000099', '#ff5500', '#ff1166'],
		});
		// Configure all line charts
		ChartJsProvider.setOptions('Line', {
		  datasetFill: false
		});
	  }]);

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
        colorClass: "md-primary",
    },
    {
        name: "Finding Aliens",
        amount: 20,
        colorClass: "md-warn",
    },
    {
        name: "Teaching the Chilrens",
        amount: 20,
        colorClass: "md-ascent",
    },
    ];

    function updateUiData() {
        $scope.pieData = getAmounts()[0];
        $scope.barData = getAmounts();
    }
    $scope.$watch("budgetItems",
        function(newValue, oldValue) {
            updateUiData();
        }
    , true);
    $scope.labels = ["Things That Go Boom", "Finding Aliens", "Teaching the Chilrens"];
    var getAmounts = function() {
        return [_.map($scope.budgetItems, function(item) {
            return item.amount;
        })];
    };
    updateUiData();
});
