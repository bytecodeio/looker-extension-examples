
project_name: "extension-typescript-template"

application: extension-typescript-template {
  label: "extension-typescript-template"
  url: "https://localhost:8080/bundle.js"
  # file: "bundle.js
  entitlements: {
    core_api_methods: ["me"] #Add more entitlements here as you develop new functionality
  }
}
