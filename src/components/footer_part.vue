<template>
    <!--<v-footer dark app height="auto">-->
        <!--<v-flex py-3 text-xs-center white&#45;&#45;text xs12>-->
            <!--&copy;2019 — <strong>WilsonLTL</strong>-->
            <!--<v-btn-->
                    <!--v-for="icon in icons"-->
                    <!--:key="icon"-->
                    <!--class="mx-3"-->
                    <!--icon-->
            <!--&gt;</v-btn>-->
        <!--</v-flex>-->
    <!--</v-footer>-->
    <v-footer dark app height="auto">
        <v-card class="flex" flat tile>
            <v-card-title class="darken-3">
                <strong class="subheading">&copy;2019 — <strong>WilsonLTL</strong></strong>
                <v-btn v-for="icon in icons" :key="icon" class="mx-3" href="https://github.com/WilsonLTL/Overparse-analysis" dark icon>
                    <v-icon size="24px">{{ icon }}</v-icon>
                </v-btn>
            </v-card-title>
        </v-card>
    </v-footer>
</template>


<script>
    export default {
        data: ()=> ({
            icons: [
                'fab fa-github'
            ]
        })
    }
</script>

<style scoped>

</style>