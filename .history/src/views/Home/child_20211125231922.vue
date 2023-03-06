<template>
    <div>
        child
    </div>
</template>

<script>
export default {
    name: 'Child',
    beforeRouteEnter() {
        console.log('123beforeRouteEnter')
    }
}
</script>

<style>
</style>