# Embed Arbitrary Site in an IFrame as a Looker Tile

Run `yarn install` and `yarn dev` to enter development mode.
To re-compile, run `yarn build`

To deploy, drag the /dist/embed_any_site.js file from your OS file browser into a lookml File Browser in development mode.

Create a manifest with these configurations to implement this app:

```plaintext
application: embed_any_site {
  label: "Embed Any Site"
  file: embed_any_site.js
  mount_points: {
    dashboard_vis: no
    dashboard_tile: yes
    standalone: no
  }
  entitlements: {
    local_storage: yes
    navigation: yes
    new_window: yes
    use_form_submit: yes
    use_embeds: yes
    use_iframes: yes
    core_api_methods: []
    oauth2_urls: ["https://*.looker.com"]
    external_api_urls: ["https://*.looker.com"]
  }
}
```
Commit & merge lookml to prod.
From there, you can add the extension as a dashboard tile! Configure & go.