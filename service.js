// Copyright (c) 2018, BKkite, The Roto2Coin Developers
// [Original]Copyright (c) 2018, Brandon Lehmann, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

'use strict'

const Roto2Coind = require('./')
const util = require('util')

var daemon = new Roto2Coind({
  // These are our Roto2Coind-ha options
  pollingInterval: 10000, // How often to check the daemon in milliseconds
  maxPollingFailures: 3, // How many polling intervals can fail before we emit a down event?
  checkHeight: true, // Check the daemon block height against known trusted nodes
  maxDeviance: 5, // What is the maximum difference between our block height and the network height that we're willing to accept?
  clearP2pOnStart: true, // Will automatically delete the p2pstate.bin file on start if set to true
  clearDBLockFile: true, // Will automatically delete the DB LOCK file on start if set to true
  timeout: 5000, // How long to wait for RPC responses in milliseconds
  enableWebSocket: true, // Enables a socket.io websocket server on the rpcBindPort + 1
  webSocketPassword: false, // Set this to a password to use for the privileged socket events.

  // These are the standard Roto2Coind options
  path: './Roto2Coind', // Where can I find Roto2Coind?
  dataDir: '~/.Roto2Coin', // Where do you store your blockchain?
  logLevel: 1, // Log level 0-4
  testnet: false, // Use the testnet?
  enableCors: false, // Enable CORS support for the domain in this value
  enableBlockExplorer: true, // Enable the block explorer
  loadCheckpoints: false, // If set to a path to a file, will supply that file to the daemon if it exists.
  rpcBindIp: '0.0.0.0', // What IP to bind the RPC server to
  rpcBindPort: 13300, // What Port to bind the RPC server to
  p2pBindIp: '0.0.0.0', // What IP to bind the P2P network to
  p2pBindPort: 13000, // What Port to bind the P2P network to
  p2pExternalPort: 0, // What External Port to bind the P2P network to for those behind NAT
  allowLocalIp: false, // Add our own IP to the peer list?
  peers: false, // Manually add the peer(s) to the list. Allows for a string or an Array of strings.
  priorityNodes: false, // Manually add the priority node(s) to the peer list. Allows for a string or an Array of strings.
  exclusiveNodes: false, // Only add these node(s) to the peer list. Allows for a string or an Array of strings.
  seedNode: false, // Connect to this node to get the peer list then quit. Allows for a string.
  hideMyPort: false, // Hide from the rest of the network
  dbThreads: 2, // Number of database background threads
  dbMaxOpenFiles: 200, // Number of allowed open files for the DB
  dbWriteBufferSize: 256, // Size of the DB write buffer in MB
  dbReadCacheSize: 10, // Size of the DB read cache in MB
  feeAddress: false, // allows to specify the fee address for the node
  feeAmount: 0 // allows to specify the fee amount for the node
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
