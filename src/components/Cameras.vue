<template>
  <section>
    <h1 class="headline">
      Cameras
      <small v-if="busy" class="grey--text">
        {{ 'updating... ' + progress + ' / ' + cameras.length }}
      </small>
    </h1>

    <v-progress-linear :value="progress"></v-progress-linear>

    <br>

    <v-expansion-panel>

      <v-expansion-panel-content :value="true">
        <div slot="header">Synced Cameras</div>
        <v-data-table v-bind:headers="defaultHeaders" :items="synced" class="elevation-1" :loading="busy">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.id }}</td>
            <td class="text-xs-right">{{ props.item.count }}</td>
            <td class="text-xs-right">{{ props.item.largest }}</td>
            <td class="text-xs-right">{{ props.item.tx }}</td>
            <td class="text-xs-right">{{ props.item.updated }}</td>
          </template>
        </v-data-table>
      </v-expansion-panel-content>

      <v-expansion-panel-content>
        <div slot="header">Unresponsive Cameras</div>
        <v-data-table v-bind:headers="unresponsiveHeaders" :items="unreachable" class="elevation-1" :loading="busy">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.id }}</td>
            <td class="text-xs-right">{{ props.item.updated }}</td>
          </template>
        </v-data-table>
      </v-expansion-panel-content>

      <v-expansion-panel-content>
        <div slot="header">Sorted by Images Taken</div>
        <v-data-table v-bind:headers="unsortableHeaders" :items="byCount" class="elevation-1" :loading="busy">
          <template slot="headers" slot-scope="props">
            <tr>
              <th v-for="(header, index) in props.headers" :key="header.text"
                :class="['column', index === 0 ? 'text-xs-left' : 'text-xs-right', header.value === 'count' ? 'sortable desc active' : '']"
              >
                <v-icon v-if="header.value === 'count'">arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <td>{{ props.item.id }}</td>
            <td class="text-xs-right">{{ props.item.count }}</td>
            <td class="text-xs-right">{{ props.item.largest }}</td>
            <td class="text-xs-right">{{ props.item.tx }}</td>
            <td class="text-xs-right">{{ props.item.updated }}</td>
          </template>
        </v-data-table>
      </v-expansion-panel-content>

      <v-expansion-panel-content>
        <div slot="header">Sorted by Largest Image</div>
        <v-data-table v-bind:headers="unsortableHeaders" :items="bySize" class="elevation-1" :loading="busy">
          <template slot="headers" slot-scope="props">
            <tr>
              <th v-for="(header, index) in props.headers" :key="header.text"
                :class="['column', index === 0 ? 'text-xs-left' : 'text-xs-right', header.value === 'largest' ? 'sortable desc active' : '']"
              >
                <v-icon v-if="header.value === 'largest'">arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <td>{{ props.item.id }}</td>
            <td class="text-xs-right">{{ props.item.count }}</td>
            <td class="text-xs-right">{{ props.item.largest }}</td>
            <td class="text-xs-right">{{ props.item.tx }}</td>
            <td class="text-xs-right">{{ props.item.updated }}</td>
          </template>
        </v-data-table>
      </v-expansion-panel-content>

      <v-expansion-panel-content>
        <div slot="header">Sorted by Data Used</div>
        <v-data-table v-bind:headers="unsortableHeaders" :items="byTx" class="elevation-1" :loading="busy">
          <template slot="headers" slot-scope="props">
            <tr>
              <th v-for="(header, index) in props.headers" :key="header.text"
                :class="['column', index === 0 ? 'text-xs-left' : 'text-xs-right', header.value === 'tx' ? 'sortable desc active' : '']"
              >
                <v-icon v-if="header.value === 'tx'">arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <td>{{ props.item.id }}</td>
            <td class="text-xs-right">{{ props.item.count }}</td>
            <td class="text-xs-right">{{ props.item.largest }}</td>
            <td class="text-xs-right">{{ props.item.tx }}</td>
            <td class="text-xs-right">{{ props.item.updated }}</td>
          </template>
        </v-data-table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </section>
</template>

<script>
import pollCamera from '../api'

