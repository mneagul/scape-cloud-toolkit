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

import sys

import logging
import cherrypy
import pkg_resources
from sct.webapi import get_app


class CloudToolkitWebServer(object):
    @cherrypy.expose
    def index(self):
        index_content = pkg_resources.resource_string(__name__, "resources/web/index.html")
        return index_content

def handle_server_cli(args, cfg):
    static_content_dir = pkg_resources.resource_filename(__name__, "resources/web/static/")
    ssl_check = args.disable_ssl_check

    config = {
        '/': {
            'tools.staticdir.debug': True,
        },
        '/static': {
            'tools.staticdir.dir': static_content_dir,
            'tools.staticdir.on': True,
        }
    }

    webapp = CloudToolkitWebServer()
    cherrypy.tree.mount(webapp, "/", config=config)
    cherrypy.tree.graft(get_app(cfg, ssl_check = ssl_check), "/api")
    cherrypy.config.update(config)
    logging.info("Satrating server...")
    cherrypy.engine.start()


