
install_updates:
	sudo apt-get install curl
	curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
	sudo apt-get install nodejs
	sudo -H npm update
	sudo bower install
	sudo npm run-script provision
	#sudo npm start

install:
	sudo cp assets/init.d/raspberry-wifi-conf /etc/init.d/raspberry-wifi-conf
	sudo cp assets/systemd/system/wificonf.service /etc/systemd/system/
	sudo systemctl enable wificonf.service
	sudo systemtcl daemon-reload
	sudo sytemtcl restart wificonf.service
