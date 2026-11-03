resource "aws_security_group" "api" {
  name        = "${var.project_name}-api"
  description = "Security group for the API"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-api-sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "api_http" {
  for_each = toset(var.api_allowed_cidrs)

  security_group_id = aws_security_group.api.id
  cidr_ipv4         = each.value
  from_port         = var.api_port
  to_port           = var.api_port
  ip_protocol       = "tcp"
  description       = "Allow API traffic"
}

resource "aws_vpc_security_group_egress_rule" "api_all" {
  security_group_id = aws_security_group.api.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
  description       = "Allow all outbound traffic"
}

resource "aws_security_group" "db" {
  name        = "${var.project_name}-db"
  description = "Security group for the database"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-db-sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "db_from_api" {
  security_group_id            = aws_security_group.db.id
  referenced_security_group_id = aws_security_group.api.id
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
  description                  = "Allow PostgreSQL from the API"
}
