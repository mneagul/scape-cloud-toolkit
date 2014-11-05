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

from jsonrpc2 import JsonRpcApplication
from mjsrpc2 import rpc
from mjsrpc2.rpc import jsonmethod, jsonattribute

from sct.cloud import CloudController
from sct.cluster import ClusterController
from sct.config import DatabaseConfigBackend
from sct.templates import get_available_templates, get_available_templates_detail


class APIApp(rpc.RPCBase):
    def __init__(self, cfg, ssl_check=True):
        rpc.RPCBase.__init__(self)
        self._ssl_check = True
        self._cfg = cfg


    def _get_config_copy(self):
        return DatabaseConfigBackend(self._cfg._config_file)

    def _construct_cloud(self):
        cc = CloudController(self._get_config_copy())
        cc.disable_ssl_check()
        cc.init()
        return cc

    def _construct_cluster_handler(self):
        cc = ClusterController(self._get_config_copy(), self._construct_cloud())
        cc.disable_ssl_check()
        cc.init()
        return cc


    @jsonmethod
    def get_clusters(self):
        clusters = self._construct_cluster_handler().list_clusters()
        return clusters

    @jsonmethod
    @jsonattribute("name", kind=str, documentation="Name of the cluster")
    @jsonattribute("image", kind=str, documentation="The machine image id to use")
    @jsonattribute("size", kind=str, documentation="The machine size")
    @jsonattribute("security_group", kind=str, documentation="The security group")
    @jsonattribute("module_repository_url", kind=str,
                   documentation="The URL of the GIT repository containing Pupept recipes")
    @jsonattribute("module_repository_branch", kind=str, documentation="The repository branch")
    @jsonattribute("module_repository_tag", kind=str, documentation="The repository tag")
    def create_cluster(self, name, image, size, security_group, module_repository_url, module_repository_branch,
                       module_repository_tag):
        cluster_handler = self._construct_cluster_handler().create(name, image, size, security_group,
                                                                   module_repository_url, module_repository_branch,
                                                                   module_repository_tag)

    @jsonmethod
    @jsonattribute("name", kind=str, documentation="Name of the cluster")
    def delete_cluster(self, name):
        self._construct_cluster_handler().delete(name)
        return True

    @jsonmethod
    @jsonattribute("name", kind=str, documentation="Name of the cluster")
    def get_cluster_info(self, name):
        cluster_info = self._construct_cluster_handler().info(name)
        return cluster_info

    @jsonmethod
    @jsonattribute("cluster_name", kind=str, documentation="Name of the cluster")
    @jsonattribute("template_name", kind=str, documentation="The name of the template")
    def add_cluster_node(self, cluster_name, template_name):
        cluster_handler = self._construct_cluster_handler()
        ret = cluster_handler.add_node(template_name, cluster_name)
        return ret

    @jsonmethod
    def delete_cluster_node(self, cluster_name, node_id):
        raise NotImplementedError()

    @jsonmethod
    def get_node_templates(self):
        return get_available_templates()

    @jsonmethod
    def get_node_templates_detail(self):
        return get_available_templates_detail()


def get_app(cfg, ssl_check=True):
    app = JsonRpcApplication()
    app.rpc = rpc.RPCService(APIApp(cfg, ssl_check))
    return app
