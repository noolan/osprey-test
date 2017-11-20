import Vue from 'vue'
import Cameras from '@/components/Cameras'

function makeWithProps (props) {
  const Constructor = Vue.extend(Cameras)
  return new Constructor({ propsData: props })
}

describe('Cameras.vue', function () {
  this.timeout(20000)
  it('should complete loading the data', done => {
    const vm = makeWithProps({
      list: [1, 2, 3],
      testing: { instant: true, canFail: false, canTimeout: true }
    }).$mount()

    setTimeout(() => {
      expect(vm.synced).to.have.lengthOf(3)
      done()
    }, 5000)
  })

  it('should have unreachable cameras', done => {
    const vm = makeWithProps({
      list: [1, 2, 3],
      timeout: 0,
      testing: { instant: false, canFail: false, canTimeout: true }
    }).$mount()

    setTimeout(() => {
      expect(vm.unreachable).to.have.lengthOf(3)
      done()
    }, 5000)
  })

  it('should have unsynced cameras', done => {
    const vm = makeWithProps({
      list: [1, 2, 3],
      testing: { instant: false, canFail: false, canTimeout: true }
    }).$mount()

    setTimeout(() => {
      expect(vm.unsynced).to.have.lengthOf(3)
      done()
    }, 0)
  })

  it('should sort the cameras', done => {
    const vm = makeWithProps({
      list: [1, 2, 3],
      testing: { instant: true, canFail: false, canTimeout: false }
    }).$mount()

    setTimeout(() => {
      expect(vm.byCount[0].count).to.be.above(vm.byCount[1].count)
      expect(vm.bySize[0].largest).to.be.above(vm.bySize[1].largest)
      expect(vm.byTx[0].tx).to.be.above(vm.byTx[1].tx)
      done()
    }, 15000)
  })
})
