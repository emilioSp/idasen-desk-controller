import noble from '@abandonware/noble';
import Desk from "./Desk.js";

export const connect = async (deskUuid) =>
  new Promise(async (resolve, reject) => {

    noble.on('stateChange', state => {
      console.log(`State changed: ${state}`)
      if (state === 'poweredOn') {
        noble.startScanning();
      }
    });

    noble.on('discover', async peripheral => {
      console.log(`Found device, name: ${peripheral.advertisement.localName}, uuid: ${peripheral.uuid}`)

      if (peripheral.uuid === deskUuid) {
        noble.stopScanning();

        peripheral.on('connect', async () => {
          console.log(`connected to ${peripheral.advertisement.localName}`);
          const desk = await getDesk(peripheral);
          resolve([desk, peripheral]);
        });

        peripheral.on('disconnect', () => {
          console.log(`disconnected from ${peripheral.advertisement.localName}`);
        })

        await peripheral.connectAsync();
      }
    });

    noble.on('error', err => reject(err));
  });

const getDesk = async (peripheral) => {
  const discovery = await peripheral.discoverAllServicesAndCharacteristicsAsync();

  const POSITION_SERVICE_UUID = '99fa0020338a10248a49009c0215f78a';
  const POSITION_CHARACTERISTIC_UUID = '99fa0021338a10248a49009c0215f78a';
  const positionService = discovery.services.find(s => s.uuid === POSITION_SERVICE_UUID);
  const position = positionService.characteristics.find(c => c.uuid === POSITION_CHARACTERISTIC_UUID);

  const CONTROL_SERVICE_UUID = '99fa0001338a10248a49009c0215f78a';
  const CONTROL_CHARACTERISTIC_UUID = '99fa0002338a10248a49009c0215f78a';
  const controlService = discovery.services.find(s => s.uuid === CONTROL_SERVICE_UUID);
  const control = controlService.characteristics.find(c => c.uuid === CONTROL_CHARACTERISTIC_UUID);

  const desk = new Desk(position, control);
  return desk;
}
