define([], function () {
    "use strict";
    return {
        cube1: {
            qHyperCubeDef: {
                qInitialDataFetch: [
                    {
                        qHeight: 100,
                        qWidth: 10
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

