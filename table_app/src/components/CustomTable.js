import React, { cloneElement, useMemo, useState, useEffect, useRef, useContext } from "react";
import { ExtensionContext } from "@looker/extension-sdk-react";
import styled from "styled-components";
import { useTable, useBlockLayout, useFlexLayout, useResizeColumns } from "react-table";

import "bootstrap/dist/css/bootstrap.min.css";
import { config } from "process";
import { Menu, MoreVert } from "@styled-icons/material-outlined";


// Function to generate CSS for column borders
const generateColumnBordersCSS = (columnBorders) => {
  if (!columnBorders) return "";

  const columns = columnBorders.split(",").map(Number);
  return columns.map(col => `
      thead th:nth-child(${col}),
      tbody td:nth-child(${col}) {
        border-right: 3px solid #ddd; /* Adjust the border style and color as needed */
      }
    `).join("\n");
};


// Function to generate CSS for row borders
const generateRowBordersCSS = (rowBorders, rowCount) => {
  if (!rowBorders) return "";

  const rows = rowBorders.split(",").map(Number);
  return rows.map(row => {
    const actualRow = row < 0 ? rowCount + row + 1 : row;
    return `
      tbody tr:nth-child(${actualRow}) {
        border-bottom: 3px solid #ddd; /* Adjust the border style and color as needed */
      }
    `;
  }).join("\n");
};



// Move the styled component definition outside of the Styles component
const StyledWrapper =  styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  #vis-container {
    height: 100%;
    max-height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    font-family: "Inter", sans-serif;
    font-weight: 400;
  }
  #vis {
    min-height: 500px;
  }
  body {
    font-family: "Inter", sans-serif !important;
  }
  .measure-header {
    text-align: center;
    pointer-events: none;
    cursor: default;
  }
  table {
    margin-top: -10px;
    /*margin-left: -20px;*/
  }

  thead > tr > th > .cell {
    ${(props) => props.headerStyles}
    /*display: flex;*/
    display:block;
    font-weight: 500;
    background-color: #dadef5;
    border-radius: 10px;
    margin: 0px 5px;
    border:0;
    padding: 5px 10px;
    min-height:60px;
  }

  /*tr > th:first-child {
    position: sticky !important;
    left: 0;
    z-index: 100;
  }*/

  /*tr > td:first-child {
    position: sticky;
    left: 0;
}*/

tr > td {
    border: none;
}

/*tr > td:first-child, th:first-child {
    border-right: 1px solid lightgrey;
    margin-right: 20px;
}*/

.frozen {
  position: sticky !important;
  z-index: 100;
  left: 0;
}

tr > td.frozen:nth-child(${(props) => props.noOfFrozen}), 
    th.frozen:nth-child(${(props) => props.noOfFrozen}) {
    border-right: 1px solid lightgrey;
}

  #vis > div > div > table > thead > tr > th:nth-child(1),
  #vis > div > div > table > thead > tr > th {
    ${(props) => props.headerStyles}
    display: flex;
  }

  thead > tr >th {
    border-bottom: none;
    padding: 0 !important;
    margin: 0;
    margin-bottom: 10px;
  }

  .table > thead {
    ${(props) => props.headerStyles}
    position: sticky;
    top: 0;
    z-index: 99;
  }

  .table > tbody {
    position:relative;
    z-index:1;
  }

  tbody > tr > td:first-child > .cell {
    background-color: #f0f3fc;
  }
  
  tbody > tr > td {
    margin:0;
    padding:0;
  }

  tbody > tr > td > .cell {
    ${(props) => props.rowStyles}
    vertical-align: middle;
    display: flex;
    align-items: center;
    min-height: 40px;
    padding: 8px 10px;
    color: #47416c;
    font-weight: 500;
    border: 0;
    border-radius:10px;
    margin: 5px 5px 2px 5px;
    background-color:#f5f4f6;
  }

  span.currency {
    color: #c0bfc0;
    font-weight: 500;
  }

  span.currency-value {
    margin: 0px 0px 0px auto;
  }

  span.td.cell {
    width: 100%;
  }

  #vis > div > div > table > tfoot > tr > td {
    ${(props) => props.headerStyles}
    display: flex;
  }

  .table > tfoot {
    ${(props) => props.headerStyles}
  }

    tfoot > tr > th {
    ${(props) => props.headerStyles}
    display: flex;
  }

  tfoot {
    position: sticky;
    bottom: 0;
    z-index: 99;
  }
  
  tfoot > tr > th > .cell {
    ${(props) => props.rowStyles}
    vertical-align: middle;
    display: flex;
    align-items: center;
    min-height: 40px;
    padding: 5px 10px;
    color: #47416c;
    font-weight: 500;
    background-color: #dadef5;
    border-radius: 10px;
    margin: 0px 5px;
    border: none;
    width:100%;
  }

  tfoot > tr > th {
    margin: 0;
    padding: 2px 0 0 0 !important;
    border-top: 0 !important;
    border-bottom: 0 !important;
  }

  .td {
    display: flex;
    align-items: center;
  }

  tbody > tr:last-child > td {
    border-bottom: none;
  }

  tfoot > tr > th {
    border-top: 1px solid #f1f0f0;
    border-bottom: 1px solid #f1f0f0;
  }

  svg {
    max-height:35px;
    width:80%;
  }

  a {
    color: inherit;
    text-decoration: none;
    cursor: default;
  } 

  .headers {
    display:grid;
  }

  .subheader {
    font-weight: 400;
    font-size: 14px;
  }
  
  .resizer {
    display: inline-block;
    background: #FFF;
    width: 3px;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    -webkit-transform: translateX(50%);
    -ms-transform: translateX(50%);
    transform: translateX(50%);
    z-index: 1;
    touch-action: none;
    opacity: 0
}

