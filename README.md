# zonemta-loop-breaker

Loop breaker plugin for [ZoneMTA](https://github.com/zone-eu/zone-mta). Install this to avoid routing loops where you send the same message to the same recipient twice. This module does not break any forwarding chains as the loop detection header is always instance specific. There can be several loop breaking headers with the same name added that should not conflict with each other.

## Setup

Add this as a dependency for your ZoneMTA app

```
npm install zonemta-loop-breaker --save
```

Add a configuration entry in the "plugins" section of your ZoneMTA app

```json
...
  "plugins": {
    "modules/zonemta-loop-breaker": {
        "enabled": "sender",
        "secret": "a cat",
        "algo": "md5"
    }
  }
...
```

**NB!** make sure you have a random value used for the secret option, as this is the value that guarantees difference between multiple ZoneMTA instances.

## License

European Union Public License 1.1 ([details](http://ec.europa.eu/idabc/eupl.html))
