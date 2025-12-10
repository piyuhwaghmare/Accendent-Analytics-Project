import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ImpactDiagramProps {
  angle: number;
  speedA: number;
  speedB: number;
}

const ImpactDiagram: React.FC<ImpactDiagramProps> = ({ angle, speedA, speedB }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw Intersection
    const roadWidth = 80;
    
    // Vertical Road (Main St)
    svg.append("rect")
      .attr("x", centerX - roadWidth / 2)
      .attr("y", 0)
      .attr("width", roadWidth)
      .attr("height", height)
      .attr("fill", "#334155");

    // Horizontal Road (4th Ave)
    svg.append("rect")
      .attr("x", 0)
      .attr("y", centerY - roadWidth / 2)
      .attr("width", width)
      .attr("height", roadWidth)
      .attr("fill", "#334155");

    // Road Markings (Dashed Lines)
    svg.append("line")
      .attr("x1", centerX)
      .attr("y1", 0)
      .attr("x2", centerX)
      .attr("y2", height)
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");

    svg.append("line")
      .attr("x1", 0)
      .attr("y1", centerY)
      .attr("x2", width)
      .attr("y2", centerY)
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");

    // Vehicle A (Defendant - Red) - Coming from Bottom (Northbound)
    // Simulating impact point at center
    const carWidth = 20;
    const carLength = 35;

    // Arrow marker
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#ef4444")
      .style("stroke", "none");

    svg.append("defs").append("marker")
      .attr("id", "arrowhead-blue")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#3b82f6")
      .style("stroke", "none");

    // Draw Vector A
    svg.append("line")
      .attr("x1", centerX - 20)
      .attr("y1", height - 20)
      .attr("x2", centerX - 20)
      .attr("y2", centerY + 30)
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 3)
      .attr("marker-end", "url(#arrowhead)");

    // Vehicle A Rect
    svg.append("rect")
      .attr("x", centerX - 20 - carWidth/2)
      .attr("y", centerY + 10)
      .attr("width", carWidth)
      .attr("height", carLength)
      .attr("fill", "#ef4444")
      .attr("rx", 3);

    // Vehicle B (Plaintiff - Blue) - Coming from Left (Eastbound)
    // Draw Vector B
    svg.append("line")
      .attr("x1", 20)
      .attr("y1", centerY + 20)
      .attr("x2", centerX - 30, centerY + 20)
      .attr("y2", centerY + 20)
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 3)
      .attr("marker-end", "url(#arrowhead-blue)");
      
    // Vehicle B Rect
    svg.append("rect")
      .attr("x", centerX - 40)
      .attr("y", centerY + 20 - carWidth/2)
      .attr("width", carLength)
      .attr("height", carWidth)
      .attr("fill", "#3b82f6")
      .attr("rx", 3);

    // Impact Star
    const star = d3.symbol().type(d3.symbolStar).size(400);
    svg.append("path")
      .attr("d", star)
      .attr("transform", `translate(${centerX - 10},${centerY + 15})`)
      .attr("fill", "#f97316")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1)
      .classed("animate-pulse", true);

    // Labels
    svg.append("text")
      .attr("x", centerX - 35)
      .attr("y", height - 10)
      .text(`Veh A: ${speedA}mph`)
      .attr("fill", "#ef4444")
      .attr("font-size", "12px")
      .attr("font-family", "monospace");

    svg.append("text")
      .attr("x", 10)
      .attr("y", centerY + 45)
      .text(`Veh B: ${speedB}mph`)
      .attr("fill", "#3b82f6")
      .attr("font-size", "12px")
      .attr("font-family", "monospace");

  }, [angle, speedA, speedB]);

  return (
    <div className="relative border border-slate-700 bg-slate-900 rounded-lg overflow-hidden shadow-inner">
      <div className="absolute top-2 left-2 text-xs text-slate-400 font-mono">FIG 1.1 - AERIAL RECONSTRUCTION</div>
      <svg ref={svgRef} width="100%" height="300" viewBox="0 0 400 300" className="w-full h-full" />
    </div>
  );
};

export default ImpactDiagram;