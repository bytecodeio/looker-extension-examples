project_name: "kitchensink"

application: kitchensink {
  label: "Kitchen sink"
  url: "http://localhost:8080/bundle.js"
  entitlements: {
    local_storage: yes
    navigation: yes
    new_window: yes
    new_window_external_urls: []
    use_form_submit: yes
    use_embeds: yes
    use_iframes: yes
    use_clipboard: no
    core_api_methods: ["dashboard", "all_connections", "search_folders", "run_inline_query", "me", "all_roles", "run_query", "search_dashboards", "all_dashboards"]
    external_api_urls: []
    oauth2_urls: []
  }
}
