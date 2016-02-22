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
                        if (amount > 0) {
                            if (!(agency in budget)) { budget[agency] = {name: agency, amount: 0, items:{} } }
                            if (!(bureau in budget[agency]["items"])) { budget[agency]["items"][bureau] = {name: bureau, amount: 0, items:{} } }
                            var amount1 = budget[agency]["items"][bureau]["amount"];
                            var amount2 = _.sum(_.map(budget[agency]['items'][bureau]['items'], function(account) { return account.amount; }));
                            if (account in budget[agency]['items'][bureau]['items']) {
                                budget[agency]["items"][bureau]["items"][account]['amount'] += amount;
                            } else {
                                budget[agency]["items"][bureau]["items"][account] = {name: account, amount: amount};
                            }
                            budget[agency]["amount"] += amount;
                            budget[agency]["items"][bureau]["amount"] += amount;
                            amount1 = budget[agency]["items"][bureau]["amount"];
                            amount2 = _.sum(_.map(budget[agency]['items'][bureau]['items'], function(account) { return account.amount; }));
                            if (amount1 != amount2) {
                                throw "1 something's wrong......"
                            }
                        }
                    }
                });

                _.forEach(budget, function(agency) {
                    var amount1 = agency['amount'];
                    var amount2 = _.sum(_.map(agency['items'], function(bureau) { return bureau.amount; }));
                    if (amount1 != amount2) {
                        throw "something's wrong......"
                    } else {
                        _.forEach(agency['items'], function(bureau) {
                            var amount1 = bureau['amount'];
                            var amount2 = _.sum(_.map(bureau['items'], function(bureau) { return bureau.amount; }));
                            if (amount1 != amount2) {
                                throw "something's wrong......"
                            }
                        });
                    }
                });

                var orderedBudget = _.orderBy(_.map(budget, function(agencyProps, agency) {
                    return {
                        name: agency,
                        amount: agencyProps["amount"],
                        bureaus: _.orderBy(_.map(agencyProps["items"], function(bureauProps, bureau) {
                            return {
                                name: bureau,
                                amount: bureauProps["amount"],
                                accounts: _.orderBy(_.map(bureauProps["items"], function(accountProps, account) {
                                    return {
                                        name: account,
                                        amount: accountProps["amount"],
                                    }
                                }), ["amount"], ["desc"]),
                                showSubItems: false
                            }
                        }), ["amount"], ["desc"]),
                        showSubItems: false
                    };
                }), ["amount"], ["desc"]);
                 
                deferred.resolve(orderedBudget);
            }
        });
        return deferred.promise;
    }

    $scope.formatAsUsd = function(number) {
        return numeral(number).format("$0,0");
    }

    getInitialBudget().then(function(data) {
        $scope.budget = data
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

        $scope.budget = _.orderBy(_.map($scope.budget, function(agency) {
            agency["bureaus"] = _.orderBy(_.map(agency["bureaus"], function(bureau) {
                bureau["accounts"] = _.orderBy(bureau["accounts"], ["amount"], ["desc"]);
                bureau["amount"] = _.sum(_.map(bureau["accounts"], function(account) { return account.amount }));
                return bureau;
            }), ["amount"], ["desc"]);
            agency["amount"] = _.sum(_.map(agency["bureaus"], function(bureau) { return bureau.amount }));
            return agency;
        }), ["amount"], ["desc"]);
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
