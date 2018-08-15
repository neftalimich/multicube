define([], function () {
    "use strict";
    return {
        type: "items",
        component: "accordion",
        items: {
            cube1props: {
                label: "Cube 1",
                type: "items",
                items: {
                    Dimensions: {
                        type: "array",
                        ref: "cube1Dimensions",
                        label: "List of Dimensions",
                        itemTitleRef: "label",
                        allowAdd: true,
                        allowRemove: true,
                        addTranslation: "Add Dimension",
                        items: {
                            label: {
                                type: "string",
                                ref: "label",
                                label: "Label",
                                expression: "optional"
                            },
                            dimension: {
                                type: "string",
                                ref: "dimension",
                                label: "Dimension Expression",
                                expression: "always",
                                expressionType: "dimension",
                            },
                            isCategory: {
                                type: "boolean",
                                ref: "isCategory",
                                label: "Category?",
                                defaultValue: false
                            },
                            icon: {
                                type: "boolean",
                                ref: "haveIcon",
                                label: "Icono",
                                defaultValue: false
                            },
                            sortCriteria: {
                                type: "string",
                                component: "dropdown",
                                label: "Ordenar",
                                ref: "sortCriteria",
                                options: [
                                    {
                                        value: "0",
                                        label: "Sin Ordenar"
                                    },
                                    {
                                        value: "-1",
                                        label: "Descendente"
                                    }, {
                                        value: "1",
                                        label: "Ascendente"
                                    }
                                ],
                                defaultValue: "0"
                            }
                        }
                    },
                    Measures: {
                        type: "array",
                        ref: "cube1Measures",
                        label: "List of Measures",
                        itemTitleRef: "label",
                        allowAdd: true,
                        allowRemove: true,
                        addTranslation: "Add Measure",
                        items: {
                            label: {
                                type: "string",
                                ref: "label",
                                label: "Label",
                                expression: "optional"
                            },
                            dimension: {
                                type: "string",
                                ref: "measure",
                                label: "Measure Expression",
                                expression: "always",
                                expressionType: "measure",
                            },
                            sortCriteria: {
                                type: "string",
                                component: "dropdown",
                                label: "Ordenar",
                                ref: "sortCriteria",
                                options: [
                                    {
                                        value: "0",
                                        label: "Sin Ordenar"
                                    },
                                    {
                                        value: "-1",
                                        label: "Descendente"
                                    }, {
                                        value: "1",
                                        label: "Ascendente"
                                    }
                                ],
                                defaultValue: "0"
                            },
                            isArrow: {
                                type: "boolean",
                                ref: "isArrow",
                                label: "Is Arrow",
                                defaultValue: false
                            },
                            qType: {
                                type: "string",
                                ref: "qType",
                                label: "qType",
                                defaultValue: "F"
                            },
                            qFmt: {
                                type: "string",
                                ref: "qFmt",
                                label: "qFmt",
                                defaultValue: "#,##0.00"
                            },
                            qnDec: {
                                type: "integer",
                                ref: "qnDec",
                                label: "qnDec",
                                defaultValue: 2
                            }
                        }
                    },
                    columnOrder1: {
                        type: "string",
                        ref: "cube1.columnOrder",
                        label: "Ordenar Columnas (0,1,2,...)",
                        defaultValue: "0,1"
                    }
                }
            },
            cube2props: {
                label: "Cube 2",
                type: "items",
                items: {
                    Dimensions: {
                        type: "array",
                        ref: "cube2Dimensions",
                        label: "List of Dimensions",
                        itemTitleRef: "label",
                        allowAdd: true,
                        allowRemove: true,
                        addTranslation: "Add Dimension",
                        items: {
                            label: {
                                type: "string",
                                ref: "label",
                                label: "Label",
                                expression: "optional"
                            },
                            dimension: {
                                type: "string",
                                ref: "dimension",
                                label: "Dimension Expression",
                                expression: "always",
                                expressionType: "dimension",
                            }
                        }
                    },
                    Measures: {
                        type: "array",
                        ref: "cube2Measures",
                        label: "List of Measures",
                        itemTitleRef: "label",
                        allowAdd: true,
                        allowRemove: true,
                        addTranslation: "Add Measure",
                        items: {
                            label: {
                                type: "string",
                                ref: "label",
                                label: "Label",
                                expression: "optional"
                            },
                            dimension: {
                                type: "string",
                                ref: "measure",
                                label: "Measure Expression",
                                expression: "always",
                                expressionType: "measure",
                            },
                            qType: {
                                type: "string",
                                ref: "qType",
                                label: "qType",
                                defaultValue: "F"
                            },
                            qFmt: {
                                type: "string",
                                ref: "qFmt",
                                label: "qFmt",
                                defaultValue: "#,##0.00"
                            },
                            qnDec: {
                                type: "integer",
                                ref: "qnDec",
                                label: "qnDec",
                                defaultValue: 2
                            }
                        }
                    },
                    url1: {
                        type: "string",
                        ref: "urlChart",
                        label: "URL Chart"
                    },
                    url2: {
                        type: "string",
                        ref: "urlIframe",
                        label: "URL iFrame"
                    },
                }
            },

        }
    }
});