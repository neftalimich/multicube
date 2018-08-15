define([], function () {
    "use strict";
    return {
        cube1: {
            qHyperCubeDef: {
                qInitialDataFetch: [
                    {
                        qHeight: 100,
                        qWidth: 15
                    }
                ],
                qDimensions: [],
                qMeasures: [],
                qSuppressZero: false,
                qSuppressMissing: false,
                qMode: "S",
                qColumnOrder:[0,1,3,2],
                qInterColumnSortOrder: [],
                qStateName: "$"
            }
        },
        cube2: {
            qHyperCubeDef: {
                qInitialDataFetch: [
                    {
                        qHeight: 1000,
                        qWidth: 3
                    }
                ],
                qDimensions: [],
                qMeasures: [],
                qSuppressZero: false,
                qSuppressMissing: false,
                qMode: "S",
                qInterColumnSortOrder: [],
                qStateName: "$"
            }
        }
    }
});

