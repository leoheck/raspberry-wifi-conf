
install_dependencies:
	curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
	sudo apt install nodejs
	sudo apt install dnsmasq
	sudo apt install hostapd
	sudo apt install fonts-font-awesome
	sudo npm update
	sudo npm install onoff
	sudo npm install bower -g
	sudo bower install --allow-root
	sudo npm run-script provision

test:
	sudo npm start

install:
	sudo cp -f assets/bin/wificonfig /usr/local/bin/
	sudo cp -f assets/systemd/system/wificonf.service /etc/systemd/system/
	sudo systemctl enable wificonf.service
	sudo systemctl daemon-reload
	sudo systemctl restart wificonf.service

uninstall:
	sudo rm -f /usr/local/bin/wificonfig
	sudo systemctl disable wificonf.service
	sudo rm -rf wificonf.service /etc/systemd/system/wificonf.service
