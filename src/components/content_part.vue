<template>
    <v-content>
        <div style="background-color: #1b213b">
            <v-container grid-list-xl text-xs-center>
                <v-layout row wrap justify-space-between>

                    <v-dialog v-model="process_status" persistent width="500" style="background-color: #1b213b">
                        <v-progress-circular
                                style="
                                    background-color: #1b213b;
									bottom: 0;
									left: 0;
									margin: auto;
									position: absolute;
									right: 0;
									top: 0;"
                                :size="210" :width="7" color="primary" indeterminate><span class="headline">Processing</span>
                        </v-progress-circular>
                    </v-dialog>

                    <v-dialog v-model="calcu_dialog_status" persistent width="700" style="background-color: #1b213b">
                        <v-card style="background-color: #1b213b">
                            <v-card-title>
                                <span class="headline white--text">Start your record</span>
                            </v-card-title>
                            <v-card-text>
                                <v-text-field outline dark label="Select csv" v-on:click='pickFile' v-model='fileName' prepend-icon='attach_file'></v-text-field>
                                <input type="file" style="display: none" ref="image" accept="csv/*" v-on:change="onFilePicked">
                                <v-select dark v-model="skill_language" :items="skill_language_list" label="Language" prepend-icon='fas fa-language' outline></v-select>
                                <v-text-field outline dark label="Your Character Name" v-model='target_player_name' prepend-icon='fas fa-smile-wink'></v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" flat v-on:click="create_new_record">Submit</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="init_setting_status" width="800">
                        <v-card style="background-color: #1b213b">
                            <v-card-title>
                                <span class="headline white--text">Record Init</span>
                            </v-card-title>
                            <v-card-text>
                                <v-tabs dark centered color="#1b213b" show-arrows>
                                    <v-tabs-slider color="yellow"></v-tabs-slider>
                                    <v-tab  href="#tab-1">
                                        <v-icon class="white--text">fas fa-file-alt</v-icon>
                                        &nbsp New record
                                    </v-tab>
                                    <v-tab href="#tab-2">
                                        <v-icon class="white--text">fas fa-exchange-alt</v-icon>
                                        &nbsp Exist record
                                    </v-tab>

                                    <v-tabs-items>
                                        <v-tab-item :value="'tab-1'">
                                            <v-card style="background-color: #1b213b">
                                                <v-card-text>
                                                    <v-flex xs12 text-xs-center>
                                                        <div id="timer" style="font-size: 200px;line-height: 1;margin-bottom: 40px;">
                                                            <span class="white--text" id="minutes">{{ minutes }}</span>
                                                            <span class="white--text" id="middle">:</span>
                                                            <span class="white--text" id="seconds">{{ seconds }}</span>
                                                        </div>
                                                    </v-flex>
                                                    <v-flex xs12 text-xs-center>
                                                        <v-btn fab dark large color="primary" v-if="play_status" v-on:click="startTimer">
                                                            <v-icon dark>fas fa-play</v-icon>
                                                        </v-btn>
                                                        <v-btn fab dark large color="primary" v-else v-on:click="startTimer" disabled>
                                                            <v-icon dark>fas fa-play</v-icon>
                                                        </v-btn>

                                                        <v-btn fab dark large color="red" v-on:click="stopTimer" v-if="stop_status">
                                                            <v-icon dark>fas fa-stop</v-icon>
                                                        </v-btn>
                                                        <v-btn fab dark large color="red" v-on:click="stopTimer" v-else disabled>
                                                            <v-icon dark>fas fa-stop</v-icon>
                                                        </v-btn>

                                                        <v-btn fab dark large color="green" v-on:click="resetTimer" v-if="reset_status">
                                                            <v-icon dark>fas fa-redo</v-icon>
                                                        </v-btn>
                                                        <v-btn fab dark large color="green" v-on:click="resetTimer" v-else disabled>
                                                            <v-icon dark>fas fa-redo</v-icon>
                                                        </v-btn>

                                                        <v-btn fab dark large color="orange" v-on:click="select_time_status = true">
                                                            <v-icon dark>fas fa-mouse-pointer</v-icon>
                                                        </v-btn>
                                                    </v-flex>
                                                </v-card-text>
                                            </v-card>
                                        </v-tab-item>
                                        <v-tab-item :value="'tab-2'">
                                            <v-card flat color="#1b213b">
                                                <v-card-text>
                                                    <v-flex xs12>
                                                        <v-text-field v-model="record_id" dark label="Your record ID" placeholder="Your record ID" outline></v-text-field>
                                                        <v-text-field v-model="target_player_name" dark label="Your character name" placeholder="Your character name" outline></v-text-field>
                                                    </v-flex>
                                                </v-card-text>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="primary" flat v-on:click="request_exist_record">Submit</v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-tab-item>
                                    </v-tabs-items>
                                </v-tabs>
                            </v-card-text>

                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="select_time_status" width="300" >
                        <v-card flat color="#1b213b">
                            <v-card-title>
                                <span class="headline white--text">Select the time</span>
                            </v-card-title>
                            <v-card-text>
                                <v-flex xs12>
                                    <v-dialog ref="select_start_time" v-model="select_start_time" :return-value.sync="start_time" persistent lazy full-width width="290px">
                                        <v-text-field dark slot="activator" v-model="start_time" label="Mission Start Time" prepend-icon="access_time" readonly></v-text-field>
                                        <v-time-picker color="#1b213b" v-if="select_start_time" v-model="start_time" full-width>
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="select_start_time = false">Cancel</v-btn>
                                            <v-btn flat color="primary" @click="save_start_time">OK</v-btn>
                                        </v-time-picker>
                                    </v-dialog>
                                </v-flex>
                                <v-flex xs12>
                                    <v-dialog ref="select_end_time" v-model="select_end_time" :return-value.sync="end_time" persistent lazy full-width width="290px">
                                        <v-text-field dark slot="activator" v-model="end_time" label="Mission End Time" prepend-icon="access_time" readonly></v-text-field>
                                        <v-time-picker color="#1b213b" v-if="select_end_time" v-model="end_time" full-width>
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="select_end_time = false">Cancel</v-btn>
                                            <v-btn flat color="primary" @click="save_end_time">OK</v-btn>
                                        </v-time-picker>
                                    </v-dialog>
                                </v-flex>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="white" flat v-on:click="select_time_status = false">Cancel</v-btn>
                                <v-btn color="primary" flat v-on:click="cal_time">Submit</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-flex xs12 sm6 md3>
                        <v-card class="mx-auto" dark color="#262d47" max-width="600">
                            <v-card-title>
                                <v-icon :color="checking ? 'red lighten-2' : 'indigo'" class="mr-5" size="64" @click="takePulse">
                                    fas fa-dharmachakra
                                </v-icon>
                                <v-layout column align-start>
                                    <div class="caption grey--text text-uppercase">
                                        Damage Per Second
                                    </div>
                                    <div>
                                        <span class="display-2 white--text font-weight-black" v-text="dpsavg || '—'"></span>
                                        <strong v-if="dpsavg" class="white--text">DPS</strong>
                                    </div>
                                </v-layout>

                                <v-spacer></v-spacer>

                                <!--<v-btn icon class="align-self-start" size="28">-->
                                <!--<v-icon color="black">mdi-file-document</v-icon>-->
                                <!--</v-btn>-->
                            </v-card-title>

                            <v-sheet class="v-sheet--offset mx-auto" color="transparent">
                                <v-sparkline :smooth="16" :gradient="['#f72047', '#ffd200', '#1feaea']" :line-width="3" :key="String(dpsavg)" :value="dps" auto-draw stroke-linecap="round"></v-sparkline>
                            </v-sheet>
                        </v-card>
                    </v-flex>

                    <v-flex xs12 sm6 md3>
                        <v-card class="mx-auto" color="#262d47" max-width="600">
                            <v-card-title>
                                <v-icon :color="checking ? 'red lighten-2' : 'indigo'" class="mr-5" size="64" @click="takePulse">
                                    fas fa-dharmachakra
                                </v-icon>
                                <v-layout column align-start>
                                    <div class="caption grey--text text-uppercase">
                                        Damage per PP
                                    </div>
                                    <div>
                                        <span class="display-2 white--text font-weight-black" v-text="ppavg || '—'"></span>
                                        <!--<strong v-if="criperavg" class="white&#45;&#45;text">%</strong>-->
                                    </div>
                                </v-layout>

                                <v-spacer></v-spacer>

                                <!--<v-btn icon class="align-self-start" size="28">-->
                                <!--<v-icon color="black">mdi-file-document</v-icon>-->
                                <!--</v-btn>-->
                            </v-card-title>

                            <v-sheet color="transparent">
                                <v-sparkline :smooth="16" :gradient="['#f72047', '#ffd200', '#1feaea']" :line-width="3" :key="String(criperavg)" :value="criper" auto-draw stroke-linecap="round"></v-sparkline>
                            </v-sheet>
                        </v-card>
                    </v-flex>

                    <v-flex xs12 sm6 md3>
                        <v-card class="mx-auto" color="#262d47" max-width="600">
                            <v-card-title>
                                <v-icon :color="checking ? 'red lighten-2' : 'indigo'" class="mr-5" size="64" @click="takePulse">
                                    fas fa-dharmachakra
                                </v-icon>
                                <v-layout column align-start>
                                    <div class="caption grey--text text-uppercase">
                                        JA Percentage
                                    </div>
                                    <div>
                                        <span class="display-2 white--text font-weight-black" v-text="japeravg || '—'"></span>
                                        <strong v-if="japeravg" class="white--text">%</strong>
                                    </div>
                                </v-layout>

                                <v-spacer></v-spacer>

                                <!--<v-btn icon class="align-self-start" size="28">-->
                                <!--<v-icon color="black">mdi-file-document</v-icon>-->
                                <!--</v-btn>-->
                            </v-card-title>

                            <v-sheet color="transparent">
                                <v-sparkline :smooth="16" :gradient="['#f72047', '#ffd200', '#1feaea']" :line-width="3" :key="String(japeravg)" :value="japer" auto-draw stroke-linecap="round"></v-sparkline>
                            </v-sheet>
                        </v-card>
                    </v-flex>

                    <v-flex xs12 sm6 md3>
                        <v-card class="mx-auto" color="#262d47" max-width="600">
                            <v-card-title>
                                <v-icon :color="checking ? 'red lighten-2' : 'indigo'" class="mr-5" size="64" @click="takePulse">
                                    fas fa-dharmachakra
                                </v-icon>
                                <v-layout column align-start>
                                    <div class="caption grey--text text-uppercase">
                                        Critical Percentage
                                    </div>
                                    <div>
                                        <span class="display-2 white--text font-weight-black" v-text="criperavg || '—'"></span>
                                        <strong v-if="criperavg" class="white--text">%</strong>
                                    </div>
                                </v-layout>

                                <v-spacer></v-spacer>

                                <!--<v-btn icon class="align-self-start" size="28">-->
                                <!--<v-icon color="black">mdi-file-document</v-icon>-->
                                <!--</v-btn>-->
                            </v-card-title>

                            <v-sheet color="transparent">
                                <v-sparkline :smooth="16" :gradient="['#f72047', '#ffd200', '#1feaea']" :line-width="3" :key="String(criperavg)" :value="criper" auto-draw stroke-linecap="round"></v-sparkline>
                            </v-sheet>
                        </v-card>
                    </v-flex>

                    <v-flex xs12 sm12 md6 xl6>
                        <v-card class="mx-auto" color="#262d47" max-width="1000" height="515">
                            <v-card-title>
                                <v-icon :color="checking ? 'red lighten-2' : 'indigo'" class="mr-5" size="64" @click="takePulse">
                                    <!--fas fa-code-branch-->
                                </v-icon>
                                <v-layout column align-start>
                                    <div class="caption grey--text text-uppercase">
                                        Total Damage
                                    </div>
                                    <div>
                                        <span class="display-2 white--text font-weight-black" v-text="totaldmage || '—'"></span>
                                        <strong v-if="totaldmage" class="white--text"></strong>
                                    </div>
                                </v-layout>
                            </v-card-title>
                            <v-card-text>
                                <apexchart type=bar :options="barchartOptions" :series="barseries"/>
                            </v-card-text>
                        </v-card>
                    </v-flex>

                    <v-flex xs12 sm12 md6 xl6>
                        <v-card class="mx-auto" color="#262d47" max-width="600" max-height="515">
                            <v-card-title>
                                <v-icon :color="checking ? 'red lighten-2' : 'indigo'" class="mr-5" size="64" @click="takePulse">
                                    <!--fab fa-phoenix-framework-->
                                </v-icon>
                                <v-layout column align-start>
                                    <div class="caption grey--text text-uppercase">
                                        Your Damage
                                    </div>
                                    <div>
                                        <span class="display-2 white--text font-weight-black" v-text="yourdmage || '—'"></span>
                                        <strong v-if="yourdmage" class="white--text"></strong>
                                    </div>
                                </v-layout>
                            </v-card-title>
                            <v-card-text>
                                <apexchart type=donut :options="donutchartOptions" :series="donutseries" />
                            </v-card-text>
                        </v-card>
                    </v-flex>

                    <v-flex xs12 sm12 md12 xl12>
                        <v-card class="mx-auto" color="#262d47" >
                            <v-card-title>
                                <v-icon :color="checking ? 'red lighten-2' : 'indigo'" class="mr-5" size="64" @click="takePulse">
                                    <!--fab fa-phoenix-framework-->
                                </v-icon>
                                <v-layout column align-start>
                                    <div class="caption grey--text text-uppercase">
                                        Battle time line
                                    </div>
                                    <div>
                                        <span class="display-2 white--text font-weight-black" v-text="battle_time || '—'"></span>
                                        <strong v-if="battle_time" class="white--text"></strong>
                                    </div>
                                </v-layout>
                            </v-card-title>
                            <v-card-text>
                                <apexchart type=line height=300 :options="linechartOptions" :series="lineseries" />
                            </v-card-text>
                        </v-card>
                    </v-flex>

                    <v-dialog v-model="change_target_player_status" width="500">
                        <v-card style="background-color: #1b213b">
                            <v-card-title>
                                <h3 style="color:white;">Change Target Player</h3>
                            </v-card-title>
                            <v-card-text>
                                <v-select dark v-model="target_player_name" :items="player_list" label="Player Name" outline></v-select>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="white" flat v-on:click="change_target_player_status = false">Cancel</v-btn>
                                <v-btn color="primary" flat v-on:click="redraw(return_data)">Submit</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-snackbar v-model="snackbar_status" :color="snackbac_color" timeout=6000>
                        {{ snackbar_text }}
                        <v-btn flat @click="snackbar_status = false">
                            Close
                        </v-btn>
                    </v-snackbar>
                </v-layout>
            </v-container>
            <v-speed-dial v-model="fab" dark fixed bottom right fab transition="slide-y-reverse-transition">
                <v-btn slot="activator" v-model="fab" color="blue darken-2" dark fab>
                    <v-icon>fas fa-cog</v-icon>
                    <v-icon>fas fa-file</v-icon>
                </v-btn>
                <v-btn fab dark small color="red" v-on:click="init_setting_status = true">
                    <v-icon>fas fa-upload</v-icon>
                </v-btn>
                <v-btn fab dark small color="orange" v-on:click="change_target_player_status = true">
                    <v-icon>fas fa-tags</v-icon>
                </v-btn>
                <v-btn fab dark small color="green" v-on:click="snackbar_contorl(true,`info`,`Your record ID: `+record_id)">
                    <v-icon>fas fa-share-alt</v-icon>
                </v-btn>
            </v-speed-dial>
        </div>
    </v-content>
