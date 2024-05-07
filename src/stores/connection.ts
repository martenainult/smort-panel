import { defineStore } from 'pinia'
import { ref } from 'vue'
import { serial as polyfill, SerialPort as SerialPortPolyfill } from 'web-serial-polyfill'

import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import 'xterm/css/xterm.css'

const bufferSize = 1024

const term = new Terminal({
  scrollback: 10_000
})
const fitAddon = new FitAddon()
term.loadAddon(fitAddon)

term.loadAddon(new WebLinksAddon())

const encoder = new TextEncoder()
let toFlush = ''

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
    bufferSize: 255,
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

  term.onData((data) => {
    term.write(data)

    if (activePort.value?.writable == null) {
      console.warn(`unable to find writable port`)
      return
    }

    const writer = activePort.value.writable.getWriter()

    // eslint-disable-next-line no-constant-condition
    if (true) {
      toFlush += data
      if (data === '\r') {
        writer.write(encoder.encode(toFlush))
        writer.releaseLock()
        toFlush = ''
      }
    }

    writer.releaseLock()
  })

  async function selectPort() {
    console.log('connection.ts -> selectPort started')

    try {
      if (!navigator.serial) return false

      const selection = await navigator.serial
        .requestPort(requestOption)
        .then(async (port: SerialPort) => {
          vendor.value = (await port).getInfo().usbVendorId
          product.value = (await port).getInfo().usbProductId
          activePort.value = port
          return port
        })
      activePort.value = selection
      console.log('Selected board from: ', vendor.value, product.value)
    } catch (e) {
      console.log("Couldn't request port")
      return
    }
  }

  /**
   * Initiates a connection to the selected port.
   */
  async function connectToPort(): Promise<void> {
    if (!activePort.value) {
      return
    }

    try {
      await activePort.value.open(comConfig)
      term.writeln('<CONNECTED>')
      // connectButton.textContent = 'Disconnect'
      // connectButton.disabled = false
    } catch (e) {
      console.error(e)
      if (e instanceof Error) {
        term.writeln(`<ERROR: ${e.message}>`)
      }
      $reset()
      return
    }

    while (activePort.value && activePort.value.readable) {
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
    }

    if (activePort.value) {
      try {
        await activePort.value.close()
      } catch (e) {
        console.error(e)
        if (e instanceof Error) {
          term.writeln(`<ERROR: ${e.message}>`)
        }
      }

      $reset()
    }
  }

  function $reset(): void {
    term.writeln('<DISCONNECTED>')
    id.value = undefined
    vendor.value = undefined
    product.value = undefined // unsigned short integer
    activePort.value = undefined
    physicallyConnected.value = false
    open.value = false
    _reader.value = undefined
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const terminalElement = document.getElementById('terminal')
    if (terminalElement) {
      term.open(terminalElement)
      fitAddon.fit()

      window.addEventListener('resize', () => {
        fitAddon.fit()
      })
    }
    /*
    
    portSelector = document.getElementById('ports') as HTMLSelectElement;
    
    connectButton = document.getElementById('connect') as HTMLButtonElement;
    connectButton.addEventListener('click', () => {
      if (port) {
        disconnectFromPort();
      } else {
        connectToPort();
      }
    });
    
    baudRateSelector = document.getElementById('baudrate') as HTMLSelectElement;
    baudRateSelector.addEventListener('input', () => {
      if (baudRateSelector.value == 'custom') {
        customBaudRateInput.hidden = false;
      } else {
        customBaudRateInput.hidden = true;
      }
    });
    
    customBaudRateInput =
    document.getElementById('custom_baudrate') as HTMLInputElement;
    dataBitsSelector = document.getElementById('databits') as HTMLSelectElement;
    paritySelector = document.getElementById('parity') as HTMLSelectElement;
    stopBitsSelector = document.getElementById('stopbits') as HTMLSelectElement;
    flowControlCheckbox = document.getElementById('rtscts') as HTMLInputElement;
    echoCheckbox = document.getElementById('echo') as HTMLInputElement;
    flushOnEnterCheckbox =
    document.getElementById('enter_flush') as HTMLInputElement;
    autoconnectCheckbox =
    document.getElementById('autoconnect') as HTMLInputElement;
    
    const convertEolCheckbox =
    document.getElementById('convert_eol') as HTMLInputElement;
    const convertEolCheckboxHandler = () => {
      term.options.convertEol = convertEolCheckbox.checked;
    };
    convertEolCheckbox.addEventListener('change', convertEolCheckboxHandler);
    convertEolCheckboxHandler();
    
    const polyfillSwitcher =
    document.getElementById('polyfill_switcher') as HTMLAnchorElement;
    if (usePolyfill) {
      polyfillSwitcher.href = './';
      polyfillSwitcher.textContent = 'Switch to native API';
    } else {
      polyfillSwitcher.href = './?polyfill';
      polyfillSwitcher.textContent = 'Switch to API polyfill';
    }
    */

    const serial = usePolyfill ? polyfill : navigator.serial
    const ports: (SerialPort | SerialPortPolyfill)[] = await serial.getPorts()
    ports.forEach((port) => addNewPort(port))

    // These events are not supported by the polyfill.
    // https://github.com/google/web-serial-polyfill/issues/20
    if (!usePolyfill) {
      navigator.serial.addEventListener('connect', (event) => {
        const portOption = addNewPort(event.target as SerialPort)
        if (autoconnectCheckbox.checked) {
          portOption.selected = true
          connectToPort()
        }
      })
      navigator.serial.addEventListener('disconnect', (event) => {
        const portOption = findPortOption(event.target as SerialPort)
        if (portOption) {
          portOption.remove()
        }
      })
    }
  })

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
