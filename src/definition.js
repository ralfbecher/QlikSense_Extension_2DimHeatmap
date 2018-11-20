function panelSliderLabel () {
  return this.labelText + " (" + arguments[0][this.ref] + ")";
}

const definition = {
  type: "items",
  component: "accordion",
  items: {
    data:{
      uses: "data",
      items:{
        dimensions:{
          disabledRef: ""
        },
        measures: {
          disabledRef: ""
        }
      }
    },
    sorting: {
      uses: "sorting"
    },
    addons: {
      uses: "addons",
      items: {
        dataHandling: {
          uses: "dataHandling"
        }
      }
    },
    settings: {
      uses: "settings",
      items: {
        options: {
          label: "Options",
          type: "items",
          items: {
            useMeanScale: {
              type: "boolean",
              component: "switch",
              translation: "Use Mean in Scale",
              ref: "useMeanScale",
              defaultValue: true,
              trueOption: {
                value: true,
                translation: "properties.on"
              },
              falseOption: {
                value: false,
                translation: "properties.off"
              }
            },
            fixedScale: {
              type: "boolean",
              component: "switch",
              translation: "Fixed Scale",
              ref: "fixedScale",
              defaultValue: false,
              trueOption: {
                value: true,
                translation: "properties.on"
              },
              falseOption: {
                value: false,
                translation: "properties.off"
              }
            },
            minScale: {
              ref: "minScale",
              type: "number",
              label: "min. Scale Value",
              defaultValue: 0,
              expression: "optional",
              show: function (layout) {
                return layout.fixedScale;
              }
            },
            maxScale: {
              ref: "maxScale",
              type: "number",
              label: "max. Scale Value",
              defaultValue: 1,
              expression: "optional",
              show: function (layout) {
                return layout.fixedScale;
              }
            },
            meanScale: {
              ref: "meanScale",
              type: "number",
              label: "mean Scale Value",
              defaultValue: 0,
              expression: "optional",
              show: function (layout) {
                return layout.useMeanScale;
              }
            },
            maxGridColums: {
              ref: "maxGridColums",
              type: "integer",
              label: "Max. Columns for Grid",
              defaultValue: 18,
              expression: "optional"
            },
          }
        },
        design:{
          label: "Design",
          type: "items",
          items:{
            colors: {
              label: 'Color Schema',
              ref: "ColorSchema",
              type: "string",
              component: "item-selection-list",
              defaultValue: "#ffffe5, #fff7bc, #fee391, #fec44f, #fe9929, #ec7014, #cc4c02, #993404, #662506",
              items: [
                {
                  label: 'Sequential',
                  component: "color-scale",
                  value: "#ffffe5, #fff7bc, #fee391, #fec44f, #fe9929, #ec7014, #cc4c02, #993404, #662506",
                  colors: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]
                },
                {
                  label: "Qlik Sense Diverging",
                  component: "color-scale",
                  value: "#3C52A1, #3A82C4, #69ACDE, #9FD0F1, #CFEAFA, #EEDCC5, #F4AA73, #E67A56, #CD473E, #AE1C3E",
                  colors: ["#3C52A1", "#3A82C4", "#69ACDE", "#9FD0F1", "#CFEAFA", "#EEDCC5", "#F4AA73", "#E67A56", "#CD473E", "#AE1C3E"]
                },
                {
                  label: "Diverging RdYlBu",
                  component: "color-scale",
                  value: "#d73027, #f46d43, #fdae61, #fee090, #ffffbf, #e0f3f8, #abd9e9, #74add1, #4575b4",
                  colors: ["#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"]
                },
                {
                  label: "Diverging BuYlRd 5 values",
                  component: "color-scale",
                  value: "#d73027, #fdae61, #ffffbf, #abd9e9, #4575b4",
                  colors: ["#d73027", "#fdae61", "#ffffbf", "#abd9e9", "#4575b4"]
                },
                {
                  label: "Blues",
                  component: "color-scale",
                  value: "#f7fbff, #deebf7, #c6dbef, #9ecae1, #6baed6, #4292c6, #2171b5, #08519c, #08306b",
                  colors: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]
                },
                {
                  label: "Reds",
                  component: "color-scale",
                  value: "#fff5f0, #fee0d2, #fcbba1, #fc9272, #fb6a4a, #ef3b2c, #cb181d, #a50f15, #67000d",
                  colors: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"]
                },
                {
                  label: "YlGnBu",
                  component: "color-scale",
                  value: "#ffffd9, #edf8b1, #c7e9b4, #7fcdbb, #41b6c4, #1d91c0, #225ea8, #253494, #081d58",
                  colors: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58",]
                }
              ]
            },
            LabelColorPicker: {
              ref: "labelColor",
              label:"Label Color",
              component: "color-picker",
              dualOutput: true,
              type: "object",
              defaultValue: {
                index: -1,
                color: "#595959"
              }
            },
            showLegend: {
              type: "boolean",
              component: "switch",
              translation: "Show Legend",
              ref: "showLegend",
              defaultValue: true,
              trueOption: {
                value: true,
                translation: "properties.on"
              },
              falseOption: {
                value: false,
                translation: "properties.off"
              }
            },
            dim1LabelSize: {
              ref: "dim1LabelSize",
              type: "integer",
              label: "Dim1 Label Size (left)",
              defaultValue: 12
            },
            dim2LabelSize: {
              ref: "dim2LabelSize",
              type: "integer",
              label: "Dim2 Label Size (right/rotate left)",
              defaultValue: 2
            },
            tileOpacity: {
              ref: "tileOpacity",
              type: "number",
              component: "slider",
              labelText: "Tile Opacity",
              label: panelSliderLabel,
              defaultValue: 1,
              min: 0,
              max: 1,
              step: 0.02
            }
          }
        }
      }
    }
  }

};

export default definition;
