import { defineStore } from 'pinia'
import { ref } from 'vue'

import { serial as polyfill, SerialPort as SerialPortPolyfill } from 'web-serial-polyfill'

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const toFlush = ''

export const useConnectionStore = defineStore('connection', () => {
  const id = ref<string | undefined>()
  const vendor = ref<number | undefined>() // unsigned short integer
  const product = ref<number | undefined>() // unsigned short integer
  const activePort = ref<SerialPort | SerialPortPolyfill | undefined>()
  const physicallyConnected = ref<boolean>(false)
  const open = ref<boolean>(false)
  const _reader = ref<ReadableStreamDefaultReader | ReadableStreamBYOBReader | undefined>()
  const comConfig = <SerialOptions>{
    baudRate: 115200,
    bufferSize: 1024,
    dataBits: 8,
    flowControl: undefined,
    parity: undefined,
    stopBits: 1
  }
  const requestOption: SerialPortRequestOptions | undefined = {
    filters: [{ usbVendorId: 0x1a86 }]
  }
  const signals = {}
  const messages: string[] = []
  const prepend = ''
  const append = '\n'

  async function selectPort() {
    console.log('connection.ts -> selectPort started')

    try {
      if (!navigator.serial) return false

      const selection = await navigator.serial
        .requestPort(requestOption)
        .then(async (port: SerialPort) => {
          activePort.value = port
          return port
        })
      activePort.value = selection
      //console.log('Selected board: ', activePort.value.getInfo())
      physicallyConnected.value = true
    } catch (e) {
      console.log("Couldn't request port")
      return
    }
  }

  /**
   * Initiates a connection to the selected port.
   */
  async function connectToPort(): Promise<void> {
    const localTag: String = 'connectToPort'
    if (!activePort.value) {
      console.log(localTag, 'activePort undefined')
      return
    }

    try {
      await activePort.value.open(comConfig)
      console.log(localTag, '<Port opened>')
      // connectButton.textContent = 'Disconnect'
      // connectButton.disabled = false
    } catch (e) {
      console.error(e)
      $reset()
      return
    }
    console.log(localTag, 'while cycle reached')
    while (activePort.value && activePort.value.readable) {
      const reader = activePort.value.readable.getReader()
      let chunks = ''
      const raw_chunks = []

      try {
        for (;;) {
          const { value, done } = await reader.read()
          const decoded = decoder.decode(value)

          chunks += decoded
          raw_chunks.push(value)

          if (done || decoded.includes('\n')) {
            console.log('Reading done.')
            reader.releaseLock()
            break
          }
        }
      } catch (error) {
        console.error(error)
        throw error
      } finally {
        reader.releaseLock()
      }

      try {
        //console.log(localTag, chunks)
        //console.log(localTag, raw_chunks)
        const parsed_chunk = JSON.parse(chunks.replace('\0', ''))
        console.log(parsed_chunk)
      } catch (error) {
        console.log('JSON parse error')
        console.log(error)
      }

      /*
      try {
        try {
          _reader.value = activePort.value.readable.getReader({ mode: 'byob' })
        } catch {
          _reader.value = activePort.value.readable.getReader()
        }

        let buffer = null
        if (_reader.value == undefined) {
          console.log('Reader undefined!')
          return
        }
        for (;;) {
          const { value, done } = await (async () => {
            if (_reader.value instanceof ReadableStreamBYOBReader) {
              if (!buffer) {
                buffer = new ArrayBuffer(bufferSize)
              }
              const { value, done } = await _reader.value.read(
                new Uint8Array(buffer, 0, bufferSize)
              )
              buffer = value?.buffer
              return { value, done }
            } else {
              return await _reader.value.read()
            }
          })()

          if (value) {
            await new Promise<void>((resolve) => {
              term.write(value, resolve)
            })
          }
          console.log(localTag, 'pos3', done, decoder.decode(value))
          if (done) {
            break
          }
        }
      } catch (e) {
        console.error(e)
        await new Promise<void>((resolve) => {
          if (e instanceof Error) {
            term.writeln(`<ERROR: ${e.message}>`, resolve)
          }
        })
      } finally {
        if (_reader.value) {
          _reader.value.releaseLock()
          _reader.value = undefined
        }
      }
      */
    }

    if (activePort.value) {
      try {
        await activePort.value.close()
      } catch (e) {
        console.error(e)
      }

      $reset()
    }
  }

  function $reset(): void {
    id.value = undefined
    vendor.value = undefined
    product.value = undefined // unsigned short integer
    activePort.value = undefined
    physicallyConnected.value = false
    open.value = false
    _reader.value = undefined
  }

  return {
    _reader,
    activePort,
    append,
    comConfig,
    id,
    messages,
    open,
    physicallyConnected,
    product,
    prepend,
    signals,
    vendor,
    close,
    connectToPort,
    selectPort,
    $reset
  }
})
