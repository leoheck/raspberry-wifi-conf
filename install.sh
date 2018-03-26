#!/bin/bash

# Run with sudo

cp -f assets/init.d/raspberry-wifi-conf /etc/init.d/
chmod +x /etc/init.d/raspberry-wifi-conf
update-rc.d raspberry-wifi-conf defaults

