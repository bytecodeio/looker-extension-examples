# FLOORPLAN Extension

## Looker Deployment Instructions

### 1. Set Up a Datasource
1. Log in to your Looker instance as an admin.
2. Navigate to **Admin > Connections**.
3. Create a new connection for your database where the sample data will be stored.
4. Test the connection and save it.

### 2. Load the Sample Data
1. Use the provided `floorplan_sample_data` table schema to create a table in your database.
2. Populate the table with sample data. You can use a SQL script or a CSV import tool depending on your database.

### 3. Configure the View File
1. Add the `floorplan_sample_data.view` file to your Looker project.
2. Ensure the `sql_table_name` in the view file matches the name of the table in your database:
   ```plaintext
   sql_table_name: `your_database_name.your_schema_name.floorplan_sample_data` ;;
   ```

### 4. Add the View to a Model
1. Open your Looker project and locate the appropriate model file (e.g., `your_model.model.lkml`).
2. Add the `floorplan_sample_data` view to the model:
   ```plaintext
   include: "/path/to/floorplan_sample_data.view"
   
   explore: floorplan_sample_data {
     label: "Floorplan Sample Data"
   }
   ```

### 5. Configure the Manifest File
1. Update the `manifest.lkml` file to include the application configuration:
   ```plaintext
   application: floorplan {
     label: "Floorplan"
     file: "floorplan/floorplan_app.js"
     mount_points: {
       dashboard_vis: yes
     }
     entitlements: {
       external_api_urls: ["https://127.0.0.1:8080", "https://localhost:8080"]
     }
   }
   ```

### 6. Deploy the Application
1. Deploy the Looker project to production.
2. Navigate to a dashboard and add the visualization component using the `Floorplan` application.

### 7. Test the Visualization
1. Open the dashboard where the visualization is added.
2. Enter a valid Query ID and click submit to render the visualization.

For further assistance, refer to the Looker documentation or contact your Looker admin.
