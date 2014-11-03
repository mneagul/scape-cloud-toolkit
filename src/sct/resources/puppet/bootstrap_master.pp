class { 'puppetdb':
  listen_address => "0.0.0.0",
  ssl_listen_address => "$ec2_local_hostname",
}
class {'puppetdb::master::config': puppetdb_server => "$ec2_local_hostname"}