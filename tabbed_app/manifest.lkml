

application: tabbed_dashboards_with_filters {
  label: "Tabbed Dashboards with Filters"
  # file: "Tabbed_Dashboards_With_Filters/tabbed_dashboard_filters_bundle.js"
  url: "https://localhost:8080/bundle.js"
  mount_points: {
    dashboard_tile: no
    standalone: yes
    dashboard_vis: no
  }
  entitlements: {
    local_storage: yes
    navigation: yes
    new_window: yes
    use_embeds: yes
    use_form_submit: yes
    core_api_methods: ["dashboard", "dashboard_dashboard_filters", "all_connections","search_folders", "run_inline_query","run_query", "me", "all_roles"]
  }
  
}
