import React, { useEffect, useContext, useRef } from "react";
import { ExtensionContext } from "@looker/extension-sdk-react";
import { allColors } from "./colors";
import { getDisplayText, textDisplayOptions } from "./displayText";
import { FLOORPLAN_BASE64 } from './assets/floorplanBase64'; // Change this line

const chooseColor = (valueColorPairs, metricValue) => {
  let pair = valueColorPairs.find(pair => pair.value === metricValue);
  if (!pair || pair === undefined || !pair.color) {
    pair = valueColorPairs.find(pair => {
      if (pair.min !== undefined && pair.max !== undefined) {
        return metricValue >= pair.min && pair.max;
      }
    });
    return pair ? pair.color : null;
  }
  return pair.color;
};

const drawLegend = (ctx, colors, metricName) => {
  ctx.font = '42px Arial';
  
  const padding = 20;
  const boxSize = 20;
  const spacing = 40;
  const metricText = `${metricName}: `;
  const metricWidth = ctx.measureText(metricText).width;
  const metricRightPadding = 40;
  
  // Calculate width of each legend item
  const legendItemWidths = colors?.map(color => {
    return boxSize + padding + ctx.measureText(color.value).width + spacing;
  }) || [];
  
  const maxWidth = ctx.canvas.width * 0.9; // Use 90% of canvas width
  let totalWidth = metricWidth + metricRightPadding + padding;
  
  // Split items into rows
  const rows = [[]];
  let currentRow = 0;
  let currentRowWidth = totalWidth;
  
  colors?.forEach((color, index) => {
    const itemWidth = legendItemWidths[index];
    if (currentRowWidth + itemWidth > maxWidth && rows[currentRow].length > 0) {
      currentRow++;
      rows[currentRow] = [];
      currentRowWidth = totalWidth;
    }
    rows[currentRow].push({ color, width: itemWidth });
    currentRowWidth += itemWidth;
  });
  
  // Calculate total height needed for legend
  const rowHeight = boxSize + padding * 2;
  const totalHeight = rows.length * rowHeight;
  
  // Draw white background
  const bgStartY = 30;
  const leftMargin = padding * 2; // Add consistent left margin
  ctx.fillStyle = 'white';
  ctx.fillRect(padding, bgStartY, ctx.canvas.width - padding * 2, totalHeight + padding);
  
  // Draw legend rows
  rows.forEach((row, rowIndex) => {
    const rowY = bgStartY + rowHeight * rowIndex + padding;
    let currentX = leftMargin; // Start from left margin instead of center
    
    // Draw metric name only in first row
    if (rowIndex === 0) {
      ctx.fillStyle = 'black';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(metricText, currentX, rowY + boxSize/2);
      currentX += metricWidth + metricRightPadding;
    } else {
      // For subsequent rows, align with the items in the first row
      currentX = leftMargin + metricWidth + metricRightPadding;
    }
    
    // Draw legend items in this row
    row.forEach((item) => {
      ctx.fillStyle = item.color.legendColor;
      ctx.fillRect(currentX, rowY, boxSize, boxSize);
      ctx.fillStyle = 'black';
      ctx.fillText(item.color.value, currentX + boxSize + padding, rowY + boxSize / 2);
      currentX += item.width;
    });
  });
};

const drawTextInPolygon = (ctx, coordinates, text) => {
  try {
    if (!coordinates || coordinates.length === 0) {
      console.warn('No coordinates provided for text drawing');
      return;
    }
    // Add debug logging
    console.log('Drawing text:', text, 'at coordinates:', coordinates);
    
    const centerX = coordinates?.reduce((sum, coord) => sum + coord.x, 0) / coordinates.length;
    const centerY = coordinates?.reduce((sum, coord) => sum + coord.y, 0) / coordinates.length;
    ctx.fillStyle = 'black';
    ctx.font = 'bold 12px Arial'; // Reduced from 36px to 16px
    ctx.textAlign = 'center'; // Center align text horizontally
    ctx.textBaseline = 'middle';
    
    const lines = text.split('\n');
    const totalHeight = lines.length * 16; // Reduced line height to match font size
    const verticalOffset = 8; // Reduced offset to match new text size
    lines.forEach((line, index) => {
      ctx.fillText(line, centerX, centerY - totalHeight / 2 + (index * 16) + verticalOffset); // Adjust the y-coordinate for each line
    });
  } catch (error) {
    console.error('Failed to draw text in polygon:', error);
    throw error;
  }
};

