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

import os
import sys
import logging
import sqlite3
from os.path import expanduser, join

import yaml


CONFIG_FILE = join(expanduser("~"), "sct.scape.db")

EUCA_VAR_MAPS = {
    'ec2_url': 'EC2_URL',
    's3_url': 'S3_URL',
    'euare_url': 'EUARE_URL',
    'token_url': 'TOKEN_URL',
    'aws_auto_scaling_url': 'AWS_AUTO_SCALING_URL',
    'aws_cloudwatch_url': 'AWS_CLOUDWATCH_URL',
    'eustore_url': 'EUSTORE_URL',
    'ec2_account_number': 'EC2_ACCOUNT_NUMBER',
    'ec2_access_key': 'EC2_ACCESS_KEY',
    'ec2_secret_key': 'EC2_SECRET_KEY',
    'aws_access_key': 'AWS_ACCESS_KEY',
    'aws_secret_key': 'AWS_SECRET_KEY',
    'ec2_user_id': 'EC2_USER_ID'

}
EUCA_BLOB_VAR_MAPS = {
    'ec2_private_key': 'EC2_PRIVATE_KEY',
    'ec2_cert': 'EC2_CERT',
    'eucalyptus_cert': 'EUCALYPTUS_CERT',
    'aws_credential_file': 'AWS_CREDENTIAL_FILE'
}


def argparse_euca_helper(parse):
    import argparse

    for key in EUCA_VAR_MAPS:
        parse.add_argument("--%s" % key, type=str, default=None)

    for key in EUCA_BLOB_VAR_MAPS:
        parse.add_argument("--%s" % key, type=argparse.FileType("r"))


