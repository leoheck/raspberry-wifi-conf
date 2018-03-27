
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

var ap_led = new Gpio(17, 'out'); //use GPIO pin 4, and specify that it is output
var wifi_led = new Gpio(27, 'out'); //use GPIO pin 4, and specify that it is output
// var rst_wifi_btn = new Gpio(23, 'in', 'both');
// var btn2 = new Gpio(24, 'in', 'both');


var async               = require("async"),
    wifi_manager        = require("./app/wifi_manager")(),
    dependency_manager  = require("./app/dependency_manager")(),
    config              = require("./config.json");

/*
** 1. Check for dependencies
** 2. Check to see if we are connected to a wifi AP
** 3. If connected to a wifi, do nothing -> exit
** 4. Convert RPI to act as a AP (with a configurable SSID)
** 5. Host a lightweight HTTP server which allows for the user to connect and
**    configure the RPIs wifi connection. The interfaces exposed are RESTy so
**    other applications can similarly implement their own UIs around the
**    data returned.
** 6. Once the RPI is successfully configured, reset it to act as a wifi
**    device (not AP anymore), and setup its wifi network based on what the
**    user picked.
** 7. At this stage, the RPI is named, and has a valid wifi connection which
**    its bound to, reboot the pi and re-run this script on startup.
*/

async.series([


    // function leds_ap_mode() {
    //     wifi_led.writeSync(0);
    //     ap_led.writeSync(1);
    // },

    // function leds_wifi_mode() {
    //     ap_led.writeSync(0);
    //     wifi_led.writeSync(1);
    // },

    // 1. Check if we have the required dependencies installed

    function test_deps(next_step) {
        dependency_manager.check_deps({
            "binaries": ["dnsmasq", "hostapd", "iw"],
            "files":    ["/etc/dnsmasq.conf"]
        }, function(error) {
            if (error) console.log(" * Dependency error, did you run `sudo npm run-script provision`?");
            next_step(error);
        });
    },

    // 2. Check if wifi is enabled / connected

    function test_is_wifi_enabled(next_step) {
        wifi_manager.is_wifi_enabled(function(error, result_ip) {
            if (result_ip) {

                // leds_wifi_mode();
                // wifi_led.writeSync(1);
                // ap_led.writeSync(0);

                console.log("\nWifi is enabled, and IP " + result_ip + " assigned");
                var reconfigure = config.access_point.force_reconfigure || false;
                if (reconfigure) {
                    console.log("\nForce reconfigure enabled - try to enable access point");
                } else {
                    process.exit(0);
                }
            } else {
                console.log("\nWifi is not enabled, Enabling AP for self-configure");
            }
            next_step(error);
        });
    },
    
    // 3. Turn RPI into an access point

    function enable_rpi_ap(next_step) {
        wifi_manager.enable_ap_mode(config.access_point.ssid, function(error) {
            if(error) {
                console.log("... AP Enable ERROR: " + error);
            } else {
                console.log("... AP Enable Success!");

                // wifi_led.writeSync(0);
                // ap_led.writeSync(1);

            }
            next_step(error);
        });
    },

    // 4. Host HTTP server while functioning as AP, the "api.js"
    //    file contains all the needed logic to get a basic express
    //    server up. It uses a small angular application which allows
    //    us to choose the wifi of our choosing.

    function start_http_server(next_step) {
        console.log("\nHTTP server running...");
        require("./app/api.js")(wifi_manager, next_step);
    },
    

], function(error) {
    if (error) {
        console.log("ERROR: " + error);
    }
});
