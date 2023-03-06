<template>
    <div>
        child
    </div>
</template>

<script>
export default {
    name: 'child',
    beforeRouteEnter() {
        console.log('123beforeRouteEnter')
    }
}
</script>

<style>
</style>