class BaseConfig(object):
    def __init__(self, config_file, prefix="/"):
        log = logging.getLogger(__name__)
        log.debug("Creating BaseConfig with prefix %s from file %s", prefix, config_file)
        self.loaded = False
        self._config_file = os.path.expanduser(config_file)
        self._prefix = prefix

    def load_config(self, config_file):
        raise NotImplementedError()

    def get_config_handler(self, section):
        raise NotImplementedError()


    def updateKey(self, key, value):
        raise NotImplementedError()

    def updateChild(self, key, value):
        #self.log.warning("ZZZZZ")
        key = "/%s" % key
        #print "updateing child: ", key, "with prefix: ", self._prefix
        if isinstance(value, dict): # Special case
            raise NotImplementedError()
        else:
            self.updateKey(key, value)

    update = updateChild

    def deleteSection(self, section_name):
        raise NotImplementedError()

    def put(self, key, value):
        newKey = "/%s" % key
        #print "PUP--->", newKey, key, value
        if isinstance(value, dict):
            section = self.getSectionConfig(key)
            for k, v in value.items():
                section[k] = v
            return section
        else:
            self.putKey(newKey, value)

    def putKey(self, key, value):
        raise NotImplementedError()

    def hasKey(self, key):
        raise NotImplementedError()

    def getKey(self, key):
        raise NotImplementedError()

    def getChild(self, child_name):
        key = "/%s" % child_name
        return self.getKey(key)

    def get(self, k, d=None):
        """
        Same as above but compatible with {}.get
        """
        if not self.hasChild(k): return d
        return self.getChild(k)

    def hasChild(self, child_name):
        key = "/%s" % child_name
        result = self.hasKey(key)
        return result

    def hasSection(self, section_name):
        key = "/%s/" % (section_name,)
        #        if self._prefix:
        #            key = "%s/%s/" % (self._prefix, section_name)
        #print "checking for key", key
        result = self.hasKey(key)
        #print "result => ", result
        return result

    def handle_config_info(self, args):
        raise NotImplementedError()

    def handle_config_euca(self, args):
        if args.autodetect:
            self._autodetect_euca_settings()
        config = self.getSectionConfig('euca')
        for key in EUCA_VAR_MAPS:
            value = getattr(args, key, None)
            if value is None: continue
            config[key] = value
        for key in EUCA_BLOB_VAR_MAPS:
            value = getattr(args, key, None)
            if value is None: continue
            with open(value, "rb") as f:
                value = f.read()
            config[key] = value

        expected_cfg_dir_location = "%s.d" % self._config_file
        config_section = self.getSectionConfig("config")
        if not config_section.hasChild("config_directory"):
            config_section["config_directory"] = expected_cfg_dir_location
        if not os.path.exists(config_section["config_directory"]):
            os.makedirs(config_section["config_directory"])


    def handle_config_registry(self, args):
        log = logging.getLogger(__name__)
        config_registry = self.getSectionConfig("config")
        for cfg_entry in args.configs:
            key, value = cfg_entry.split("=")
            if key in config_registry:
                old_value = config_registry[key]
                log.info("Updating key %s (%s) with %s", key, old_value, value)
            else:
                log.info("Adding new key %s with %s", key, value)
            config_registry[key] = value


    def getSectionConfig(self, section_name):
        if self._prefix:
            prefix = "%s/%s" % (self._prefix, section_name)
        else:
            prefix = "/%s" % section_name
            #print section_name
        if not self.hasSection(section_name):
            self.put("%s/" % section_name, None)

        return self.__class__(self._config_file, prefix=prefix)

    def get_config_handler(self, section):
        hndlr_name = "handle_config_%s" % section
        hndlr = getattr(self, hndlr_name, None)

        if hndlr is None:
            raise NotImplementedError("Undefined config handler for section: %s", section)

        return hndlr

    def __contains__(self, item):
        return self.hasChild(item)

    def __setitem__(self, key, value):
        if self.hasChild(key):
            return self.updateChild(key, value)
        return self.put(key, value)

    def __getitem__(self, item):
        if not self.hasChild(item):
            raise KeyError("No such child item: %s" % item)
        return self.getChild(item)

    def _autodetect_euca_settings(self):

        config = self.getSectionConfig('euca')
        for prop, env in EUCA_VAR_MAPS.items():
            value = os.environ.get(env, None)
            config[prop] = value

        for prop, env in EUCA_BLOB_VAR_MAPS.items():
            value = os.environ.get(env, None)
            if not os.path.exists(value):
                continue
            with open(value, "rb") as f:
                value = f.read()
            config[prop] = value

    def getChildren(self):
        chlds = self.getChildKeys(self._prefix)
        chlds = [chld.split("/")[-1] for chld in chlds]
        return chlds

    def getChildSections(self):
        chlds = self.getChildSectionKeys(self._prefix)
        chlds = [chld.split("/")[-2] for chld in chlds]
        return chlds


    def __getAllChildKeys(self, prefix="/"):
        cursor = self._sqlite_connection.cursor()
        try:
            results = cursor.execute("""
            SELECT id,key FROM config WHERE ISCHILDOF(?, key);
            """, (prefix,))
            return [i[1] for i in results]
        finally:
            cursor.close()

    def getChildKeys(self, *args, **kwargs):
        keys = self.__getAllChildKeys(*args, **kwargs)
        keys = [key for key in keys if not key.endswith("/")]
        return keys

    def getChildSectionKeys(self, *args, **kwargs):
        keys = self.__getAllChildKeys(*args, **kwargs)
        keys = [key for key in keys if key.endswith("/")]
        return keys

def SQIsChildOf(parent, element):
    if not parent.endswith("/"):
        parent = "%s/" % parent
    if not element.startswith(parent):
        return False
    if parent == element:
        return False
    child_elements = element[len(parent):].split("/")
    if len(child_elements) < 1 or len(child_elements) > 2:
        return False
    if len(child_elements) == 2 and child_elements[-1]:
        return False
    return True


