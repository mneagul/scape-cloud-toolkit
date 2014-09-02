#!/bin/sh

. /etc/profile
grep "puppet" /etc/hosts || echo "@puppetServer puppet" >> /etc/hosts
echo -e "START=yes\nDAEMON_OPTS=\"\"\n" > /etc/default/puppet
rm -fr /var/lib/puppet/ssl/*
/etc/init.d/puppet start
SD=$(blkid -s TYPE | grep -i swap | cut -d ":" -f 1)
for D in $SD; do
    swapon $D
done
