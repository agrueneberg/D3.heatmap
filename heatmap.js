(function (exports) {
    "use strict";

    /*jshint curly:false */
    /*global d3 */

    exports.heatmap = function () {

        var heatmap, width, height, xScale, yScale, colorScale, tooltip;

        width = 300;
        height = 300;

        xScale = d3.scale.ordinal();
        yScale = d3.scale.ordinal();
        colorScale = d3.scale.linear();

        tooltip = (function () {
            var body, tooltip;
            body = d3.select("body");
            tooltip = body.append("div")
                          .style("display", "none")
                          .style("position", "absolute")
                          .style("padding", "5px")
                          .style("background-color", "rgba(242, 242, 242, .6)")
            return {
                show: function (d) {
                    var mouse;
                    mouse = d3.mouse(body.node());
                    tooltip.style("display", null)
                           .style("left", (mouse[0] + 25) + "px")
                           .style("top", (mouse[1] - 10) + "px")
                           .html(d);
                },
                hide: function () {
                    tooltip.style("display", "none");
                }
            };
        }());

        heatmap = function (selection) {

            selection.each(function (data) {

                var labels, values, svg, squares;

             // Extract labels.
                labels = d3.keys(data);

             // Transform data.
                values = [];
                labels.map(function (rowLabel) {
                    labels.map(function (columnLabel) {
                        values.push([rowLabel, columnLabel, data[rowLabel][columnLabel]]);
                    });
                });

             // Update x scale.
                xScale.domain(labels)
                      .rangeBands([0, width]);

             // Update y scale.
                yScale.domain(labels)
                      .rangeBands([0, height]);

             // Update color scale.
                colorScale.domain([-1, 0, 1])
                          .range(["green", "black", "red"]);

             // Generate canvas.
                svg = d3.select(this)
                        .selectAll("svg")
                        .data([data]);

             // Generate chart template.
                svg.enter()
                   .append("svg")
                   .append("g");

             // Update dimensions.
                svg.attr("width", width)
                   .attr("height", height);

             // Generate squares.
                squares = svg.select("g")
                             .selectAll("rect")
                             .data(values, function (d) {
                                 return [d[0], d[1]];
                              });

                squares.enter()
                       .append("rect");

                squares.attr("x", function (d) {
                           return xScale(d[0]);
                        })
                       .attr("y", function (d) {
                           return yScale(d[1]);
                        })
                       .attr("width", function (d) {
                           return xScale.rangeBand();
                        })
                       .attr("height", function (d) {
                           return yScale.rangeBand();
                        })
                       .attr("fill", function (d) {
                           return colorScale(d[2]);
                        })
                       .on("mousemove", function (d) {
                           tooltip.show(d[0] + " and " + d[1] + ":<br>" + d[2]);
                        })
                       .on("mouseout", function (d) {
                           tooltip.hide();
                        });

                squares.exit()
                       .remove();

            });

        };

        heatmap.height = function (_) {
            if (!arguments.length) return height;
            height = _;
            return heatmap;
        };

        heatmap.width = function (_) {
            if (!arguments.length) return width;
            width = _;
            return heatmap;
        };

        heatmap.tooltip = function (_) {
            if (!arguments.length) return tooltip;
            tooltip = _;
            return heatmap;
        };

        return heatmap;

    };

}(window));
