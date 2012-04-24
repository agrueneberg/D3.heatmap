(function (exports) {
    "use strict";

    /*global d3 */

 // Draws a heatmap.
 // @param {object} data
 // @param {object} options
 // @param {DOMElement} options.parentElement Parent element of the SVG element.
 // @param {number} options.width Width of the SVG element.
 // @param {number} options.height Height of the SVG element.
    exports.heatmap = function (data, options) {

        var parentElement, width, height, colorScale, numRects, rectWidth, rectHeight, svg;

     // Evaluate options and set defaults.
        options = options || {};
        parentElement = options.parentElement || document.body;
        width = options.width || 300;
        height = options.height || 300;

     // Create padded scale for the x axis.
        colorScale = d3.scale.linear()
                       .domain([-1, 0, 1])
                       .range(["green", "black", "red"]);

     // Capture the basics.
        numRects = Object.keys(data).length;
        rectWidth = width / numRects;
        rectHeight = height / numRects;

     // Set up the SVG element.
        svg = d3.select(parentElement)
                .append("svg:svg")
                .attr("width", width)
                .attr("height", height);

     // Prepare data.
        Object.keys(data).forEach(function (rowLabel, rowIndex) {
            var columnLabels, row;
            columnLabels = Object.keys(data[rowLabel]);
            row = [];
            columnLabels.forEach(function (columnLabel) {
                row.push(data[rowLabel][columnLabel]);
            });
         // Generate and append rectangles.
            svg.append("svg:g")
               .selectAll("rect")
               .data(row)
               .enter()
               .append("rect")
               .attr("x", function (d, columnIndex) {
                   return columnIndex * rectWidth;
                })
               .attr("y", function () {
                   return rowIndex * rectWidth;
                })
               .attr("width", rectWidth)
               .attr("height", rectHeight)
               .attr("fill", colorScale)
               .append("svg:title")
               .text(function (d, i) {
                    return rowLabel + "  and  " + columnLabels[i];
                });
        });

    };

}(window));
