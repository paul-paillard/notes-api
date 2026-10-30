variable "aws_region" {
  description = "AWS region where everything is deployed."
  type        = string
  default     = "eu-west-3"
}

variable "project_name" {
  description = "Prefix used to name the resources."
  type        = string
  default     = "notes-api"
}
