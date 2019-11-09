
install_updates:
	curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
	sudo apt install nodejs
	sudo apt install dnsmasq
	sudo apt install hostapd
	sudo apt install fonts-font-awesome
	sudo -H npm update
	sudo npm install bower -g
	sudo bower install
	sudo npm run-script provision

test:
	sudo npm start

install:
	sudo cp assets/init.d/raspberry-wifi-conf /etc/init.d/raspberry-wifi-conf
	sudo cp assets/systemd/system/wificonf.service /etc/systemd/system/
	sudo systemctl enable wificonf.service
	sudo systemctl daemon-reload
	sudo systemctl restart wificonf.service
