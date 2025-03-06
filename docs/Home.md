@rsksmart/bridges-core-sdk / [Exports](modules.md)

# Bridges Core SDK
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/rsksmart/bridges-core-sdk/badge)](https://scorecard.dev/viewer/?uri=github.com/rsksmart/bridges-core-sdk)
[![CodeQL](https://github.com/rsksmart/bridges-core-sdk/workflows/CodeQL/badge.svg)](https://github.com/rsksmart/bridges-core-sdk/actions?query=workflow%3ACodeQL)
[![CI](https://github.com/rsksmart/bridges-core-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/rsksmart/bridges-core-sdk/actions/workflows/ci.yml)

This is the core module shared by all the bridges SDKs. This has common functionality such as logic to call the blockchain, HTTP client configuration, common validations and the configuration objects to initialize each bridges product.

## Initialization

This repo also contains a submodule which can be imported with the path `@rsksmart/bridges-core-sdk/initialization`. This submodule helps the user to initialize multiple bridges at once (taking into account that every bridge package still provides its own constructor and specific ways to initialize it).

To use core initialization you need to use the `init()` function, provide the common configuration fields, and in the `bridges` field add all the keys for the bridges you want to initialize, for each key the value that you'll provide is the specific configuration for that bridge or `{}` if you want to initialize that bridge with its default configuration

```javascript
    // this would initialize flyover with custom config and tokenbridge with default config
    const { flyover, tokenbridge } = await init({
      network: 'Regtest',
      allowInsecureConnections: true,
      bridges: {
        flyover: {
          captchaTokenResolver: async () => Promise.resolve('')
        },
        tokenbridge: {}
      }
    })
```

### Drawbacks
One advantage of using initialization module is that you can lazy load the bridges. But if you provide an non existing bridge name the function will return and error. Also if you provide an existing bridge name but you don't have that package installed on your project the function will return and error.

This comes with one drawback, even when the SDK **ensures that any lazy loaded bridge error is caught**, you can find problems with some code bundlers that don't support external dependencies dynamic importing. If your bundler doesn't support that and you can't fix it via bundler configuration the only solution that you have is to install all the bridges packages even if you're not using them all. If your bundler does support external dependency dynamic importing then you shouldn't have any problem.

## Connect to RSK
If you need to connect to RSK to execute some operation then you need to create a BlockchainConnection and provide it to your bridge object
```javascript
    const rsk = await BlockchainConnection.createUsingStandard(window.ethereum)
    const flyover = new Flyover({ rskConnection: rsk, network: 'Regtest' })
```
or you can set it after creation
```javascript
    const rsk = await BlockchainConnection.createUsingStandard(window.ethereum)
    await flyover.connectToRsk(rsk)
```

There are multiple ways to create the connection, all of them are specified in the `BlockchainConnection` class JSDocs

## Application Programming Interface
To see the full API of this package please refer to the [the docs folder](./docs/) of this project
