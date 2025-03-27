provider "google" {
  project = var.project_id
}

module "project-services" {
  source                      = "terraform-google-modules/project-factory/google//modules/project_services"
  version                     = "14.2.1"
  disable_services_on_destroy = false

  project_id  = var.project_id
  enable_apis = true

  activate_apis = [
    "cloudresourcemanager.googleapis.com", 
    "cloudapis.googleapis.com",
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "run.googleapis.com",
    "iam.googleapis.com",
    "serviceusage.googleapis.com",
    "storage-api.googleapis.com",
    "storage.googleapis.com",
    "aiplatform.googleapis.com",
    "compute.googleapis.com"
  ]
}

resource "time_sleep" "wait_after_apis_activate" {
  depends_on      = [module.project-services]
  create_duration = "300s"
}


### Default Compute Engine Service Account Used; Will include permissions to call Vertex API's already

resource "google_cloud_run_v2_service" "default" {
  name     = var.cloud_run_service_name
  location = var.deployment_region
  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
        max_instance_count = 20
        min_instance_count = 1
    }
    session_affinity = true
    timeout = "300s"
    max_instance_request_concurrency = 80

    containers {
        image = var.docker_image

        env {
          name = "PROJECT"
          value = var.project_id
        }

        env {
          name = "REGION"
          value = var.deployment_region
        }

        resources {
            limits = {
                cpu = 1
                memory = "1024Mi"
            }
        }
    }
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_v2_service_iam_policy" "noauth" {
  location    = var.deployment_region
  project     = var.project_id
  name     = var.cloud_run_service_name

  policy_data = data.google_iam_policy.noauth.policy_data
  depends_on  = [google_cloud_run_v2_service.default]
}

# Return service URL
output "url" {
  value = "${google_cloud_run_v2_service.default.uri}"
}