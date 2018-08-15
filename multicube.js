define([
    "qlik",
    "jquery",
    "text!./style.css",
    "text!./template.html",
    "./initial-properties",
    "./properties",
    "./Chart"
], function (qlik, $, cssContent, template, initialProps, props, chart) {
    "use strict";
    return {
        template: template,
        initialProperties: initialProps,
        definition: props,
        controller: ['$scope', '$element', function ($scope, $element) {
            $("<style>").html(cssContent).appendTo("head");
            var qDimensionTemplate = {
                qDef: {
                    qGrouping: "N",
                    qFieldDefs: "CHANGE_ME",
                    qFieldLabels: [""],
                    autoSort: false,
                    qSortCriterias: [
                        {
                            qSortByAscii: 0,
                        }
                    ]
                },
                qNullSuppression: false,
            };
            var qMeasureTemplate = {
                qDef: {
                    qLabel: "",
                    qDescription: "",
                    qTags: [""],
                    qGrouping: "N",
                    qDef: "CHANGE_ME",
                    qNumFormat: {
                        qDec: ".",
                        qFmt: "#,##0.00",
                        qThou: ",",
                        qType: "F",
                        qUseThou: 0,
                        qnDec: 2,
                    },
                    autoSort: false
                },
                qSortBy: {
                    qSortByState: 0,
                    qSortByFrequency: 0,
                    qSortByNumeric: 0,
                    qSortByAscii: 0,
                    qSortByLoadOrder: 0,
                    qSortByExpression: 0,
                    qExpression: {
                        qv: ""
                    }
                }
            };
            $scope.counter = 0;
            console.log("layout", $scope.layout);

            // Cube1
            $scope.$watchCollection("layout.cube1Dimensions", function (newVal) {
                let qDimensions = [];
                angular.forEach(newVal, function (value, key) {
                    if (value.dimension != "") {
                        let qDimAux = JSON.parse(JSON.stringify(qDimensionTemplate));
                        qDimAux.qDef.qLabel = [value.label];
                        qDimAux.qDef.qFieldDefs = [value.dimension];
                        qDimAux.qDef.qSortCriterias[0].qSortByAscii = parseInt(value.sortCriteria);
                        qDimensions.push(qDimAux);
                    }
                });
                //console.log("qDimensions1", qDimensions);

                $scope.backendApi.applyPatches([
                    {
                        "qPath": "/cube1/qHyperCubeDef/qDimensions",
                        "qOp": "replace",
                        "qValue": JSON.stringify(qDimensions)
                    }
                ], false);

                $scope.PatchInterColumnSorter1();

                $scope.cube1 = $scope.layout.cube1.qHyperCube;
                console.log("cube1-dim", $scope.cube1);
                //$scope.ReloadCube1();
            });
            $scope.$watchCollection("layout.cube1Measures", function (newVal) {
                let qMeasures = [];
                angular.forEach(newVal, function (value, key) {
                    if (value.measure != "") {
                        let qMeasAux = JSON.parse(JSON.stringify(qMeasureTemplate));
                        qMeasAux.qDef.qLabel = value.label;
                        qMeasAux.qDef.qDef = value.measure;
                        qMeasAux.qSortBy.qSortByNumeric = parseInt(value.sortCriteria);
                        qMeasAux.qDef.qNumFormat.qType = value.qType ? value.qType : "F";
                        qMeasAux.qDef.qNumFormat.qFmt = value.qFmt ? value.qFmt : "#,##0.00";
                        qMeasAux.qDef.qNumFormat.qnDec = value.qnDec ? value.qnDec : 2;
                        qMeasures.push(qMeasAux);
                    }
                });
                //console.log("qMeasures1", qMeasures);

                $scope.backendApi.applyPatches([
                    {
                        "qPath": "/cube1/qHyperCubeDef/qMeasures",
                        "qOp": "replace",
                        "qValue": JSON.stringify(qMeasures)
                    }
                ], false);

                $scope.PatchInterColumnSorter1();

                $scope.cube1 = $scope.layout.cube1.qHyperCube;
                console.log("cube1-mea", $scope.cube1);
            });
            $scope.$watchCollection("layout.cube1.columnOrder", function (newValue) {
                let qColumnOrder = [];
                $scope.cube1ColumnNames = [];
                //console.log("ColumnOrder", newValue);
                let orderAux = newValue.split(",");
                let dimLength = $scope.layout.cube1.qHyperCube.qDimensionInfo.length;
                let meaLength = $scope.layout.cube1.qHyperCube.qMeasureInfo.length;
                orderAux.forEach(function (currentValue, index, arr) {
                    let indexAux = parseInt(currentValue);
                    qColumnOrder.push(indexAux);
                    if (indexAux < dimLength) {
                        $scope.cube1ColumnNames.push(
                            {
                                qLabel: $scope.layout.cube1.qHyperCube.qDimensionInfo[indexAux].qLabel,
                                haveIcon: $scope.layout.cube1Dimensions[indexAux].haveIcon
                            }
                        );
                    } else if (indexAux < (dimLength + meaLength)) {
                        $scope.cube1ColumnNames.push(
                            {
                                qLabel: [$scope.layout.cube1.qHyperCube.qMeasureInfo[indexAux - dimLength].qFallbackTitle],
                                haveIcon: $scope.layout.cube1Measures[indexAux - dimLength].haveIcon
                            }
                        );
                    }
                });
                //console.log("qColumnOrder", qColumnOrder);
                //console.log("cube1ColumnNames", $scope.cube1ColumnNames);

                $scope.backendApi.applyPatches([
                    {
                        "qPath": "/cube1/qHyperCubeDef/qColumnOrder",
                        "qOp": "replace",
                        "qValue": JSON.stringify(qColumnOrder)
                    }
                ], false);

                $scope.PatchInterColumnSorter1();

                $scope.cube1 = $scope.layout.cube1.qHyperCube;
            });
            $scope.$watchCollection("layout.cube1.qHyperCube.qDataPages", function (newVal) {
                $scope.ReloadCube1();
                angular.element(document).ready(function () {
                    $scope.GroupDataChart();
                    $scope.LoadCharts();
                });
            });

            $scope.PatchInterColumnSorter1 = function () {
                //console.log("qColumnOrder1", $scope.layout.cube1.qHyperCube.qColumnOrder);
                let qColumnOrder = $scope.layout.cube1.qHyperCube.qColumnOrder;
                let qInterColumnSortOrder = [1];
                let dimLength = $scope.layout.cube1.qHyperCube.qDimensionInfo.length;
                let meaLength = $scope.layout.cube1.qHyperCube.qMeasureInfo.length;

                for (let i = 2; i < dimLength + meaLength; i++) {
                    qInterColumnSortOrder.push(qColumnOrder[i]);
                }
                //console.log("qInterColumnSortOrder", qInterColumnSortOrder);
                $scope.backendApi.applyPatches([
                    {
                        "qPath": "/cube1/qHyperCubeDef/qInterColumnSortOrder",
                        "qOp": "replace",
                        "qValue": JSON.stringify(qInterColumnSortOrder)
                    }
                ], false);
            };

            $scope.ReloadCube1 = function () {
                $scope.cube1 = $scope.layout.cube1.qHyperCube;
                // GROUP DATA
                if ($scope.cube1.qDataPages[0].qMatrix.length > 0 && $scope.cube1.qDataPages[0].qMatrix[0].length > 1) {
                    if ($scope.layout.cube1Dimensions[1].isCategory) {
                        var qMatrix1Copy = JSON.parse(JSON.stringify($scope.cube1.qDataPages[0].qMatrix));
                        var categories = qMatrix1Copy.reduce(function (obj, item) {
                            obj[item[1].qText] = obj[item[1].qText] || [];
                            obj[item[1].qText].push(item);
                            return obj;
                        }, {});
                        $scope.cube1IsGrouped = true;
                        $scope.cube1Grouped = Object.keys(categories).map(function (key) {
                            return { category: key, data: categories[key] };
                        });
                    } else {
                        $scope.cube1IsGrouped = false;
                        $scope.cube1Grouped = [{
                            category: "",
                            data: $scope.cube1.qDataPages[0].qMatrix
                        }];
                    }
                    //console.log("cube1Grouped", $scope.cube1Grouped);
                }
            }

            // Cube2
            $scope.$watchCollection("layout.cube2Dimensions", function (newVal) {
                let qDimensions = [];
                angular.forEach(newVal, function (value, key) {
                    if (value.dimension != "") {
                        let qDimAux = JSON.parse(JSON.stringify(qDimensionTemplate));
                        qDimAux.qDef.qLabel = [value.label];
                        qDimAux.qDef.qFieldDefs = [value.dimension];
                        qDimensions.push(qDimAux);
                    }
                });

                $scope.backendApi.applyPatches([
                    {
                        "qPath": "/cube2/qHyperCubeDef/qDimensions",
                        "qOp": "replace",
                        "qValue": JSON.stringify(qDimensions)
                    }
                ], false);
                $scope.cube2 = $scope.layout.cube2.qHyperCube;
                //console.log("cube2-dim", $scope.cube2);
            });
            $scope.$watchCollection("layout.cube2Measures", function (newVal) {
                let qMeasures = [];
                angular.forEach(newVal, function (value, key) {
                    if (value.measure != "") {
                        let qMeasAux = JSON.parse(JSON.stringify(qMeasureTemplate));
                        qMeasAux.qDef.qLabel = value.label;
                        qMeasAux.qDef.qDef = value.measure;
                        qMeasAux.qDef.qNumFormat.qType = value.qType ? value.qType : "F";
                        qMeasAux.qDef.qNumFormat.qFmt = value.qFmt ? value.qFmt : "#,##0.00";
                        qMeasAux.qDef.qNumFormat.qnDec = value.qnDec ? value.qnDec : 2;
                        qMeasures.push(qMeasAux);
                    }
                });

                $scope.backendApi.applyPatches([
                    {
                        "qPath": "/cube2/qHyperCubeDef/qMeasures",
                        "qOp": "replace",
                        "qValue": JSON.stringify(qMeasures)
                    }
                ], false);
                $scope.cube2 = $scope.layout.cube2.qHyperCube;
                console.log("cube2-mea", $scope.cube2);
            });     
            $scope.$watchCollection("layout.cube2.qHyperCube.qDataPages", function (newVal) {
                angular.element(document).ready(function () {
                    $scope.GroupDataChart();
                    $scope.LoadCharts();
                });
            });

            // -------------------- CHARTS
            angular.element(document).ready(function () {
                $scope.GroupDataChart();
                $scope.LoadCharts();
            });

            $scope.GroupDataChart = function () {
                if ($scope.cube2.qDimensionInfo.length > 0) {
                    var qMatrixCopy = JSON.parse(JSON.stringify($scope.cube2.qDataPages[0].qMatrix));
                    var groups = qMatrixCopy.reduce(function (obj, item) {
                        obj[item[0].qText] = obj[item[0].qText] || [];
                        obj[item[0].qText].push(item);
                        return obj;
                    }, {});
                    $scope.dataGrouped = Object.keys(groups).map(function (key) {
                        return { name: key, data: groups[key] };
                    });

                    angular.forEach($scope.dataGrouped, function (value, key) {
                        value.data.sort(function compare(a, b) {
                            if (a[1].qNum < b[1].qNum)
                                return -1;
                            if (a[1].qNum > b[1].qNum)
                                return 1;
                            return 0;
                        });
                    });

                    //console.log($scope.dataGrouped);
                }
            };
            var charts = [];
            $scope.LoadCharts = function () {
                //console.log("charts",charts);
                //console.log("dataGrouped", $scope.dataGrouped);

                angular.forEach($scope.dataGrouped, function (value, key) {
                    let ctx = $("#chart-" + value.name);
                    if (ctx.length) {
                        let dataAux = [];
                        let labelsAux = []
                        for (let i = 0; i < value.data.length; i++) {
                            dataAux.push(value.data[i][2].qNum);
                            labelsAux.push(value.data[i][1].qText);
                        }
                        if (charts[key] != undefined || charts[key] != null) {
                            charts[key].destroy();
                            chart[key] = {};
                        }

                        let myLineChart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: labelsAux,
                                datasets: [{
                                    data: dataAux,
                                    label: value.name,
                                    borderColor: "#3e95cd",
                                    fill: false
                                }]
                            },
                            options: {
                                legend: { display: false },
                                title: { display: false },
                                elements: {
                                    point: { radius: 3 },
                                    pointHoverRadius: { radius: 4 }
                                },
                                scales: {
                                    xAxes: [{
                                        display: false
                                    }],
                                    yAxes: [{
                                        display: false
                                    }]
                                },
                                layout: {
                                    padding: {
                                        left: 5,
                                        right: 5,
                                        top: 0,
                                        bottom: 0
                                    }
                                },
                                responsive: false,
                                tooltips: {
                                    displayColors: false
                                }
                            }
                        });
                        charts[key] = charts[key] || [];
                        charts[key] = myLineChart;
                    }
                });
            };


            // EXTRA
            $scope.goUrl = function (id) {
                if (id.length>0) {
                    var win = window.open($scope.layout.urlChart + id, '_blank');
                    win.focus();
                }
            };

            $scope.sFrame = false;
            $scope.showFrame = function (id) {
                console.log("d: ", id);
                console.log("id: ", $scope.layout.urlIframe, id);
                $scope.sFrame = true;
                $scope.idk =
                    $scope.layout.urlIframe
                    + id
                    console.log("link: ",$scope.idk);
            }
        }]
    };
});