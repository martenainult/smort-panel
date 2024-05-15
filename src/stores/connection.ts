// Parts were reused from the project of https://github.com/williamkapke/webserial/blob/main/src/stores/connection.js

import { defineStore } from 'pinia'
import { ref } from 'vue'

import { serial as polyfill, SerialPort as SerialPortPolyfill } from 'web-serial-polyfill'
import { sanitizeJSON } from '@/tools'
import { useDeviceStore } from './devices'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const useConnectionStore = defineStore('connection', () => {
  const devices = useDeviceStore()
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
      const portInfo = activePort.value.getInfo()
      physicallyConnected.value = true
      vendor.value = portInfo.usbVendorId
      product.value = portInfo.usbProductId
    } catch (e) {
      console.log("Couldn't request port")
      return
    }
  }

  async function write(data: string) {
    if (activePort.value?.writable) {
      const writer = activePort.value.writable.getWriter()
      await writer.write(encoder.encode(data))
      writer.releaseLock()
      console.log('PING from host')
    } else {
      console.log('Unable to write to serial USB')
    }
  }

  /**
   * Initiates a connection to the selected port.
   */
  async function connectToPort(): Promise<void> {
    const localTag: String = 'connectToPort'
    console.log(localTag, 'Start connecting to port')
    if (!activePort.value) {
      console.log(localTag, 'activePort undefined')
      return
    }

    try {
      await activePort.value.open(comConfig)
      console.log(localTag, '<Port opened>')
      const portInfo = activePort.value.getInfo()
      vendor.value = portInfo.usbVendorId
      product.value = portInfo.usbProductId
      open.value = true
    } catch (e) {
      console.error(e)
      $reset()
      return
    }
    console.log(localTag, 'while cycle reached')
    let multisample_start = ''
    while (activePort.value && activePort.value.readable && open.value) {
      _reader.value = activePort.value.readable.getReader()
      let chunks = ''
      const raw_chunks = []
      if (multisample_start != '') {
        chunks = multisample_start
        multisample_start = ''
        //console.log('CHUNKS: ', chunks)
      }

      try {
        while (open.value) {
          const { value, done } = await _reader.value.read()
          const decoded = decoder.decode(value)

          if (decoded.includes('\n{')) {
            // Handle the beginning of next JSON read
            // console.log('Handling extra information')
            //console.log(decoded)
            multisample_start = decoded.substring(decoded.indexOf('{'))
            chunks += decoded.substring(0, decoded.indexOf('\n'))
            raw_chunks.push(value)
            _reader.value.releaseLock()
            //console.log('Handled json', chunks)
            if (!open.value) return
            break
          }

          chunks += decoded
          raw_chunks.push(value)

          if (done || decoded.includes('\n')) {
            //console.log('Reading done.')
            // console.log(raw_chunks)
            _reader.value.releaseLock()
            if (!open.value) return
            break
          }
        }
      } catch (error) {
        console.error(error)
        throw error
      } finally {
        _reader.value.releaseLock()
      }

      try {
        //console.log(localTag, chunks)
        //console.log(localTag, raw_chunks)
        const parsed_chunk = JSON.parse(sanitizeJSON(chunks))
        // console.log(parsed_chunk)

        switch (parsed_chunk.event) {
          case 'answer':
            devices.updateAnswer(parsed_chunk)
            break
          case 'sensor':
            devices.updateSensor(parsed_chunk)
            break
          case 'ping':
            devices.handlePong(parsed_chunk)
            break
        }
        if (parsed_chunk.event == 'answer') {
          console.log('updateAnswer')
        }
      } catch (error) {
        console.log('JSON parse error')
        console.log(error)
        _reader.value.releaseLock()
      }
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

  function disconnectPort() {
    if (activePort.value && open.value) {
      try {
        console.log('Starting port disconnection')
        $reset()
      } catch (error) {
        console.log(error)
      }
    }
  }

  async function $reset(): Promise<void> {
    id.value = undefined
    vendor.value = undefined
    product.value = undefined // unsigned short integer
    physicallyConnected.value = false
    open.value = false
    if (_reader.value) {
      await _reader.value.cancel()
      _reader.value = undefined
    }
    if (activePort.value) {
      try {
        await activePort.value.close()
      } catch (e) {
        console.log(e)
      }
    }

    activePort.value = undefined
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
    disconnectPort,
    selectPort,
    write,
    $reset
  }
})
