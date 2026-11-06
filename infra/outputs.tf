output "vpc_id" {
  description = "ID of the VPC."
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets."
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets."
  value       = aws_subnet.private[*].id
}

output "api_security_group_id" {
  description = "ID of the API security group."
  value       = aws_security_group.api.id
}

output "db_security_group_id" {
  description = "ID of the database security group."
  value       = aws_security_group.db.id
}

output "db_address" {
  description = "Hostname of the database."
  value       = aws_db_instance.main.address
}

output "db_port" {
  description = "Port of the database."
  value       = aws_db_instance.main.port
}

output "db_secret_arn" {
  description = "ARN of the Secrets Manager secret holding the database credentials."
  value       = aws_db_instance.main.master_user_secret[0].secret_arn
}

output "ecr_repository_url" {
  description = "URL of the ECR repository."
  value       = aws_ecr_repository.api.repository_url
}
