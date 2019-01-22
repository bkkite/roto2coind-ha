// Copyright (c) 2018, BKkite, The Roto2Coin Developers
//
// Please see the included LICENSE file for more information.

'use strict'

var pm2 = require('pm2')

pm2.connect(function (err) {
  if (err) throw err

  setTimeout(function worker () {
    console.log('Restarting app...')
    pm2.restart('roto2coind', function () {})
    setTimeout(worker, 24 * 60 * 60 * 1000)
  }, 2 * 60 * 1000)
})
