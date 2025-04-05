import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { getCoverUrl } from "../services/bookService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const BookGraph = ({ books }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Set gradient background
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "background-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f5f7fa");
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#dbe9f4");

    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#background-gradient)");

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const nodes = books.map((book, index) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      themes: book.themes,
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
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    const link = svg.append("g")
      .attr("stroke", "#ccc")
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

    const imageSize = 60;

    // Tooltip div
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#1e1e2f")
      .style("color", "white")
      .style("border", "1px solid #444")
      .style("padding", "12px")
      .style("border-radius", "10px")
      .style("box-shadow", "0 4px 20px rgba(0,0,0,0.3)")
      .style("font-size", "14px")
      .style("z-index", 1000)
      .style("pointer-events", "auto");

    const node = svg.append("g")
      .selectAll("image")
      .data(nodes)
      .join("image")
      .attr("xlink:href", d => getCoverUrl(d.coverId))
      .attr("width", imageSize)
      .attr("height", imageSize)
      .attr("clip-path", "circle(30px at center)")
      .on("mouseover", (event, d) => {
        const goodreadsSearch = `https://www.goodreads.com/search?q=${encodeURIComponent(d.title + ' ' + d.author)}`;
        tooltip.style("visibility", "visible")
               .html(`
                <div style="text-align: left">
                  <div style="font-weight: bold; font-size: 16px; margin-bottom: 4px;">${d.title}</div>
                  <div style="margin-bottom: 6px;">by ${d.author}</div>
                  <div style="font-style: italic; color: #aaa; margin-bottom: 6px;">${d.themes.join(", ")}</div>
                  <a href="${goodreadsSearch}" target="_blank" rel="noopener noreferrer" style="color: #80bfff; text-decoration: underline;">View on Goodreads</a>
                </div>
               `);
      })
      .on("mousemove", event => {
        tooltip.style("top", (event.pageY - 10) + "px")
               .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      })
      .call(drag(simulation));

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.title)
      .attr("font-size", 10)
      .attr("dx", 35)
      .attr("dy", ".35em")
      .attr("fill", "#333")
      .attr("font-weight", "bold");

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
