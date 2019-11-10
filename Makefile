install_dependencies:
	curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
	sudo apt install nodejs
	sudo apt install dnsmasq
	sudo apt install hostapd
	sudo npm update
	sudo npm install onoff
	sudo npm install bower -g
	sudo bower install --allow-root
	sudo npm run-script provision

install:
	sudo cp assets/init.d/raspberry-wifi-conf /etc/init.d/raspberry-wifi-conf
	sudo chmod +x /etc/init.d/raspberry-wifi-conf
	sudo update-rc.d raspberry-wifi-conf defaults

uninstall:
	sudo rm -f /etc/init.d/raspberry-wifi-conf
	sudo  update-rc.d raspberry-wifi-conf disable
