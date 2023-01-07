#!/usr/bin/env node
import { Command } from 'commander';
import { connect } from './connect.js';
import { setTimeout } from 'node:timers/promises';
import { MIN_HEIGHT, MAX_HEIGHT } from './Desk.js';
import pkg from "./package.json" assert { type: 'json' };
import { scan } from "./scan.js";

const program = new Command();

const deskUuid = process.env.IDASEN_DESK_UUID;

program
  .name('idasen')
  .description('CLI to control your Idasen Ikea standing desk')
  .version(pkg.version);

program.command('scan')
  .description('scan bluetooth devices. Use this command to search for your desk uuid')
  .action(() => {
    scan();
  });

program.command('height')
  .description('Return current height expressed in cm')
  .action(async () => {
    if (!deskUuid) {
      console.error('Unable to find IDASEN_DESK_UUID variable');
      process.exit(-1);
    }

    const [desk, peripheral] = await connect(deskUuid);
    const heightCm = await desk.getCurrentHeightCm();
    console.log('current height', heightCm);
    await peripheral.disconnectAsync();
    process.exit();
  });

// await desk.moveTo(75);
program.command('move-to')
  .description('Move desk to target height in cm')
  .argument('<target-cm>', 'target height in cm')
  .action(async (targetCm) => {
    if (!deskUuid) {
      console.error('Unable to find IDASEN_DESK_UUID variable');
      process.exit(-1);
    }

    if (targetCm < MIN_HEIGHT) {
      console.error(`Cannot move under ${MIN_HEIGHT} cm`);
      process.exit(-1);
    }
    if (targetCm > MAX_HEIGHT) {
      console.error(`Cannot move over ${MAX_HEIGHT} cm`);
      process.exit(-1);
    }

    const [desk, peripheral] = await connect(deskUuid);
    let heightCm = await desk.getCurrentHeightCm();
    console.log(`initial height ${heightCm} cm`);
    await desk.moveTo(targetCm);

    await setTimeout(500);
    heightCm = await desk.getCurrentHeightCm();
    console.log(`final height ${heightCm} cm`);

    await peripheral.disconnectAsync();
    process.exit();
  });

program.parse();
