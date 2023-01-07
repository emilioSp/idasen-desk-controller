import noble from '@abandonware/noble';

export const scan = () => {
  noble.on('stateChange', (state) => {
    console.log(`State changed: ${state}`);
    if (state === 'poweredOn') {
      noble.startScanning();
    }
  });

  noble.on('discover', async (peripheral) => {
    console.log(`Found device, name: ${peripheral.advertisement.localName}, uuid: ${peripheral.uuid}`);
  });

  setTimeout(async () => {
    await noble.stopScanningAsync();
    process.exit();
  }, 4000);
};
