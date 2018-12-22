// Copyright (c) 2018, BKkite, The Roto2Coin Developers
// [Original]Copyright (c) 2018, Brandon Lehmann, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

'use strict'

const Roto2Coind = require('./')
const util = require('util')

var daemon = new Roto2Coind({
  loadCheckpoints: './checkpoints.csv'
  // Load additional daemon parameters here
})

function log (message) {
  console.log(util.format('%s: %s', (new Date()).toUTCString(), message))
}

daemon.on('start', (args) => {
  log(util.format('Roto2Coind has started... %s', args))
})

daemon.on('started', () => {
  log('Roto2Coind is attempting to synchronize with the network...')
})

daemon.on('syncing', (info) => {
  log(util.format('Roto2Coind has synchronized %s out of %s blocks [%s%]', info.height, info.network_height, info.percent))
})

daemon.on('synced', () => {
  log('Roto2Coind is synchronized with the network...')
})

daemon.on('ready', (info) => {
  log(util.format('Roto2Coind is waiting for connections at %s @ %s - %s H/s', info.height, info.difficulty, info.globalHashRate))
})

daemon.on('desync', (daemon, network, deviance) => {
  log(util.format('Roto2Coind is currently off the blockchain by %s blocks. Network: %s  Daemon: %s', deviance, network, daemon))
})

daemon.on('down', () => {
  log('Roto2Coind is not responding... stopping process...')
  daemon.stop()
})

daemon.on('stopped', (exitcode) => {
  log(util.format('Roto2Coind has closed (exitcode: %s)... restarting process...', exitcode))
  daemon.start()
})

daemon.on('info', (info) => {
  log(info)
})

daemon.on('error', (err) => {
  log(err)
})

daemon.start()
