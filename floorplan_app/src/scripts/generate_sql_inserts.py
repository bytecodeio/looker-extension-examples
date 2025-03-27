import csv
import os
import base64

def format_value(value, column_name):
    """Format value based on column type"""
    if value == '':
        return 'NULL'
        
    # Detect if column is for PNG data
    if column_name.lower() == 'floorplan':
        try:  
            # For PNG data, convert hex to base64
            binary = bytes.fromhex(value)
            b64 = base64.b64encode(binary).decode('utf-8')
            return f"'{value}'"  # Keep as hex string
        except ValueError:
            return 'NULL'
            
    try:
        float(value)
        return value
    except ValueError:
        return f"'{value}'"

def get_bigquery_type(sample_value, column_name):
    """Determine BigQuery data type based on sample value and column name"""
    # Special handling for PNG/floorplan data column
    if column_name.lower() == 'floorplan':
        return 'STRING'  # Store PNG as hex string
        
    if sample_value == '':
        return 'STRING'
    try:
        float(sample_value)
        return 'FLOAT64'  # All numeric values as FLOAT64
    except ValueError:
        return 'STRING'

def generate_sql_inserts(csv_file, output_file):
    # Read CSV file
    with open(csv_file, 'r') as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        rows = list(reader)

    # Generate SQL
    sql = []
    sql.append("-- Create the floorplan data table")
    sql.append("CREATE TABLE IF NOT EXISTS looker_scratch.floorplan_sample_data (")
    
    # Generate column definitions
    columns = []
    for header in headers:
        col_name = header.lower().replace(' ', '_')
        
        # Get sample values and max length for type determination
        sample_values = [row[header] for row in rows if row[header]]
        max_length = max([len(str(val)) for val in sample_values]) if sample_values else 0
        sample_value = sample_values[0] if sample_values else ''
        
        # Get BigQuery type with column name
        bq_type = get_bigquery_type(sample_value, header)
        columns.append(f"    {col_name} {bq_type}")
    
    sql.append(',\n'.join(columns))
    sql.append(");")
    sql.append("")
    sql.append("-- Insert the data")
    sql.append("INSERT INTO looker_scratch.floorplan_sample_data VALUES")

    # Generate insert values
    values = []
    for row in rows:
        row_values = [format_value(row[header], header) for header in headers]
        values.append(f"({', '.join(row_values)})")
    
    sql.append(',\n'.join(values) + ';')

    # Write to file
    with open(output_file, 'w') as f:
        f.write('\n'.join(sql))

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(os.path.dirname(script_dir))
    
    csv_file = os.path.join(project_dir, 'src', 'floorplan_sample_data.csv')
    sql_file = os.path.join(project_dir, 'src', 'sql', 'create_floorplan_data.sql')
    
    generate_sql_inserts(csv_file, sql_file)
    print(f"SQL statements generated in {sql_file}")
