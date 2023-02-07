<script setup>
import { ref, onMounted } from 'vue'
import { createScene } from './scenes/x0'

let bcan = ref(null)
let fps = ref(0)
let ready = ref(false)

onMounted(_ => {
  createScene(bcan.value, ({ engine, scene }) => {
    scene.executeWhenReady(_ => {
      ready.value = true
    })

    scene.registerAfterRender(_ => {
      fps.value = engine.getFps() | 0
    })
  })
})
</script>

<template>
  <section flex justify-center items-center transition-opacity duration-500 :opacity="ready * 100">
    <span fixed top-0 right-0 text-white>{{ fps }}fps</span>
    <canvas ref="bcan" w-screen h-screen outline-0></canvas>
  </section>
  <div hidden opacity="0 100" />
</template>