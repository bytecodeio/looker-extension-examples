## Getting Started for Development

1. Clone or download a copy of this template to your development machine
2. Navigate (`cd`) to the template directory on your system
3. Install the dependencies with [Yarn](https://yarnpkg.com/).

   ```
   yarn install
   ```

   > You may need to update your Node version or use a [Node version manager](https://github.com/nvm-sh/nvm) to change your Node version.

4. Start the development server

   ```
   yarn start
   ```

   Great! Your extension is now running and serving the JavaScript at https://localhost:8080/bundle.js.

   > **Note:** The webpack development server runs with HTTPS by default. You may see a certificate warning in your browser which you'll need to accept to proceed.

   The default yarn start command runs with hot module replacement working. Some changes will cause a full reload of the extension iframe. When this happens the extension framework connection will break. You should see an error. You will need to do a full page reload of the outer page.

   To run without hot module replacement run `yarn start-no-hot`

5. Now log in to Looker and create a new project.

   This is found under **Develop** => **Manage LookML Projects** => **New LookML Project**.

   You'll want to select "Blank Project" as your "Starting Point". You'll now have a new project with no files.

6. In your copy of the extension tablet you have `manifest.lkml` file.

   You can either drag & upload this file into your Looker project, or create a `manifest.lkml` with the same content. Change the `id`, `label`, or `url` as needed.

   ```
    application: look-runner {
      label: "Look runner"
      url: "http://localhost:8080/bundle.js"
      entitlements: {
        local_storage: no
        navigation: no
        new_window: no
        allow_forms: no
        allow_same_origin: no
        core_api_methods: ["all_looks", "run_look"]
        external_api_urls: []
        oauth2_urls: []
      }
    }
   ```

7. Create a `model` LookML file in your project. The name doesn't matter although the convention is to use the name of the extension. The model and connection are used to secure access to the extension.

   - Add a [connection parameter](https://docs.looker.com/r/lookml/types/model/connection) to this model.
   - [Configure the model you created](https://docs.looker.com/r/develop/configure-model) so that it has access to the connection.

8. Connect your new project to Git. You can do this multiple ways:

   - Create a new repository on GitHub or a similar service, and follow the instructions to [connect your project to Git](https://docs.looker.com//r/api/pull-request)
   - A simpler but less powerful approach is to set up git with the ["Bare" repository](https://docs.looker.com/r/develop/bare-git-repo) option which does not require connecting to an external Git Service.

9. [Commit your changes](https://docs.looker.com/r/develop/commit-changes) and [deploy your them to production](https://docs.looker.com/r/develop/deploy-changes) through the Projects page UI.
10. Reload the page and click the `Browse` dropdown menu. You should see your extension in the list.
    - The extension will load the JavaScript from the `url` you provided in the `application` definition/
    - Reloading the extension page will bring in any new code changes from the extension template.

## Deployment

The process above requires your local development server to be running to load the extension code. To allow other people to use the extension, we can build the JavaScript file and include it in the project directly.

1. In your extension project directory on your development machine you can build the extension with `yarn build`.
2. Drag and drop the generated `dist/bundle.js` file into the Looker project interface
3. Modify your `manifest.lkml` to use `file` instead of `url`:
   ```
    application: look-runner {
      label: "Look runner"
      file: "bundle.js"
      entitlements: {
        local_storage: no
        navigation: no
        new_window: no
        allow_forms: no
        allow_same_origin: no
        core_api_methods: ["all_looks", "run_look"]
        external_api_urls: []
        oauth2_urls: []
      }
    }
   ```
