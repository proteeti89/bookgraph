import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { getCoverUrl } from "../services/bookService";

const BookGraph = ({ books }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const nodes = books.map((book, index) => ({
      id: book.id,
      title: book.title,
      coverId: book.coverId,
      group: index,
    }));

    const links = [];
    for (let i = 0; i < books.length; i++) {
      for (let j = i + 1; j < books.length; j++) {
        const sharedThemes = books[i].themes.filter(theme => books[j].themes.includes(theme));
        if (sharedThemes.length > 0) {
          links.push({
            source: books[i].id,
            target: books[j].id,
            value: sharedThemes.length
          });
        }
      }
    }

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

    const imageSize = 40;

    const node = svg.append("g")
      .selectAll("image")
      .data(nodes)
      .join("image")
      .attr("xlink:href", d => getCoverUrl(d.coverId))
      .attr("width", imageSize)
      .attr("height", imageSize)
      .attr("clip-path", "circle(20px at center)")
      .call(drag(simulation));

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.title)
      .attr("font-size", 10)
      .attr("dx", 20)
      .attr("dy", ".35em");

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("x", d => d.x - imageSize / 2)
        .attr("y", d => d.y - imageSize / 2);

      label
        .attr("x", d => d.x + imageSize / 2)
        .attr("y", d => d.y);
    });

    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  }, [books]);

  return <svg ref={svgRef} width={800} height={600}></svg>;
};

export default BookGraph;
