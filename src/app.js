var DeficitBusters = angular.module('DeficitBusters', ["ngMaterial", "ngAnimate", "chart.js"])
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

DeficitBusters.controller('MainController', function($scope, $interval, $q) {
    $scope.Math = Math;
    $scope.currentBalance = -19032777056146.24;
    odometer.innerHTML = ($scope.currentBalance * -1);
	$scope.budget1 = 20;
	$scope.budget2 = 20;
	$scope.budget3 = 20;
    $scope.yearlyIncome = 0;
    $scope.yearlyExpenses = 0;
    //$interval(function(){
	//	odometer.innerHTML = $scope.currentBalance;
	//	$scope.currentBalance += 277.78
	//}, 1);

    //$interval(function(){
	//	odometer.innerHTML = $scope.currentBalance;
	//	$scope.currentBalance += 54000.78
	//}, 2000);
    
    getInitialBudget = function() {
        var deferred = $q.defer();
        Papa.parse("http://0.0.0.0:8001/src/budget2016.csv", {
            download: true,
            header: true,
            complete: function(results) {

                var budgetItems = results.data;

                var budget = {};

                _(budgetItems).forEach(function(item) {
                    if ("Agency Name" in item) {
                        var agency = item["Agency Name"];
                        var bureau = item["Bureau Name"];
                        var account = item["Account Name"];
                        var amount = parseInt(item["2016"].replace(",", ""));
                        if (!(agency in budget)) {
                            budget[agency] = {name: agency, amount: 0, bureaus:{}, showSubItems: false };
                        }
                        if (!(bureau in budget[agency]["bureaus"])) {
                            budget[agency]["bureaus"][bureau] = {name: bureau, amount: 0, accounts:{}, showSubItems: false };
                        }
                        if (account in budget[agency]['bureaus'][bureau]['accounts']) {
                            budget[agency]["bureaus"][bureau]["accounts"][account]['amount'] += amount;
                        } else {
                            budget[agency]["bureaus"][bureau]["accounts"][account] = {name: account, amount: amount};
                        }
                    }
                });

                deferred.resolve(budget);
            }
        });
        return deferred.promise;
    }

    $scope.formatAsUsd = function(number) {
        return numeral(number).format("$0,0");
    }

    getInitialBudget().then(function(data) {
        $scope.budget = data;
        recalculateTotals();
    });
    
    $scope.toggleBureaus = function(name) {
        $scope.budget[name]["showSubItems"] = !$scope.budget[name]["showSubItems"];
    }
    $scope.onSliderMouseUp = function(type, object) {
        if (type == "agency") {
            var previousSum = _.sum(_.map(object['bureaus'], function (bureau) {
                return bureau['amount'];
            }))
            _.forEach(object['bureaus'], function(bureau) {
                changeBureauAmount(bureau, object['amount'] * (bureau['amount'] / previousSum))
            });
        } else if (type == "bureau") {
            changeBureauAmount(object, object['amount']);
        }
        recalculateTotals();
    }

    function copyObject(object) {
        return JSON.parse(JSON.stringify(object));
    }

    function recalculateTotals() {
        $scope.income = _.orderBy(_.filter(_.map(copyObject($scope.budget), function(agency) {
            agency["bureaus"] = _.orderBy(_.filter(_.map(agency["bureaus"], function(bureau) {
                bureau["accounts"] = _.orderBy(_.map(_.filter(bureau["accounts"], function(account) {
                    if (account.amount < 0) {
                        return true;
                    } else {
                        return false;
                    }
                }), function(account) {
                    account.amount = -1 * account.amount;
                    return account
                }), ["amount"], ["desc"]);
                bureau["amount"] = _.sum(_.map(bureau["accounts"], function(account) { return account.amount }));
                return bureau;
            }), function(bureau) { return bureau.accounts && bureau.accounts.length }), ["amount"], ["desc"]);
            agency["amount"] = _.sum(_.map(agency["bureaus"], function(bureau) { return bureau.amount }));
            return agency;
        }), function(agency) { return agency.bureaus && agency.bureaus.length }), ["amount"], ["desc"]);

        $scope.expenses = _.orderBy(_.filter(_.map(copyObject($scope.budget), function(agency) {
            agency["bureaus"] = _.orderBy(_.filter(_.map(agency["bureaus"], function(bureau) {
                bureau["accounts"] = _.orderBy(_.filter(bureau["accounts"], function(account) {
                    if (account.amount > 0) {
                        return true;
                    } else {
                        return false;
                    }
                }), ["amount"], ["desc"]);
                bureau["amount"] = _.sum(_.map(bureau["accounts"], function(account) { return account.amount }));
                return bureau;
            }), function(bureau) { return bureau.accounts && bureau.accounts.length }), ["amount"], ["desc"]);
            agency["amount"] = _.sum(_.map(agency["bureaus"], function(bureau) { return bureau.amount }));
            return agency;
        }), function(agency) { return agency.bureaus && agency.bureaus.length }), ["amount"], ["desc"]);
        console.log($scope.budget);

        $scope.yearlyIncome = _.sum(_.map($scope.income, function(agency) {
            return agency.amount;
        }));
        formattedYearlyIncome = numeral($scope.yearlyIncome).format("$0,0");

        $scope.yearlyExpenses = _.sum(_.map($scope.expenses, function(agency) {
            return agency.amount;
        }));
        formattedYearlyExpenses = numeral($scope.yearlyExpenses).format("$0,0");

        $scope.stats = []
        $scope.stats.push({label: "Income", value: formattedYearlyIncome});
        $scope.stats.push({label: "Expenses", value: formattedYearlyExpenses});

        $scope.yearlyBalance = $scope.yearlyIncome - $scope.yearlyExpenses;
        formattedYearlyBalance = numeral($scope.yearlyBalance).format("$0,0");
        $scope.stats.push({label: "Yearly Balance", value: formattedYearlyBalance});

        var yearsDifference = 2050 - 2016;
        $scope.projectedBalance = $scope.currentBalance + (yearsDifference * $scope.yearlyBalance);
    }

    function changeBureauAmount(bureau, amount) {
        var previousSum = _.sum(_.map(bureau['accounts'], function (account) {
            return account['amount'];
        }))
        _.forEach(bureau["accounts"], function(account) {
            account['amount'] = amount * (account.amount / previousSum)
        });
    }

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
