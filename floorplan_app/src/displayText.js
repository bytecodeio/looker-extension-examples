export const textDisplayOptions = [
  'Default',
  'Standard',
  'Price only',
  'Office Only',
  'Seats Only',
  'None',
  'Occupied',
  'For PDFs'
];

const getRenderedValue = (row, column) => {
  return row[column]?.rendered || row[column]?.value || '';
};

export const getDisplayText = (row, textDisplay) => {
  switch (textDisplay) {
    case 'Default':
      return `#${getRenderedValue(row, "floorplan_sample_data.office_number")} / ${getRenderedValue(row, "floorplan_sample_data.seats")}
${getRenderedValue(row, "floorplan_sample_data.two_yr_price")}`;
    case 'Standard':
      return `#${getRenderedValue(row, "floorplan_sample_data.office_number")} / ${getRenderedValue(row, "floorplan_sample_data.seats")}
${getRenderedValue(row, "floorplan_sample_data.two_yr_price")}`;
    case 'Price only':
      return getRenderedValue(row, "floorplan_sample_data.two_yr_price");
    case 'Office Only':  
      return `#${getRenderedValue(row, "floorplan_sample_data.office_number")}
${getRenderedValue(row, "floorplan_sample_data.two_yr_price")}`;
    case 'Seats Only':
      return `${getRenderedValue(row, "floorplan_sample_data.seats")}
${getRenderedValue(row, "floorplan_sample_data.two_yr_price")}`;
    case 'None':
      return '';
    case 'Occupied':
      return `${row["floorplan_sample_data.office_status"].value === 'Occupied' ? 'X' : ''}
${getRenderedValue(row, "floorplan_sample_data.list_price_per_seat")}`;
    case 'For PDFs':
      return `#${getRenderedValue(row, "floorplan_sample_data.office_number")} / ${getRenderedValue(row, "floorplan_sample_data.seats")}
${getRenderedValue(row, "floorplan_sample_data.two_yr_price")}`;
    default:
      return '';
  }
};
