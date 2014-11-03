#!/bin/sh

. /etc/profile
grep "puppet" /etc/hosts || echo "@puppetServer puppet" >> /etc/hosts
LV=`LANG=C mount | grep -i 'on / ' | cut -d " " -f 1`
VG=`echo $LV | cut -d "/" -f 4 | cut -d "-" -f 1`
/sbin/pvcreate /dev/vdb
/sbin/vgextend $VG /dev/vdb
lvcreate -L 800M -n Swap ubuntu
/sbin/lvresize -l +90%FREE $LV
/sbin/resize2fs $LV
mkswap -f /dev/ubuntu/Swap

SD=$(blkid -s TYPE | grep -i swap | cut -d ":" -f 1)
for D in $SD; do
    swapon $D
done

apt-get -q -y --force-yes install facter=2.0.2-1puppetlabs1
apt-mark hold facter
apt-get -q -y --force-yes install puppet
echo -e "START=yes\nDAEMON_OPTS=\"\"\n" > /etc/default/puppet
rm -fr /var/lib/puppet/ssl/*
/etc/init.d/puppet start

