<template>
  <v-app light>
    <v-toolbar fixed app :clipped-left="clipped">
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <v-slide-y-transition mode="out-in">
          <v-layout column align-center>
            <cameras :list="allCameras"></cameras>
          </v-layout>
        </v-slide-y-transition>
      </v-container>
    </v-content>
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
    >
      <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon light>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
import Cameras from './components/Cameras'

export default {
  name: 'app',
  components: { Cameras },
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: true,
      items: [{
        icon: 'bubble_chart',
        title: 'Osprey'
      }],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Osprey Camera Programming Test'
    }
  },
  computed: {
    allCameras () {
      const cameraCount = 100
      const ids = new Array(cameraCount)
      for (let i = 0; i < cameraCount; i++) {
        ids[i] = i + 1
      }

      return ids
    }
  }
}
</script>
