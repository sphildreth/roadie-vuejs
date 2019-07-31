<template>
    <v-card max-height="100px"  class="mb-3" hover :data-id="playlist.id" >
        <v-layout>
            <v-flex xs4 >
                <router-link :to="'/playlist/' + playlist.id">
                <v-img
                    :src="playlist.thumbnail.url"
                    :alt="playlist.playlist.text"
                    max-width="80"
                    class="ma-1"
                    lazy-src="data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBmRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAExAAIAAAAQAAAATgAAAAAAAABgAAAAAQAAAGAAAAABcGFpbnQubmV0IDQuMS40AP/bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIAFAAUAMBIgACEQEDEQH/xAAaAAADAQEBAQAAAAAAAAAAAAAABQYEBwMB/8QAPBAAAQMBAgkICAYDAAAAAAAAAQACAwQFEQYSExYhMVSS0RVBUVNxkZPhFCIyNYKhssIjM0JhYtJDscH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A5UhCEC3COR8Ni1L4nFrrgLxr0uAU3g5bcdBHNHVmV7HEFmKL7td/P2Kiwn9w1fY362rnqDodJbln1Lg1k4Y86g8Yvkma5SqnBO1n5UUNQ4uaR+E48x6EFahCEAhCEAhCECrCj3DVdjfqCiaGz6mubIaWPKZO7GF4Gu/p7FbYUe4qr4fqCU4C6q34PuQS0jHRvcyRpa9puIIuIX2KR0UrJIzc9hDgeghWmFFk+lw+k07b6iMaQP1t4hRCDptBWR1dFHUtIDXNvdp9k84X2mq4Kxr/AEWZr8U3Et5iue0ENXVuNNSGQtfpc0OIb2lXVjWbHZlLk2HGkdpe/pPBBMVtuWpS1c0Dp2kxuLb8m3T++peGcdp9c3w28FrrrAtGqrJpy2IZRxddj6l4ZsWh0Rb6C6QsNp2nTWdGDUOOMfZY3S4pBLha/G/CpGhv8n3lA3wp9xVPw/UEqwF1Vvwfcs9pYQsr7Lmp3wOjldi3EOvGggrRgLqrfg+5BtzgjhtWelrGhkbXYrZG3/NbJLPsyudljFDITpxmO192tTlsWLaFRadRLDTl0b3Xg47dPzWLkC09lO+3igrai0LNsmEsYY2kf44gCT2+aQyYWVZe7JwU4ZfoDgSe+8LByBaeynfbxRyBaeynfbxQbc667qabdd/ZGddd1NNuu/ssXINp7K7ebxRyDaeyu3m8UGW0ql9ZXTTSEkucbh0DmCypzhFZUlFVSTMaTTPdjBw/TfzFJkAqzAX2a3tZ9yloo3yyNZExz3u0BrReSr3B6zzZlAcr+c847wNN3QEGG0MJjSVs0ApQ/JuxcbKXX/JZs7nbGPE8knraSuqauac0VSMo8uuyTtF57F48m12x1PhO4IH2dztjb4nkjO5+xt8TySHk2u2Op8J3BHJtdsdT4TuCB9nc/Y2+J5IzufsbfE8kh5NrtjqfCdwRybXbHU+E7gg6UQHAggEHWCsEtjWdI7GdSR3/AMfV/wBJghAtc+zLIafyYCRqA9Y/9KXOwrpQ4hsExHMdGn5pRhZG91syFrHEYrdIH7JPkZerfulBXZ2U2zzfJGdlNs83eFI5GXq37pRkZerfulBXZ2U2zzd4RnZTbPN3hSORl6t+6UZGXq37pQV2dlNs83eEZ2U2zzd4UjkZerfulGRl6t+6UH//2Q=="                    
                ></v-img>                  
                </router-link>
            </v-flex>
            <v-flex xs8>
                <v-card-title primary-title class="pa-0 ma-0">
                <div>
                    <router-link :to="'/playlist/' + playlist.id"><div :title="playlist.playlist.text" class="secondary--text text--lighten-1 playlist-name subheading font-weight-medium pointer">{{ playlist.playlist.text }}</div></router-link>
                    <div class="caption accent--text"><span title="Playlist Tracks">{{ playlist.playlistCount | padNumber4 }}</span> | <span title="Playlist Play time">{{ playlist.durationTime }}</span></div>
                </div>
                </v-card-title>
            </v-flex>
        </v-layout>
    </v-card>   
</template>

<script>

export default {
    name: 'PlaylistCard',
    props: {
        playlist: Object
    },
    methods: {
    },
    computed: {
    },
    data: () => ({
        //isFavorite: false
    })
}
</script>

<style>
</style>