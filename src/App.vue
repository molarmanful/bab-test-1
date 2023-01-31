<script setup>
import { ref, onMounted } from 'vue'
import { createScene } from './scenes/x0'

let bcan = ref(null)
let fps = ref(0)

onMounted(_ => {
  createScene(bcan.value, ({ engine, scene }) => {
    scene.registerAfterRender(_ => {
      fps.value = engine.getFps() | 0
    })
  })
})
</script>

<template>
  <section flex justify-center items-center>
    <span fixed top-0 right-0 text-white>{{ fps }}fps</span>
    <canvas ref="bcan" w-screen h-screen outline-0></canvas>
  </section>
</template>