</template>

<script>
    import axios from 'axios'
    const exhale = ms =>
        new Promise(resolve => setTimeout(resolve, ms))
    export default {
        name: 'content',
        components: {
        },
        data: ()=> ({
            // back_end_url:"http://www.overparse-analysis.com:5000",
            back_end_url:"http://0.0.0.0:5000",
            battle_time:"-",
            barchartOptions: {
                bar_color: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8', '#9E9D24', '#D10CE8', '#D10CE8', '#D10CE8'],
                chart: {
                    height: 700,
                    type: 'bar',
                    foreColor: "#fff",
                    // sparkline: {
                    //     enabled: true,
                    // },
                },tooltip: {
                    theme: "dark",
                },
                grid: {
                    borderColor: "#40475D"
                },
                xaxis: {
                    categories: [],
                    labels: {
                        style: {
                            colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8', '#9E9D24', '#FFB300', '#880E4F', '#FF9E80'],
                            fontSize: '14px'
                        }
                    }
                },
                colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8', '#9E9D24', '#FFB300', '#880E4F', '#FF9E80'],
                plotOptions: {
                    bar: {
                        columnWidth: '45%',
                        distributed: false
                    }
                },
                dataLabels: {
                    enabled: false,
                }
            },
            barseries: [{
                data: [0,0,0,0,0,0,0,0,0,0,0,0,0]
            }],
            calcu_dialog_status:false,
            checking: false,
            change_target_player_status: false,
            criper: [0],
            csv_text:"",
            datacollection: null,
            donutchartOptions: {
                chart:{
                    foreColor: "#fff",
                },
                dataLabels: {
                    enabled: false
                },
                grid: {
                    borderColor: "#40475D"
                },
                legend: {
                    position: 'right',
                    offsetY: 0,
                    height: 230,
                },
                labels: [],
                width: 380,
            },
            donutseries: [0],
            dps: [0],
            end_time:0,
            fab:true,
            file: "",
            fileName: "",
            init_setting_status: false,
            japer: [0],
            linechartOptions: {
                chart: {
                    height: 350,
                    type: 'line',
                    foreColor: "#fff",
                },
                stroke: {
                    width: 7,
                    curve: 'smooth'
                },
                grid: {
                    borderColor: "#40475D"
                },
                dataLabels: {
                    enabled: false,
                },
                xaxis: {
                    type: 'category',
                    labels: {
                        show: false,
                    },
                    axisTicks: {
                        color: "#333"
                    },
                    axisBorder: {
                        color: "#333"
                    }
                },
                tooltip: {
                    theme: "dark",
                },
                title: {
                    text: 'Start Time: 2019-01-21 14:01:14',
                    align: 'left',
                    style: {
                        fontSize: "16px",
                        color: '#666'
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'dark',
                        gradientToColors: ["#FCCF31", "#17ead9", "#f02fc2"],
                        shadeIntensity: 1,
                        type: 'horizontal',
                        opacityFrom: 1,
                        opacityTo: 1,
                    },
                },
                markers: {
                    size: 0,
                    opacity: 0.9,
                    colors: ["#FFA41B"],
                    strokeColor: "#fff",
                    strokeWidth: 2,

                    hover: {
                        size: 7,
                    }
                },
                yaxis: {
                    min: 0,
                    max: 1000000,
                    title: {
                        text: 'Damage',
                    },
                },

            },
            lineseries: {
                name: 'DPS',
                data: [0]
            },
            play_status:true,
            process_status:false,
            player_list: [],
            ppper: [0],
            record_id: "",
            reset_status:true,
            return_data: "",
            stop_status:false,
            select_time_status:false,
            snackbar_status:false,
            snackbar_text:"",
            skill_language_list: ["English", "繁體中文", "日本語"],
            skill_language: "",
            snackbac_color:"",
            start_time:0,
            select_start_time: false,
            select_end_time: false,
            totalTime:0,
            target_player_name: "",
            time: null,
        }),
        mounted () {
            this.fillData()
            // this.get_data()
        },
        computed: {
            dpsavg () {
                const sum = this.dps.reduce((acc, cur) => acc + cur, 0);
                const length = this.dps.length;
                if (!sum && !length) return 0;
                return Intl.NumberFormat().format(Math.ceil(sum / length))
            },
            japeravg () {
                const sum = this.japer.reduce((acc, cur) => acc + cur, 0);
                const length = this.japer.length;
                if (!sum && !length) return 0;
                return (sum/length*100).toFixed(2)
            },
            criperavg () {
                const sum = this.criper.reduce((acc, cur) => acc + cur, 0);
                const length = this.criper.length;
                if (!sum && !length) return 0;
                return (sum/length*100).toFixed(2)
            },
            totaldmage () {
                let sum = this.barseries[0].data.reduce((acc, cur) => acc + cur, 0);
                return new Intl.NumberFormat().format(sum)
            },
            yourdmage () {
                let sum = this.donutseries.reduce((acc, cur) => acc + cur, 0);
                return new Intl.NumberFormat().format(sum)
            },
            minutes: function() {
                const minutes = Math.floor(this.totalTime / 60);
                return this.padTime(minutes);
            },
            seconds: function() {
                const seconds = this.totalTime - (this.minutes * 60);
                return this.padTime(seconds);
            }
        },
        created () {
            this.takePulse(false)
            // this.get_data()
        },
        methods: {
            request_exist_record () {
                let req_val = {
                    "id":this.record_id
                }
                this.process_status = true;
                axios.post(this.back_end_url+"/exist_record",req_val).then((res) => {
                    if (res.data["status"] === true){
                        this.init_setting_status = false;
                        this.redraw(res)
                    }else{
                        this.snackbar_contorl(true,"error","The record ID is not exist")
                    }
                    this.process_status = false;
                })
            },
            save_start_time: function() {
                this.$refs.select_start_time.save(this.start_time);
                this.select_start_time = false;
            },
            save_end_time: function() {
                this.$refs.select_end_time.save(this.end_time);
                this.select_end_time = false;
            },
            cal_time: function() {
                this.select_start_time = false;
                this.select_end_time = false;

                this.$refs.select_end_time.save(this.end_time);
                let now = new Date()
                let start_time = new Date(now.getFullYear(),now.getMonth(),now.getDate(),this.start_time.split(":")[0],this.start_time.split(":")[1],0)
                let end_time = new Date(now.getFullYear(),now.getMonth(),now.getDate(),this.end_time.split(":")[0],this.end_time.split(":")[1],0)
                this.start_time = Math.floor(start_time.getTime() / 1000);
                this.end_time = Math.floor(end_time.getTime() / 1000);
                this.calcu_dialog_status = true
            },
            startTimer: function() {
                this.timer = setInterval(() => this.countup(), 1000);
                this.snackbar_contorl(true,"info","Sart counting ...");
                this.play_status = false;
                this.stop_status = true;
                this.reset_status = true;
                this.start_time = Math.floor(Date.now() / 1000);
            },
            stopTimer: function() {
                clearInterval(this.timer);
                this.timer = null;
                this.snackbar_contorl(true,"info","Stop counting, calculation being ...")
                this.play_status = true;
                this.stop_status = false;
                this.reset_status = false;
                this.end_time =  Math.floor(Date.now() / 1000);
                this.calcu_dialog_status = true;
                // this.process_status = true;
                // this.cal_new_record()
            },
            resetTimer: function() {
                this.totalTime = 0;
                clearInterval(this.timer);
                this.timer = null;
                this.snackbar_contorl(true,"info","Reset record ...");
                // this.create_new_record();
                this.play_status = true;
                this.stop_status = false;
                this.reset_status = true;
            },
            padTime: function(time) {
                return (time < 10 ? '0' : '') + time;
            },
            countup: function() {
                this.totalTime++;
            },
            snackbar_contorl (control,color,text) {
                this.snackbar_status = control;
                this.snackbac_color = color;
                this.snackbar_text = text
            },
            create_new_record () {
                let textType = /text.*/;
                let language = this.skill_language;
                let target_name = this.target_player_name
                this.process_status = true;
                try{
                    let reader = new FileReader();
                    reader.onload = function () {
                        let result = {
                            'data':reader.result.toString(),
                            "language":language,
                            "target_name":target_name
                        };
                        axios.post(this.back_end_url+"/create_new_record",result).then((res) => {
                            this.init_setting_status = false;
                            this.process_status = false;
                            this.calcu_dialog_status = true;
                            this.record_id = res.data["ID"]
                            this.snackbar_contorl(true,"success","New record create success")
                            this.cal_new_record()
                        });
                    }.bind(this);
                    reader.readAsText(this.file);
                    // if (this.file.type.match(textType)) {
                    //
                    // }else{
                    //     this.snackbar_contorl(true,"error","Please select the .csv file")
                    // }

                }catch (err) {
                    this.process_status = false;
                    this.snackbar_contorl(true,"error","Exception: "+err)
                }

            },
            cal_new_record () {
                // let textType = /text.*/;
                let language = this.skill_language;
                let target_name = this.target_player_name
                this.process_status = true;
                try{
                    let result = {
                        'id':this.record_id,
                        "language":language,
                        "start_time":this.start_time,
                        "end_time":this.end_time,
                        "target_name":target_name
                    };
                    axios.post(this.back_end_url+"/caclu",result).then((res) => {
                        this.redraw(res);
                        this.process_status = false;
                        this.calcu_dialog_status = false;
                        this.select_time_status = false;
                    });
                    // reader.readAsText(this.file);
                    // reader.onload = function (e) {
                    //
                    // }
                } catch (err) {
                    this.process_status = false;
                    this.snackbar_contorl(true,"error","Exception: "+err)
                }
            },
            // check_snack_bar_status()
            pickFile () {
                this.$refs.image.click ()
            },
            onFilePicked (e) {
                this.file = e.target.files[0];
                this.fileName = this.file.name;
                    // const files = e.target.files;
                // if(files[0] !== undefined) {
                //     this.fileName = files[0].name;
                //     if(this.fileName.lastIndexOf('.') <= 0) {
                //         return
                //     }
                //     const fr = new FileReader ()
                //     fr.readAsDataURL(files[0])
                //     fr.addEventListener('load', () => {
                //         this.fileURL = fr.result
                //         this.file = files[0] // this is an image file that can be sent to server...
                //     })
                //     console.log("file name:"+this.fileName)
                //     fr.onload = e => console.log(e.target.result);
                //     fr.readAsText(file);
                // } else {
                //     this.fileName = ''
                //     this.file = ''
                //     this.fileURL = ''
                // }
            },
            redraw (res) {
                try {
                    this.change_target_player_status = false;
                    let target_player = this.target_player_name;
                    let player_item = "";
                    let total_damage = [];
                    let dps_skill = [];
                    let name_list = [];
                    let skill_damage = [];
                    let skill_list = [];
                    let new_player_list = [];
                    // let max_damage = 0
                    res.data["player_detail"].forEach(function (item){
                        if(item["Name"] === target_player){
                            player_item = item
                        }
                        new_player_list.push(item["Name"]);
                        total_damage.push(item["Damage"]);
                        name_list.push(item["Name"]);
                    });
                    player_item["Skill"].forEach(function(item) {
                        skill_list.push(item["Skill Name"]);
                        skill_damage.push(item["Damage"]);
                    });
                    player_item["DPS skill detail"].forEach(function (item,index) {
                        dps_skill.push(index+ ": " +item)
                    });
                    this.return_data = res;
                    this.player_list = new_player_list;
                    this.battle_time = res.data["total_using_time"];
                    this.japer = player_item["JA"];
                    this.criper = player_item["Crit"];
                    this.dps = player_item["DPS detail"];
                    this.barseries = [{
                        name: "Damage",
                        data: total_damage
                    }];
                    this.barchartOptions = {
                        chart: {
                            height: 400,
                            type: 'bar',
                            // sparkline: {
                            //     enabled: true,
                            // },
                        },
                        xaxis: {
                            categories: name_list,
                            labels: {
                                style: {
                                    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8', '#9E9D24', '#FFB300', '#880E4F', '#FF9E80'],
                                    fontSize: '14px'
                                }
                            }
                        },
                        colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8', '#9E9D24', '#FFB300', '#880E4F', '#FF9E80'],
                        plotOptions: {
                            bar: {
                                columnWidth: '45%',
                                distributed: true
                            }
                        },
                        dataLabels: {
                            enabled: false,
                        }
                    };
                    this.donutchartOptions = {
                        dataLabels: {
                            enabled: false
                        },

                        legend: {
                            position: 'right',
                            offsetY: 0,
                            height: 230,
                        },
                        labels: skill_list,
                    };
                    this.donutseries = skill_damage;
                    this.linechartOptions={
                        chart: {
                            height: 350,
                            type: 'line',
                            foreColor: "#fff",
                        },
                        stroke: {
                            width: 7,
                            curve: 'smooth'
                        },
                        grid: {
                            borderColor: "#40475D"
                        },
                        xaxis: {
                            // type: 'category',
                            categories: dps_skill,
                            labels: {
                                show: false,
                            },
                            axisTicks: {
                                color: "#333"
                            },
                            axisBorder: {
                                color: "#333"
                            }
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        tooltip: {
                            theme: "dark",
                        },
                        title: {
                            text: 'Start Time: '+res.data["start_time"],
                            align: 'left',
                            style: {
                                fontSize: "16px",
                                color: '#666'
                            }
                        },
                        fill: {
                            type: 'gradient',
                            gradient: {
                                shade: 'dark',
                                gradientToColors: ["#FCCF31", "#17ead9", "#f02fc2"],
                                shadeIntensity: 1,
                                type: 'horizontal',
                                opacityFrom: 1,
                                opacityTo: 1,
                            },
                        },
                        markers: {
                            size: 0,
                            opacity: 0.9,
                            colors: ["#FFA41B"],
                            strokeColor: "#fff",
                            strokeWidth: 2,

                            hover: {
                                size: 7,
                            }
                        },
                        yaxis: {
                            min: 0,
                            max: 1500000,
                            title: {
                                text: 'Damage',
                            },
                        },

                    }
                    this.lineseries = [{
                            name: 'DPS',
                            data: player_item["DPS detail"]

                        }];
                    this.snackbar_contorl(true,"success","Redraw success");
                } catch (err) {
                    this.snackbar_contorl(true,"error","Redraw fail: "+err);
                }

            },
            heartbeat () {
                return Math.ceil(Math.random() * (120 - 80) + 80)
            },
            async takePulse (inhale = true) {
                this.checking = true
                inhale && await exhale(1000);
                this.heartbeats = Array.from({ length: 20 }, this.heartbeat);
                this.checking = false
            },
            fillData () {
                this.datacollection = {
                    labels: [this.getRandomInt(), this.getRandomInt()],
                    datasets: [
                        {
                            label: 'Data One',
                            backgroundColor: '#f87979',
                            data: [this.getRandomInt(), this.getRandomInt()]
                        }, {
                            label: 'Data One',
                            backgroundColor: '#f87979',
                            data: [this.getRandomInt(), this.getRandomInt()]
                        }
                    ]
                }
            },
            getRandomInt () {
                return Math.floor(Math.random() * (50 - 5 + 1)) + 5
            }
        }
    }
</script>

<style>
    .small {
        max-width: 600px;
        margin:  150px auto;
    }
</style>