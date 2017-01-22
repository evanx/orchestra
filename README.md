# orchestra

Redis-based controller to run Docker containers.

<img src='https://raw.githubusercontent.com/evanx/orchestra/master/docs/readme/images/options.png'>


## Use case

Sample data
```
redis-cli hset mytest:1001:h err some_error
```


## Usage

```
npm start
```

## Config

See `app/config.js`
```javascript
```

## Implementation

See `app/index.js`
```javascript
```

## Docker

Having audited the `Dockerfile` and code, you can build and run as follows:

```shell
docker build -t orchestra https://github.com/evanx/orchestra.git
```
where we tag the image as `orchestra`

```shell
docker run --network=host -e pattern='authbot:*' -e field=role -e format=both orchestra
```
where `--network-host` connects the container to your `localhost` bridge. The default `redisUrl` of `redis://localhost:6379` works in that case.


### Prebuilt image demo

```
evan@dijkstra:~$ docker run --network=redis \
  -e redisUrl=redis://$redisHost:6379 \
  -e pattern='authbot:*' -e field=role -e format=both \
  evanxsummers/orchestra
```
where rather than using `--network=host` we have a Redis container with IP address `$redisHost` on a network bridge called `redis`


### Test Redis instance

See `scripts/demo.sh`
```
docker network create -d bridge test-orchestra-redis-network
container=`docker run --network=test-orchestra-redis-network \
  --name test-redis-orchestra -d tutum/redis`
redisPass=`docker logs $container | grep '^\s*redis-cli -a' |
  sed -e 's/^\s*redis-cli -a \(\w*\) .*$/\1/'`
redisHost=`docker inspect $container |
  grep '"IPAddress":' | tail -1 | sed 's/.*"\([0-9\.]*\)",/\1/'`
redisUrl="redis://:$redisPass@$redisHost:6379"
redis-cli -a $redisPass -h $redisHost hset mytest:1001:h err some_error
redis-cli -a $redisPass -h $redisHost hset mytest:1002:h err other_error
redis-cli -a $redisPass -h $redisHost keys 'mytest:*:h'
docker run --network=test-orchestra-redis-network -e redisUrl=$redisUrl \
  -e pattern=mytest:*:h -e field=err -e format=both evanxsummers/orchestra
docker rm -f `docker ps -q -f name=test-redis-orchestra`
docker network rm test-orchestra-redis-network
```
where we:
- create an isolated bridge network `test-orchestra-redis-network` for the demo
- `docker run tutum/redis` for an isolated test Redis container
- from the `logs` of that instance to get its password into `redisPass`
- `docker inspect` that instance to get its IP number into `redisHost`
- build `redisUrl` from `redisPass` and `redisHost` and default port `6379`
- use `redis-cli` to create some test keys in the Redis container e.g. `mytest:1001:h`
- `docker run evanxsummers/orchestra` to run our utility against that Redis container
- remove the test Redis container
- remove the test network


See `docs/demo.out`
```
```

https://twitter.com/@evanxsummers
