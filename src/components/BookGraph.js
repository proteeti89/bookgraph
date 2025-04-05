// Here's the core D3 BookGraph component (BookGraph.js)

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card } from "@/components/ui/card";

export default function BookGraph({ books }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const nodes = books.map(book => ({ id: book.id, label: book.title }));
    const links = [];

    books.forEach((book, i) => {
      for (let j = i + 1; j < books.length; j++) {
        const commonThemes = book.themes.filter(theme => books[j].themes.includes(theme));
        if (commonThemes.length) {
          links.push({ source: book.id, target: books[j].id, label: commonThemes.join(", ") });
        }
      }
    });

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#aaa");

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 20)
      .attr("fill", "#86efac")
      .call(drag(simulation));

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", 5);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });
  }, [books]);

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

  return (
    <Card className="p-4">
      <svg ref={svgRef} width={600} height={400} className="border rounded" />
    </Card>
  );
}