export default {
  name: 'cameras',
  props: {
    list: {
      type: Array,
      required: true
    },
    concurrent: {
      type: Number,
      required: false,
      default: 5
    },
    timeout: {
      type: Number,
      required: false,
      default: 10000
    },
    testing: {
      type: Object,
      required: false,
      default () {
        return {
          instant: false,
          canFail: true,
          canTimeout: true
        }
      }
    }
  },
  data () {
    return {
      cameras: [],
      defaultHeaders: [
        { text: 'Camera ID', align: 'left', sortable: true, value: 'id' },
        { text: 'Images', value: 'count' },
        { text: 'Largest Image', value: 'largest' },
        { text: 'Data Used', value: 'tx' },
        { text: 'Last Updated', value: 'updated' }
      ],
      unresponsiveHeaders: [
        { text: 'Camera ID', align: 'left', sortable: true, value: 'id' },
        { text: 'Last Attempt', value: 'updated' }
      ],
      unsortableHeaders: [
        { text: 'Camera ID', align: 'left', sortable: false, value: 'id' },
        { text: 'Images', sortable: false, value: 'count' },
        { text: 'Largest Image', sortable: false, value: 'largest' },
        { text: 'Data Used', sortable: false, value: 'tx' },
        { text: 'Last Updated', sortable: false, value: 'updated' }
      ]
    }
  },
  computed: {
    synced () {
      return this.cameras.filter(this.onlySynced)
    },
    unsynced () {
      return this.cameras.filter(this.onlyUnsynced)
    },
    unreachable () {
      return this.cameras.filter(this.onlyUnreachable)
    },

    byTx () {
      return this.cameras.slice().sort(this.sortComparator.bind(null, 'tx', 'desc'))
    },
    bySize () {
      return this.cameras.slice().sort(this.sortComparator.bind(null, 'largest', 'desc'))
    },
    byCount () {
      return this.cameras.slice().sort(this.sortComparator.bind(null, 'count', 'desc'))
    },
    busy () {
      return this.unsynced.length > 0
    },
    progress () {
      return this.cameras.length - this.unsynced.length
    }
  },
  methods: {
    sortComparator (key, order, a, b) {
      const dir = order === 'desc' ? -1 : 1
      if (a[key] > b[key]) {
        return dir
      } else if (a[key] < b[key]) {
        return dir * -1
      } else {
        return 0
      }
    },

    onlySynced (camera) {
      return camera.updated !== null && camera.count !== null
    },

    onlyUnsynced (camera) {
      return camera.updated === null
    },

    onlyUnreachable (camera) {
      return camera.updated !== null && camera.count === null
    },

    async sync () {
      let inProgress = new Map()
      while (this.unsynced.length) {
        while (inProgress.size < this.concurrent && inProgress.size < this.unsynced.length) {
          let nextIndex = inProgress.size
          let camera = this.unsynced[nextIndex]
          let promise = this.updateCamera(camera)
          inProgress.set(camera.id, promise)
          promise.then(function () { inProgress.delete(camera.id) })
        }
        await Promise.race(inProgress.values())
      }
    },
    async updateCamera (camera) {
      let response = await pollCamera(
        'domain.tld/camera/' + camera.id,
        this.timeout,
        this.testing.instant,
        this.testing.canFail,
        this.testing.canTimeout
      )
      if (response === 502) {
        // no response
      } else if (response === 504) {
        // timeout
      } else {
        let tx = 0
        let largest = 0
        for (let i = 0; i < response.images.length; i++) {
          tx += response.images[i].file_size
          if (response.images[i].file_size > largest) {
            largest = response.images[i].file_size
          }
        }
        camera.count = response.images.length
        camera.tx = tx
        camera.largest = largest
      }
      camera.updated = new Date()
      return camera
    }
  },
  created () {
    let cameras = []
    for (let i = 0; i < this.list.length; i++) {
      cameras.push({
        id: this.list[i],
        count: null,
        tx: null,
        largest: null,
        updated: null
      })
    }
    this.$set(this, 'cameras', cameras)
    this.sync()
  }
}
</script>
