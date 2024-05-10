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
    '00:00:00:00:00:00': { s_mac: '00:00:00:00:00:00', opt: 'A' },
    '00:00:00:00:00:01': { s_mac: '00:00:00:00:00:00', opt: 'A' },
    '00:00:00:00:00:02': { s_mac: '00:00:00:00:00:00', opt: 'A' },
    '00:00:00:00:00:03': { s_mac: '00:00:00:00:00:00', opt: 'A' },
    '00:00:00:00:00:04': { s_mac: '00:00:00:00:00:00', opt: 'A' },
    '00:00:00:00:00:05': { s_mac: '00:00:00:00:00:00', opt: 'A' },
    '00:00:00:00:00:06': { s_mac: '00:00:00:00:00:00', opt: 'A' },
    '00:00:00:00:00:07': { s_mac: '00:00:00:00:00:00', opt: 'A' },
    '00:00:00:00:00:08': { s_mac: '00:00:00:00:00:00', opt: 'A' },
    '00:00:00:00:00:09': { s_mac: '00:00:00:00:00:00', opt: 'A' },
    '00:00:00:00:00:10': { s_mac: '00:00:00:00:00:00', opt: 'A' },
    '00:00:00:00:00:11': { s_mac: '00:00:00:00:00:00', opt: 'A' },
    '00:00:00:00:00:12': { s_mac: '00:00:00:00:00:00', opt: 'A' }
  })
  const answers = ref([])

  function updateAnswer(update_json: any) {
    const localTag = 'devices: updateAnswer'
    if (update_json['s_mac']) activeDevices.value[update_json['s_mac']] = update_json
    console.log(update_json)
    //console.log(activeDevices.value)
    return activeDevices
  }

  function submitAnswers() {
    const device_options = Object.values(activeDevices.value).map((device) => {
      return device['opt']
    })
    answers.value.push(device_options)
    resetDevices()
    console.log(answers.value)
    console.log('Answers submitted')
  }

  function resetDevices() {
    Object.values(activeDevices.value).forEach((o) => (o['opt'] = '-'))
  }

  const getDevices = computed(() => {
    return activeDevices.value
  })

  return {
    activeDevices,
    getDevices,
    updateAnswer,
    submitAnswers
  }
})