const LegendComponent = ({ colorScheme }) => {
  if (!colorScheme || !colorScheme.colors) return null;
  
  return (
    <div style={{
      padding: '10px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'white',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '10px'
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {colorScheme.colors.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '12px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: item.legendColor,
              marginRight: '6px'
            }} />
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const HelloWorldVisComponent = () => {
  const { visualizationSDK, extensionSDK } = useContext(ExtensionContext);
  const canvasRef = useRef(null);
  const selectedMetricRef = useRef('availabilityRedGreen');
  const textDisplayRef = useRef('Office Only');

  const handleMetricChange = (event) => {
    console.log('Metric changed to:', event.target.value);
    selectedMetricRef.current = event.target.value;
    renderVisualization();
  };

  const handleTextDisplayChange = (event) => {
    console.log('Text display changed to:', event.target.value);
    textDisplayRef.current = event.target.value;
    renderVisualization();
  };

  const renderVisualization = async () => {
    try {
      console.log('Starting visualization render');
      
      if (!FLOORPLAN_BASE64) {
        console.error('Base64 image data is missing');
        extensionSDK?.rendered();
        return;
      }

      console.log('Loading image from Base64 data of length:', FLOORPLAN_BASE64.length);
      
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onerror = (error) => {
        console.error('Failed to load image:', error);
        console.error('Image source length:', img.src?.length);
        console.error('First 100 chars of source:', img.src?.substring(0, 100));
        extensionSDK?.rendered();
      };

      // Ensure we wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = FLOORPLAN_BASE64;
      });

      console.log('Image loaded successfully:', img.width, 'x', img.height);
      
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error('Canvas reference not available');
      }

      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Only process overlays if we have visualization data
      if (visualizationSDK?.visualizationData) {
        const queryResponse = visualizationSDK.queryResponse;
        const data = queryResponse.data;
        
        if (data && data.length > 0) {
          console.log('Drawing overlays');
          const colorScheme = allColors[selectedMetricRef.current];
          
          data.forEach((row, index) => {
            try {
              const coordinateList = row["floorplan_sample_data.coordinates"]?.value;
              const metricValue = row[colorScheme.column]?.value;
              const displayText = getDisplayText(row, textDisplayRef.current);
              
              console.log(`Processing overlay ${index + 1}:`, {
                coordinateList,
                metricValue,
                displayText
              });
              
              if (!coordinateList) {
                console.warn(`No coordinates for overlay ${index + 1}`);
                return;
              }

              // Parse coordinates more carefully
              const coordinates = coordinateList.split('|RECORD|')
                .filter(coord => coord.trim()) // Remove empty strings
                .sort((a, b) => parseInt(a.split(':')[0]) - parseInt(b.split(':')[0]))
                .map(coord => {
                  const [order, x, y] = coord.split(':').map(val => val.trim());
                  const parsedX = parseFloat(x);
                  const parsedY = img.height - parseFloat(y);
                  
                  // Validate coordinate values
                  if (isNaN(parsedX) || isNaN(parsedY)) {
                    console.error(`Invalid coordinates in overlay ${index + 1}:`, coord);
                    return null;
                  }
                  
                  return { x: parsedX, y: parsedY };
                })
                .filter(coord => coord !== null);

              console.log(`Processed coordinates for overlay ${index + 1}:`, coordinates);

              const fillColor = chooseColor(colorScheme.colors, metricValue);
              
              if (coordinates && coordinates.length > 2) { // Ensure we have at least 3 points for a polygon
                ctx.fillStyle = fillColor || 'rgba(255, 0, 0, 0.5)';
                ctx.beginPath();
                ctx.moveTo(coordinates[0].x, coordinates[0].y);
                for (let i = 1; i < coordinates.length; i++) {
                  ctx.lineTo(coordinates[i].x, coordinates[i].y);
                }
                ctx.closePath();
                ctx.fill();
                
                // Draw border for visibility
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                drawTextInPolygon(ctx, coordinates, displayText);
              } else {
                console.warn(`Not enough valid coordinates for overlay ${index + 1}`);
              }
            } catch (error) {
              console.error(`Failed to process overlay ${index + 1}:`, error);
            }
          });
        }
      }
      
      extensionSDK?.rendered();
    } catch (error) {
      console.error('Visualization rendering failed:', error);
      extensionSDK?.rendered();
    }
  };

  useEffect(() => {
    console.log('Visualization component mounted or data updated');
    renderVisualization();
  }, [visualizationSDK, visualizationSDK?.visualizationData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ marginRight: '20px' }}>
          <label htmlFor='metric' style={{ display: 'block', marginBottom: '5px' }}>Metric Options - Floor Plans</label>
          <select value={selectedMetricRef.current} onChange={handleMetricChange} id='metric' style={{ display: 'block' }}>
            {Object.keys(allColors).map(key => (
              <option key={key} value={key}>{allColors[key].name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor='textDisplay' style={{ display: 'block', marginBottom: '5px' }}>Display Option</label>
          <select value={textDisplayRef.current} onChange={handleTextDisplayChange} id='textDisplay' style={{ display: 'block' }}>
            {textDisplayOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <LegendComponent colorScheme={allColors[selectedMetricRef.current]} />
      <canvas ref={canvasRef} style={{ width: '100%', height: 'auto' }} />
    </div>
  );
};
