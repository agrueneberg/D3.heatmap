(function (exports) {
    "use strict";

    /*jshint curly:false */
    /*global d3 */

    exports.heatmap = function () {

        var heatmap, width, height, xScale, yScale, colorScale;

        width = 300;
        height = 300;

        xScale = d3.scale.ordinal();
        yScale = d3.scale.ordinal();
        colorScale = d3.scale.linear();

        heatmap = function (selection) {

            selection.each(function (data) {

                var labels, values, canvas;

             // Extract labels.
                labels = d3.keys(data);

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
                canvas = d3.select(this)
                           .selectAll("canvas")
                           .data([data]);

             // Generate chart template.
                canvas.enter()
                      .append("canvas");

             // Update dimensions.
                canvas.attr("width", width)
                      .attr("height", height);

                canvas.each(function (d) {
                    var ctx;
                    ctx = this.getContext("2d");
                    labels.forEach(function (l1, xi) {
                        labels.forEach(function (l2, yi) {
                            ctx.fillStyle = colorScale(data[l1][l2]);
                            ctx.fillRect (xScale(xi), yScale(yi), xScale.rangeBand(), yScale.rangeBand());
                        });
                    });
                    this.addEventListener("mousemove", function (e) {
                        var x, y;
                        x = Math.floor(e.offsetX / xScale.rangeBand());
                        y = Math.floor(e.offsetY / yScale.rangeBand());
                        this.title = labels[x] + " and " + labels[y];
                    });
                });

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

        return heatmap;

    };

}(window));
