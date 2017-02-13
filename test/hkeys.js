module.exports = {
  network: 'test-hkeys',
  spec: {
    keyfile: '{env:HOME}/tmp/test-spiped-keyfile'
  },
  image: {
    repo: 'https://github.com/evanx/scan-hkeys.git',
    tag: 'evanxsummers/scan-hkeys'
  },
  setupCommands: [
    ['dd', 'if=/dev/urandom', 'of={spec:keyfile}', 'bs=32', 'count=1'],
  ],
  aliasCommands: {
    hset: ['redis-cli', '-h', '{container:testEncipher:ip}', '-p', 6379, 'hset']
  }
  containers: {
    scan_hkeys: {
      mode: 'interactive',
      env: {
        redisHost: '{container:testEncipher:ip}'
      },
      setupCommands: [
        ['hset', 'test:h', 'field1', 'value1'],
        ['hset', 'test:h', 'field2', 'value2'],
      ]
    },
    testRedis: {
      image: 'tutum/redis',
    },
    testDecipher: {
      image: 'spiped',
      expose: '6444:6444',
      volume: '{spec:keyfile}:/spiped/key:ro'
      options: {
        source: "[0.0.0.0]:6444",
        target: "[{container:testRedis:ip}]:6379'
      }
    }
    testEncipher: {
      image: 'spiped',
      expose: '6444:6444',
      volume: '{env.HOME}/tmp/test-spiped-keyfile:/spiped/key:ro'
      options: {
        source: "[0.0.0.0]:6444",
        target: "[{container:testRedis:ip}]:6379'
      }
    }
  }
}

