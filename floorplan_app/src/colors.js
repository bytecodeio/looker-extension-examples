export const stringColors = [
  { value: "Available soon", color: "rgba(212, 166, 200, 0.5)", legendColor: "rgb(212, 166, 200)" },
  { value: "Available", color: "rgba(160, 203, 232, 0.5)", legendColor: "rgb(160, 203, 232)" },
  { value: "Occupied", color: "rgba(186, 176, 172, 0.5)", legendColor: "rgb(186, 176, 172)" },
  { value: "Inactive", color: "rgba(255, 255, 255, 0.5)", legendColor: "rgb(255, 255, 255)" },
  { value: "Pending", color: "rgba(255, 218, 102, 0.5)", legendColor: "rgb(255, 218, 102)" },
];

export const availabilityBlueGrey = [
  { value: "Available soon", color: "rgba(212, 166, 200, 0.5)", hex: "#d4a6c8", legendColor: "rgb(212, 166, 200)" },
  { value: "Available", color: "rgba(160, 203, 232, 0.5)", hex: "#a0cbe8", legendColor: "rgb(160, 203, 232)" },
  { value: "Occupied", color: "rgba(186, 176, 172, 0.5)", hex: "#bab0ac", legendColor: "rgb(186, 176, 172)" },
  { value: "Inactive", color: "rgba(255, 255, 255, 0.5)", legendColor: "rgb(255, 255, 255)" },
  { value: "Pending", color: "rgba(255, 218, 102, 0.5)", legendColor: "rgb(255, 218, 102)" }
];

export const availabilityRedGreen = [
  { value: "Available soon", color: "rgba(212, 166, 200, 0.5)", hex: "#d4a6c8", legendColor: "rgb(212, 166, 200)" },
  { value: "Available", color: "rgba(160, 203, 232, 0.5)", hex: "#a0cbe8", legendColor: "rgb(160, 203, 232)" },
  { value: "Occupied", color: "rgba(89, 161, 79, 0.5)", hex: "#59a14f", legendColor: "rgb(89, 161, 79)" },
  { value: "Inactive", color: "rgba(255, 255, 255, 0.5)", legendColor: "rgb(255, 255, 255)" },
  { value: "Pending", color: "rgba(255, 218, 102, 0.5)", legendColor: "rgb(255, 218, 102)" }
];

export const listPriceSeat = [
  { value: "$450-500/Seat", min: 450, max: 500, color: "rgba(255, 218, 102, 0.5)", legendColor: "rgb(255, 218, 102)" },
  { value: "$500-1000/Seat", min: 500, max: 1000, color: "rgba(138, 206, 126, 0.5)", legendColor: "rgb(138, 206, 126)" },
  { value: "$>1000/Seat", min: 1000, max: 10000, color: "rgba(42, 87, 131, 0.5)", hex: "#2a5783", legendColor: "rgb(42, 87, 131)" }
];

export const listPriceLSF = [
  { value: "Higher (+25%)", min: 1.25, max: 100, color: "rgba(42, 87, 142, 0.5)", hex: "#2a578e", legendColor: "rgb(42, 87, 142)" },
  { value: "Higher (15-25%)", min: 1.15, max: 1.25, color: "rgba(115, 186, 103, 0.5)", hex: "#73ba67", legendColor: "rgb(115, 186, 103)" },
  { value: "Higher (5-15%)", min: 1.05, max: 1.15, color: "rgba(179, 224, 166, 0.5)", hex: "#b3e0a6", legendColor: "rgb(179, 224, 166)" },
  { value: "Average (+/-5%)", min: .95, max: 1.05, color: "rgba(255, 218, 102, 0.5)", hex: "#ffda66", legendColor: "rgb(255, 218, 102)" },
  { value: "Lower (5-15%)", min: .85, max: 0.95, color: "rgba(255, 190, 178, 0.5)", hex: "#ffbeb2", legendColor: "rgb(255, 190, 178)" },
  { value: "Lower (15-25%)", min: .75, max: 0.85, color: "rgba(248, 130, 107, 0.5)", hex: "#f8826b", legendColor: "rgb(248, 130, 107)" },
  { value: "Lower (25-50%)", min: .5, max: 0.75, color: "rgba(255, 35, 69, 0.5)", hex: "#ff2345", legendColor: "rgb(255, 35, 69)" },
  { value: "Lower (<-50%)", min: 0, max: 0.50, color: "rgba(234, 18, 58, 0.5)", hex: "#ea123a", legendColor: "rgb(234, 18, 58)" }
];

export const lsfSeat = [
  {  value: "Higher (+25%)", min: 1.25, max: 100, color: "rgba(42, 87, 142, 0.5)", hex: "#2a578e", legendColor: "rgb(42, 87, 142)" },
  {  value: "Higher (15-25%)", min: 1.15, max: 1.25, color: "rgba(115, 186, 103, 0.5)", hex: "#73ba67", legendColor: "rgb(115, 186, 103)" },
  {  value: "Higher (5-15%)", min: 1.05, max: 1.15, color: "rgba(179, 224, 166, 0.5)", hex: "#b3e0a6", legendColor: "rgb(179, 224, 166)" },
  {  value: "Average (+/-5%)", min: .95, max: 1.05, color: "rgba(255, 218, 102, 0.5)", hex: "#ffda66", legendColor: "rgb(255, 218, 102)" },
  {  value: "Lower (5-15%)", min: .85, max: 0.95, color: "rgba(255, 190, 178, 0.5)", hex: "#ffbeb2", legendColor: "rgb(255, 190, 178)" },
  {  value: "Lower (15-25%)", min: .75, max: 0.85, color: "rgba(248, 130, 107, 0.5)", hex: "#f8826b", legendColor: "rgb(248, 130, 107)" },
  {  value: "Lower (25-50%)", min: .5, max: 0.75, color: "rgba(255, 35, 69, 0.5)", hex: "#ff2345", legendColor: "rgb(255, 35, 69)" },
  {  value: "Lower (<-50%)", min: 0, max: 0.50, color: "rgba(234, 18, 58, 0.5)", hex: "#ea123a", legendColor: "rgb(234, 18, 58)" }
];

