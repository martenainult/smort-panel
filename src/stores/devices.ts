import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/* interface Device {
  mac: string
  parent_mac: string
  option: string
  level: number
} */

export const useDeviceStore = defineStore('devices', () => {
  const activeDevices = ref({
    /*
    '00:00:00:00:00:00': { s_mac: '00:00:00:00:00:00', opt: 'A' },
    '00:00:00:00:00:01': { s_mac: '00:00:00:00:00:01', opt: 'A' },
    '00:00:00:00:00:02': { s_mac: '00:00:00:00:00:02', opt: 'A' },
    '00:00:00:00:00:03': { s_mac: '00:00:00:00:00:03', opt: 'B' },
    '00:00:00:00:00:04': { s_mac: '00:00:00:00:00:04', opt: 'B' },
    '00:00:00:00:00:05': { s_mac: '00:00:00:00:00:05', opt: 'B' },
    '00:00:00:00:00:06': { s_mac: '00:00:00:00:00:06', opt: 'C' },
    '00:00:00:00:00:07': { s_mac: '00:00:00:00:00:07', opt: 'D' },
    '00:00:00:00:00:08': { s_mac: '00:00:00:00:00:08', opt: 'D' },
    '00:00:00:00:00:09': { s_mac: '00:00:00:00:00:09', opt: 'D' },
    '00:00:00:00:00:10': { s_mac: '00:00:00:00:00:10', opt: 'D' },
    '00:00:00:00:00:11': { s_mac: '00:00:00:00:00:11', opt: 'D' },
    '00:00:00:00:00:12': { s_mac: '00:00:00:00:00:12', opt: 'D' }
    */
  })
  const answers = ref([])

  function updateAnswer(update_json: any) {
    const localTag = 'devices: updateAnswer'
    if (update_json['s_mac']) {
      if (activeDevices.value[update_json['s_mac']]) {
        activeDevices.value[update_json['s_mac']]['opt'] = update_json['opt']
      } else {
        activeDevices.value[update_json['s_mac']] = update_json
      }
    }
    // console.log(update_json)
    //console.log(activeDevices.value)
    return activeDevices
  }

  function setPing() {
    const milliseconds = new Date().getTime()
    for (const device in activeDevices.value) {
      activeDevices.value[device]['ping'] = milliseconds
    }
    console.log('set ping timestamp')
    console.log(activeDevices.value)
  }

  function setPong() {
    const milliseconds = new Date().getTime()
    for (const device in activeDevices.value) {
      activeDevices.value[device]['pong'] = milliseconds
    }
    console.log('set pong timestamp')
    console.log(activeDevices.value)
  }

  function handlePong(update_json: any) {
    const localTag = 'devices: handlePong'
    const milliseconds = new Date().getTime()

    if (update_json['s_mac']) {
      if (activeDevices.value[update_json['s_mac']]) {
        activeDevices.value[update_json['s_mac']]['opt'] = update_json['opt']
        activeDevices.value[update_json['s_mac']]['pong'] = milliseconds
      } else {
        activeDevices.value[update_json['s_mac']] = update_json
      }
    }
    console.log(localTag, activeDevices.value[update_json['s_mac']])
    //console.log(activeDevices.value)
    return activeDevices
  }

  function updateSensor(update_json: any) {
    if (update_json['s_mac']) {
      // Check whether the device is in the list
      if (activeDevices.value[update_json['s_mac']]) {
        activeDevices.value[update_json['s_mac']]['temp'] = update_json['temp']
      } else {
        update_json['opt'] = ''
        activeDevices.value[update_json['s_mac']] = update_json
      }
    }
  }

  function submitAnswers() {
    const device_options = Object.values(activeDevices.value)
      .map((device) => {
        return device['opt']
      })
      .filter((o) => o != '')
    if (device_options.length != 0) {
      answers.value.push(device_options)
      resetDevices()
      console.log('Answers submitted')
      console.log(device_options.toString())
    } else {
      console.log('No answers present!')
    }
  }

  function resetDevices() {
    Object.values(activeDevices.value).forEach((o) => (o['opt'] = ''))
  }

  const getDevices = computed(() => {
    return activeDevices.value
  })

  const getResults = computed(() => {
    return Object.values(answers.value)
  })

  const getAnswers = computed(() => {
    return Object.values(activeDevices.value)
      .map((device) => {
        return device['opt']
      })
      .filter((o) => o != '')
  })

  return {
    activeDevices,
    getDevices,
    getResults,
    getAnswers,
    updateAnswer,
    updateSensor,
    handlePong,
    submitAnswers,
    setPing,
    setPong
  }
})
