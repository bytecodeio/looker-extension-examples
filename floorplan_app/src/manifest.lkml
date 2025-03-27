application: floorplan {
  label: "Floorplan"
  file: "floorplan/floorplan_app.js"
  # url: "https://localhost:8080/floorplan_app.js"
  mount_points: {
    dashboard_vis: yes
  }
  entitlements: {
    external_api_urls: ["https://127.0.0.1:8080","https://localhost:8080"]
  }
}