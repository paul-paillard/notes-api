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

variable "vpc_cidr" {
  description = "CIDR block of the VPC."
  type        = string
  default     = "10.0.0.0/16"
}
