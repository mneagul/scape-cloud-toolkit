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
from mjsrpc2.rpc import jsonmethod
from sct.cloud import CloudController
from sct.cluster import ClusterController
from sct.config import DatabaseConfigBackend


class APIApp(rpc.RPCBase):
    def __init__(self, cfg):
        rpc.RPCBase.__init__(self)
        self._cfg = cfg


    def _get_config_copy(self):
        return DatabaseConfigBackend(self._cfg._config_file)

    def _get_cloud(self):
        cc = CloudController(self._get_config_copy())
        cc.init()
        return cc


    def _get_cluster(self):
        cc = ClusterController(self._get_config_copy(), self._get_cloud())
        cc.init()
        return cc

    @jsonmethod
    def get_clusters(self):
        clusters = self._get_cluster().list_clusters()
        return clusters

    @jsonmethod
    def create_cluster(self, name):
        raise NotImplementedError()

    @jsonmethod
    def delete_cluster(self, name):
        raise NotImplementedError()

    @jsonmethod
    def get_cluster_info(self, name):
        raise NotImplementedError()

    @jsonmethod
    def add_cluster_node(self, cluster_name, node_type):
        raise NotImplementedError()

    @jsonmethod
    def delete_cluster_node(self, cluster_name, node_id):
        raise NotImplementedError()


def get_app(cfg):
    app = JsonRpcApplication()
    app.rpc = rpc.RPCService(APIApp(cfg))
    return app
