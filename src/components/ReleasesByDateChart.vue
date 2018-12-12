<script>
  import { Line } from 'vue-chartjs'

  export default {
    name: 'ReleasesByDateChart',
    extends: Line,
    props: {
      chartdata: {
        type: Object,
        default: null
      },
      options: {
        type: Object,
        default: null
      }
    },    
    mounted () {
      this.renderChart(this.chartdata, this.options)
    }    
  }
</script>
