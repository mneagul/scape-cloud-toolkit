# -*- coding: utf-8 -*-
"""
Copyright 2014 Universitatea de Vest din Timișoara

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

@author: Marian Neagul <marian@info.uvt.ro>
@contact: marian@info.uvt.ro
@copyright: 2014 Universitatea de Vest din Timișoara
"""

import logging
import libcloud.security


class BaseController(object):
    def __init__(self, config):
        self.configObj = config
        self.config = None
        self.global_config = None
        self._initialized = False

    def init(self):
        pass

    def disable_ssl_check(self):
        # ToDo: Find a way to workaround in a sane way the warning
        # and not by disabling it
        import warnings

        warnings.filterwarnings("ignore", module="libcloud.httplib_ssl")
        libcloud.security.VERIFY_SSL_CERT = False

    def get_config_registry(self):
        return self.configObj.getSectionConfig("config")


    def _get_keypair_config_container(self):
        """This should go to the "cluster" module
        """
        return self.configObj.getSectionConfig("keypairs")


    def list_keypairs(self, **args):
        """This should go to the "cluster" module
        """
        name = args.get("name", None)
        all_keypairs = self.conn.list_key_pairs()
        keypairs = []
        for keypair in all_keypairs:
            if name is None:
                keypairs.append(keypair)
            elif keypair.name == name:
                keypairs.append(keypair)
            else:
                continue
        return keypairs


    def create_keypair(self, **kwargs):
        """This should go to the "cluster" module
        """
        log = logging.getLogger("create_keypair")
        name = kwargs.get("name")
        config = self._get_keypair_config_container()
        keypairs = self.list_keypairs(name=name)
        if keypairs:
            log.critical("Keypair %s already exists", name)
            return False
        keypair = self.conn.create_key_pair(name)
        keypair_section_name = "%s/" % name
        keypair_config = config.getSectionConfig(name)
        keypair_config['private_key'] = keypair.private_key
        keypair_config['public_key'] = keypair.public_key

        return True


    def console(self, node, name):
        log = logging.getLogger("cluster.console")
        if node is None:
            node = "management_node"
        else:
            node = "%s_%s" % (name, node)

        if not self.clusters_config.hasSection(name):
            log.error("Cluster %s does not exist", name)
            return False
        cluster_config = self.clusters_config.getSectionConfig(name)
        if "nodes" not in cluster_config:
            cluster_config["nodes"] = {}

        cluster_nodes_config = cluster_config.getSectionConfig("nodes")

        if not cluster_nodes_config.hasSection(node):
            log.error("Node %s is not part of cluster %s", node, name)
            return False

        node_configuration = cluster_nodes_config.getSectionConfig(node)
        node_id = node_configuration["instance_id"]
        keypair_name = cluster_config['main_keypair']

        running_nodes = [node['instance-id'] for node in self.cloud_controller.list_nodes()]

        if node_id not in running_nodes:
            log.critical("Node %s is not running", node_id)


        log.debug("Trying to gain console access to %s in cluster %s", node, name)

        if not self.cloud_controller.console(node_id, keypair_name):
            log.error("Failed connecting to node %s", node_id)

    def delete(self, name):
        log = logging.getLogger("cluster.delete")

        if name not in self.clusters_config.getChildSections():
            log.warn("No cluster with name '%s' to delete", name)
            return False

        cluster_config = self.clusters_config.getSectionConfig(name)
        if not cluster_config.getChildSections(): # Chimera cluster :)
            log.warn("Deleting chimera cluster '%s'", name)
            self.clusters_config.deleteSection(name)
            return True

        nodes_config = cluster_config.getSectionConfig("nodes")
        nodes = nodes_config.getChildSections()

        for node_name in nodes:
            node_value = nodes_config.getSectionConfig(node_name)
            node_instance_id = node_value['instance_id']
            log.info("Deleting node `%s` (%s)", node_name, node_instance_id)
            self.cloud_controller.terminate_node(node_instance_id)
        self.clusters_config.deleteSection(name)

        return True
