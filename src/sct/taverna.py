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

from sct.templates.base import DefaultNodeTemplate


class TavernaNodeTemplate(DefaultNodeTemplate):
    puppet_parent_node = None

    def __init__(self, *args, **kwargs):
        DefaultNodeTemplate.__init__(self, *args, **kwargs)


    def get_puppet_node_specification(self, dns_name):
        return (self.puppet_parent_node, "")


class TavernaServer(TavernaNodeTemplate):
    shortName = "tavernaServer"
    puppet_parent_node = "taverna_server"

    def __init__(self, *args, **kwargs):
        TavernaNodeTemplate.__init__(self, *args, **kwargs)

