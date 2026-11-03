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

variable "api_port" {
  description = "Port the API container listens on."
  type        = number
  default     = 3000
}

variable "api_allowed_cidrs" {
  description = "CIDR blocks allowed to reach the API."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