.resizer:hover {
    background-color: lightgray;
    opacity: 1;
}

.headers {
  cursor:pointer;
}
.menu {
  margin-left:auto;
  visibility: hidden;
  cursor:pointer;
}


span.th.cell:hover > .menu {
    visibility: visible;
}

.popover-container {
    position: relative;
}

.popover-container > button > svg {
  width: 20px;
}
.popover-container > button {
    border: none;
    background: inherit;
    margin: 0;
    padding: 0;
}

div#popover-content {
    position: absolute;
    max-width: 200px;
    background-color: white;
    z-index: 1;
    margin: auto;
    border: 1px solid lightgrey;
    padding: 5px;
    min-width: 150px;
    left: -60px;
}

button.menu-item {
    border: none;
    background: white;
    width: 100%;
    text-align: left;
}

button.menu-item:hover {
    background: #ededed;
}

  ${(props) => props.columnBordersCSS}
  ${(props) => props.rowBordersCSS}
  ${(props) => props.generalCSS}
`;

const TableTitle = styled.h2`
  font-family: "Inter", sans-serif;
  margin-bottom: 1rem;
  font-size: 1.25rem;
`;

const Styles = ({ children, config, rowCount, noOfFrozen }) => {
  const { headerStyles, rowStyles, generalCSS, borderBetweenColumns, borderBetweenRows } = config;

  const columnBordersCSS = useMemo(() => generateColumnBordersCSS(borderBetweenColumns), [borderBetweenColumns]);
  const rowBordersCSS = useMemo(() => generateRowBordersCSS(borderBetweenRows, rowCount), [borderBetweenRows, rowCount]);

  return (
    <StyledWrapper
      headerStyles={headerStyles}
      rowStyles={rowStyles}
      generalCSS={generalCSS}
      columnBordersCSS={columnBordersCSS}
      rowBordersCSS={rowBordersCSS}
      noOfFrozen={noOfFrozen}
    >
      {children}
    </StyledWrapper>
  );
};


function Table({ columns, data, config, total, queryResponse, handleDragOver, handleDragStart, allowDrop, updateColumnFreeze }) {

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 140,
      width: 200,
      maxWidth: 400,
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups,footerGroups, rows, prepareRow, state, resetResizing } =
    useTable(
      {
        columns,
        data,
        defaultColumn,
        // Remove sorting options
      },
      // Remove useSortBy,
      useFlexLayout,
      useResizeColumns
    );

  return (
    <>
      <div>
        <table {...getTableProps()}
          className={`table ${config.tableBordered ? 'bordered' : config.unsetTable ? 'unsetTable' : config.fixedHeight ? 'fixedHeight' : ''}`}>

          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="tr">
                {headerGroup.headers.map((column, index) => (
                  <th {...column.getHeaderProps({style:{left:column.frozen?column.freezeLeft:0}})} className={`th report ${column.headerClassName || ''}  ${column.frozen? "frozen":""}`}
                  key={column.id} name={column.key}
                  //draggable
                  //onDragStart={(e) => handleDragStart(e,index)}
                  //onDragOver={allowDrop}
                  //onDrop={(e) => handleDragOver(e,index)}
                  >
                    <span className="th cell" style={{display:'flex'}}>
                      <div className="headers"                      
                        draggable
                        onDragStart={(e) => handleDragStart(e,index)}
                        onDragOver={allowDrop}
                        onDrop={(e) => handleDragOver(e,index)}        
                      >
                        {column.render("Header")}
                        {/* Remove sort indicator */}

                        <span className="subheader">{column.render("SubHeader")}</span>
                      </div>

                      <span className="menu">
                        <Popover 
                          children={<MoreVert />} 
                          content={<button className="menu-item" onClick={() => updateColumnFreeze(column.key, !column.frozen)}>{column.frozen? "Unfreeze": "Freeze"}</button>}/>
                      </span>  
                    </span>                    
                    <div
                        {...column.getResizerProps()}
                        className={`resizer ${column.isResizing ? "isResizing" : ""}`}
                    />
                    

                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="tr">
                  {row.cells.map((cell,i) => {
                   
                    const cellProps = cell.getCellProps({style:{left:cell.column.frozen?cell.column.freezeLeft:0}});
                    return (
                      <td {...cellProps} className={`td ${cell.column.frozen? "frozen":""}`} >
                          {cell.render("Cell")}
                      </td> 
                    )
                  })}
                </tr>
              );
            })}
          </tbody>
          {queryResponse?.totals_data &&
            <tfoot>
              {footerGroups.map((footerGroup) => (
                <tr {...footerGroup.getFooterGroupProps()} className="tr">
                  {footerGroup.headers.map((column) => (
                    <th {...column.getFooterProps({style:{left:column.frozen?column.freezeLeft:0}})} className={`th ${column.headerClassName || ''}${column.frozen? "frozen":""}`}>
                      <span className="th cell">
                        {column.render("Footer")}
                        {/* Remove sort indicator */}
                        <div
                          {...column.getResizerProps()}
                          className={`resizer ${column.isResizing ? "isResizing" : ""}`}
                        />
                      </span>

                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          }
        </table>
      </div>
    </>
  );
}

const Popover = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false); // Manages the visibility state of the popover
  const popoverRef = useRef(null); // Reference to the popover element
  const triggerRef = useRef(null); // Reference to the button element that triggers the popover

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target) &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsVisible(false); // Close the popover if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="popover-container">
      <button
        ref={triggerRef}
        onClick={toggleVisibility}
        className="popover-trigger"
        aria-haspopup="true"
        aria-expanded={isVisible}
        aria-controls="popover-content"
      >
        {children}
      </button>
      {isVisible && (
        <div
          id="popover-content"
          ref={popoverRef}
          className="popover-content"
          role="dialog"
          aria-modal="true"
        >
          {content}
        </div>
      )}
    </div>
  );
};

// Function to parse CSS string into an object
const parseCSSString = (cssString) => {
  return cssString.split(';').reduce((acc, style) => {
    if (style.trim()) {
      const [key, value] = style.split(':');
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});
};


export const CustomTable = ({ data, updateColumnOrder, updateColumnFreeze }) => {
  const {visualizationSDK, visualizationData, extensionSDK} = useContext(ExtensionContext);
  const queryResponse = visualizationData?.queryResponse;
  const config = visualizationData?.visConfig;
  const dimensionKeys = queryResponse.fields.dimension_like || [];
  const measureKeys = queryResponse.fields.measure_like || [];
  const fields = dimensionKeys.concat(measureKeys);
  let sortOrder = config?.columnOrder

  console.log("query", queryResponse)

  const [headerList, setHeaderList] = useState([] || null)
  const [noOfFrozen, setNoOfFrozen] = useState(0)

  const getCurrencyElement = (value, isHtml) => {
  return <span className="td currency-cell" style={{width:'100%'}}>
      <span className="currency">$</span>
      {isHtml? 
        <span className="currency-value" dangerouslySetInnerHTML={{__html:value}}></span>
        :
        <span className="currency-value">{value}</span>
      }
    </span>
  }

  const handleDragStart = (e, columnIndex) => {
    e.dataTransfer.setData('columnIndex', columnIndex);
  };

  const allowDrop= (e, columnIndex) =>  {
      e.preventDefault();
  }

  const handleDragOver = (e, columnIndex) => {
      e.preventDefault();
      const dragIndex = e.dataTransfer.getData('columnIndex');
      if (dragIndex !== columnIndex) {
          const newColumns = [...headerList];
          const [draggedColumn] = newColumns.splice(dragIndex, 1);
          newColumns.splice(columnIndex, 0, draggedColumn);
          sortOrder = newColumns.map(({key}) => key);
          updateColumnOrder(newColumns.map(({key}) => key));
          setHeaderList(newColumns);
      }
  };

  const getFooterValue = (key,index,field) => {    
    if (queryResponse?.totals_data) {
      if (field?.category == "dimension") {
        if (index == 0) {
          return 'Total'
        }
        return ' '
      }
      let total = queryResponse.totals_data[key];
      let row;
      if (total?.html) {
        let value = total.html;
        if (typeof value == "string" && value?.indexOf("$") > -1) {
          value = getCurrencyElement(value.replace("$", ''), true)
        } else {
          value = <span dangerouslySetInnerHTML={{__html:value}}></span>
        }
        row = value;
      }
      else if (total?.rendered) {
        let value = total.rendered;
        if (typeof value == "string" && value?.indexOf("$") > -1) {
          value = getCurrencyElement(value.replace("$", ''), false)
        }
        row = value;
      }
      else if (total?.value) {
        let value = total.value;
        if (typeof value == "string" && value?.indexOf("$") > -1) {
          value = getCurrencyElement(value.replace("$", ''), false)
        }
        row = value;
      }
      return row;
    }
  }

  const getHeaders = (key, index,field, defaultWidth, freeze, freezeLeft) => {    
    if (field) {
      let override = config[`name_${field.name}`]
      let subHeader = config[`subheader_${field.name}`];
      let footerValue = getFooterValue(key,index, field);
      return {
          Header: override || field?.label_short || field?.label,
          Footer: footerValue,
          accessor: row => row[key]?.rendered? row[key]?.rendered : row[key]?.value,
          Cell: ({ value }) => {
            if (typeof value == "string" && value?.indexOf("$") > -1) {
              return(              
                <span className="td cell">
                  <span className="td currency-cell" style={{ width: '100%' }}>
                    <span className="currency">$</span>
                    <span className="currency-value">{value.replace("$", "")}</span>
                  </span>
                </span>
              )
            }
            return <span className="td cell">{value}</span>          
          },
          maxWidth: 400,
          minWidth: 140,
          width: defaultWidth,
          id: index,
          frozen: freeze || false,
          key: key,
          SubHeader: subHeader || "",
          freezeLeft: freezeLeft
      }
    }
    return;
  }


  const columns = useMemo(
    () => {
      let _sortOrder = sortOrder;
      let keys = Object.keys(data[0]);
      if (keys && _sortOrder?.length > 0) {
        keys = keys.sort((a,b) => {
          let freezeA = config[`freeze_${a}`] || false;
          let freezeB = config[`freeze_${b}`] || false;
          if (freezeA < freezeB) return 1;
          if (freezeA > freezeB) return -1;
          else {
            return _sortOrder.indexOf(a) - _sortOrder.indexOf(b)
          }
          //return 
        })
      }
      extensionSDK.rendered()
      let freezeLeft = 0;
      return keys.map((key, index) => {
        let field = fields.find(({name}) => name == key);
        let freeze = config[`freeze_${field.name}`]
        let defaultWidth = config[`width_${field.name}`]; 
        let headers = getHeaders(key, index, field, defaultWidth, freeze, freezeLeft)          
        if (freeze) {
          freezeLeft += defaultWidth;
        }   
        return headers;
 
      }).filter(header => {return header})
    }
  ,[dimensionKeys,measureKeys,config,data,sortOrder])
  

  useEffect(() => {    
    let cols = [...columns];
    let noOfFrozen = cols.filter((col) => (
      col.frozen == true
    ))
    setNoOfFrozen(noOfFrozen?.length);
    setHeaderList(cols);
  },[columns])

  return (
    <Styles config={config} rowCount={data.length} noOfFrozen={noOfFrozen}>
      <Table
        config={config}
        columns={headerList}
        data={data}
        queryResponse={queryResponse}
        handleDragOver={handleDragOver}
        handleDragStart={handleDragStart}
        allowDrop={allowDrop}
        updateColumnFreeze={updateColumnFreeze}
      />
    </Styles>
  );
}