export const seats = [
  { value: "Higher (+25%)", min: 1.25, max: 100, color: "rgba(42, 87, 142, 0.5)", hex: "#2a578e", legendColor: "rgb(42, 87, 142)" },
  { value: "Higher (15-25%)", min: 1.15, max: 1.25, color: "rgba(115, 186, 103, 0.5)", hex: "#73ba67", legendColor: "rgb(115, 186, 103)" },
  { value: "Higher (5-15%)", min: 1.05, max: 1.15, color: "rgba(179, 224, 166, 0.5)", hex: "#b3e0a6", legendColor: "rgb(179, 224, 166)" },
  { value: "Average (+/-5%)", min: .95, max: 1.05, color: "rgba(255, 218, 102, 0.5)", hex: "#ffda66", legendColor: "rgb(255, 218, 102)" },
  { value: "Lower (5-15%)", min: .85, max: 0.95, color: "rgba(255, 190, 178, 0.5)", hex: "#ffbeb2", legendColor: "rgb(255, 190, 178)" },
  { value: "Lower (15-25%)", min: .75, max: 0.85, color: "rgba(248, 130, 107, 0.5)", hex: "#f8826b", legendColor: "rgb(248, 130, 107)" },
  { value: "Lower (25-50%)", min: .5, max: 0.75, color: "rgba(255, 35, 69, 0.5)", hex: "#ff2345", legendColor: "rgb(255, 35, 69)" },
  { value: "Lower (<-50%)", min: 0, max: 0.50, color: "rgba(234, 18, 58, 0.5)", hex: "#ea123a", legendColor: "rgb(234, 18, 58)" }
];

export const desirabilityScore = [
  { value: 1, color: "rgba(160, 203, 232, 0.5)", hex: "#a0cbe8", legendColor: "rgb(160, 203, 232)" },
  { value: 2, color: "rgba(72, 120, 166, 0.5)", hex: "#4878a6", legendColor: "rgb(72, 120, 166)" },
  { value: 3, color: "rgba(217, 179, 217, 0.5)", hex: "#d9b3d9", legendColor: "rgb(217, 179, 217)" },
  { value: 4, color: "rgba(225, 59, 66, 0.5)", hex: "#e13b42", legendColor: "rgb(225, 59, 66)" }
];

export const viewScore = [
  { value: "1", color: "rgba(160, 203, 232, 0.5)", hex: "#a0cbe8", legendColor: "rgb(160, 203, 232)" },
  { value: "2", color: "rgba(72, 120, 166, 0.5)", hex: "#4878a6", legendColor: "rgb(72, 120, 166)" },
  { value: "3", color: "rgba(217, 179, 217, 0.5)", hex: "#d9b3d9", legendColor: "rgb(217, 179, 217)" }
];

export const sunScore = [
  { value: "1", color: "rgba(160, 203, 232, 0.5)", hex: "#a0cbe8", legendColor: "rgb(160, 203, 232)" },
  { value: "2", color: "rgba(72, 120, 166, 0.5)", hex: "#4878a6", legendColor: "rgb(72, 120, 166)" },
  { value: "3", color: "rgba(217, 179, 217, 0.5)", hex: "#d9b3d9", legendColor: "rgb(217, 179, 217)" }
];

export const acousticsScore = [
  { value: "1", color: "rgba(160, 203, 232, 0.5)", hex: "#a0cbe8", legendColor: "rgb(160, 203, 232)" },
  { value: "2", color: "rgba(72, 120, 166, 0.5)", hex: "#4878a6", legendColor: "rgb(72, 120, 166)" },
  { value: "3", color: "rgba(217, 179, 217, 0.5)", hex: "#d9b3d9", legendColor: "rgb(217, 179, 217)" }
];

export const allColors = {
  'availabilityBlueGrey': {
    name: 'Availability (Blue-Grey)',
    column: 'floorplan_sample_data.office_status',
    colors: availabilityBlueGrey
  }, 'availabilityRedGreen': {
    name: 'Availability (Red-Green)',
    column: 'floorplan_sample_data.office_status',
    colors: availabilityRedGreen
  }, 'listPriceSeat': {
    name: 'List Price per Seat',
    column: 'floorplan_sample_data.list_price_per_seat',
    colors: listPriceSeat
  },
  'listPriceLSF': {
    name: 'List Price per LSF',
    column: 'floorplan_sample_data.list_price_per_lsf_ratio',
    colors: listPriceLSF
  },
  'lsfSeat': {
    name: 'LSF per Seat',
    column: 'floorplan_sample_data.lsf_per_seat_ratio',
    colors: lsfSeat
  },
  'seats': {
    name: 'Seats',
    column: 'floorplan_sample_data.seats_ratio',
    colors: seats
  },
  'desirabilityScore': {
    name: 'Desirability Score',
    column: 'floorplan_sample_data.desirability_score_numeric',
    colors: desirabilityScore
  },
  'viewScore': {
    name: 'View Score',
    column: 'floorplan_sample_data.view_score',
    colors: viewScore
  },
  'sunScore': {
    name: 'Sun Score',
    column: 'floorplan_sample_data.sun_score',
    colors: sunScore
  },
  'acousticsScore': {
    name: 'Acoustics Score',
    column: 'floorplan_sample_data.acoustics_score',
    colors: acousticsScore
  }
};
