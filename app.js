var DeficitBusters = angular.module('DeficitBusters', ["ngMaterial", "chart.js"]);

DeficitBusters.controller('MainController', function($scope, $interval) {
    $scope.debtCounter = 19032777056146.24;
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
    //
    

    $scope.labels = ["Things That Go Boom", "Finding Aliens", "Teaching the Chilrens"];
	$scope.pieData = [$scope.budget1, $scope.budget2, $scope.budget3];

});
