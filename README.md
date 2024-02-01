# idasen desk controller
Idasen Ikea standing desk CLI

This package uses noble to communicate with Idasen bluetooth controller 

Check its [prerequisites](https://github.com/abandonware/noble#os-x)

https://github.com/emilioSp/idasen-desk-controller/assets/22614105/fc9bf818-a8f9-4c1a-8b99-b5778c5e7ac2

<a href="https://www.buymeacoffee.com/emiliosp" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## installation
```shell
npm install -g idasen-desk-controller
```

## configuration
Search for your desk bluetooth controller using 
```shell
idasen scan
```
output example:
```shell
State changed: poweredOn
Found device, name: undefined, uuid: xxxxx
Found device, name: Desk 0856, uuid: 4ba2a62184b3b56238428b2ec607c086 <<-- This is what you need
Found device, name: [TV] UE48J6200, uuid: xxxxx
Found device, name: VS9-EU-NEA2334A, uuid: xxxxx
Found device, name: [TV] UE48J6200, uuid: xxxxx
Found device, name: [LG] webOS TV OLED65C16LA, uuid: xxxxxx
Found device, name: iPhone di Emilio, uuid: xxxxx
```
Copy your `deskUuid` and set a global env variable `IDASEN_DESK_UUID` with its value

## commands
```shell
idasen --help
```
```shell
idasen scan
```
```shell
idasen height
```
```shell
idasen move-to 80
```