class DatabaseConfigBackend(BaseConfig):
    def __init__(self, config_file, prefix=None):
        BaseConfig.__init__(self, config_file=config_file, prefix=prefix)
        _db_needs_init = False
        if not os.path.exists(self._config_file):
            _db_needs_init = True
        self._sqlite_connection = sqlite3.connect(self._config_file)
        self._sqlite_connection.create_function("ISCHILDOF", 2, SQIsChildOf)

        if _db_needs_init:
            self.__initialize_db()

    def __initialize_db(self):
        cursor = self._sqlite_connection.cursor()
        try:
            cursor.execute(
                """CREATE TABLE config (id INTEGER PRIMARY KEY ASC AUTOINCREMENT, key TEXT NOT NULL UNIQUE, value TEXT);""")
            cursor.execute("""INSERT INTO config(key,value) VALUES("/", NULL);""")
            self._sqlite_connection.commit()
        finally:
            cursor.close()

    def getKey(self, key):
        cursor = self._sqlite_connection.cursor()
        if key.startswith("/"):
            key = key[1:]
        if self._prefix:
            key = "%s/%s" % (self._prefix, key)
        try:
            results = [row for row in cursor.execute("""SELECT * FROM config WHERE key=?""", (key,))]
            if not results:
                raise KeyError("No such key: %s" % key)
            if len(results) > 1:
                raise AssertionError("To many matches for key: %s" % key)
            return results[0][2]
        finally:
            cursor.close()

    def putKey(self, key, value):
        is_section = key.endswith("/")
        if is_section and value is not None:
            raise ValueError("Sections can't have a value")

        if self._prefix:
            key = self._prefix + key

        elements = key.rstrip("/").split("/")
        if len(elements) == 1 or len(elements[:-1]) == 1:
            parent = "/"
        else:
            parent = "/".join(elements[:-1])
        if not parent.endswith("/"):
            parent = "%s/" % parent

        lookup_key = key
        lookup_parent = parent
        if self._prefix:
            lookup_key = key[len(self._prefix):]
            lookup_parent = parent[len(self._prefix):]

        if self.hasKey(lookup_key):
            raise KeyError("Key is already defined: %s" % key)

        if not self.hasKey(lookup_parent):
            raise KeyError("Key does not exist: %s", parent)
        cursor = self._sqlite_connection.cursor()

        cursor.execute("""
        INSERT INTO config (key, value) VALUES (?, ?)
        """, (key, value))
        self._sqlite_connection.commit()
        cursor.close()


    def updateKey(self, key, value):
        cursor = self._sqlite_connection.cursor()
        if self._prefix:
            if key.startswith("/"): key = key[1:]
            key = "%s/%s" % (self._prefix, key)
            #print "update key=", key
        try:
            ret = cursor.execute("""UPDATE config SET value=? WHERE key=?
            """, (value, key))
            #print "Update WHERE: '%s'" % key
            #print "Update affected: ", ret.rowcount
            self._sqlite_connection.commit()
        finally:
            cursor.close()

    def deleteSection(self, section_name):
        effective_name = "/%s/" % section_name
        if self._prefix:
            effective_name = "%s%s" % (self._prefix, effective_name)
        cursor = self._sqlite_connection.cursor()
        try:
            q = "DELETE from config WHERE key LIKE ? || '%'"
            cursor.execute(q, (effective_name,))
            self._sqlite_connection.commit()
        finally:
            cursor.close()

    def hasKey(self, key):
        if self._prefix:
            key = self._prefix + key
            #print "hasKey=> searching for", key
        cursor = self._sqlite_connection.cursor()
        try:
            results = [row for row in cursor.execute("""SELECT * FROM config WHERE key=?""", (key,))]
            if results:
                return True
            else:
                return False
        finally:
            cursor.close()


ConfigFile = DatabaseConfigBackend # Temporary

if __name__ == "__main__":
    logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.DEBUG)
    cfg = DatabaseConfigBackend("~/sct.scape.db")
    if not cfg.hasKey("/clusters/"):
        cfg.putKey("/clusters/", None)
    cfg.putKey("/bau/", None)
    cfg2 = DatabaseConfigBackend("~/sct.scape.db", prefix="/bau")
    if not cfg2.hasKey("/test_prefix/"):
        cfg2.putKey("/clusters/", None)

    print "Keys=", cfg.getChildKeys("/")
    print "SectionKeys=", cfg.getChildSectionKeys("/")

